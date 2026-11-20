import { ArrowLeft, ArrowRight, Calendar, ExternalLink, Layers } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { CtaBannerSection } from '@/components/sections/CtaBannerSection'
import { Button } from '@/components/ui/Button'
import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import {
  getAllPublishedSlugs,
  getPublishedProjectBySlug,
  getSiteSettings,
} from '@/lib/cms'
import {
  buildPageMetadata,
  resolveAbsoluteMediaUrl,
  resolveCanonicalUrl,
  sanitizeExternalUrl,
} from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

function formatCompletionDate(iso?: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export async function generateStaticParams() {
  const { projects } = await getAllPublishedSlugs()
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const res = await getPublishedProjectBySlug(slug)
  const project = res.data.project

  if (!project) {
    return buildPageMetadata({
      title: 'Project Not Found',
      description: 'The requested portfolio project could not be found.',
      path: `/portfolio/${slug}`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: project.projectName,
    description: project.description.slice(0, 160),
    path: `/portfolio/${project.slug}`,
    image: project.featuredImage?.raw || null,
    type: 'website',
  })
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [projectRes, settingsRes] = await Promise.all([
    getPublishedProjectBySlug(slug),
    getSiteSettings(),
  ])

  if (projectRes.status !== 'ok') {
    return (
      <section className="py-20 sm:py-28 bg-modx-bg">
        <Container className="space-y-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold text-modx-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Portfolio</span>
          </Link>
          <CmsEmptyState
            status={projectRes.status}
            title="Project Unavailable"
            description="Unable to load project details from Payload CMS right now."
            actionHref="/portfolio"
            actionLabel="Return to Portfolio"
          />
        </Container>
      </section>
    )
  }

  const { project, relatedProjects } = projectRes.data
  if (!project) {
    notFound()
  }

  const formattedDate = formatCompletionDate(project.completionDate)
  const safeLiveUrl = sanitizeExternalUrl(project.projectUrl)
  const ogImageUrl = resolveAbsoluteMediaUrl(project.featuredImage?.raw, 'hero')

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.projectName,
          description: project.description,
          url: resolveCanonicalUrl(`/portfolio/${project.slug}`),
          creator: {
            '@type': 'Organization',
            name: settingsRes.data.agencyName,
          },
          ...(formattedDate && project.completionDate
            ? { datePublished: project.completionDate }
            : {}),
          ...(ogImageUrl ? { image: ogImageUrl } : {}),
        }}
      />

      <section className="relative overflow-hidden bg-modx-bg pt-12 pb-16 sm:pt-20 sm:pb-20 border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[760px] -translate-x-1/2 purple-glow"
        />
        <Container className="relative space-y-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold text-modx-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-modx-muted">
              <span className="font-semibold text-modx-accent-light">
                {project.category?.name || 'Case Study'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{project.clientName}</span>
              {formattedDate ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{formattedDate}</span>
                </>
              ) : null}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.1]">
              {project.projectName}
            </h1>
            <p className="text-base sm:text-lg text-modx-muted leading-relaxed">
              {project.description}
            </p>
          </div>

          <CmsMedia
            media={project.featuredImage}
            altFallback={project.projectName}
            aspectRatio="16 / 10"
            sizeVariant="hero"
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
            showCaption={Boolean(project.featuredImage?.caption)}
            className="max-w-4xl"
          />
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-modx-surface">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-10">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white">Project Overview</h2>
                <p className="text-base text-modx-muted leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {project.projectVideo ? (
                <div className="space-y-4 pt-8 border-t border-white/10">
                  <h2 className="text-xl font-bold text-white">Project Showcase Video</h2>
                  <CmsMedia
                    media={project.projectVideo}
                    altFallback={`${project.projectName} showcase video`}
                    aspectRatio="16 / 9"
                    showCaption={Boolean(project.projectVideo.caption)}
                  />
                </div>
              ) : null}

              {project.gallery.length > 0 ? (
                <div className="space-y-5 pt-8 border-t border-white/10">
                  <h2 className="text-xl font-bold text-white">Project Gallery</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {project.gallery.map((item, idx) => (
                      <div key={`${item.image.id}-${idx}`} className="space-y-2">
                        <CmsMedia
                          media={item.image}
                          altFallback={item.caption || `${project.projectName} gallery image ${idx + 1}`}
                          aspectRatio="4 / 3"
                          sizeVariant="card"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        {item.caption ? (
                          <p className="text-xs text-modx-muted">{item.caption}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-modx-accent/30 bg-modx-bg p-7 space-y-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-modx-accent-light">
                  Engagement Details
                </p>

                <dl className="space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                    <dt className="text-modx-muted">Client</dt>
                    <dd className="font-semibold text-white text-right">{project.clientName}</dd>
                  </div>

                  {project.category ? (
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                      <dt className="text-modx-muted">Category</dt>
                      <dd className="font-semibold text-modx-accent-light text-right">
                        {project.category.name}
                      </dd>
                    </div>
                  ) : null}

                  {formattedDate ? (
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                      <dt className="inline-flex items-center gap-1.5 text-modx-muted">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Completed</span>
                      </dt>
                      <dd className="font-semibold text-white text-right">{formattedDate}</dd>
                    </div>
                  ) : null}
                </dl>

                {project.technologiesUsed.length > 0 ? (
                  <div className="space-y-3">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                      <Layers className="h-3.5 w-3.5 text-modx-accent-light" aria-hidden="true" />
                      <span>Technologies &amp; Channels</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologiesUsed.map((tech, idx) => (
                        <span
                          key={`${tech}-${idx}`}
                          className="rounded-md border border-white/15 bg-modx-surface px-2.5 py-1 font-mono text-xs text-white/90"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3 pt-2">
                  {safeLiveUrl ? (
                    <a
                      href={safeLiveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-modx-surface px-5 py-2.5 text-sm font-semibold text-white hover:border-modx-accent/60 transition-colors"
                    >
                      <span>Visit Live Project</span>
                      <ExternalLink className="h-4 w-4 text-modx-accent-light" aria-hidden="true" />
                    </a>
                  ) : null}

                  <Button href="/contact" variant="primary" size="md" className="w-full">
                    <span>Discuss a Similar Project</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {relatedProjects.length > 0 ? (
        <section className="py-16 bg-modx-bg border-t border-white/10">
          <Container className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">More Client Work</h2>
              <Link
                href="/portfolio"
                className="text-sm font-semibold text-modx-accent-light hover:underline"
              >
                View all work
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {relatedProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className="group rounded-2xl border border-white/10 bg-modx-surface p-5 card-surface-hover space-y-4"
                >
                  <CmsMedia
                    media={item.featuredImage}
                    altFallback={item.projectName}
                    aspectRatio="4 / 3"
                    sizeVariant="card"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-modx-accent-light">
                      {item.category?.name || 'Case Study'}
                    </p>
                    <h3 className="text-lg font-bold text-white group-hover:text-modx-accent-light transition-colors">
                      {item.projectName}
                    </h3>
                  </div>
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
