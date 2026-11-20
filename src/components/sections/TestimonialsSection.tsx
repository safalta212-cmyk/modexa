import { Quote, Star } from 'lucide-react'
import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { CmsStatus, CmsTestimonialItem } from '@/lib/cms'

interface TestimonialsSectionProps {
  testimonials: CmsTestimonialItem[]
  status: CmsStatus
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function TestimonialsSection({
  testimonials,
  status,
}: TestimonialsSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-modx-bg">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeading
            eyebrow="Client Perspectives"
            title="How partners describe working with Modexa."
            description="Verified reviews from founders and marketing leaders we partner with."
          />
        </div>

        {status !== 'ok' || testimonials.length === 0 ? (
          <CmsEmptyState
            status={status}
            title="No published testimonials yet"
            description="Publish verified client testimonials in the Payload CMS Admin Dashboard to showcase client feedback here."
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((item, idx) => (
              <FadeIn key={item.id} delay={idx * 0.06}>
                <blockquote className="h-full rounded-2xl card-surface p-7 flex flex-col justify-between space-y-6 card-surface-hover">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <Quote className="h-6 w-6 text-modx-accent-light" aria-hidden="true" />
                      <div
                        className="flex items-center gap-1"
                        aria-label={`Rated ${item.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, starIndex) => {
                          const filled = starIndex < item.rating
                          return (
                            <Star
                              key={starIndex}
                              className={`h-3.5 w-3.5 ${
                                filled
                                  ? 'fill-modx-accent-light text-modx-accent-light'
                                  : 'text-white/20'
                              }`}
                              aria-hidden="true"
                            />
                          )
                        })}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                      {item.review}
                    </p>
                  </div>

                  <footer className="pt-5 border-t border-white/10 flex items-center gap-3.5">
                    {item.clientPhoto ? (
                      <CmsMedia
                        media={item.clientPhoto}
                        altFallback={item.clientName}
                        aspectRatio="1 / 1"
                        sizeVariant="thumbnail"
                        sizes="44px"
                        className="h-11 w-11 shrink-0 rounded-full"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-modx-accent/35 bg-modx-accent/15 text-xs font-bold text-modx-accent-light"
                      >
                        {getInitials(item.clientName)}
                      </div>
                    )}
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-bold text-white truncate">{item.clientName}</p>
                      <p className="text-xs text-modx-muted truncate">
                        {item.clientDesignation} · {item.company}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              </FadeIn>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
