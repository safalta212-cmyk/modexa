import type { Metadata } from 'next'

import type { Media } from '@/payload-types'

const SITE_NAME = 'Modexa Digital'

export function getSiteBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SERVER_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    'http://localhost:3000'

  if (!raw || raw === 'MY_APP_URL') {
    return 'http://localhost:3000'
  }

  try {
    const parsed = new URL(raw)
    return parsed.origin
  } catch {
    return 'http://localhost:3000'
  }
}

export function resolveCanonicalUrl(pathname: string): string {
  const base = getSiteBaseUrl()
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (normalizedPath === '/') {
    return `${base}/`
  }
  return `${base}${normalizedPath.replace(/\/+$/, '')}`
}

export function sanitizeExternalUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString()
    }
    return null
  } catch {
    return null
  }
}

export function resolveMediaObject(
  input: string | Media | null | undefined
): Media | null {
  if (!input || typeof input === 'string') return null
  return input
}

export function isVideoMedia(media: Media | null | undefined): boolean {
  if (!media) return false
  if (media.mimeType && media.mimeType.toLowerCase().startsWith('video/')) {
    return true
  }
  const url = media.url || media.filename || ''
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
}

export type MediaSizePreference = 'thumbnail' | 'card' | 'hero' | 'original'

export function resolveMediaUrl(
  input: string | Media | null | undefined,
  preferredSize: MediaSizePreference = 'original'
): string | null {
  const media = resolveMediaObject(input)
  if (!media) return null

  if (preferredSize !== 'original' && !isVideoMedia(media)) {
    const sizedUrl = media.sizes?.[preferredSize]?.url
    if (sizedUrl) return sizedUrl
  }

  return media.url || null
}

export function resolveAbsoluteMediaUrl(
  input: string | Media | null | undefined,
  preferredSize: MediaSizePreference = 'hero'
): string | null {
  const rawUrl = resolveMediaUrl(input, preferredSize)
  if (!rawUrl) return null
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }
  const base = getSiteBaseUrl()
  return `${base}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`
}

export function getMediaAlt(
  input: string | Media | null | undefined,
  fallbackAlt: string
): string {
  const media = resolveMediaObject(input)
  return media?.alt?.trim() || fallbackAlt
}

interface BuildPageMetadataInput {
  title: string
  description: string
  path: string
  image?: string | Media | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  authors?: string[]
  tags?: string[]
  noIndex?: boolean
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  authors,
  tags,
  noIndex = false,
}: BuildPageMetadataInput): Metadata {
  const canonical = resolveCanonicalUrl(path)
  const ogImageUrl = resolveAbsoluteMediaUrl(image, 'hero')
  const ogImageAlt = getMediaAlt(image, title)

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && authors && authors.length > 0 ? { authors } : {}),
      ...(type === 'article' && tags && tags.length > 0 ? { tags } : {}),
      ...(ogImageUrl
        ? {
            images: [
              {
                url: ogImageUrl,
                alt: ogImageAlt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  }
}
