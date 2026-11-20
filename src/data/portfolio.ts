import type { PortfolioCategory, PortfolioProject } from './types'

export const PORTFOLIO_CATEGORIES: Array<'All' | PortfolioCategory> = [
  'All',
  'Digital Marketing',
  'SEO & Search',
  'Paid Ads',
  'Web Development',
  'Branding',
]

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'velora-cloud-demand-engine',
    title: 'Velora Cloud — Full-Funnel Search & Demand Architecture',
    client: 'Velora Cloud (Sample B2B SaaS)',
    category: 'SEO & Search',
    year: '2026',
    summary:
      'Sample case template demonstrating technical SEO restructuring, AI answer visibility, and high-intent comparison hubs for an enterprise cloud platform.',
    challenge:
      'Organic pipeline plateaued after a product rebrand left legacy URLs unmapped and core solution pages missing structured entity schema.',
    strategy:
      'Rebuild information architecture around buyer-stage comparison intent, deploy programmatic schema markup, and align paid search capture on high-value terms.',
    execution: [
      'Technical crawl cleanup and 301 redirect architecture across 180+ pages',
      'Entity-rich product comparison & use-case landing cluster',
      'Answer Engine Optimization (AEO) structured FAQ and citation blocks',
      'GA4 server-side conversion tracking tied to demo pipeline',
    ],
    sampleOutcome: 'Sample benchmark: Illustrative +140% organic demo intent template',
    isSample: true,
    media: {
      id: 'media-velora-saas',
      alt: 'Velora Cloud SaaS growth showcase visual',
      replaceableLabel: 'Replaceable Case Study Cover (16:10 / 4:3)',
      recommendedAspect: '4 / 3',
      variant: 'saas-platform',
    },
  },
  {
    slug: 'kuro-atelier-ecommerce-scale',
    title: 'Kuro Atelier — Paid Social & D2C Storefront Acceleration',
    client: 'Kuro Atelier (Sample D2C Brand)',
    category: 'Paid Ads',
    year: '2026',
    summary:
      'Sample case template pairing creative-led Meta Ads testing with a conversion-optimized product landing flow for luxury consumer goods.',
    challenge:
      'Rising customer acquisition costs on Meta and fragmented product pages caused high drop-off between ad click and checkout.',
    strategy:
      'Launch structured weekly creative sprints paired with fast-loading mobile product storytelling and clear bundle incentives.',
    execution: [
      'Weekly Meta Ads hook & creative angle testing matrix',
      'Google Shopping feed enrichment and Performance Max segmentation',
      'Custom modular product story page optimized for mobile checkout',
      'Retention email/CRM post-purchase sequence design',
    ],
    sampleOutcome: 'Sample benchmark: Illustrative 3.4x blended MER target framework',
    isSample: true,
    media: {
      id: 'media-kuro-commerce',
      alt: 'Kuro Atelier D2C luxury campaign showcase visual',
      replaceableLabel: 'Replaceable Product Photography (4:3)',
      recommendedAspect: '4 / 3',
      variant: 'ecommerce-brand',
    },
  },
  {
    slug: 'aether-pay-brand-system',
    title: 'Aether Pay — Visual Identity & Design System Overhaul',
    client: 'Aether Pay (Sample Fintech)',
    category: 'Branding',
    year: '2026',
    summary:
      'Sample case template establishing an international dark-mode visual identity, typography hierarchy, and interactive component system.',
    challenge:
      'An early-stage fintech brand needed to transition from an informal startup look to enterprise credibility across global markets.',
    strategy:
      'Craft an obsidian and electric-violet visual language anchored by disciplined typographic scale and modular digital brand guidelines.',
    execution: [
      'Brand positioning, tone of voice & typographic hierarchy',
      'Geometric emblem, color token system & dark/light UI kits',
      'Interactive pitch deck, social templates & launch film direction',
      'Developer-ready Figma-to-Tailwind token specification',
    ],
    sampleOutcome: 'Sample benchmark: Complete multi-market brand & UI foundation',
    isSample: true,
    media: {
      id: 'media-aether-brand',
      alt: 'Aether Pay fintech brand identity showcase visual',
      replaceableLabel: 'Replaceable Brand Identity Visual (4:3)',
      recommendedAspect: '4 / 3',
      variant: 'fintech-identity',
    },
  },
  {
    slug: 'nordic-grid-nextjs-flagship',
    title: 'Nordic Grid — Headless Next.js Flagship & Conversion Hub',
    client: 'Nordic Grid (Sample CleanTech)',
    category: 'Web Development',
    year: '2026',
    summary:
      'Sample case template for a high-speed Next.js App Router marketing flagship integrated with a headless CMS editorial workflow.',
    challenge:
      'Legacy monolithic templates slowed page load times and prevented marketing teams from launching regional campaign pages quickly.',
    strategy:
      'Engineer a modular Next.js + TypeScript frontend with reusable CMS content blocks, crisp motion choreography, and accessible forms.',
    execution: [
      'Next.js 15 App Router architecture with strict TypeScript models',
      'Modular landing-page section library ready for Payload CMS',
      'Core Web Vitals optimization targeting sub-second LCP',
      'Multi-step lead qualification & routing UX',
    ],
    sampleOutcome: 'Sample benchmark: 99 Lighthouse performance architecture target',
    isSample: true,
    media: {
      id: 'media-nordic-web',
      alt: 'Nordic Grid headless Next.js flagship web showcase',
      replaceableLabel: 'Replaceable Web Interface Preview (4:3)',
      recommendedAspect: '4 / 3',
      variant: 'web-architecture',
    },
  },
  {
    slug: 'solaris-health-integrated-growth',
    title: 'Solaris Health — Integrated Search, Content & Paid Acquisition',
    client: 'Solaris Health (Sample Healthcare)',
    category: 'Digital Marketing',
    year: '2026',
    summary:
      'Sample case template uniting medical-compliant Google Ads, educational content hubs, and patient inquiry conversion flows.',
    challenge:
      'Strict healthcare advertising policies and fragmented agency vendors created inconsistent messaging and untracked patient leads.',
    strategy:
      'Consolidate paid search, authoritative patient education guides, and localized landing funnels under a single compliance-first team.',
    execution: [
      'Policy-compliant Google Search & local clinic campaign setup',
      'Clinician-reviewed editorial guides structured for AI search',
      'Appointment booking UX simplification across mobile devices',
      'Closed-loop call & form attribution reporting',
    ],
    sampleOutcome: 'Sample benchmark: Unified multi-channel acquisition blueprint',
    isSample: true,
    media: {
      id: 'media-solaris-growth',
      alt: 'Solaris Health integrated digital marketing visual',
      replaceableLabel: 'Replaceable Campaign Visual (4:3)',
      recommendedAspect: '4 / 3',
      variant: 'paid-growth',
    },
  },
  {
    slug: 'lumina-ai-category-launch',
    title: 'Lumina AI — Global Product Launch & Performance Funnel',
    client: 'Lumina AI (Sample AI Platform)',
    category: 'Digital Marketing',
    year: '2026',
    summary:
      'Sample case template combining brand launch creative, LinkedIn & Google demand capture, and developer documentation SEO.',
    challenge:
      'Launching into a crowded AI software market required immediate differentiation and measurable enterprise trial signups.',
    strategy:
      'Anchor launch messaging around concrete workflow benchmarks while pairing video storytelling with high-intent search capture.',
    execution: [
      'Launch narrative, interactive product tour & landing architecture',
      'LinkedIn ABM & high-intent Google Search campaign rollout',
      'Technical documentation SEO & comparison landing pages',
      'Weekly cohort conversion & funnel velocity analysis',
    ],
    sampleOutcome: 'Sample benchmark: Global go-to-market launch architecture',
    isSample: true,
    media: {
      id: 'media-lumina-launch',
      alt: 'Lumina AI global product launch showcase visual',
      replaceableLabel: 'Replaceable Launch Showcase Visual (4:3)',
      recommendedAspect: '4 / 3',
      variant: 'hero-3d',
    },
  },
]
