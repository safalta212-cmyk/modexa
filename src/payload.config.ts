import path from 'path'
import { fileURLToPath } from 'url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

function resolveServerURL(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SERVER_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    ''

  if (!candidate || candidate === 'MY_APP_URL') {
    return ''
  }

  return candidate.replace(/\/+$/, '')
}

function resolveAllowedOrigins(): string[] {
  const origins = new Set<string>()
  const serverURL = resolveServerURL()

  if (serverURL) {
    origins.add(serverURL)
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000')
    origins.add('http://127.0.0.1:3000')
  }

  return Array.from(origins)
}

const serverURL = resolveServerURL()
const allowedOrigins = resolveAllowedOrigins()

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
  secret: process.env.PAYLOAD_SECRET?.trim() ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 25 * 1024 * 1024, // 25 MB max upload size
    },
  },
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
