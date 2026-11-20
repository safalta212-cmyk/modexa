import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { CtaBannerSection } from '@/components/sections/CtaBannerSection'
import { CmsEmptyState } from '@/components/ui/CmsEmptyState'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { CmsRichText } from '@/components/ui/CmsRichText'
import { Container } from '@/components/ui/Container'
import { JsonLd } from '@/components/ui/JsonLd'
import {
  getAllPublishedSlugs,
  getPublishedBlogPostBySlug,
  getSiteSettings,
} from '@/lib/cms'
import { buildPageMetadata, resolveAbsoluteMediaUrl, resolveCanonicalUrl } from '@/lib/seo'

type PageProps = {
  params: Promise<{ slug: string }>
}

function formatPublishedDate(iso?: string | null): string {
  if (!iso) return 'Published'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Published'
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export async function generateStaticParams() {
  const { blogPosts } = await getAllPublishedSlugs()
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const res = await getPublishedBlogPostBySlug(slug)
  const post = res.data.post

  if (!post) {
    return buildPageMetadata({
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
      path: `/blog/${slug}`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: post.seoTitle?.trim() || post.title,
    description: post.seoDescription?.trim() || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImage?.raw || null,
    type: 'article',
    publishedTime: post.publishedDate,
    authors: [post.authorName],
    tags: post.tags,
  })
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params
  const [postRes, settingsRes] = await Promise.all([
    getPublishedBlogPostBySlug(slug),
    getSiteSettings(),
  ])

  if (postRes.status !== 'ok') {
    return (
      <section className="py-20 sm:py-28 bg-modx-bg">
        <Container className="max-w-4xl space-y-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-modx-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to All Articles</span>
          </Link>
          <CmsEmptyState
            status={postRes.status}
            title="Article Unavailable"
            description="Unable to load this blog post from Payload CMS right now."
            actionHref="/blog"
            actionLabel="Return to Blog"
          />
        </Container>
      </section>
    )
  }

  const { post, relatedPosts } = postRes.data
  if (!post) {
    notFound()
  }

  const formattedDate = formatPublishedDate(post.publishedDate)
  const ogImageUrl = resolveAbsoluteMediaUrl(post.featuredImage?.raw, 'hero')

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.seoDescription?.trim() || post.excerpt,
          url: resolveCanonicalUrl(`/blog/${post.slug}`),
          datePublished: post.publishedDate || post.updatedAt,
          dateModified: post.updatedAt,
          author: {
            '@type': 'Person',
            name: post.authorName,
          },
          publisher: {
            '@type': 'Organization',
            name: settingsRes.data.agencyName,
          },
          ...(ogImageUrl ? { image: ogImageUrl } : {}),
        }}
      />

      <article className="bg-modx-bg">
        <header className="relative overflow-hidden pt-12 pb-12 sm:pt-20 sm:pb-16 border-b border-white/10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 h-[400px] w-[760px] -translate-x-1/2 purple-glow"
          />
          <Container className="relative max-w-4xl space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-modx-muted hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to All Articles</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 text-xs text-modx-muted">
              <span className="font-semibold text-modx-accent-light">
                {post.category?.name || 'Insights'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>{formattedDate}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.12]">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-modx-muted leading-relaxed">
              {post.excerpt}
            </p>

            <div className="pt-2 text-sm text-white/90">
              <span className="font-semibold">{post.authorName}</span>
              <span className="text-modx-muted"> · {settingsRes.data.agencyName}</span>
            </div>
          </Container>
        </header>

        <Container className="py-12 sm:py-16 max-w-4xl space-y-12">
          <CmsMedia
            media={post.featuredImage}
            altFallback={post.title}
            aspectRatio="16 / 9"
            sizeVariant="hero"
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
            showCaption={Boolean(post.featuredImage?.caption)}
          />

          <CmsRichText data={post.content} />

          {post.tags.length > 0 ? (
            <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-modx-muted mr-2">
                Topics:
              </span>
              {post.tags.map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="rounded-md border border-white/10 bg-modx-surface px-2.5 py-1 font-mono text-xs text-white/85"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </Container>
      </article>

      {relatedPosts.length > 0 ? (
        <section className="py-16 bg-modx-surface border-t border-white/10">
          <Container className="max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Continue Reading</h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-modx-accent-light hover:underline"
              >
                View all articles
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group rounded-2xl border border-white/10 bg-modx-bg p-5 card-surface-hover space-y-3"
                >
                  <p className="text-xs font-medium text-modx-accent-light">
                    {item.category?.name || 'Insights'} · {item.readTime}
                  </p>
                  <h3 className="text-lg font-bold text-white group-hover:text-modx-accent-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-modx-muted leading-relaxed line-clamp-3">
                    {item.excerpt}
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
