import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'
import { NextResponse, type NextRequest } from 'next/server'

import { checkCmsConnection } from '@/lib/payload'

const graphqlHandler = GRAPHQL_POST(config)

export async function POST(req: NextRequest) {
  const connection = await checkCmsConnection()
  if (!connection.ok) {
    return NextResponse.json(
      {
        errors: [
          {
            message: `Payload GraphQL API is unavailable: ${connection.reason}`,
          },
        ],
      },
      { status: 500 }
    )
  }

  return graphqlHandler(req)
}

export const OPTIONS = REST_OPTIONS(config)
