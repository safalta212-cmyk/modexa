import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PROCESS_STEPS } from '@/data/company'

export function ProcessSection() {
  return (
    <section className="py-20 sm:py-28 bg-modx-bg">
      <Container>
        <SectionHeading
          eyebrow="Our Process"
          title="Five disciplined stages from audit to scale."
          description="Every engagement follows a clear operating cadence so strategy, creative production, and optimization stay tightly aligned."
          className="mb-14"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS_STEPS.map((item, idx) => (
            <FadeIn key={item.step} delay={idx * 0.05}>
              <div className="relative h-full rounded-xl card-surface p-6 flex flex-col justify-between space-y-6 card-surface-hover">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-modx-accent-light tabular-nums">
                      Step {item.step}
                    </span>
                    <span className="h-1.5 w-8 rounded-full bg-modx-accent/40" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <p className="text-sm text-modx-muted leading-relaxed">{item.summary}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
