import path from 'path'
import { fileURLToPath } from 'url'
import { withPayload } from '@payloadcms/next/withPayload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function getServerRemotePatterns() {
  const candidates = [process.env.NEXT_PUBLIC_SERVER_URL, process.env.APP_URL].filter(
    (value) => Boolean(value && value !== 'MY_APP_URL')
  )

  const patterns = []

  for (const candidate of candidates) {
    try {
      const url = new URL(candidate)
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        patterns.push({
          protocol: url.protocol.replace(':', ''),
          hostname: url.hostname,
          port: url.port,
          pathname: '/**',
        })
      }
    } catch {
      // Ignore malformed URL values in env during build
    }
  }

  return patterns
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: getServerRemotePatterns(),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    webpackMemoryOptimizations: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(dirname, 'src'),
      '@payload-config': path.resolve(dirname, 'src/payload.config.ts'),
    }
    return config
  },
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
