import { ArrowUpRight } from 'lucide-react'
import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/Button'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { Container } from '@/components/ui/Container'
import { ReplaceableMedia } from '@/components/ui/ReplaceableMedia'
import type { MediaAssetSpec } from '@/data/types'
import { DEFAULT_SITE_SETTINGS, type SiteSettingsViewModel } from '@/lib/cms'

const FALLBACK_ABOUT_ARTWORK: MediaAssetSpec = {
  id: 'about-studio-editorial',
  alt: 'Modexa Digital Agency studio editorial visual',
  replaceableLabel: 'Agency Studio Visual',
  recommendedAspect: '16 / 10',
  variant: 'editorial-studio',
}

export function AboutPreviewSection({
  settings = DEFAULT_SITE_SETTINGS,
}: {
  settings?: SiteSettingsViewModel
}) {
  return (
    <section className="py-20 sm:py-28 bg-modx-bg">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <FadeIn className="lg:col-span-6">
            {settings.introMedia ? (
              <CmsMedia
                media={settings.introMedia}
                altFallback={FALLBACK_ABOUT_ARTWORK.alt}
                aspectRatio="16 / 10"
                sizeVariant="card"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
            ) : (
              <ReplaceableMedia
                media={FALLBACK_ABOUT_ARTWORK}
                showReplaceableCaption={false}
              />
            )}
          </FadeIn>

          <FadeIn delay={0.08} className="lg:col-span-6 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-modx-accent-light">
              {settings.introEyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-[1.15]">
              {settings.introHeadline}
            </h2>
            <p className="text-base text-modx-muted leading-relaxed">
              {settings.introDescription}
            </p>
            {settings.introHighlights.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-white/10">
                {settings.introHighlights.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <p className="text-lg font-bold text-white">{item.title}</p>
                    <p className="text-sm text-modx-muted">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="pt-2">
              <Button href={settings.introCtaHref} variant="secondary" size="md">
                <span>{settings.introCtaLabel}</span>
                <ArrowUpRight className="h-4 w-4 text-modx-accent-light" aria-hidden="true" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
