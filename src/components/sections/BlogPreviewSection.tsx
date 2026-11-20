import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { Button } from '@/components/ui/Button'
import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { CmsBlogPostItem, CmsStatus } from '@/lib/cms'

interface BlogPreviewSectionProps {
  posts: CmsBlogPostItem[]
  status: CmsStatus
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

export function BlogPreviewSection({ posts, status }: BlogPreviewSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-modx-surface border-t border-white/10">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeading
            eyebrow="Insights & Strategy"
            title="Thinking on search, creative, and digital growth."
            description="Latest editorial playbooks and digital strategy articles from our team."
          />
          <Button href="/blog" variant="outline" size="md">
            <span>Read All Articles</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {status !== 'ok' || posts.length === 0 ? (
          <CmsEmptyState
            status={status}
            title="No published articles yet"
            description="Publish blog posts in the Payload CMS Admin Dashboard to feature latest insights here."
            actionHref="/contact"
            actionLabel="Talk to Our Strategists"
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {posts.map((post, idx) => (
              <FadeIn key={post.id} delay={idx * 0.06}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-modx-bg p-5 card-surface-hover"
                >
                  <CmsMedia
                    media={post.featuredImage}
                    altFallback={post.title}
                    aspectRatio="16 / 9"
                    sizeVariant="card"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="mb-5"
                  />
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-modx-muted">
                        <span className="font-medium text-modx-accent-light">
                          {post.category?.name || 'Insights'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-modx-accent-light transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-modx-muted leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                    <p className="text-xs text-modx-muted pt-3 border-t border-white/[0.06]">
                      {formatDate(post.publishedDate)} · {post.authorName}
                    </p>
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
