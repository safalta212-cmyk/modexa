import type { AgencyService } from './types'

export const AGENCY_SERVICES: AgencyService[] = [
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    shortSummary:
      'Full-funnel growth architecture aligning search, paid media, creative strategy, and conversion optimization under one unified roadmap.',
    fullDescription:
      'We build cohesive multi-channel marketing ecosystems where organic discovery, paid acquisition, and conversion engineering reinforce one another. Every campaign is structured around qualified pipeline and revenue accountability rather than isolated vanity impressions.',
    deliverables: [
      'Quarterly full-funnel growth roadmap',
      'Cross-channel attribution & GA4 reporting',
      'Customer journey & funnel bottleneck audits',
      'Weekly sprint execution & creative testing',
    ],
    idealFor: 'Growth-stage brands scaling across multiple acquisition channels.',
    iconName: 'TrendingUp',
  },
  {
    slug: 'seo-optimization',
    title: 'SEO Optimization',
    shortSummary:
      'Technical SEO, entity architecture, and AI answer optimization designed to capture high-intent demand across Google and AI assistants.',
    fullDescription:
      'Modern search spans classic Google SERPs, AI Overviews, and conversational engines like ChatGPT and Perplexity. We fix technical crawling and Core Web Vitals, build topic clusters, and implement structured schema so buyers find and trust your brand first.',
    deliverables: [
      'Technical crawl, indexation & speed remediation',
      'High-intent commercial keyword & entity mapping',
      'Answer Engine Optimization (AEO) & schema markup',
      'Authority link acquisition & internal link architecture',
    ],
    idealFor: 'B2B SaaS, D2C, and enterprise teams seeking compounding organic acquisition.',
    iconName: 'Search',
  },
  {
    slug: 'social-media-marketing',
    title: 'Social Media Marketing',
    shortSummary:
      'Editorial storytelling, short-form video direction, and community ecosystems that build brand affinity and organic momentum.',
    fullDescription:
      'We transform brand channels into distinct cultural touchpoints with platform-native content systems across LinkedIn, Instagram, and YouTube. Strategy pairs creative direction with audience retention analytics to convert attention into loyal advocates.',
    deliverables: [
      'Channel positioning & editorial content pillars',
      'Short-form video & motion creative direction',
      'Executive founder positioning on LinkedIn',
      'Monthly engagement & audience velocity reporting',
    ],
    idealFor: 'Modern consumer brands and B2B founders building category authority.',
    iconName: 'Share2',
  },
  {
    slug: 'google-ads',
    title: 'Google Ads',
    shortSummary:
      'High-intent Search, Performance Max, and Shopping campaigns engineered around return on ad spend and customer acquisition cost.',
    fullDescription:
      'We eliminate wasted ad spend with granular search term governance, clean conversion tracking, and dedicated landing pages matched to buyer intent. Campaigns are continuously refined around qualified lead value and contribution margin.',
    deliverables: [
      'Account restructure & negative keyword governance',
      'Search, Shopping & Performance Max optimization',
      'Server-side & enhanced conversion tracking',
      'Dedicated high-converting PPC landing pages',
    ],
    idealFor: 'Businesses capturing active search demand with measurable CAC targets.',
    iconName: 'MousePointerClick',
  },
  {
    slug: 'meta-ads',
    title: 'Meta Ads',
    shortSummary:
      'Creative-first paid social acquisition across Instagram and Facebook driven by rapid hook testing and full-funnel retargeting.',
    fullDescription:
      'On Meta, creative is the primary targeting lever. We combine data-backed audience structures with high-velocity creative iteration—testing static concepts, UGC angles, and motion ads to scale profitable acquisition without creative fatigue.',
    deliverables: [
      'Weekly creative testing matrix & ad production briefs',
      'Advantage+ & prospecting campaign architecture',
      'Dynamic product catalog & retargeting sequences',
      'ROAS, MER & cohort payback tracking',
    ],
    idealFor: 'D2C ecommerce and high-velocity consumer services scaling paid social.',
    iconName: 'Layers',
  },
  {
    slug: 'website-development',
    title: 'Website Development',
    shortSummary:
      'High-performance Next.js web applications and marketing platforms engineered for speed, accessibility, and conversion.',
    fullDescription:
      'Your website is the core conversion engine for every marketing dollar spent. We design and engineer modular, headless Next.js and CMS-backed digital flagships featuring fluid motion, sub-second page loads, and flexible editorial workflows.',
    deliverables: [
      'Next.js App Router & TypeScript architecture',
      'Headless CMS integration & modular page blocks',
      'Core Web Vitals & technical SEO foundations',
      'Interactive conversion flows & form integrations',
    ],
    idealFor: 'Brands outgrowing rigid templates and slow legacy storefronts.',
    iconName: 'Code2',
  },
  {
    slug: 'branding-creative-design',
    title: 'Branding & Creative Design',
    shortSummary:
      'Distinctive visual identities, design systems, and campaign art direction crafted to command category authority.',
    fullDescription:
      'We craft unmistakable brand worlds—from typography, color systems, and logo geometry to interactive UI design languages and campaign art direction—giving ambitious companies a cohesive visual edge across every touchpoint.',
    deliverables: [
      'Brand strategy, positioning & visual identity',
      'Comprehensive UI & marketing design systems',
      'Campaign key visuals & 3D/motion direction',
      'Brand guidelines & reusable component kits',
    ],
    idealFor: 'New ventures launching boldly or established brands repositioning.',
    iconName: 'Palette',
  },
  {
    slug: 'content-marketing',
    title: 'Content Marketing',
    shortSummary:
      'Research-backed editorial hubs, buyer guides, and conversion copywriting that educate decision-makers and earn citations.',
    fullDescription:
      'Generic content gets ignored. We produce authoritative long-form guides, product comparison pages, original industry studies, and sharp conversion copywritten by domain specialists to drive organic rankings and sales enablement.',
    deliverables: [
      'Editorial calendar mapped to buyer funnel stages',
      'Original research studies & authority whitepapers',
      'High-converting website & landing page copy',
      'Content refresh workflows for decaying assets',
    ],
    idealFor: 'Complex B2B, fintech, SaaS, and considered-purchase brands.',
    iconName: 'FileText',
  },
]
