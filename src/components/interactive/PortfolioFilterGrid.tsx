import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { PaginationNav } from '@/components/ui/PaginationNav'
import type {
  CmsCategoryItem,
  CmsProjectItem,
  CmsStatus,
  PaginatedCmsList,
} from '@/lib/cms'

interface PortfolioFilterGridProps {
  categories: CmsCategoryItem[]
  projectsPage: PaginatedCmsList<CmsProjectItem>
  status: CmsStatus
  activeCategorySlug: string
}

function formatYear(iso?: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return String(date.getFullYear())
}

export function PortfolioFilterGrid({
  categories,
  projectsPage,
  status,
  activeCategorySlug,
}: PortfolioFilterGridProps) {
  const normalizedActive = activeCategorySlug || 'all'
  const projects = projectsPage.items

  return (
    <div className="space-y-10">
      <div
        role="navigation"
        aria-label="Filter portfolio projects by category"
        className="flex flex-wrap items-center gap-2"
      >
        <Link
          href="/portfolio"
          aria-current={normalizedActive === 'all' ? 'page' : undefined}
          className={`rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 ${
            normalizedActive === 'all'
              ? 'bg-modx-accent text-white shadow-[0_0_20px_-6px_rgba(139,92,246,0.75)]'
              : 'border border-white/10 bg-modx-surface text-modx-muted hover:text-white hover:border-white/25'
          }`}
        >
          All
        </Link>

        {categories.map((category) => {
          const isActive = normalizedActive === category.slug
          return (
            <Link
              key={category.id}
              href={`/portfolio?category=${encodeURIComponent(category.slug)}`}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 ${
                isActive
                  ? 'bg-modx-accent text-white shadow-[0_0_20px_-6px_rgba(139,92,246,0.75)]'
                  : 'border border-white/10 bg-modx-surface text-modx-muted hover:text-white hover:border-white/25'
              }`}
            >
              {category.name}
            </Link>
          )
        })}
      </div>

      {status !== 'ok' || projects.length === 0 ? (
        <CmsEmptyState
          status={status}
          title={
            normalizedActive !== 'all'
              ? 'No published projects in this category yet'
              : 'No published portfolio projects yet'
          }
          description={
            normalizedActive !== 'all'
              ? 'Try selecting another project category or view all published work.'
              : 'Publish client case studies in the Payload CMS Admin Dashboard to showcase portfolio projects here.'
          }
          actionHref={normalizedActive !== 'all' ? '/portfolio' : '/contact'}
          actionLabel={normalizedActive !== 'all' ? 'View All Projects' : 'Start a Project'}
        />
      ) : (
        <div className="space-y-10">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const year = formatYear(project.completionDate)
              return (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-modx-surface p-5 card-surface-hover"
                >
                  <CmsMedia
                    media={project.featuredImage}
                    altFallback={project.projectName}
                    aspectRatio="4 / 3"
                    sizeVariant="card"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="mb-5"
                  />
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-xs text-modx-muted">
                        <span className="font-medium text-modx-accent-light">
                          {project.category?.name || 'Case Study'}
                          {year ? ` · ${year}` : ''}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-modx-muted group-hover:text-modx-accent-light transition-colors"
                          aria-hidden="true"
                        />
                      </div>
                      <h2 className="text-lg font-bold text-white group-hover:text-modx-accent-light transition-colors leading-snug">
                        {project.projectName}
                      </h2>
                      <p className="text-sm text-modx-muted leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <p className="font-mono text-[11px] text-white/75 pt-3 border-t border-white/[0.06] truncate">
                      Client: {project.clientName}
                      {project.gallery.length > 0
                        ? ` · ${project.gallery.length} gallery image${project.gallery.length === 1 ? '' : 's'}`
                        : ''}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>

          <PaginationNav
            basePath="/portfolio"
            currentPage={projectsPage.page}
            totalPages={projectsPage.totalPages}
            categorySlug={normalizedActive}
          />
        </div>
      )}
    </div>
  )
}
