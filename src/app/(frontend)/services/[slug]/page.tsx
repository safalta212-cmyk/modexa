import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { CtaBannerSection } from '@/components/sections/CtaBannerSection'
import { Button } from '@/components/ui/Button'
import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { CmsRichText } from '@/components/ui/CmsRichText'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import {
  getAllPublishedSlugs,
  getPublishedServiceBySlug,
  getSiteSettings,
} from '@/lib/cms'
import { buildPageMetadata, resolveAbsoluteMediaUrl, resolveCanonicalUrl } from '@/lib/seo'

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { services } = await getAllPublishedSlugs()
  return services.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const res = await getPublishedServiceBySlug(slug)
  const service = res.data.service

  if (res.status !== 'ok') {
    return buildPageMetadata({
      title: 'Service Unavailable',
      description: 'Unable to load service details from Payload CMS right now.',
      path: `/services/${slug}`,
      noIndex: true,
    })
  }

  if (!service) {
    return buildPageMetadata({
      title: 'Service Not Found',
      description: 'The requested digital service page could not be found.',
      path: `/services/${slug}`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: service.seoTitle?.trim() || service.title,
    description: service.seoDescription?.trim() || service.shortDescription,
    path: `/services/${service.slug}`,
    image: service.featuredImage?.raw || null,
    type: 'website',
  })
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const [serviceRes, settingsRes] = await Promise.all([
    getPublishedServiceBySlug(slug),
    getSiteSettings(),
  ])

  if (serviceRes.status !== 'ok') {
    return (
      <section className="py-20 sm:py-28 bg-modx-bg">
        <Container className="space-y-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-modx-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Services</span>
          </Link>
          <CmsEmptyState
            status={serviceRes.status}
            title="Service Unavailable"
            description="Unable to load service details from Payload CMS right now."
            actionHref="/contact"
            actionLabel="Contact Our Team"
          />
        </Container>
      </section>
    )
  }

  const { service, relatedServices } = serviceRes.data
  if (!service) {
    notFound()
  }

  const imageUrl = resolveAbsoluteMediaUrl(service.featuredImage?.raw, 'hero')

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.seoDescription?.trim() || service.shortDescription,
          url: resolveCanonicalUrl(`/services/${service.slug}`),
          provider: {
            '@type': 'Organization',
            name: settingsRes.data.agencyName,
          },
          ...(imageUrl ? { image: imageUrl } : {}),
        }}
      />

      <section className="relative overflow-hidden bg-modx-bg pt-12 pb-16 sm:pt-20 sm:pb-20 border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[760px] -translate-x-1/2 purple-glow"
        />
        <Container className="relative space-y-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-modx-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to All Services</span>
          </Link>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-modx-accent/35 bg-modx-accent/10">
                  <ServiceIcon name={service.icon} className="h-5 w-5 text-modx-accent-light" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-modx-accent-light">
                  Service Capability
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.1]">
                {service.title}
              </h1>

              <p className="text-base sm:text-lg text-modx-muted leading-relaxed">
                {service.shortDescription}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  href={`/contact?service=${encodeURIComponent(service.slug)}`}
                  variant="primary"
                  size="lg"
                >
                  <span>Start {service.title} Project</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button href="/portfolio" variant="outline" size="lg">
                  <span>View Related Work</span>
                </Button>
              </div>
            </div>

            {service.featuredImage ? (
              <div className="lg:col-span-5">
                <CmsMedia
                  media={service.featuredImage}
                  altFallback={service.title}
                  aspectRatio="4 / 3"
                  sizeVariant="hero"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                  showCaption={Boolean(service.featuredImage.caption)}
                />
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-modx-surface">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Overview &amp; Approach</h2>
                <CmsRichText data={service.fullDescription} />
              </div>

              {service.benefits.length > 0 ? (
                <div className="space-y-5 pt-8 border-t border-white/10">
                  <h2 className="text-2xl font-bold text-white">Key Business Benefits</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {service.benefits.map((benefit, idx) => (
                      <div
                        key={`${benefit.title}-${idx}`}
                        className="rounded-xl border border-white/10 bg-modx-bg p-5 space-y-2"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="h-5 w-5 text-modx-accent-light shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <h3 className="text-base font-bold text-white">{benefit.title}</h3>
                        </div>
                        {benefit.description ? (
                          <p className="text-sm text-modx-muted leading-relaxed pl-7">
                            {benefit.description}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="lg:col-span-5 space-y-6">
              {service.features.length > 0 ? (
                <div className="rounded-2xl border border-white/10 bg-modx-bg p-7 space-y-5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-modx-accent-light">
                    Included Features &amp; Deliverables
                  </h2>
                  <ul className="space-y-3.5">
                    {service.features.map((item, idx) => (
                      <li
                        key={`${item.label}-${idx}`}
                        className="flex items-start gap-3 text-sm text-white/90"
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

              <div className="rounded-2xl border border-modx-accent/30 bg-modx-bg p-7 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-modx-accent-light">
                  Ready to Move Forward?
                </p>
                <p className="text-lg font-bold text-white">
                  Scope a custom {service.title} roadmap with our team.
                </p>
                <p className="text-xs text-modx-muted leading-relaxed">
                  Share your current benchmarks and timeline—we will respond with a clear audit and
                  actionable growth plan.
                </p>
                <Button
                  href={`/contact?service=${encodeURIComponent(service.slug)}`}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  <span>Request a Proposal</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {relatedServices.length > 0 ? (
        <section className="py-16 bg-modx-bg border-t border-white/10">
          <Container className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Explore Other Services</h2>
              <Link
                href="/services"
                className="text-sm font-semibold text-modx-accent-light hover:underline"
              >
                View all services
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((item) => (
                <Link
                  key={item.id}
                  href={`/services/${item.slug}`}
                  className="group rounded-xl border border-white/10 bg-modx-surface p-5 space-y-3 card-surface-hover"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-modx-accent/30 bg-modx-accent/10">
                    <ServiceIcon name={item.icon} />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-modx-accent-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-modx-muted leading-relaxed line-clamp-3">
                    {item.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBannerSection settings={settingsRes.data} />
    </>
  )
}
