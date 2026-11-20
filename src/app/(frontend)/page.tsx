import type { Metadata } from 'next'
import React from 'react'

import { AboutPreviewSection } from '@/components/sections/AboutPreviewSection'
import { BlogPreviewSection } from '@/components/sections/BlogPreviewSection'
import { CtaBannerSection } from '@/components/sections/CtaBannerSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { PortfolioShowcaseSection } from '@/components/sections/PortfolioShowcaseSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { ResultsSection } from '@/components/sections/ResultsSection'
import { ServicesGridSection } from '@/components/sections/ServicesGridSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { TrustedBySection } from '@/components/sections/TrustedBySection'
import { WhyChooseUsSection } from '@/components/sections/WhyChooseUsSection'
import { JsonLd } from '@/components/ui/JsonLd'
import {
  getPublishedBlogPosts,
  getPublishedProjects,
  getPublishedServices,
  getPublishedTestimonials,
  getSiteSettings,
} from '@/lib/cms'
import { buildPageMetadata, getSiteBaseUrl, sanitizeExternalUrl } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const settingsRes = await getSiteSettings()
  const settings = settingsRes.data

  return buildPageMetadata({
    title: settings.defaultSeoTitle,
    description: settings.defaultSeoDescription,
    path: '/',
    image: settings.defaultOgImage || settings.heroMedia?.raw || null,
    type: 'website',
  })
}

export default async function HomePage() {
  const [settingsRes, servicesRes, projectsRes, testimonialsRes, blogRes] =
    await Promise.all([
      getSiteSettings(),
      getPublishedServices({ featuredOnly: true, limit: 8 }),
      getPublishedProjects({ featuredOnly: true, limit: 4 }),
      getPublishedTestimonials(6),
      getPublishedBlogPosts({ limit: 3 }),
    ])

  const settings = settingsRes.data
  const baseUrl = getSiteBaseUrl()
  const sameAs = settings.socialLinks
    .map((s) => sanitizeExternalUrl(s.url))
    .filter((u): u is string => Boolean(u))

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: settings.agencyName,
          alternateName: settings.brandMark,
          url: baseUrl,
          description: settings.defaultSeoDescription,
          email: settings.contactEmail,
          areaServed: ['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Australia'],
          ...(sameAs.length > 0 ? { sameAs } : {}),
        }}
      />
      <HeroSection settings={settings} />
      <TrustedBySection settings={settings} />
      <AboutPreviewSection settings={settings} />
      <ServicesGridSection services={servicesRes.data} status={servicesRes.status} />
      <WhyChooseUsSection />
      <PortfolioShowcaseSection
        projects={projectsRes.data.items}
        status={projectsRes.status}
      />
      <ProcessSection />
      <ResultsSection settings={settings} />
      <TestimonialsSection
        testimonials={testimonialsRes.data}
        status={testimonialsRes.status}
      />
      <BlogPreviewSection posts={blogRes.data.items} status={blogRes.status} />
      <CtaBannerSection settings={settings} />
    </>
  )
}
