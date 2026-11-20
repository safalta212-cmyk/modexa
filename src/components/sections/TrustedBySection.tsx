import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Container } from '@/components/ui/Container'
import { DEFAULT_SITE_SETTINGS, type SiteSettingsViewModel } from '@/lib/cms'

export function TrustedBySection({
  settings = DEFAULT_SITE_SETTINGS,
}: {
  settings?: SiteSettingsViewModel
}) {
  if (settings.trustedBrands.length === 0) {
    return null
  }

  return (
    <section className="border-y border-white/10 bg-modx-surface/60 py-10">
      <Container>
        <FadeIn>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1 shrink-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                {settings.trustedBrandsHeading}
              </p>
              <p className="text-xs text-modx-muted">
                {settings.trustedBrandsSubheading}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:gap-8">
              {settings.trustedBrands.map((brand) => (
                <div
                  key={brand.name}
                  className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-modx-bg/70 px-4 py-2.5"
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-sm bg-modx-accent-light/80"
                  />
                  <span className="text-sm font-semibold text-white whitespace-nowrap">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
