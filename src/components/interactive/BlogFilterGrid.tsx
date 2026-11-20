import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { PaginationNav } from '@/components/ui/PaginationNav'
import type {
  CmsBlogPostItem,
  CmsCategoryItem,
  CmsStatus,
  PaginatedCmsList,
} from '@/lib/cms'

interface BlogFilterGridProps {
  categories: CmsCategoryItem[]
  postsPage: PaginatedCmsList<CmsBlogPostItem>
  status: CmsStatus
  activeCategorySlug: string
}

function formatDate(iso?: string | null): string {
  if (!iso) return 'Published'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Published'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function BlogFilterGrid({
  categories,
  postsPage,
  status,
  activeCategorySlug,
}: BlogFilterGridProps) {
  const normalizedActive = activeCategorySlug || 'all'
  const posts = postsPage.items

  return (
    <div className="space-y-10">
      <div
        role="navigation"
        aria-label="Filter articles by category"
        className="flex flex-wrap items-center gap-2"
      >
        <Link
          href="/blog"
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
              href={`/blog?category=${encodeURIComponent(category.slug)}`}
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

      {status !== 'ok' || posts.length === 0 ? (
        <CmsEmptyState
          status={status}
          title={
            normalizedActive !== 'all'
              ? 'No published articles in this category yet'
              : 'No published blog articles yet'
          }
          description={
            normalizedActive !== 'all'
              ? 'Try another topic filter or view all published insights.'
              : 'Publish articles in the Payload CMS Admin Dashboard to display editorial guides and insights here.'
          }
          actionHref={normalizedActive !== 'all' ? '/blog' : '/contact'}
          actionLabel={normalizedActive !== 'all' ? 'View All Articles' : 'Talk to Our Team'}
        />
      ) : (
        <div className="space-y-10">
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-modx-surface p-5 card-surface-hover"
              >
                <CmsMedia
                  media={post.featuredImage}
                  altFallback={post.title}
                  aspectRatio="16 / 9"
                  sizeVariant="card"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="mb-5"
                />
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-modx-muted">
                      <span className="font-medium text-modx-accent-light">
                        {post.category?.name || 'Insights'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(post.publishedDate)}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-modx-accent-light transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-modx-muted leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-modx-accent-light">
                    <span className="text-modx-muted font-normal">By {post.authorName}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span>Read article</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <PaginationNav
            basePath="/blog"
            currentPage={postsPage.page}
            totalPages={postsPage.totalPages}
            categorySlug={normalizedActive}
          />
        </div>
      )}
    </div>
  )
}
