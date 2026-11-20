export type MediaSlotVariant =
  | 'hero-3d'
  | 'saas-platform'
  | 'ecommerce-brand'
  | 'fintech-identity'
  | 'paid-growth'
  | 'web-architecture'
  | 'editorial-studio'
  | 'portrait'

export interface MediaAssetSpec {
  id: string
  alt: string
  replaceableLabel: string
  recommendedAspect: string
  variant: MediaSlotVariant
  suppliedSrc?: string
}

export interface AgencyService {
  slug: string
  title: string
  shortSummary: string
  fullDescription: string
  deliverables: string[]
  idealFor: string
  iconName:
    | 'TrendingUp'
    | 'Search'
    | 'Share2'
    | 'MousePointerClick'
    | 'Layers'
    | 'Code2'
    | 'Palette'
    | 'FileText'
}

export type PortfolioCategory =
  | 'Digital Marketing'
  | 'SEO & Search'
  | 'Paid Ads'
  | 'Web Development'
  | 'Branding'

export interface PortfolioProject {
  slug: string
  title: string
  client: string
  category: PortfolioCategory
  year: string
  summary: string
  challenge: string
  strategy: string
  execution: string[]
  sampleOutcome: string
  isSample: boolean
  media: MediaAssetSpec
}

export type BlogCategory = 'Strategy' | 'SEO & AI Search' | 'Paid Media' | 'Design & Web'

export interface BlogPost {
  slug: string
  title: string
  category: BlogCategory
  publishedDate: string
  readTime: string
  authorName: string
  authorRole: string
  excerpt: string
  content: {
    heading: string
    paragraphs: string[]
  }[]
  media: MediaAssetSpec
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  expertise: string
  isSample: boolean
  media: MediaAssetSpec
}

export interface SampleTestimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  engagementType: string
  isSample: boolean
}

export interface SampleMetric {
  id: string
  value: string
  label: string
  context: string
  isSample: boolean
}
