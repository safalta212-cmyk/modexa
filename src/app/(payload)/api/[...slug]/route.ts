import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
} from '@payloadcms/next/routes'
import { NextResponse, type NextRequest } from 'next/server'

import { checkCmsConnection } from '@/lib/payload'

type RouteContext = {
  params: Promise<{
    slug: string[]
  }>
}

type PayloadRestHandler = (req: NextRequest, context: RouteContext) => Promise<Response>

function withCmsGuard(handler: PayloadRestHandler): PayloadRestHandler {
  return async (req, context) => {
    const connection = await checkCmsConnection()
    if (!connection.ok) {
      return NextResponse.json(
        {
          errors: [
            {
              message: `Payload CMS is unavailable: ${connection.reason}`,
            },
          ],
        },
        { status: 500 }
      )
    }

    return handler(req, context)
  }
}

export const GET = withCmsGuard(REST_GET(config))
export const POST = withCmsGuard(REST_POST(config))
export const DELETE = withCmsGuard(REST_DELETE(config))
export const PATCH = withCmsGuard(REST_PATCH(config))
export const OPTIONS = REST_OPTIONS(config)
