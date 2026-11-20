import type { Metadata } from 'next'
import React from 'react'

import { PortfolioFilterGrid } from '@/components/interactive/PortfolioFilterGrid'
import { FadeIn } from '@/components/motion/FadeIn'
import { CtaBannerSection } from '@/components/sections/CtaBannerSection'
import { Container } from '@/components/ui/Container'
import {
  getPublishedCategories,
  getPublishedProjects,
  getSiteSettings,
} from '@/lib/cms'
import { buildPageMetadata } from '@/lib/seo'

type PortfolioPageProps = {
  searchParams: Promise<{ category?: string; page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const settingsRes = await getSiteSettings()
  return buildPageMetadata({
    title: 'Portfolio',
    description:
      'Explore Modexa Digital portfolio case studies across Digital Marketing, SEO, Paid Ads, Web Development, and Branding.',
    path: '/portfolio',
    image: settingsRes.data.defaultOgImage,
    type: 'website',
  })
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const { category, page } = await searchParams
  const categorySlug = category?.trim() || 'all'
  const currentPage = Math.max(1, Number(page) || 1)

  const [categoriesRes, projectsRes, settingsRes] = await Promise.all([
    getPublishedCategories('project'),
    getPublishedProjects({
      categorySlug: categorySlug === 'all' ? undefined : categorySlug,
      page: currentPage,
      limit: 9,
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
              Portfolio &amp; Case Studies
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08]">
              Work engineered for attention and conversion.
            </h1>
            <p className="text-base sm:text-lg text-modx-muted leading-relaxed">
              Filter published client engagements by discipline below to explore strategy, media
              execution, and delivered digital platforms.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-16 sm:py-20 bg-modx-bg">
        <Container>
          <PortfolioFilterGrid
            categories={categoriesRes.data}
            projectsPage={projectsRes.data}
            status={projectsRes.status}
            activeCategorySlug={categorySlug}
          />
        </Container>
      </section>

      <CtaBannerSection settings={settingsRes.data} />
    </>
  )
}
