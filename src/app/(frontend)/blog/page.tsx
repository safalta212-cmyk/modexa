import type { Metadata } from 'next'
import React from 'react'

import { BlogFilterGrid } from '@/components/interactive/BlogFilterGrid'
import { FadeIn } from '@/components/motion/FadeIn'
import { CtaBannerSection } from '@/components/sections/CtaBannerSection'
import { Container } from '@/components/ui/Container'
import {
  getPublishedBlogPosts,
  getPublishedCategories,
  getSiteSettings,
} from '@/lib/cms'
import { buildPageMetadata } from '@/lib/seo'

type BlogPageProps = {
  searchParams: Promise<{ category?: string; page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const settingsRes = await getSiteSettings()
  return buildPageMetadata({
    title: 'Blog',
    description:
      'Insights, playbooks, and editorial guides on SEO, AI search visibility, paid media, and web architecture from Modexa Digital.',
    path: '/blog',
    image: settingsRes.data.defaultOgImage,
    type: 'website',
  })
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, page } = await searchParams
  const categorySlug = category?.trim() || 'all'
  const currentPage = Math.max(1, Math.floor(Number(page)) || 1)

  const [categoriesRes, blogRes, settingsRes] = await Promise.all([
    getPublishedCategories('blog'),
    getPublishedBlogPosts({
      categorySlug: categorySlug === 'all' ? undefined : categorySlug,
      page: currentPage,
      limit: 6,
    }),
    getSiteSettings(),
  ])

  return (
    <>
      <section className="relative overflow-hidden bg-modx-bg pt-16 pb-14 sm:pt-24 sm:pb-16 border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[760px] -translate-x-1/2 purple-glow"
        />
        <Container className="relative">
          <FadeIn immediate className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-modx-accent-light">
              Journal &amp; Insights
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08]">
              Playbooks built from real digital growth strategy.
            </h1>
            <p className="text-base sm:text-lg text-modx-muted leading-relaxed">
              Browse published insights by topic across search strategy, performance media, and web
              engineering.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-16 sm:py-20 bg-modx-bg">
        <Container>
          <BlogFilterGrid
            categories={categoriesRes.data}
            postsPage={blogRes.data}
            status={blogRes.status}
            activeCategorySlug={categorySlug}
          />
        </Container>
      </section>

      <CtaBannerSection settings={settingsRes.data} />
    </>
  )
}
