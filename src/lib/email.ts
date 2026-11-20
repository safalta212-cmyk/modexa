import { Resend } from 'resend'

import { escapeHtml } from './contact-validation'

export interface EmailConfigStatus {
  isConfigured: boolean
  missingVars: string[]
  fromAddress: string | null
  adminEmail: string | null
}

export interface EnquiryEmailPayload {
  id: string
  fullName: string
  email: string
  phone: string
  company?: string
  requestedService: string
  budget?: string
  message: string
  submissionDate: string
}

export interface EmailDeliveryResult {
  status: 'sent' | 'partial' | 'failed' | 'skipped_unconfigured'
  adminNotified: boolean
  customerConfirmed: boolean
  warning?: string
}

const PLACEHOLDER_VALUES = new Set([
  'your-resend-api-key',
  're_xxxxxxxxx',
  'REPLACE_WITH_RESEND_API_KEY',
  'MY_EMAIL_API_KEY',
])

export function getEmailConfigStatus(): EmailConfigStatus {
  const apiKey = process.env.EMAIL_API_KEY?.trim() || ''
  const fromAddress = process.env.EMAIL_FROM?.trim() || ''
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || ''

  const missingVars: string[] = []

  if (!apiKey || PLACEHOLDER_VALUES.has(apiKey)) {
    missingVars.push('EMAIL_API_KEY')
  }
  if (!fromAddress) {
    missingVars.push('EMAIL_FROM')
  }
  if (!adminEmail) {
    missingVars.push('ADMIN_NOTIFICATION_EMAIL')
  }

  return {
    isConfigured: missingVars.length === 0,
    missingVars,
    fromAddress: fromAddress || null,
    adminEmail: adminEmail || null,
  }
}

function buildAdminEmailHtml(enquiry: EnquiryEmailPayload): string {
  const rows: Array<[string, string]> = [
    ['Enquiry ID', enquiry.id],
    ['Full Name', enquiry.fullName],
    ['Email', enquiry.email],
    ['Phone', enquiry.phone],
    ['Company', enquiry.company || 'Not provided'],
    ['Requested Service', enquiry.requestedService],
    ['Estimated Budget', enquiry.budget || 'Not specified'],
    ['Submitted At', enquiry.submissionDate],
  ]

  const rowsHtml = rows
    .map(
      ([label, val]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #262636;color:#A1A1AA;font-size:13px;width:170px;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #262636;color:#FFFFFF;font-size:14px;">${escapeHtml(val)}</td></tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;background:#08080C;font-family:system-ui,-apple-system,sans-serif;color:#FFFFFF;">
  <div style="max-width:620px;margin:0 auto;background:#111118;border:1px solid rgba(139,92,246,0.35);border-radius:14px;padding:28px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#A78BFA;">MODX 2.0 · New Customer Enquiry</p>
    <h1 style="margin:0 0 18px;font-size:22px;color:#FFFFFF;">${escapeHtml(enquiry.fullName)} requested ${escapeHtml(enquiry.requestedService)}</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${rowsHtml}</table>
    <div style="background:#08080C;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:16px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#A78BFA;text-transform:uppercase;letter-spacing:0.08em;">Project Details</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#E4E4E7;white-space:pre-wrap;">${escapeHtml(enquiry.message)}</p>
    </div>
  </div>
</body>
</html>`
}

function buildAdminEmailText(enquiry: EnquiryEmailPayload): string {
  return [
    'MODX 2.0 — New Customer Enquiry',
    `Enquiry ID: ${enquiry.id}`,
    `Full Name: ${enquiry.fullName}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    `Company: ${enquiry.company || 'Not provided'}`,
    `Requested Service: ${enquiry.requestedService}`,
    `Estimated Budget: ${enquiry.budget || 'Not specified'}`,
    `Submitted At: ${enquiry.submissionDate}`,
    '',
    'Project Details:',
    enquiry.message,
  ].join('\n')
}

function buildCustomerConfirmationHtml(enquiry: EnquiryEmailPayload): string {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;background:#08080C;font-family:system-ui,-apple-system,sans-serif;color:#FFFFFF;">
  <div style="max-width:600px;margin:0 auto;background:#111118;border:1px solid rgba(139,92,246,0.35);border-radius:14px;padding:28px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#A78BFA;">Modexa Digital Agency</p>
    <h1 style="margin:0 0 12px;font-size:22px;color:#FFFFFF;">We received your enquiry, ${escapeHtml(enquiry.fullName)}.</h1>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:#A1A1AA;">
      Thank you for reaching out regarding <strong style="color:#FFFFFF;">${escapeHtml(enquiry.requestedService)}</strong>. A strategist from our studio will review your project brief and follow up shortly.
    </p>
    <div style="background:#08080C;border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:16px;font-size:13px;color:#D4D4D8;">
      <p style="margin:0 0 6px;"><strong>Reference ID:</strong> ${escapeHtml(enquiry.id)}</p>
      <p style="margin:0 0 6px;"><strong>Service:</strong> ${escapeHtml(enquiry.requestedService)}</p>
      ${enquiry.budget ? `<p style="margin:0;"><strong>Estimated Budget:</strong> ${escapeHtml(enquiry.budget)}</p>` : ''}
    </div>
  </div>
</body>
</html>`
}

function buildCustomerConfirmationText(enquiry: EnquiryEmailPayload): string {
  return [
    `Hi ${enquiry.fullName},`,
    '',
    `Thank you for contacting Modexa Digital Agency regarding ${enquiry.requestedService}.`,
    'Our team has received your enquiry and will respond shortly.',
    '',
    `Reference ID: ${enquiry.id}`,
    `Service: ${enquiry.requestedService}`,
    enquiry.budget ? `Estimated Budget: ${enquiry.budget}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function sendEnquiryNotificationEmails(
  enquiry: EnquiryEmailPayload
): Promise<EmailDeliveryResult> {
  const config = getEmailConfigStatus()

  if (!config.isConfigured || !config.fromAddress || !config.adminEmail) {
    console.warn(
      `[Enquiry Email] Skipped email notifications; missing env vars: ${config.missingVars.join(', ')}`
    )
    return {
      status: 'skipped_unconfigured',
      adminNotified: false,
      customerConfirmed: false,
      warning: `Email notifications skipped (missing ${config.missingVars.join(', ')})`,
    }
  }

  const apiKey = process.env.EMAIL_API_KEY!.trim()
  const resend = new Resend(apiKey)

  let adminNotified = false
  let customerConfirmed = false
  const warnings: string[] = []

  try {
    const adminResult = await resend.emails.send({
      from: config.fromAddress,
      to: [config.adminEmail],
      replyTo: enquiry.email,
      subject: `[MODX 2.0 Enquiry] ${enquiry.requestedService} — ${enquiry.fullName}`,
      html: buildAdminEmailHtml(enquiry),
      text: buildAdminEmailText(enquiry),
    })

    if (adminResult.error) {
      warnings.push(`Admin alert failed: ${adminResult.error.message}`)
      console.error('[Enquiry Email] Admin alert error:', adminResult.error.message)
    } else {
      adminNotified = true
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown email provider error'
    warnings.push(`Admin alert failed: ${msg}`)
    console.error('[Enquiry Email] Admin alert exception:', msg)
  }

  try {
    const customerResult = await resend.emails.send({
      from: config.fromAddress,
      to: [enquiry.email],
      subject: 'We received your enquiry — Modexa Digital Agency',
      html: buildCustomerConfirmationHtml(enquiry),
      text: buildCustomerConfirmationText(enquiry),
    })

    if (customerResult.error) {
      warnings.push(`Customer confirmation failed: ${customerResult.error.message}`)
      console.error('[Enquiry Email] Customer confirmation error:', customerResult.error.message)
    } else {
      customerConfirmed = true
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown email provider error'
    warnings.push(`Customer confirmation failed: ${msg}`)
    console.error('[Enquiry Email] Customer confirmation exception:', msg)
  }

  const status =
    adminNotified && customerConfirmed
      ? 'sent'
      : adminNotified || customerConfirmed
        ? 'partial'
        : 'failed'

  return {
    status,
    adminNotified,
    customerConfirmed,
    ...(warnings.length > 0 ? { warning: warnings.join('; ') } : {}),
  }
}
