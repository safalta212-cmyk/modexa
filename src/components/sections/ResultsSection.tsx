import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { DEFAULT_SITE_SETTINGS, type SiteSettingsViewModel } from '@/lib/cms'

export function ResultsSection({
  settings = DEFAULT_SITE_SETTINGS,
}: {
  settings?: SiteSettingsViewModel
}) {
  if (settings.resultsMetrics.length === 0) {
    return null
  }

  return (
    <section className="py-20 sm:py-28 bg-modx-surface border-y border-white/10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeading
            eyebrow="Performance Benchmarks"
            title="Built around measurable pipeline and unit economics."
            description="Key agency impact metrics managed via Payload CMS."
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {settings.resultsMetrics.map((metric, idx) => (
            <FadeIn key={`${metric.label}-${idx}`} delay={idx * 0.05}>
              <div className="h-full rounded-xl border border-white/10 bg-modx-bg p-6 space-y-3 card-surface-hover">
                <p className="font-display text-4xl sm:text-5xl font-extrabold text-white tabular-nums">
                  <span className="text-modx-accent-light">{metric.value}</span>
                </p>
                <p className="text-base font-semibold text-white">{metric.label}</p>
                {metric.context ? (
                  <p className="text-xs text-modx-muted leading-relaxed">{metric.context}</p>
                ) : null}
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
