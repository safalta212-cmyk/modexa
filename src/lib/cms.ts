import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { unstable_cache } from 'next/cache'

import {
  getCmsEnvironmentStatus,
  getPayloadClient,
  sanitizeMongoErrorMessage,
} from '@/lib/payload'
import {
  blogPostSlugTag,
  CMS_TAGS,
  projectSlugTag,
  serviceSlugTag,
} from '@/lib/revalidate'
import { isVideoMedia, resolveMediaObject, resolveMediaUrl } from '@/lib/seo'
import type {
  BlogPost,
  Category,
  Media,
  Project,
  Service,
  SiteSetting,
  Testimonial,
} from '@/payload-types'

export type CmsStatus = 'ok' | 'unconfigured' | 'error'

export interface CmsResult<T> {
  status: CmsStatus
  data: T
  errorMessage?: string
}

export interface CmsMediaAsset {
  id: string
  url: string
  cardUrl: string
  heroUrl: string
  thumbnailUrl: string
  alt: string
  caption?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
  isVideo: boolean
  raw: Media
}

export interface CmsServiceItem {
  id: string
  title: string
  slug: string
  shortDescription: string
  fullDescription: Service['fullDescription']
  fullDescriptionPlaintext: string
  featuredImage: CmsMediaAsset | null
  icon: Service['icon']
  benefits: Array<{ title: string; description?: string | null }>
  features: Array<{ label: string }>
  seoTitle?: string | null
  seoDescription?: string | null
  displayOrder: number
  featured: boolean
  updatedAt: string
}

export interface CmsCategoryItem {
  id: string
  name: string
  slug: string
  description?: string | null
  categoryType: Category['categoryType']
}

export interface CmsProjectItem {
  id: string
  projectName: string
  slug: string
  clientName: string
  category: CmsCategoryItem | null
  description: string
  featuredImage: CmsMediaAsset | null
  gallery: Array<{ image: CmsMediaAsset; caption?: string | null }>
  projectVideo: CmsMediaAsset | null
  technologiesUsed: string[]
  projectUrl?: string | null
  completionDate?: string | null
  featured: boolean
  updatedAt: string
}

export interface CmsTestimonialItem {
  id: string
  clientName: string
  clientDesignation: string
  company: string
  clientPhoto: CmsMediaAsset | null
  review: string
  rating: number
  displayOrder: number
}

export interface CmsBlogPostItem {
  id: string
  title: string
  slug: string
  featuredImage: CmsMediaAsset | null
  excerpt: string
  content: BlogPost['content']
  readTime: string
  authorName: string
  category: CmsCategoryItem | null
  tags: string[]
  seoTitle?: string | null
  seoDescription?: string | null
  publishedDate?: string | null
  updatedAt: string
}

export interface PaginatedCmsList<T> {
  items: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

export interface SiteSettingsViewModel {
  fromCms: boolean
  agencyName: string
  brandMark: string
  tagline: string
  contactEmail: string
  contactPhone: string
  studioLocation: string
  workingHours: string
  marketsServed: string
  socialLinks: Array<{ label: string; url: string }>
  trustedBrandsHeading: string
  trustedBrandsSubheading: string
  trustedBrands: Array<{ name: string; sector?: string | null }>
  heroEyebrow: string
  heroHeadlinePrefix: string
  heroHeadlineHighlight: string
  heroDescription: string
  heroPrimaryCtaLabel: string
  heroPrimaryCtaHref: string
  heroSecondaryCtaLabel: string
  heroSecondaryCtaHref: string
  heroMedia: CmsMediaAsset | null
  introEyebrow: string
  introHeadline: string
  introDescription: string
  introMedia: CmsMediaAsset | null
  introHighlights: Array<{ title: string; description: string }>
  introCtaLabel: string
  introCtaHref: string
  aboutEyebrow: string
  aboutHeadline: string
  aboutSummary: string
  aboutMedia: CmsMediaAsset | null
  missionEyebrow: string
  missionHeadline: string
  missionDescription: string
  visionEyebrow: string
  visionHeadline: string
  visionDescription: string
  coreValues: Array<{ title: string; description: string }>
  leadershipTitle: string
  leadershipDescription: string
  teamMembers: Array<{
    id: string
    name: string
    role: string
    bio: string
    expertise?: string | null
    photo: CmsMediaAsset | null
  }>
  ctaEyebrow: string
  ctaHeadline: string
  ctaDescription: string
  ctaPrimaryLabel: string
  ctaPrimaryHref: string
  ctaSecondaryLabel: string
  ctaSecondaryHref: string
  resultsMetrics: Array<{ value: string; label: string; context?: string | null }>
  defaultSeoTitle: string
  defaultSeoDescription: string
  defaultOgImage: Media | null
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsViewModel = {
  fromCms: false,
  agencyName: 'Modexa Digital Agency',
  brandMark: 'MODX 2.0',
  tagline:
    'Modexa Digital Agency builds category-defining brand systems, high-speed web platforms, and full-funnel acquisition engines for ambitious businesses worldwide.',
  contactEmail: 'hello@modexadigital.com',
  contactPhone: '+91 (Studio Concierge)',
  studioLocation: 'India · International Remote Operations',
  workingHours: 'Monday – Friday · 10:00 AM to 7:00 PM IST',
  marketsServed: 'India · USA · UK · UAE · Australia',
  socialLinks: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com' },
    { label: 'Instagram', url: 'https://www.instagram.com' },
    { label: 'X / Twitter', url: 'https://x.com' },
    { label: 'YouTube', url: 'https://www.youtube.com' },
  ],
  trustedBrandsHeading: 'Trusted By Forward-Thinking Teams',
  trustedBrandsSubheading: 'Partnering with high-growth brands across SaaS, D2C, and Fintech',
  trustedBrands: [],
  heroEyebrow: 'Modexa Digital Agency · MODX 2.0',
  heroHeadlinePrefix: 'We Build Brands That',
  heroHeadlineHighlight: 'Move The World.',
  heroDescription:
    'We partner with ambitious companies to combine creative brand direction, full-funnel digital marketing, and high-speed web engineering—turning market attention into compounding business growth.',
  heroPrimaryCtaLabel: 'Start a Project',
  heroPrimaryCtaHref: '/contact',
  heroSecondaryCtaLabel: 'Explore Our Work',
  heroSecondaryCtaHref: '/portfolio',
  heroMedia: null,
  introEyebrow: 'About Modexa Digital',
  introHeadline: 'A multidisciplinary growth studio engineered for the modern buyer journey.',
  introDescription:
    'Most agencies split creative branding, paid media, SEO, and web engineering into disconnected silos. Modexa Digital brings senior strategists, creative directors, performance marketers, and Next.js engineers into one unified pod.',
  introMedia: null,
  introHighlights: [
    {
      title: 'One Unified Team',
      description: 'Creative, acquisition, and web execution aligned in weekly sprints.',
    },
    {
      title: 'Global Reach',
      description: 'Built for ambitious startups, D2C brands, and B2B teams across time zones.',
    },
  ],
  introCtaLabel: 'Discover Our Story',
  introCtaHref: '/about',
  aboutEyebrow: 'About Modexa Digital',
  aboutHeadline: 'Creative ambition backed by growth discipline.',
  aboutSummary:
    'Modexa Digital Agency (MODX 2.0) was built to bridge the gap between high-craft brand experiences and measurable revenue acquisition. We partner with founders and marketing leaders across India, the USA, the UK, the UAE, and Australia.',
  aboutMedia: null,
  missionEyebrow: 'Our Mission',
  missionHeadline: 'Turn brand clarity into compounding demand.',
  missionDescription:
    'To help ambitious organizations build distinctive brands, lightning-fast digital flagships, and transparent acquisition systems across search, AI discovery, and paid social—without agency bloat or vanity reporting.',
  visionEyebrow: 'Our Vision',
  visionHeadline: 'Set the global benchmark for modern growth studios.',
  visionDescription:
    'To become the trusted long-term growth partner for category leaders worldwide—where strategy, creative direction, AI search readiness, and full-stack web engineering operate as one seamless team.',
  coreValues: [
    {
      title: 'Clarity Over Complexity',
      description:
        'We strip away agency jargon and focus on the few high-leverage strategies that actually move revenue.',
    },
    {
      title: 'Craft & Rigor Together',
      description:
        'World-class creative direction and disciplined analytical measurement belong in the same room.',
    },
    {
      title: 'Radical Ownership',
      description:
        'We operate as an embedded growth partner, treating client budgets and brand equity as our own.',
    },
    {
      title: 'Continuous Evolution',
      description:
        'Search algorithms, ad platforms, and AI discovery evolve weekly—our systems are built to adapt first.',
    },
  ],
  leadershipTitle: 'Senior specialists leading your account.',
  leadershipDescription:
    'Multidisciplinary directors across growth strategy, paid acquisition, brand craft, and web engineering.',
  teamMembers: [],
  ctaEyebrow: "Let's Build Together",
  ctaHeadline: 'Ready to Grow Your Business?',
  ctaDescription:
    'Tell us about your goals across branding, web development, SEO, or paid media—and we will craft a clear action plan tailored to your growth stage.',
  ctaPrimaryLabel: 'Start a Project',
  ctaPrimaryHref: '/contact',
  ctaSecondaryLabel: 'Explore Services',
  ctaSecondaryHref: '/services',
  resultsMetrics: [],
  defaultSeoTitle: 'Modexa Digital (MODX 2.0) — Digital Marketing & Creative Growth Agency',
  defaultSeoDescription:
    'MODX 2.0 — Modexa Digital Agency builds brands that move the world through strategy, creative design, web engineering, and measurable growth.',
  defaultOgImage: null,
}

function mapMediaAsset(
  input: string | Media | null | undefined,
  fallbackAlt = 'Modexa Digital visual asset'
): CmsMediaAsset | null {
  const media = resolveMediaObject(input)
  if (!media) return null

  const originalUrl = resolveMediaUrl(media, 'original')
  if (!originalUrl) return null

  const isVideo = isVideoMedia(media)

  return {
    id: String(media.id),
    url: originalUrl,
    cardUrl: resolveMediaUrl(media, 'card') || originalUrl,
    heroUrl: resolveMediaUrl(media, 'hero') || originalUrl,
    thumbnailUrl: resolveMediaUrl(media, 'thumbnail') || originalUrl,
    alt: media.alt?.trim() || fallbackAlt,
    caption: media.caption ?? null,
    mimeType: media.mimeType ?? null,
    width: media.width ?? null,
    height: media.height ?? null,
    focalX: media.focalX ?? null,
    focalY: media.focalY ?? null,
    isVideo,
    raw: media,
  }
}

function mapCategory(input: string | Category | null | undefined): CmsCategoryItem | null {
  if (!input || typeof input === 'string') return null
  if (input.status !== 'published') return null
  return {
    id: String(input.id),
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    categoryType: input.categoryType,
  }
}

function extractPlaintext(lexicalData: unknown): string {
  if (!lexicalData || typeof lexicalData !== 'object') return ''
  try {
    return convertLexicalToPlaintext({
      data: lexicalData as Parameters<typeof convertLexicalToPlaintext>[0]['data'],
    }).trim()
  } catch {
    return ''
  }
}

function computeReadTime(lexicalData: unknown): string {
  const text = extractPlaintext(lexicalData)
  if (!text) return '3 min read'
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 210))
  return `${minutes} min read`
}

function mapService(doc: Service): CmsServiceItem {
  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    shortDescription: doc.shortDescription,
    fullDescription: doc.fullDescription,
    fullDescriptionPlaintext: extractPlaintext(doc.fullDescription),
    featuredImage: mapMediaAsset(doc.featuredImage, doc.title),
    icon: doc.icon,
    benefits: (doc.benefits ?? []).map((b) => ({
      title: b.title,
      description: b.description ?? null,
    })),
    features: (doc.features ?? []).map((f) => ({ label: f.label })),
    seoTitle: doc.seoTitle ?? null,
    seoDescription: doc.seoDescription ?? null,
    displayOrder: doc.displayOrder ?? 0,
    featured: Boolean(doc.featured),
    updatedAt: doc.updatedAt,
  }
}

function mapProject(doc: Project): CmsProjectItem {
  const gallery = (doc.gallery ?? [])
    .map((item) => {
      const image = mapMediaAsset(item.image, item.caption || doc.projectName)
      if (!image) return null
      return {
        image,
        caption: item.caption ?? null,
      }
    })
    .filter((entry): entry is { image: CmsMediaAsset; caption: string | null } => Boolean(entry))

  return {
    id: String(doc.id),
    projectName: doc.projectName,
    slug: doc.slug,
    clientName: doc.clientName,
    category: mapCategory(doc.category),
    description: doc.description,
    featuredImage: mapMediaAsset(doc.featuredImage, doc.projectName),
    gallery,
    projectVideo: mapMediaAsset(doc.projectVideo, `${doc.projectName} video`),
    technologiesUsed: (doc.technologiesUsed ?? [])
      .map((t) => t.name?.trim())
      .filter((name): name is string => Boolean(name)),
    projectUrl: doc.projectUrl ?? null,
    completionDate: doc.completionDate ?? null,
    featured: Boolean(doc.featured),
    updatedAt: doc.updatedAt,
  }
}

function mapTestimonial(doc: Testimonial): CmsTestimonialItem {
  return {
    id: String(doc.id),
    clientName: doc.clientName,
    clientDesignation: doc.clientDesignation,
    company: doc.company,
    clientPhoto: mapMediaAsset(doc.clientPhoto, doc.clientName),
    review: doc.review,
    rating: Math.min(5, Math.max(1, Math.round(doc.rating ?? 5))),
    displayOrder: doc.displayOrder ?? 0,
  }
}

function mapBlogPost(doc: BlogPost, authorNames: Map<string, string>): CmsBlogPostItem {
  let authorName = 'Modexa Editorial Team'
  if (typeof doc.author === 'string') {
    authorName = authorNames.get(doc.author) || authorName
  } else if (doc.author && typeof doc.author === 'object' && doc.author.name) {
    authorName = doc.author.name
  }

  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    featuredImage: mapMediaAsset(doc.featuredImage, doc.title),
    excerpt: doc.excerpt,
    content: doc.content,
    readTime: computeReadTime(doc.content),
    authorName,
    category: mapCategory(doc.category),
    tags: (doc.tags ?? [])
      .map((t) => t.tag?.trim())
      .filter((tag): tag is string => Boolean(tag)),
    seoTitle: doc.seoTitle ?? null,
    seoDescription: doc.seoDescription ?? null,
    publishedDate: doc.publishedDate ?? doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

function mapSiteSettings(doc: Partial<SiteSetting> | null | undefined): SiteSettingsViewModel {
  if (!doc || typeof doc !== 'object') {
    return DEFAULT_SITE_SETTINGS
  }

  const pick = (val: string | null | undefined, fallback: string) =>
    val && val.trim().length > 0 ? val.trim() : fallback

  return {
    fromCms: Boolean(doc.id || doc.updatedAt),
    agencyName: pick(doc.agencyName, DEFAULT_SITE_SETTINGS.agencyName),
    brandMark: pick(doc.brandMark, DEFAULT_SITE_SETTINGS.brandMark),
    tagline: pick(doc.tagline, DEFAULT_SITE_SETTINGS.tagline),
    contactEmail: pick(doc.contactEmail, DEFAULT_SITE_SETTINGS.contactEmail),
    contactPhone: pick(doc.contactPhone, DEFAULT_SITE_SETTINGS.contactPhone),
    studioLocation: pick(doc.studioLocation, DEFAULT_SITE_SETTINGS.studioLocation),
    workingHours: pick(doc.workingHours, DEFAULT_SITE_SETTINGS.workingHours),
    marketsServed: pick(doc.marketsServed, DEFAULT_SITE_SETTINGS.marketsServed),
    socialLinks:
      doc.socialLinks && doc.socialLinks.length > 0
        ? doc.socialLinks.map((item) => ({ label: item.label, url: item.url }))
        : DEFAULT_SITE_SETTINGS.socialLinks,
    trustedBrandsHeading: pick(
      doc.trustedBrandsHeading,
      DEFAULT_SITE_SETTINGS.trustedBrandsHeading
    ),
    trustedBrandsSubheading: pick(
      doc.trustedBrandsSubheading,
      DEFAULT_SITE_SETTINGS.trustedBrandsSubheading
    ),
    trustedBrands: (doc.trustedBrands ?? []).map((b) => ({
      name: b.name,
      sector: b.sector ?? null,
    })),
    heroEyebrow: pick(doc.heroEyebrow, DEFAULT_SITE_SETTINGS.heroEyebrow),
    heroHeadlinePrefix: pick(doc.heroHeadlinePrefix, DEFAULT_SITE_SETTINGS.heroHeadlinePrefix),
    heroHeadlineHighlight: pick(
      doc.heroHeadlineHighlight,
      DEFAULT_SITE_SETTINGS.heroHeadlineHighlight
    ),
    heroDescription: pick(doc.heroDescription, DEFAULT_SITE_SETTINGS.heroDescription),
    heroPrimaryCtaLabel: pick(doc.heroPrimaryCtaLabel, DEFAULT_SITE_SETTINGS.heroPrimaryCtaLabel),
    heroPrimaryCtaHref: pick(doc.heroPrimaryCtaHref, DEFAULT_SITE_SETTINGS.heroPrimaryCtaHref),
    heroSecondaryCtaLabel: pick(
      doc.heroSecondaryCtaLabel,
      DEFAULT_SITE_SETTINGS.heroSecondaryCtaLabel
    ),
    heroSecondaryCtaHref: pick(
      doc.heroSecondaryCtaHref,
      DEFAULT_SITE_SETTINGS.heroSecondaryCtaHref
    ),
    heroMedia: mapMediaAsset(doc.heroMedia, 'Modexa Digital hero visual'),
    introEyebrow: pick(doc.introEyebrow, DEFAULT_SITE_SETTINGS.introEyebrow),
    introHeadline: pick(doc.introHeadline, DEFAULT_SITE_SETTINGS.introHeadline),
    introDescription: pick(doc.introDescription, DEFAULT_SITE_SETTINGS.introDescription),
    introMedia: mapMediaAsset(doc.introMedia, 'Modexa Digital studio'),
    introHighlights:
      doc.introHighlights && doc.introHighlights.length > 0
        ? doc.introHighlights.map((item) => ({
            title: item.title,
            description: item.description,
          }))
        : DEFAULT_SITE_SETTINGS.introHighlights,
    introCtaLabel: pick(doc.introCtaLabel, DEFAULT_SITE_SETTINGS.introCtaLabel),
    introCtaHref: pick(doc.introCtaHref, DEFAULT_SITE_SETTINGS.introCtaHref),
    aboutEyebrow: pick(doc.aboutEyebrow, DEFAULT_SITE_SETTINGS.aboutEyebrow),
    aboutHeadline: pick(doc.aboutHeadline, DEFAULT_SITE_SETTINGS.aboutHeadline),
    aboutSummary: pick(doc.aboutSummary, DEFAULT_SITE_SETTINGS.aboutSummary),
    aboutMedia: mapMediaAsset(doc.aboutMedia, 'Modexa Digital Agency studio'),
    missionEyebrow: pick(doc.missionEyebrow, DEFAULT_SITE_SETTINGS.missionEyebrow),
    missionHeadline: pick(doc.missionHeadline, DEFAULT_SITE_SETTINGS.missionHeadline),
    missionDescription: pick(doc.missionDescription, DEFAULT_SITE_SETTINGS.missionDescription),
    visionEyebrow: pick(doc.visionEyebrow, DEFAULT_SITE_SETTINGS.visionEyebrow),
    visionHeadline: pick(doc.visionHeadline, DEFAULT_SITE_SETTINGS.visionHeadline),
    visionDescription: pick(doc.visionDescription, DEFAULT_SITE_SETTINGS.visionDescription),
    coreValues:
      doc.coreValues && doc.coreValues.length > 0
        ? doc.coreValues.map((v) => ({ title: v.title, description: v.description }))
        : DEFAULT_SITE_SETTINGS.coreValues,
    leadershipTitle: pick(doc.leadershipTitle, DEFAULT_SITE_SETTINGS.leadershipTitle),
    leadershipDescription: pick(
      doc.leadershipDescription,
      DEFAULT_SITE_SETTINGS.leadershipDescription
    ),
    teamMembers: (doc.teamMembers ?? []).map((member, index) => ({
      id: member.id || `team-${index}`,
      name: member.name,
      role: member.role,
      bio: member.bio,
      expertise: member.expertise ?? null,
      photo: mapMediaAsset(member.photo, member.name),
    })),
    ctaEyebrow: pick(doc.ctaEyebrow, DEFAULT_SITE_SETTINGS.ctaEyebrow),
    ctaHeadline: pick(doc.ctaHeadline, DEFAULT_SITE_SETTINGS.ctaHeadline),
    ctaDescription: pick(doc.ctaDescription, DEFAULT_SITE_SETTINGS.ctaDescription),
    ctaPrimaryLabel: pick(doc.ctaPrimaryLabel, DEFAULT_SITE_SETTINGS.ctaPrimaryLabel),
    ctaPrimaryHref: pick(doc.ctaPrimaryHref, DEFAULT_SITE_SETTINGS.ctaPrimaryHref),
    ctaSecondaryLabel: pick(doc.ctaSecondaryLabel, DEFAULT_SITE_SETTINGS.ctaSecondaryLabel),
    ctaSecondaryHref: pick(doc.ctaSecondaryHref, DEFAULT_SITE_SETTINGS.ctaSecondaryHref),
    resultsMetrics: (doc.resultsMetrics ?? []).map((m) => ({
      value: m.value,
      label: m.label,
      context: m.context ?? null,
    })),
    defaultSeoTitle: pick(doc.defaultSeoTitle, DEFAULT_SITE_SETTINGS.defaultSeoTitle),
    defaultSeoDescription: pick(
      doc.defaultSeoDescription,
      DEFAULT_SITE_SETTINGS.defaultSeoDescription
    ),
    defaultOgImage: resolveMediaObject(doc.defaultOgImage),
  }
}

async function runCmsQuery<T>(
  fallbackData: T,
  cacheKey: string[],
  tags: string[],
  fetcher: () => Promise<T>
): Promise<CmsResult<T>> {
  const env = getCmsEnvironmentStatus()
  if (!env.isReady) {
    return {
      status: 'unconfigured',
      data: fallbackData,
      errorMessage:
        'Payload CMS / MongoDB environment variables (MONGODB_URI and PAYLOAD_SECRET) are not configured.',
    }
  }

  try {
    const cachedFetcher = unstable_cache(fetcher, cacheKey, {
      tags,
      revalidate: 300,
    })
    const data = await cachedFetcher()
    return {
      status: 'ok',
      data,
    }
  } catch (error) {
    const safeMsg = sanitizeMongoErrorMessage(error)
    console.error('[CMS Query Error]:', safeMsg)
    return {
      status: 'error',
      data: fallbackData,
      errorMessage: 'Unable to load content from Payload CMS at the moment.',
    }
  }
}

async function resolvePublicAuthorNames(
  posts: BlogPost[]
): Promise<Map<string, string>> {
  const ids = new Set<string>()
  for (const post of posts) {
    if (typeof post.author === 'string' && post.author.trim()) {
      ids.add(post.author.trim())
    }
  }

  const authorMap = new Map<string, string>()
  if (ids.size === 0) return authorMap

  const payload = await getPayloadClient()
  const usersRes = await payload.find({
    collection: 'users',
    overrideAccess: true,
    depth: 0,
    limit: ids.size,
    where: {
      id: { in: Array.from(ids) },
    },
    select: {
      name: true,
    },
  })

  for (const u of usersRes.docs) {
    if (u.id && u.name) {
      authorMap.set(String(u.id), u.name)
    }
  }

  return authorMap
}

export async function getSiteSettings(): Promise<CmsResult<SiteSettingsViewModel>> {
  return runCmsQuery<SiteSettingsViewModel>(
    DEFAULT_SITE_SETTINGS,
    ['cms-site-settings'],
    [CMS_TAGS.siteSettings, CMS_TAGS.media],
    async () => {
      const payload = await getPayloadClient()
      const globalDoc = await payload.findGlobal({
        slug: 'site-settings',
        depth: 2,
        overrideAccess: false,
      })
      return mapSiteSettings(globalDoc)
    }
  )
}

export async function getPublishedServices(options?: {
  featuredOnly?: boolean
  limit?: number
}): Promise<CmsResult<CmsServiceItem[]>> {
  const featuredOnly = Boolean(options?.featuredOnly)
  const limit = Math.min(Math.max(options?.limit ?? 50, 1), 100)

  return runCmsQuery<CmsServiceItem[]>(
    [],
    ['cms-services', String(featuredOnly), String(limit)],
    [CMS_TAGS.services, CMS_TAGS.media],
    async () => {
      const payload = await getPayloadClient()

      if (featuredOnly) {
        const featuredRes = await payload.find({
          collection: 'services',
          overrideAccess: false,
          depth: 1,
          sort: 'displayOrder',
          limit,
          where: {
            and: [
              { status: { equals: 'published' } },
              { featured: { equals: true } },
            ],
          },
        })

        if (featuredRes.docs.length > 0) {
          return featuredRes.docs.map(mapService)
        }
      }

      const res = await payload.find({
        collection: 'services',
        overrideAccess: false,
        depth: 1,
        sort: 'displayOrder',
        limit,
        where: {
          status: { equals: 'published' },
        },
      })

      return res.docs.map(mapService)
    }
  )
}

export async function getPublishedServiceBySlug(slug: string): Promise<
  CmsResult<{ service: CmsServiceItem | null; relatedServices: CmsServiceItem[] }>
> {
  return runCmsQuery<{ service: CmsServiceItem | null; relatedServices: CmsServiceItem[] }>(
    { service: null, relatedServices: [] },
    ['cms-service-detail', slug],
    [CMS_TAGS.services, serviceSlugTag(slug), CMS_TAGS.media],
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'services',
        overrideAccess: false,
        depth: 1,
        limit: 1,
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: 'published' } },
          ],
        },
      })

      const doc = res.docs[0]
      if (!doc) {
        return { service: null, relatedServices: [] }
      }

      const relatedRes = await payload.find({
        collection: 'services',
        overrideAccess: false,
        depth: 0,
        sort: 'displayOrder',
        limit: 4,
        where: {
          and: [
            { status: { equals: 'published' } },
            { slug: { not_equals: slug } },
          ],
        },
      })

      return {
        service: mapService(doc),
        relatedServices: relatedRes.docs.map(mapService),
      }
    }
  )
}

export async function getPublishedCategories(
  categoryType: 'blog' | 'project'
): Promise<CmsResult<CmsCategoryItem[]>> {
  return runCmsQuery<CmsCategoryItem[]>(
    [],
    ['cms-categories', categoryType],
    [CMS_TAGS.categories],
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'categories',
        overrideAccess: false,
        depth: 0,
        sort: 'name',
        limit: 100,
        where: {
          and: [
            { categoryType: { equals: categoryType } },
            { status: { equals: 'published' } },
          ],
        },
      })

      return res.docs
        .map((cat) => mapCategory(cat))
        .filter((item): item is CmsCategoryItem => Boolean(item))
    }
  )
}

export async function getPublishedProjects(options?: {
  categorySlug?: string | null
  featuredOnly?: boolean
  page?: number
  limit?: number
}): Promise<CmsResult<PaginatedCmsList<CmsProjectItem>>> {
  const categorySlug = options?.categorySlug?.trim() || ''
  const featuredOnly = Boolean(options?.featuredOnly)
  const page = Math.max(1, Number(options?.page) || 1)
  const limit = Math.min(Math.max(options?.limit ?? 9, 1), 50)

  const empty: PaginatedCmsList<CmsProjectItem> = {
    items: [],
    totalDocs: 0,
    totalPages: 1,
    page,
    limit,
    hasPrevPage: false,
    hasNextPage: false,
  }

  return runCmsQuery<PaginatedCmsList<CmsProjectItem>>(
    empty,
    ['cms-projects', categorySlug, String(featuredOnly), String(page), String(limit)],
    [CMS_TAGS.projects, CMS_TAGS.categories, CMS_TAGS.media],
    async () => {
      const payload = await getPayloadClient()
      const conditions: Array<Record<string, unknown>> = [
        { status: { equals: 'published' } },
      ]

      if (categorySlug && categorySlug !== 'all') {
        const catRes = await payload.find({
          collection: 'categories',
          overrideAccess: false,
          depth: 0,
          limit: 1,
          where: {
            and: [
              { slug: { equals: categorySlug } },
              { categoryType: { equals: 'project' } },
              { status: { equals: 'published' } },
            ],
          },
        })

        const categoryDoc = catRes.docs[0]
        if (!categoryDoc) {
          return empty
        }
        conditions.push({ category: { equals: categoryDoc.id } })
      }

      if (featuredOnly) {
        const featuredRes = await payload.find({
          collection: 'projects',
          overrideAccess: false,
          depth: 1,
          sort: '-completionDate',
          page,
          limit,
          where: {
            and: [...conditions, { featured: { equals: true } }],
          } as never,
        })

        if (featuredRes.docs.length > 0) {
          return {
            items: featuredRes.docs.map(mapProject),
            totalDocs: featuredRes.totalDocs,
            totalPages: featuredRes.totalPages || 1,
            page: featuredRes.page || page,
            limit: featuredRes.limit || limit,
            hasPrevPage: featuredRes.hasPrevPage,
            hasNextPage: featuredRes.hasNextPage,
          }
        }
      }

      const res = await payload.find({
        collection: 'projects',
        overrideAccess: false,
        depth: 1,
        sort: '-completionDate',
        page,
        limit,
        where: {
          and: conditions,
        } as never,
      })

      return {
        items: res.docs.map(mapProject),
        totalDocs: res.totalDocs,
        totalPages: res.totalPages || 1,
        page: res.page || page,
        limit: res.limit || limit,
        hasPrevPage: res.hasPrevPage,
        hasNextPage: res.hasNextPage,
      }
    }
  )
}

export async function getPublishedProjectBySlug(slug: string): Promise<
  CmsResult<{ project: CmsProjectItem | null; relatedProjects: CmsProjectItem[] }>
> {
  return runCmsQuery<{ project: CmsProjectItem | null; relatedProjects: CmsProjectItem[] }>(
    { project: null, relatedProjects: [] },
    ['cms-project-detail', slug],
    [CMS_TAGS.projects, projectSlugTag(slug), CMS_TAGS.categories, CMS_TAGS.media],
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'projects',
        overrideAccess: false,
        depth: 2,
        limit: 1,
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: 'published' } },
          ],
        },
      })

      const doc = res.docs[0]
      if (!doc) {
        return { project: null, relatedProjects: [] }
      }

      const relatedRes = await payload.find({
        collection: 'projects',
        overrideAccess: false,
        depth: 1,
        sort: '-completionDate',
        limit: 2,
        where: {
          and: [
            { status: { equals: 'published' } },
            { slug: { not_equals: slug } },
          ],
        },
      })

      return {
        project: mapProject(doc),
        relatedProjects: relatedRes.docs.map(mapProject),
      }
    }
  )
}

export async function getPublishedTestimonials(
  limit = 6
): Promise<CmsResult<CmsTestimonialItem[]>> {
  const safeLimit = Math.min(Math.max(limit, 1), 30)

  return runCmsQuery<CmsTestimonialItem[]>(
    [],
    ['cms-testimonials', String(safeLimit)],
    [CMS_TAGS.testimonials, CMS_TAGS.media],
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'testimonials',
        overrideAccess: false,
        depth: 1,
        sort: 'displayOrder',
        limit: safeLimit,
        where: {
          status: { equals: 'published' },
        },
      })

      return res.docs.map(mapTestimonial)
    }
  )
}

export async function getPublishedBlogPosts(options?: {
  categorySlug?: string | null
  page?: number
  limit?: number
}): Promise<CmsResult<PaginatedCmsList<CmsBlogPostItem>>> {
  const categorySlug = options?.categorySlug?.trim() || ''
  const page = Math.max(1, Number(options?.page) || 1)
  const limit = Math.min(Math.max(options?.limit ?? 6, 1), 50)

  const empty: PaginatedCmsList<CmsBlogPostItem> = {
    items: [],
    totalDocs: 0,
    totalPages: 1,
    page,
    limit,
    hasPrevPage: false,
    hasNextPage: false,
  }

  return runCmsQuery<PaginatedCmsList<CmsBlogPostItem>>(
    empty,
    ['cms-blog-posts', categorySlug, String(page), String(limit)],
    [CMS_TAGS.blogPosts, CMS_TAGS.categories, CMS_TAGS.media],
    async () => {
      const payload = await getPayloadClient()
      const conditions: Array<Record<string, unknown>> = [
        { status: { equals: 'published' } },
      ]

      if (categorySlug && categorySlug !== 'all') {
        const catRes = await payload.find({
          collection: 'categories',
          overrideAccess: false,
          depth: 0,
          limit: 1,
          where: {
            and: [
              { slug: { equals: categorySlug } },
              { categoryType: { equals: 'blog' } },
              { status: { equals: 'published' } },
            ],
          },
        })

        const categoryDoc = catRes.docs[0]
        if (!categoryDoc) {
          return empty
        }
        conditions.push({ category: { equals: categoryDoc.id } })
      }

      const res = await payload.find({
        collection: 'blog-posts',
        overrideAccess: false,
        depth: 1,
        sort: '-publishedDate',
        page,
        limit,
        where: {
          and: conditions,
        } as never,
      })

      const authorNames = await resolvePublicAuthorNames(res.docs)

      return {
        items: res.docs.map((doc) => mapBlogPost(doc, authorNames)),
        totalDocs: res.totalDocs,
        totalPages: res.totalPages || 1,
        page: res.page || page,
        limit: res.limit || limit,
        hasPrevPage: res.hasPrevPage,
        hasNextPage: res.hasNextPage,
      }
    }
  )
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<
  CmsResult<{ post: CmsBlogPostItem | null; relatedPosts: CmsBlogPostItem[] }>
> {
  return runCmsQuery<{ post: CmsBlogPostItem | null; relatedPosts: CmsBlogPostItem[] }>(
    { post: null, relatedPosts: [] },
    ['cms-blog-post-detail', slug],
    [CMS_TAGS.blogPosts, blogPostSlugTag(slug), CMS_TAGS.categories, CMS_TAGS.media],
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'blog-posts',
        overrideAccess: false,
        depth: 2,
        limit: 1,
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: 'published' } },
          ],
        },
      })

      const doc = res.docs[0]
      if (!doc) {
        return { post: null, relatedPosts: [] }
      }

      const categoryId =
        typeof doc.category === 'string' ? doc.category : doc.category?.id

      const sameCategoryRes = categoryId
        ? await payload.find({
            collection: 'blog-posts',
            overrideAccess: false,
            depth: 1,
            sort: '-publishedDate',
            limit: 2,
            where: {
              and: [
                { status: { equals: 'published' } },
                { slug: { not_equals: slug } },
                { category: { equals: categoryId } },
              ],
            },
          })
        : { docs: [] as BlogPost[] }

      let relatedDocs = sameCategoryRes.docs
      if (relatedDocs.length < 2) {
        const excludeSlugs = [slug, ...relatedDocs.map((item) => item.slug)]
        const fallbackRes = await payload.find({
          collection: 'blog-posts',
          overrideAccess: false,
          depth: 1,
          sort: '-publishedDate',
          limit: 2 - relatedDocs.length,
          where: {
            and: [
              { status: { equals: 'published' } },
              { slug: { not_in: excludeSlugs } },
            ],
          },
        })
        relatedDocs = [...relatedDocs, ...fallbackRes.docs]
      }

      const authorNames = await resolvePublicAuthorNames([doc, ...relatedDocs])

      return {
        post: mapBlogPost(doc, authorNames),
        relatedPosts: relatedDocs.map((item) => mapBlogPost(item, authorNames)),
      }
    }
  )
}

export async function getAllPublishedSlugs(): Promise<{
  services: Array<{ slug: string; updatedAt: string }>
  projects: Array<{ slug: string; updatedAt: string }>
  blogPosts: Array<{ slug: string; updatedAt: string }>
}> {
  const empty = { services: [], projects: [], blogPosts: [] }
  const env = getCmsEnvironmentStatus()
  if (!env.isReady) return empty

  try {
    const cached = unstable_cache(
      async () => {
        const payload = await getPayloadClient()
        const [servicesRes, projectsRes, blogRes] = await Promise.all([
          payload.find({
            collection: 'services',
            overrideAccess: false,
            depth: 0,
            limit: 500,
            where: { status: { equals: 'published' } },
            select: { slug: true, updatedAt: true },
          }),
          payload.find({
            collection: 'projects',
            overrideAccess: false,
            depth: 0,
            limit: 500,
            where: { status: { equals: 'published' } },
            select: { slug: true, updatedAt: true },
          }),
          payload.find({
            collection: 'blog-posts',
            overrideAccess: false,
            depth: 0,
            limit: 500,
            where: { status: { equals: 'published' } },
            select: { slug: true, updatedAt: true },
          }),
        ])

        return {
          services: servicesRes.docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt })),
          projects: projectsRes.docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt })),
          blogPosts: blogRes.docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt })),
        }
      },
      ['cms-published-slugs'],
      {
        tags: [CMS_TAGS.services, CMS_TAGS.projects, CMS_TAGS.blogPosts],
        revalidate: 300,
      }
    )

    return await cached()
  } catch (error) {
    console.error('[CMS Slugs Error]:', sanitizeMongoErrorMessage(error))
    return empty
  }
}
