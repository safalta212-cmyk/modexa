import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WHY_CHOOSE_US_ITEMS } from '@/data/company'

export function WhyChooseUsSection() {
  return (
    <section className="py-20 sm:py-28 bg-modx-bg">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <FadeIn className="lg:col-span-5 space-y-6">
            <SectionHeading
              eyebrow="Why Modexa"
              title="Strategy, creative craft, and growth accountability in one place."
              description="We replace bloated agency layers with senior operators who care about pipeline quality, unit economics, and brand longevity."
            />
          </FadeIn>

          <div className="lg:col-span-7 grid gap-5 sm:grid-cols-2">
            {WHY_CHOOSE_US_ITEMS.map((item, idx) => (
              <FadeIn key={item.number} delay={idx * 0.05}>
                <div className="h-full rounded-xl card-surface p-6 space-y-3 card-surface-hover">
                  <span className="font-mono text-xs font-semibold text-modx-accent-light tabular-nums">
                    {item.number}
                  </span>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-modx-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
