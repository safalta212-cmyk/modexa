import { NextResponse } from 'next/server'

import { getEmailConfigStatus } from '@/lib/email'
import { checkCmsConnection, getCmsEnvironmentStatus } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const cmsEnv = getCmsEnvironmentStatus()
  const emailEnv = getEmailConfigStatus()
  const storageProvider = process.env.BLOB_READ_WRITE_TOKEN?.trim() ? 'vercel-blob' : 'local'

  let dbConnected = false

  if (cmsEnv.isReady) {
    const connection = await checkCmsConnection()
    if (connection.ok) {
      try {
        await connection.payload.count({
          collection: 'services',
          overrideAccess: true,
        })
        dbConnected = true
      } catch {
        dbConnected = false
      }
    }
  }

  const healthy = cmsEnv.isReady && dbConnected

  return NextResponse.json(
    {
      ok: healthy,
      status: healthy ? 'healthy' : 'degraded',
      cmsConfigured: cmsEnv.isReady,
      dbConnected,
      storageProvider,
      emailConfigured: emailEnv.isConfigured,
      timestamp: new Date().toISOString(),
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      },
    }
  )
}
