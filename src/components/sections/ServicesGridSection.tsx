import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/Button'
import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import type { CmsServiceItem, CmsStatus } from '@/lib/cms'

interface ServicesGridSectionProps {
  services: CmsServiceItem[]
  status: CmsStatus
}

export function ServicesGridSection({ services, status }: ServicesGridSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-modx-surface border-y border-white/10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeading
            eyebrow="Capabilities"
            title="Full-spectrum digital capabilities built to compound."
            description="Integrated digital disciplines designed to capture demand, elevate brand perception, and convert visitors into measurable revenue."
          />
          <Button href="/services" variant="outline" size="md">
            <span>View All Services</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {status !== 'ok' || services.length === 0 ? (
          <CmsEmptyState
            status={status}
            title="No published services yet"
            description="Publish services in the Payload CMS Admin Dashboard to showcase your agency capabilities here."
            actionHref="/contact"
            actionLabel="Discuss a Custom Scope"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <FadeIn key={service.id} delay={Math.min(index * 0.04, 0.24)}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col justify-between rounded-xl border border-white/10 bg-modx-bg p-6 card-surface-hover"
                >
                  <div className="space-y-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-modx-accent/30 bg-modx-accent/10">
                      <ServiceIcon name={service.icon} />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-modx-accent-light transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-modx-muted leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-modx-accent-light">
                    <span>Explore service</span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
