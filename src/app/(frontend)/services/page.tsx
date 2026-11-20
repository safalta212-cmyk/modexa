import { ArrowRight, Check } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { CtaBannerSection } from '@/components/sections/CtaBannerSection'
import { Button } from '@/components/ui/Button'
import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { CmsRichText } from '@/components/ui/CmsRichText'
import { Container } from '@/components/ui/Container'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { getPublishedServices, getSiteSettings } from '@/lib/cms'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settingsRes = await getSiteSettings()
  return buildPageMetadata({
    title: 'Services',
    description:
      'Explore Modexa Digital agency services across SEO Optimization, Paid Ads, Social Media Marketing, Website Development, Branding, and Content Strategy.',
    path: '/services',
    image: settingsRes.data.defaultOgImage,
    type: 'website',
  })
}

export default async function ServicesPage() {
  const [servicesRes, settingsRes] = await Promise.all([
    getPublishedServices({ limit: 50 }),
    getSiteSettings(),
  ])

  const services = servicesRes.data

  return (
    <>
      <section className="relative overflow-hidden bg-modx-bg pt-16 pb-16 sm:pt-24 sm:pb-20 border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[760px] -translate-x-1/2 purple-glow"
        />
        <Container className="relative">
          <FadeIn immediate className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-modx-accent-light">
              Agency Services
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08]">
              Integrated marketing, creative, and web engineering.
            </h1>
            <p className="text-base sm:text-lg text-modx-muted leading-relaxed">
              Every discipline below can operate as a focused sprint or combine into a unified
              full-funnel growth partnership tailored to your goals.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-modx-surface">
        <Container className="space-y-8">
          {servicesRes.status !== 'ok' || services.length === 0 ? (
            <CmsEmptyState
              status={servicesRes.status}
              title="No published services found"
              description="Publish services in the Payload CMS Admin Dashboard to display agency offerings, features, and benefits here."
              actionHref="/contact"
              actionLabel="Request a Custom Proposal"
            />
          ) : (
            services.map((service, idx) => (
              <FadeIn key={service.id} delay={Math.min(idx * 0.04, 0.2)}>
                <article
                  id={service.slug}
                  className="scroll-mt-24 rounded-2xl border border-white/10 bg-modx-bg p-6 sm:p-10 card-surface-hover"
                >
                  <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-7 space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-modx-accent/35 bg-modx-accent/10 shrink-0">
                          <ServiceIcon
                            name={service.icon}
                            className="h-6 w-6 text-modx-accent-light"
                          />
                        </div>
                        <div>
                          <span className="font-mono text-xs text-modx-accent-light tabular-nums">
                            {String(idx + 1).padStart(2, '0')} · Core Capability
                          </span>
                          <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            <Link
                              href={`/services/${service.slug}`}
                              className="hover:text-modx-accent-light transition-colors"
                            >
                              {service.title}
                            </Link>
                          </h2>
                        </div>
                      </div>

                      <p className="text-base text-white/90 leading-relaxed">
                        {service.shortDescription}
                      </p>

                      <CmsRichText data={service.fullDescription} className="text-sm sm:text-base" />

                      {service.benefits.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 pt-2">
                          {service.benefits.slice(0, 4).map((benefit, bIdx) => (
                            <div
                              key={`${benefit.title}-${bIdx}`}
                              className="rounded-xl border border-white/10 bg-modx-surface/70 p-4 space-y-1"
                            >
                              <p className="text-sm font-semibold text-white">{benefit.title}</p>
                              {benefit.description ? (
                                <p className="text-xs text-modx-muted leading-relaxed">
                                  {benefit.description}
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <Button
                          href={`/services/${service.slug}`}
                          variant="primary"
                          size="md"
                        >
                          <span>View Service Details</span>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          href={`/contact?service=${encodeURIComponent(service.slug)}`}
                          variant="outline"
                          size="md"
                        >
                          <span>Start {service.title} Project</span>
                        </Button>
                      </div>
                    </div>

                    <div className="lg:col-span-5 space-y-5">
                      {service.featuredImage ? (
                        <CmsMedia
                          media={service.featuredImage}
                          altFallback={service.title}
                          aspectRatio="16 / 10"
                          sizeVariant="card"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                        />
                      ) : null}

                      {service.features.length > 0 ? (
                        <div className="rounded-xl border border-white/10 bg-modx-surface p-6 space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                            Key Features &amp; Deliverables
                          </h3>
                          <ul className="space-y-3">
                            {service.features.map((item, fIdx) => (
                              <li
                                key={`${item.label}-${fIdx}`}
                                className="flex items-start gap-3 text-sm text-modx-muted"
                              >
                                <Check
                                  className="h-4 w-4 text-modx-accent-light shrink-0 mt-0.5"
                                  aria-hidden="true"
                                />
                                <span>{item.label}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))
          )}
        </Container>
      </section>

      <CtaBannerSection settings={settingsRes.data} />
    </>
  )
}
