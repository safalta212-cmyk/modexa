import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
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

export default async function AdminPage({ params, searchParams }: Args) {
  const connection = await checkCmsConnection()

  if (!connection.ok) {
    const { status, reason } = connection

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
            maxWidth: '640px',
            width: '100%',
            backgroundColor: '#111118',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#A78BFA',
              margin: '0 0 12px 0',
            }}
          >
            MODX 2.0 · Payload CMS Admin
          </p>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 12px 0' }}>
            Database &amp; Secret Configuration Required
          </h1>
          <p style={{ color: '#A1A1AA', fontSize: '15px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            The Payload CMS admin panel requires a valid MongoDB connection and signing secret
            before initializing authentication and collections.
          </p>

          <div
            style={{
              backgroundColor: '#08080C',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: '#FCA5A5', display: 'block', marginBottom: '6px' }}>
              Status Detail
            </strong>
            <span style={{ color: '#E4E4E7' }}>{reason}</span>
          </div>

          <div style={{ fontSize: '14px', color: '#D4D4D8', lineHeight: 1.65 }}>
            <p style={{ fontWeight: 600, margin: '0 0 8px 0' }}>Required Environment Variables:</p>
            <ul style={{ margin: '0 0 16px 0', paddingLeft: '20px', color: '#A1A1AA' }}>
              <li>
                <code style={{ color: '#FFFFFF' }}>MONGODB_URI</code> —{' '}
                {status.hasMongoUri && status.hasValidMongoScheme
                  ? 'Configured'
                  : 'Set a valid MongoDB / MongoDB Atlas URI'}
              </li>
              <li>
                <code style={{ color: '#FFFFFF' }}>PAYLOAD_SECRET</code> —{' '}
                {status.hasPayloadSecret
                  ? 'Configured'
                  : 'Set a random 32+ character cryptographic secret'}
              </li>
              <li>
                <code style={{ color: '#FFFFFF' }}>NEXT_PUBLIC_SERVER_URL</code> —{' '}
                {status.serverURL ? `Configured (${status.serverURL})` : 'Optional canonical URL'}
              </li>
            </ul>
            <p style={{ color: '#A1A1AA', margin: 0 }}>
              Add these values to <code style={{ color: '#FFFFFF' }}>.env</code> (or AI Studio
              Secrets), restart the server, and reload <code style={{ color: '#FFFFFF' }}>/admin</code>{' '}
              to create your first Admin user.
            </p>
          </div>
        </section>
      </main>
    )
  }

  return RootPage({ config, params, searchParams, importMap })
}
