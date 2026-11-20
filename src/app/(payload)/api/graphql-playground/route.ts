import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'
import { NextResponse, type NextRequest } from 'next/server'

import { checkCmsConnection } from '@/lib/payload'

const playgroundHandler = GRAPHQL_PLAYGROUND_GET(config)

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'GraphQL Playground is disabled in production.' },
      { status: 404 }
    )
  }

  const connection = await checkCmsConnection()
  if (!connection.ok) {
    return NextResponse.json(
      {
        errors: [
          {
            message: `Payload GraphQL Playground is unavailable: ${connection.reason}`,
          },
        ],
      },
      { status: 500 }
    )
  }

  return playgroundHandler(req)
}
