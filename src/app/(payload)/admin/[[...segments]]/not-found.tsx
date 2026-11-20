import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'
import React from 'react'

import { checkCmsConnection, getCmsEnvironmentStatus } from '@/lib/payload'
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  const status = getCmsEnvironmentStatus()
  if (!status.isReady) {
    return {
      title: 'CMS Configuration Required — Modexa Digital CMS',
      robots: { index: false, follow: false },
    }
  }

  return generatePageMetadata({ config, params, searchParams })
}

export default async function AdminNotFound({ params, searchParams }: Args) {
  const connection = await checkCmsConnection()

  if (!connection.ok) {
    return (
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: '#08080C',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <section
          style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: '#111118',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 10px 0' }}>
            Payload CMS Not Yet Configured
          </h1>
          <p style={{ color: '#A1A1AA', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
            {connection.reason}. Configure MONGODB_URI and PAYLOAD_SECRET and reload /admin.
          </p>
        </section>
      </main>
    )
  }

  return NotFoundPage({ config, params, searchParams, importMap })
}
