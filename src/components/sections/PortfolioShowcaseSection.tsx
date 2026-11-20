import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/Button'
import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { CmsProjectItem, CmsStatus } from '@/lib/cms'

interface PortfolioShowcaseSectionProps {
  projects: CmsProjectItem[]
  status: CmsStatus
}

function formatYear(iso?: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return String(date.getFullYear())
}

export function PortfolioShowcaseSection({
  projects,
  status,
}: PortfolioShowcaseSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-modx-surface border-y border-white/10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeading
            eyebrow="Selected Work"
            title="Digital products, brand worlds, and growth engines."
            description="Explore published client case studies and shipped digital experiences."
          />
          <Button href="/portfolio" variant="outline" size="md">
            <span>Explore Full Portfolio</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {status !== 'ok' || projects.length === 0 ? (
          <CmsEmptyState
            status={status}
            title="No published projects yet"
            description="Publish featured client case studies in the Payload CMS Admin Dashboard to display them here."
            actionHref="/contact"
            actionLabel="Start Your Case Study"
          />
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project, idx) => {
              const year = formatYear(project.completionDate)
              return (
                <FadeIn key={project.id} delay={idx * 0.06}>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="group block h-full rounded-2xl border border-white/10 bg-modx-bg p-5 card-surface-hover"
                  >
                    <CmsMedia
                      media={project.featuredImage}
                      altFallback={project.projectName}
                      aspectRatio="4 / 3"
                      sizeVariant="card"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="mb-5"
                    />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4 text-xs text-modx-muted">
                        <span className="font-medium text-modx-accent-light">
                          {project.category?.name || 'Case Study'}
                          {year ? ` · ${year}` : ''}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-modx-muted group-hover:text-modx-accent-light transition-colors"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-modx-accent-light transition-colors">
                        {project.projectName}
                      </h3>
                      <p className="text-sm text-modx-muted leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                      <p className="font-mono text-xs text-white/75 pt-1">
                        Client: {project.clientName}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        )}
      </Container>
    </section>
  )
}
