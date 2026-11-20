import { ArrowRight, Compass } from 'lucide-react'
import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/Button'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { Container } from '@/components/ui/Container'
import { ReplaceableMedia } from '@/components/ui/ReplaceableMedia'
import type { MediaAssetSpec } from '@/data/types'
import { DEFAULT_SITE_SETTINGS, type SiteSettingsViewModel } from '@/lib/cms'

const FALLBACK_HERO_ARTWORK: MediaAssetSpec = {
  id: 'hero-3d-sculpture',
  alt: 'Abstract 3D sculptural orbital rings and dark obsidian monolith with electric purple rim lighting',
  replaceableLabel: 'Hero Visual',
  recommendedAspect: '16 / 10',
  variant: 'hero-3d',
}

export function HeroSection({
  settings = DEFAULT_SITE_SETTINGS,
}: {
  settings?: SiteSettingsViewModel
}) {
  return (
    <section className="relative overflow-hidden bg-modx-bg pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[540px] w-[880px] -translate-x-1/2 purple-glow"
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <FadeIn immediate className="lg:col-span-7 space-y-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-modx-accent-light">
              {settings.heroEyebrow}
            </p>

            <h1 className="text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold text-white leading-[1.05] tracking-tight">
              {settings.heroHeadlinePrefix}{' '}
              <span className="bg-gradient-to-r from-modx-accent-light via-modx-accent to-white bg-clip-text text-transparent">
                {settings.heroHeadlineHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-modx-muted max-w-2xl leading-relaxed">
              {settings.heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button href={settings.heroPrimaryCtaHref} variant="primary" size="lg">
                <span>{settings.heroPrimaryCtaLabel}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href={settings.heroSecondaryCtaHref} variant="outline" size="lg">
                <Compass className="h-4 w-4 text-modx-accent-light" aria-hidden="true" />
                <span>{settings.heroSecondaryCtaLabel}</span>
              </Button>
            </div>
          </FadeIn>

          <FadeIn immediate delay={0.12} className="lg:col-span-5">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-3xl bg-modx-accent/15 blur-2xl"
              />
              {settings.heroMedia ? (
                <CmsMedia
                  media={settings.heroMedia}
                  altFallback={FALLBACK_HERO_ARTWORK.alt}
                  aspectRatio="16 / 10"
                  sizeVariant="hero"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                  className="relative shadow-[0_24px_70px_-20px_rgba(139,92,246,0.35)]"
                />
              ) : (
                <ReplaceableMedia
                  media={FALLBACK_HERO_ARTWORK}
                  priority
                  showReplaceableCaption={false}
                  className="relative shadow-[0_24px_70px_-20px_rgba(139,92,246,0.35)]"
                />
              )}
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
