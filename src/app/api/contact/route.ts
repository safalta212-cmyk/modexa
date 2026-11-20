import { NextResponse, type NextRequest } from 'next/server'

import { validateContactInput } from '@/lib/contact-validation'
import { sendEnquiryNotificationEmails } from '@/lib/email'
import {
  checkEnquiryRateLimit,
  computeEnquiryFingerprint,
  extractClientIp,
  isRecentInMemoryDuplicate,
  recordInMemoryFingerprint,
} from '@/lib/enquiry-guard'
import { checkCmsConnection, sanitizeMongoErrorMessage } from '@/lib/payload'

const MAX_BODY_BYTES = 24 * 1024 // 24 KB
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Content-Type must be application/json.',
      },
      { status: 415 }
    )
  }

  let rawText: string
  try {
    rawText = await req.text()
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'Unable to read request payload.',
      },
      { status: 400 }
    )
  }

  if (Buffer.byteLength(rawText, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Enquiry payload is too large.',
      },
      { status: 413 }
    )
  }

  let parsedBody: unknown
  try {
    parsedBody = JSON.parse(rawText)
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'Invalid JSON request body.',
      },
      { status: 400 }
    )
  }

  if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Invalid enquiry payload format.',
      },
      { status: 400 }
    )
  }

  const clientIp = extractClientIp(req)
  const rateCheck = checkEnquiryRateLimit(clientIp)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: rateCheck.reason,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateCheck.retryAfterSeconds),
        },
      }
    )
  }

  const validation = validateContactInput(parsedBody as Record<string, unknown>)
  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: validation.message,
        ...(Object.keys(validation.errors).length > 0 ? { errors: validation.errors } : {}),
      },
      { status: 400 }
    )
  }

  const enquiryData = validation.data
  const fingerprint = computeEnquiryFingerprint({
    email: enquiryData.email,
    requestedService: enquiryData.requestedService,
    message: enquiryData.message,
  })

  if (isRecentInMemoryDuplicate(fingerprint)) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'We already received this enquiry moments ago. Please wait a few minutes before resubmitting.',
      },
      { status: 409 }
    )
  }

  const connection = await checkCmsConnection()
  if (!connection.ok) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Our enquiry database is currently unavailable because CMS database settings are not configured.',
      },
      { status: 500 }
    )
  }

  const { payload } = connection

  try {
    const windowStartIso = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString()

    const existingRecent = await payload.find({
      collection: 'contact-enquiries',
      overrideAccess: true,
      limit: 1,
      depth: 0,
      where: {
        and: [
          { email: { equals: enquiryData.email } },
          { requestedService: { equals: enquiryData.requestedService } },
          { message: { equals: enquiryData.message } },
          { submissionDate: { greater_than_equal: windowStartIso } },
        ],
      },
    })

    if (existingRecent.totalDocs > 0) {
      recordInMemoryFingerprint(fingerprint)
      return NextResponse.json(
        {
          ok: false,
          message:
            'A matching enquiry was already received recently. Our team will review it shortly.',
        },
        { status: 409 }
      )
    }

    let linkedServiceId: string | undefined
    try {
      const matchedService = await payload.find({
        collection: 'services',
        overrideAccess: true,
        limit: 1,
        depth: 0,
        where: {
          or: [
            { title: { equals: enquiryData.requestedService } },
            { slug: { equals: enquiryData.requestedService } },
          ],
        },
      })
      if (matchedService.docs[0]?.id) {
        linkedServiceId = String(matchedService.docs[0].id)
      }
    } catch {
      // Optional relationship lookup must never block enquiry creation
    }

    const submissionDate = new Date().toISOString()

    const created = await payload.create({
      collection: 'contact-enquiries',
      overrideAccess: true,
      data: {
        fullName: enquiryData.fullName,
        email: enquiryData.email,
        phone: enquiryData.phone,
        ...(enquiryData.company ? { company: enquiryData.company } : {}),
        requestedService: enquiryData.requestedService,
        ...(linkedServiceId ? { serviceRecord: linkedServiceId } : {}),
        ...(enquiryData.budget ? { budget: enquiryData.budget } : {}),
        message: enquiryData.message,
        privacyConsent: true,
        enquiryStatus: 'new',
        submissionDate,
      },
    })

    recordInMemoryFingerprint(fingerprint)

    const emailResult = await sendEnquiryNotificationEmails({
      id: String(created.id),
      fullName: enquiryData.fullName,
      email: enquiryData.email,
      phone: enquiryData.phone,
      company: enquiryData.company || undefined,
      requestedService: enquiryData.requestedService,
      budget: enquiryData.budget || undefined,
      message: enquiryData.message,
      submissionDate,
    })

    return NextResponse.json(
      {
        ok: true,
        id: String(created.id),
        message: 'Thank you! Your enquiry has been received by our studio team.',
        enquiry: {
          fullName: enquiryData.fullName,
          email: enquiryData.email,
          requestedService: enquiryData.requestedService,
          ...(enquiryData.budget ? { budget: enquiryData.budget } : {}),
          submissionDate,
        },
        notification: {
          status: emailResult.status,
          adminNotified: emailResult.adminNotified,
          customerConfirmed: emailResult.customerConfirmed,
        },
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('[POST /api/contact] Failed to persist enquiry:', sanitizeMongoErrorMessage(error))
    return NextResponse.json(
      {
        ok: false,
        message: 'Unable to submit your enquiry right now. Please try again shortly.',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: 'Method not allowed.',
    },
    { status: 405, headers: { Allow: 'POST', 'Cache-Control': 'no-store' } }
  )
}
