import type { MetadataRoute } from 'next'

import { getAllPublishedSlugs } from '@/lib/cms'
import { resolveCanonicalUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: resolveCanonicalUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: resolveCanonicalUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: resolveCanonicalUrl('/services'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: resolveCanonicalUrl('/portfolio'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: resolveCanonicalUrl('/blog'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: resolveCanonicalUrl('/contact'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  const { services, projects, blogPosts } = await getAllPublishedSlugs()

  const serviceRoutes: MetadataRoute.Sitemap = services.map((item) => ({
    url: resolveCanonicalUrl(`/services/${item.slug}`),
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((item) => ({
    url: resolveCanonicalUrl(`/portfolio/${item.slug}`),
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((item) => ({
    url: resolveCanonicalUrl(`/blog/${item.slug}`),
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes]
}
