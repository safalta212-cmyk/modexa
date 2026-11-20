import { ArrowRight } from 'lucide-react'
import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { DEFAULT_SITE_SETTINGS, type SiteSettingsViewModel } from '@/lib/cms'
import { sanitizeSafeHref } from '@/lib/seo'

export function CtaBannerSection({
  settings = DEFAULT_SITE_SETTINGS,
}: {
  settings?: SiteSettingsViewModel
}) {
  return (
    <section className="relative overflow-hidden bg-modx-bg py-20 sm:py-24 border-t border-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 purple-glow opacity-90"
      />
      <Container className="relative">
        <FadeIn>
          <div className="rounded-2xl border border-modx-accent/30 bg-modx-surface/90 p-8 sm:p-14 text-center space-y-6 shadow-[0_24px_80px_-24px_rgba(139,92,246,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-modx-accent-light">
              {settings.ctaEyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white max-w-2xl mx-auto leading-[1.1]">
              {settings.ctaHeadline}
            </h2>
            <p className="text-base text-modx-muted max-w-xl mx-auto leading-relaxed">
              {settings.ctaDescription}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                href={sanitizeSafeHref(settings.ctaPrimaryHref, '/contact')}
                variant="primary"
                size="lg"
              >
                <span>{settings.ctaPrimaryLabel}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                href={sanitizeSafeHref(settings.ctaSecondaryHref, '/services')}
                variant="outline"
                size="lg"
              >
                {settings.ctaSecondaryLabel}
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
