import Image from 'next/image'
import React from 'react'

import type { CmsMediaAsset } from '@/lib/cms'

interface CmsMediaProps {
  media?: CmsMediaAsset | null
  altFallback?: string
  aspectRatio?: string
  sizeVariant?: 'thumbnail' | 'card' | 'hero' | 'original'
  sizes?: string
  priority?: boolean
  showCaption?: boolean
  className?: string
  fallbackLabel?: string
}

export function CmsMedia({
  media,
  altFallback = 'Modexa Digital visual',
  aspectRatio = '16 / 10',
  sizeVariant = 'card',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  showCaption = false,
  className = '',
  fallbackLabel,
}: CmsMediaProps) {
  const src = media
    ? sizeVariant === 'hero'
      ? media.heroUrl
      : sizeVariant === 'thumbnail'
        ? media.thumbnailUrl
        : sizeVariant === 'original'
          ? media.url
          : media.cardUrl
    : null

  const alt = media?.alt || altFallback
  const objectPosition =
    typeof media?.focalX === 'number' && typeof media?.focalY === 'number'
      ? `${media.focalX}% ${media.focalY}%`
      : '50% 50%'

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-modx-surface ${className}`}
      style={{ aspectRatio }}
    >
      {media && src ? (
        media.isVideo ? (
          <video
            src={media.url}
            controls
            playsInline
            preload="metadata"
            aria-label={alt}
            className="h-full w-full object-cover bg-black"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            referrerPolicy="no-referrer"
            className="object-cover"
            style={{ objectPosition }}
          />
        )
      ) : (
        <div
          aria-label={alt}
          className="relative flex h-full w-full items-center justify-center bg-[#0B0B12]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.22),transparent_65%)]"
          />
          <div
            aria-hidden="true"
            className="h-20 w-20 rounded-2xl border border-modx-accent/35 bg-modx-accent/10 rotate-12"
          />
          {fallbackLabel ? (
            <span className="pointer-events-none absolute bottom-3 left-4 right-4 truncate font-mono text-[11px] text-modx-muted">
              {fallbackLabel}
            </span>
          ) : null}
        </div>
      )}

      {showCaption && media?.caption ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 py-3">
          <p className="text-xs text-white/85">{media.caption}</p>
        </div>
      ) : null}
    </div>
  )
}
