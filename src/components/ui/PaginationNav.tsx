import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface PaginationNavProps {
  basePath: string
  currentPage: number
  totalPages: number
  categorySlug?: string | null
}

function buildHref(basePath: string, page: number, categorySlug?: string | null): string {
  const params = new URLSearchParams()
  if (categorySlug && categorySlug !== 'all') {
    params.set('category', categorySlug)
  }
  if (page > 1) {
    params.set('page', String(page))
  }
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function PaginationNav({
  basePath,
  currentPage,
  totalPages,
  categorySlug,
}: PaginationNavProps) {
  if (totalPages <= 1) return null

  const pages: number[] = []
  for (let p = 1; p <= totalPages; p += 1) {
    pages.push(p)
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10"
    >
      <p className="text-xs font-mono text-modx-muted">
        Page <span className="text-white font-semibold">{currentPage}</span> of{' '}
        <span className="text-white font-semibold">{totalPages}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildHref(basePath, currentPage - 1, categorySlug)}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-modx-surface px-3 py-2 text-xs font-semibold text-white hover:border-modx-accent/50 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Previous</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-white/5 bg-modx-surface/50 px-3 py-2 text-xs font-semibold text-modx-muted/50 cursor-not-allowed">
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Previous</span>
          </span>
        )}

        {pages.map((p) => {
          const isCurrent = p === currentPage
          return (
            <Link
              key={p}
              href={buildHref(basePath, p, categorySlug)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2.5 text-xs font-semibold transition-colors ${
                isCurrent
                  ? 'bg-modx-accent text-white shadow-[0_0_20px_-6px_rgba(139,92,246,0.75)]'
                  : 'border border-white/10 bg-modx-surface text-modx-muted hover:text-white hover:border-white/25'
              }`}
            >
              {p}
            </Link>
          )
        })}

        {currentPage < totalPages ? (
          <Link
            href={buildHref(basePath, currentPage + 1, categorySlug)}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-modx-surface px-3 py-2 text-xs font-semibold text-white hover:border-modx-accent/50 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-white/5 bg-modx-surface/50 px-3 py-2 text-xs font-semibold text-modx-muted/50 cursor-not-allowed">
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  )
}
