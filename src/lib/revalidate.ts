import { revalidatePath, revalidateTag } from 'next/cache'

export const CMS_TAGS = {
  siteSettings: 'site-settings',
  services: 'services',
  projects: 'projects',
  blogPosts: 'blog-posts',
  categories: 'categories',
  testimonials: 'testimonials',
  media: 'media',
} as const

export function serviceSlugTag(slug: string): string {
  return `service:${slug}`
}

export function projectSlugTag(slug: string): string {
  return `project:${slug}`
}

export function blogPostSlugTag(slug: string): string {
  return `blog-post:${slug}`
}

function safeRevalidateTag(tag: string): void {
  try {
    revalidateTag(tag)
  } catch {
    // Ignore when executed outside a Next.js runtime context (e.g., CLI scripts)
  }
}

function safeRevalidatePath(path: string, type?: 'page' | 'layout'): void {
  try {
    revalidatePath(path, type)
  } catch {
    // Ignore when executed outside a Next.js runtime context (e.g., CLI scripts)
  }
}

export function revalidateSiteSettings(): void {
  safeRevalidateTag(CMS_TAGS.siteSettings)
  safeRevalidatePath('/', 'layout')
  safeRevalidatePath('/about')
  safeRevalidatePath('/contact')
  safeRevalidatePath('/sitemap.xml')
}

export function revalidateServices(slug?: string | null): void {
  safeRevalidateTag(CMS_TAGS.services)
  if (slug) {
    safeRevalidateTag(serviceSlugTag(slug))
    safeRevalidatePath(`/services/${slug}`)
  }
  safeRevalidatePath('/')
  safeRevalidatePath('/services')
  safeRevalidatePath('/services/[slug]', 'page')
  safeRevalidatePath('/contact')
  safeRevalidatePath('/', 'layout')
  safeRevalidatePath('/sitemap.xml')
}

export function revalidateProjects(slug?: string | null): void {
  safeRevalidateTag(CMS_TAGS.projects)
  if (slug) {
    safeRevalidateTag(projectSlugTag(slug))
    safeRevalidatePath(`/portfolio/${slug}`)
  }
  safeRevalidatePath('/')
  safeRevalidatePath('/portfolio')
  safeRevalidatePath('/portfolio/[slug]', 'page')
  safeRevalidatePath('/sitemap.xml')
}

export function revalidateBlogPosts(slug?: string | null): void {
  safeRevalidateTag(CMS_TAGS.blogPosts)
  if (slug) {
    safeRevalidateTag(blogPostSlugTag(slug))
    safeRevalidatePath(`/blog/${slug}`)
  }
  safeRevalidatePath('/')
  safeRevalidatePath('/blog')
  safeRevalidatePath('/blog/[slug]', 'page')
  safeRevalidatePath('/sitemap.xml')
}

export function revalidateCategories(): void {
  safeRevalidateTag(CMS_TAGS.categories)
  safeRevalidateTag(CMS_TAGS.projects)
  safeRevalidateTag(CMS_TAGS.blogPosts)
  safeRevalidatePath('/')
  safeRevalidatePath('/portfolio')
  safeRevalidatePath('/blog')
}

export function revalidateTestimonials(): void {
  safeRevalidateTag(CMS_TAGS.testimonials)
  safeRevalidatePath('/')
}

export function revalidateMedia(): void {
  safeRevalidateTag(CMS_TAGS.media)
  safeRevalidateTag(CMS_TAGS.siteSettings)
  safeRevalidateTag(CMS_TAGS.services)
  safeRevalidateTag(CMS_TAGS.projects)
  safeRevalidateTag(CMS_TAGS.blogPosts)
  safeRevalidateTag(CMS_TAGS.testimonials)
  safeRevalidatePath('/', 'layout')
}
