import path from 'path'
import { fileURLToPath } from 'url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { BlogPosts } from './collections/BlogPosts'
import { Categories } from './collections/Categories'
import { ContactEnquiries } from './collections/ContactEnquiries'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function normalizeOriginCandidate(raw?: string): string {
  const candidate = raw?.trim() || ''
  if (!candidate || candidate === 'MY_APP_URL') {
    return ''
  }

  const withProtocol =
    candidate.startsWith('http://') || candidate.startsWith('https://')
      ? candidate
      : `https://${candidate}`

  try {
    return new URL(withProtocol).origin
  } catch {
    return ''
  }
}

function resolveServerURL(): string {
  const explicit =
    normalizeOriginCandidate(process.env.NEXT_PUBLIC_SERVER_URL) ||
    normalizeOriginCandidate(process.env.APP_URL)

  if (explicit) {
    return explicit
  }

  return (
    normalizeOriginCandidate(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeOriginCandidate(process.env.VERCEL_URL)
  )
}

function resolveAllowedOrigins(): string[] {
  const origins = new Set<string>()

  for (const candidate of [
    process.env.NEXT_PUBLIC_SERVER_URL,
    process.env.APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
  ]) {
    const normalized = normalizeOriginCandidate(candidate)
    if (normalized) {
      origins.add(normalized)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000')
    origins.add('http://127.0.0.1:3000')
  }

  return Array.from(origins)
}

const serverURL = resolveServerURL()
const allowedOrigins = resolveAllowedOrigins()
const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim() || ''

export default buildConfig({
  ...(serverURL ? { serverURL } : {}),
  ...(allowedOrigins.length > 0 ? { cors: allowedOrigins, csrf: allowedOrigins } : {}),
  cookiePrefix: 'modx-payload',
  admin: {
    user: Users.slug,
    theme: 'dark',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Modexa Digital CMS',
    },
    components: {
      graphics: {
        Logo: '/components/admin/ModxBrandLogo#ModxBrandLogo',
        Icon: '/components/admin/ModxBrandIcon#ModxBrandIcon',
      },
      afterNavLinks: ['/components/admin/AdminNavQuickLinks#AdminNavQuickLinks'],
      beforeDashboard: ['/components/admin/DashboardOverview#DashboardOverview'],
      views: {
        enquiries: {
          Component: '/components/admin/EnquiriesView#EnquiriesView',
          path: '/enquiries',
          exact: true,
          meta: {
            title: 'Enquiry Desk',
          },
        },
      },
    },
  },
  collections: [
    Services,
    Projects,
    BlogPosts,
    Categories,
    Testimonials,
    ContactEnquiries,
    Media,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  graphQL: {
    disablePlaygroundInProduction: true,
  },
  secret: process.env.PAYLOAD_SECRET?.trim() ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 25 * 1024 * 1024, // 25 MB max upload size
    },
  },
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      alwaysInsertFields: true,
      addRandomSuffix: true,
      clientUploads: true,
      collections: {
        media: true,
      },
      token: blobToken,
    }),
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI?.trim() || '',
    connectOptions: {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    },
    afterCreateConnection: (adapter) => {
      adapter.connection.on('error', (err) => {
        const sanitized = String(err?.message || err).replace(
          /mongodb(\+srv)?:\/\/[^@\s]+@/gi,
          'mongodb$1://<credentials>@'
        )
        console.error('[Payload MongoDB] Connection error:', sanitized)
      })
    },
  }),
  sharp,
})
