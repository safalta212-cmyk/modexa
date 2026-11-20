import Image from 'next/image'
import React from 'react'

import type { MediaAssetSpec, MediaSlotVariant } from '@/data/types'

interface ReplaceableMediaProps {
  media: MediaAssetSpec
  className?: string
  priority?: boolean
  showReplaceableCaption?: boolean
}

function AbstractArtwork({ variant }: { variant: MediaSlotVariant }) {
  switch (variant) {
    case 'hero-3d':
      return (
        <svg
          viewBox="0 0 800 560"
          fill="none"
          aria-hidden="true"
          className="h-full w-full object-cover"
        >
          <defs>
            <radialGradient id="heroOrbGlow" cx="50%" cy="48%" r="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.48" />
              <stop offset="52%" stopColor="#6D28D9" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#08080C" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ringStrokeA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="prismFace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F1A36" />
              <stop offset="100%" stopColor="#0B0B12" />
            </linearGradient>
          </defs>

          <rect width="800" height="560" fill="#0B0B12" />
          <circle cx="400" cy="275" r="245" fill="url(#heroOrbGlow)" />

          {/* Architectural grid lines */}
          <g stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1">
            <line x1="0" y1="140" x2="800" y2="140" />
            <line x1="0" y1="280" x2="800" y2="280" />
            <line x1="0" y1="420" x2="800" y2="420" />
            <line x1="200" y1="0" x2="200" y2="560" />
            <line x1="400" y1="0" x2="400" y2="560" />
            <line x1="600" y1="0" x2="600" y2="560" />
          </g>

          {/* Sculptural 3D orbital rings */}
          <ellipse
            cx="400"
            cy="280"
            rx="235"
            ry="88"
            transform="rotate(-24 400 280)"
            stroke="url(#ringStrokeA)"
            strokeWidth="2.5"
          />
          <ellipse
            cx="400"
            cy="280"
            rx="195"
            ry="72"
            transform="rotate(28 400 280)"
            stroke="#A78BFA"
            strokeOpacity="0.5"
            strokeWidth="1.75"
          />
          <ellipse
            cx="400"
            cy="280"
            rx="155"
            ry="155"
            stroke="#8B5CF6"
            strokeOpacity="0.24"
            strokeDasharray="6 8"
            strokeWidth="1.25"
          />

          {/* Central obsidian faceted monolith */}
          <polygon points="400,132 512,248 400,428 288,248" fill="url(#prismFace)" stroke="#A78BFA" strokeOpacity="0.45" strokeWidth="1.5" />
          <polygon points="400,132 512,248 400,280" fill="#8B5CF6" fillOpacity="0.16" />
          <polygon points="400,132 288,248 400,280" fill="#FFFFFF" fillOpacity="0.04" />
          <line x1="400" y1="132" x2="400" y2="428" stroke="#A78BFA" strokeOpacity="0.35" strokeWidth="1" />

          {/* Floating geometric satellites */}
          <circle cx="578" cy="184" r="18" fill="#171722" stroke="#A78BFA" strokeOpacity="0.7" strokeWidth="1.5" />
          <circle cx="218" cy="356" r="14" fill="#171722" stroke="#8B5CF6" strokeOpacity="0.75" strokeWidth="1.5" />
          <circle cx="516" cy="396" r="9" fill="#8B5CF6" fillOpacity="0.75" />
        </svg>
      )

    case 'saas-platform':
      return (
        <svg viewBox="0 0 640 480" fill="none" aria-hidden="true" className="h-full w-full">
          <rect width="640" height="480" fill="#111118" />
          <circle cx="490" cy="110" r="180" fill="#8B5CF6" fillOpacity="0.16" />
          <rect x="64" y="76" width="512" height="328" rx="16" fill="#0A0A10" stroke="#FFFFFF" strokeOpacity="0.1" />
          <rect x="96" y="114" width="176" height="12" rx="4" fill="#A78BFA" fillOpacity="0.7" />
          <rect x="96" y="142" width="120" height="8" rx="4" fill="#FFFFFF" fillOpacity="0.18" />
          <path
            d="M96 320 C168 292, 224 236, 292 252 C360 268, 412 186, 544 152"
            stroke="#8B5CF6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M96 356 C182 342, 240 310, 326 300 C406 290, 464 246, 544 216"
            stroke="#A78BFA"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          <rect x="96" y="346" width="84" height="32" rx="6" fill="#171724" stroke="#8B5CF6" strokeOpacity="0.35" />
          <rect x="196" y="346" width="84" height="32" rx="6" fill="#171724" stroke="#FFFFFF" strokeOpacity="0.08" />
        </svg>
      )

    case 'ecommerce-brand':
      return (
        <svg viewBox="0 0 640 480" fill="none" aria-hidden="true" className="h-full w-full">
          <rect width="640" height="480" fill="#111118" />
          <circle cx="320" cy="240" r="200" fill="#8B5CF6" fillOpacity="0.14" />
          <rect x="150" y="290" width="340" height="24" rx="4" fill="#1B1B27" stroke="#FFFFFF" strokeOpacity="0.08" />
          <rect x="208" y="132" width="94" height="158" rx="14" fill="#0B0B10" stroke="#A78BFA" strokeOpacity="0.55" strokeWidth="1.5" />
          <rect x="234" y="106" width="42" height="26" rx="4" fill="#1E1B2E" stroke="#A78BFA" strokeOpacity="0.4" />
          <rect x="330" y="176" width="110" height="114" rx="14" fill="#151521" stroke="#FFFFFF" strokeOpacity="0.14" />
          <circle cx="255" cy="210" r="22" fill="#8B5CF6" fillOpacity="0.3" />
        </svg>
      )

    case 'fintech-identity':
      return (
        <svg viewBox="0 0 640 480" fill="none" aria-hidden="true" className="h-full w-full">
          <rect width="640" height="480" fill="#0E0E15" />
          <circle cx="200" cy="140" r="170" fill="#8B5CF6" fillOpacity="0.16" />
          <rect x="128" y="128" width="260" height="164" rx="18" transform="rotate(-8 128 128)" fill="#161622" stroke="#A78BFA" strokeOpacity="0.45" />
          <rect x="248" y="186" width="260" height="164" rx="18" fill="#09090E" stroke="#8B5CF6" strokeOpacity="0.7" strokeWidth="1.5" />
          <circle cx="304" cy="242" r="20" fill="#8B5CF6" fillOpacity="0.35" stroke="#A78BFA" strokeOpacity="0.8" />
          <rect x="284" y="296" width="144" height="10" rx="5" fill="#FFFFFF" fillOpacity="0.22" />
        </svg>
      )

    case 'paid-growth':
      return (
        <svg viewBox="0 0 640 480" fill="none" aria-hidden="true" className="h-full w-full">
          <rect width="640" height="480" fill="#111118" />
          <circle cx="480" cy="360" r="190" fill="#8B5CF6" fillOpacity="0.15" />
          <rect x="96" y="256" width="64" height="132" rx="8" fill="#1D1D2B" />
          <rect x="190" y="212" width="64" height="176" rx="8" fill="#252238" />
          <rect x="284" y="168" width="64" height="220" rx="8" fill="#4C1D95" fillOpacity="0.55" stroke="#8B5CF6" strokeOpacity="0.4" />
          <rect x="378" y="122" width="64" height="266" rx="8" fill="#6D28D9" fillOpacity="0.7" stroke="#A78BFA" strokeOpacity="0.6" />
          <rect x="472" y="84" width="64" height="304" rx="8" fill="#8B5CF6" />
        </svg>
      )

    case 'web-architecture':
      return (
        <svg viewBox="0 0 640 480" fill="none" aria-hidden="true" className="h-full w-full">
          <rect width="640" height="480" fill="#0D0D14" />
          <circle cx="320" cy="240" r="180" fill="#8B5CF6" fillOpacity="0.16" />
          <rect x="78" y="82" width="484" height="316" rx="14" fill="#11111A" stroke="#FFFFFF" strokeOpacity="0.12" />
          <line x1="78" y1="126" x2="562" y2="126" stroke="#FFFFFF" strokeOpacity="0.08" />
          <circle cx="110" cy="104" r="5" fill="#A78BFA" />
          <circle cx="130" cy="104" r="5" fill="#FFFFFF" fillOpacity="0.22" />
          <circle cx="150" cy="104" r="5" fill="#FFFFFF" fillOpacity="0.22" />
          <rect x="110" y="158" width="210" height="18" rx="4" fill="#FFFFFF" fillOpacity="0.82" />
          <rect x="110" y="190" width="160" height="10" rx="4" fill="#A1A1AA" fillOpacity="0.45" />
          <rect x="110" y="220" width="112" height="34" rx="8" fill="#8B5CF6" />
          <rect x="352" y="156" width="176" height="206" rx="12" fill="#181826" stroke="#8B5CF6" strokeOpacity="0.45" />
        </svg>
      )

    case 'editorial-studio':
      return (
        <svg viewBox="0 0 640 480" fill="none" aria-hidden="true" className="h-full w-full">
          <rect width="640" height="480" fill="#0B0B11" />
          <circle cx="320" cy="200" r="210" fill="#8B5CF6" fillOpacity="0.16" />
          <polygon points="120,380 280,120 440,380" fill="#141420" stroke="#A78BFA" strokeOpacity="0.45" />
          <polygon points="240,380 380,160 520,380" fill="#1A182B" stroke="#8B5CF6" strokeOpacity="0.55" />
          <circle cx="330" cy="210" r="44" fill="#8B5CF6" fillOpacity="0.24" stroke="#A78BFA" strokeOpacity="0.7" />
        </svg>
      )

    case 'portrait':
    default:
      return (
        <svg viewBox="0 0 400 400" fill="none" aria-hidden="true" className="h-full w-full">
          <rect width="400" height="400" fill="#111118" />
          <circle cx="200" cy="150" r="140" fill="#8B5CF6" fillOpacity="0.14" />
          <circle cx="200" cy="148" r="56" fill="#1B1B28" stroke="#A78BFA" strokeOpacity="0.5" strokeWidth="1.5" />
          <path
            d="M96 356 C96 286, 142 246, 200 246 C258 246, 304 286, 304 356"
            fill="#171724"
            stroke="#8B5CF6"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
        </svg>
      )
  }
}

export function ReplaceableMedia({
  media,
  className = '',
  priority = false,
  showReplaceableCaption = true,
}: ReplaceableMediaProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-modx-surface ${className}`}
      style={{ aspectRatio: media.recommendedAspect }}
    >
      {media.suppliedSrc ? (
        <Image
          src={media.suppliedSrc}
          alt={media.alt}
          fill
          priority={priority}
          referrerPolicy="no-referrer"
          className="object-cover"
        />
      ) : (
        <AbstractArtwork variant={media.variant} />
      )}

      {showReplaceableCaption && !media.suppliedSrc ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 py-3">
          <p className="font-mono text-[11px] text-modx-muted">
            {media.replaceableLabel}
          </p>
        </div>
      ) : null}
    </div>
  )
}
