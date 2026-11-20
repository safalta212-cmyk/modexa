import type { BlogCategory, BlogPost } from './types'

export const BLOG_CATEGORIES: Array<'All' | BlogCategory> = [
  'All',
  'Strategy',
  'SEO & AI Search',
  'Paid Media',
  'Design & Web',
]

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ai-answer-engine-optimization-playbook',
    title: 'How Brands Win Citations in Google AI Overviews and ChatGPT Search',
    category: 'SEO & AI Search',
    publishedDate: 'Sample Editorial · 2026',
    readTime: '6 min read',
    authorName: 'Modexa Editorial Team',
    authorRole: 'Search & AI Strategy',
    excerpt:
      'Why keyword stuffing no longer works—and how entity clarity, original research, and clean technical schema help AI assistants recommend your brand.',
    media: {
      id: 'blog-aeo-playbook',
      alt: 'Abstract editorial illustration for AI search visibility',
      replaceableLabel: 'Replaceable Editorial Cover (16:9)',
      recommendedAspect: '16 / 9',
      variant: 'saas-platform',
    },
    content: [
      {
        heading: 'Search has shifted from ten blue links to synthesized answers',
        paragraphs: [
          'Buyers increasingly ask ChatGPT, Gemini, Perplexity, and Google AI Overviews to shortlist vendors before ever visiting a website. Winning visibility now requires proving topical authority and clear factual consistency across your owned pages and third-party citations.',
          'Brands that organize pages around direct buyer questions, structured JSON-LD entities, and transparent comparison data earn disproportionate inclusion in AI-generated recommendations.',
        ],
      },
      {
        heading: 'Three structural pillars for modern organic visibility',
        paragraphs: [
          'First, establish a crawlable technical foundation with fast Core Web Vitals, clean canonical URLs, and unambiguous semantic HTML.',
          'Second, publish verifiable primary information—pricing frameworks, implementation timelines, and honest trade-offs—rather than generic fluff. Third, reinforce your brand entity consistently across industry directories, documentation, and digital PR.',
        ],
      },
    ],
  },
  {
    slug: 'creative-testing-velocity-meta-ads',
    title: 'Creative Is the New Targeting: Structuring Weekly Meta Ads Sprints',
    category: 'Paid Media',
    publishedDate: 'Sample Editorial · 2026',
    readTime: '5 min read',
    authorName: 'Modexa Editorial Team',
    authorRole: 'Performance Media',
    excerpt:
      'A practical framework for diagnosing creative fatigue, isolating hook performance, and scaling profitable paid social budgets without guesswork.',
    media: {
      id: 'blog-meta-creative',
      alt: 'Performance media creative testing studio visual',
      replaceableLabel: 'Replaceable Editorial Cover (16:9)',
      recommendedAspect: '16 / 9',
      variant: 'paid-growth',
    },
    content: [
      {
        heading: 'Why micro-targeting lost to creative diversity',
        paragraphs: [
          'Automated bidding algorithms do the heavy lifting of audience discovery, which means your ad creative now dictates who converts and at what cost. Running one static concept across ten ad sets only fragments learnings.',
          'Instead, structure accounts around clean consolidation paired with deliberate weekly creative hypotheses—testing distinct problem angles, visual formats, and landing page continuity.',
        ],
      },
      {
        heading: 'Measuring true incremental contribution',
        paragraphs: [
          'Platform-reported ROAS rarely tells the whole story. Pair in-platform click diagnostics (thumbstop rate, hold rate, CTR) with blended Marketing Efficiency Ratio (MER) and post-purchase attribution before scaling spend.',
        ],
      },
    ],
  },
  {
    slug: 'headless-nextjs-conversion-architecture',
    title: 'Why High-Growth Marketing Teams Are Moving to Headless Next.js Platforms',
    category: 'Design & Web',
    publishedDate: 'Sample Editorial · 2026',
    readTime: '7 min read',
    authorName: 'Modexa Editorial Team',
    authorRole: 'Web Engineering',
    excerpt:
      'How decoupling a modular Next.js frontend from a structured CMS eliminates template bottlenecks, accelerates Core Web Vitals, and improves conversion rates.',
    media: {
      id: 'blog-nextjs-arch',
      alt: 'Modern web architecture visual in deep black and violet',
      replaceableLabel: 'Replaceable Editorial Cover (16:9)',
      recommendedAspect: '16 / 9',
      variant: 'web-architecture',
    },
    content: [
      {
        heading: 'Speed and editorial agility do not have to compete',
        paragraphs: [
          'Traditional page builders weigh down websites with bloated scripts and rigid layouts, hurting both paid-ad Quality Scores and organic rankings. Conversely, hardcoded static sites slow marketing teams down whenever a new campaign launches.',
          'Combining Next.js App Router with a typed headless CMS gives marketers reusable, design-system-compliant blocks while delivering sub-second page transitions for visitors.',
        ],
      },
      {
        heading: 'Designing every page for a single clear action',
        paragraphs: [
          'Great engineering only converts when paired with disciplined visual hierarchy: focused above-the-fold propositions, scannable proof adjacent to claims, and frictionless mobile inquiry flows.',
        ],
      },
    ],
  },
  {
    slug: 'unified-brand-and-performance-strategy',
    title: 'Bridging Brand Storytelling and Performance Accountability in 2026',
    category: 'Strategy',
    publishedDate: 'Sample Editorial · 2026',
    readTime: '5 min read',
    authorName: 'Modexa Editorial Team',
    authorRole: 'Brand Strategy',
    excerpt:
      'Separate brand and performance silos burn budget. Here is how modern growth teams align distinctive creative with measurable pipeline goals.',
    media: {
      id: 'blog-brand-perf',
      alt: 'Creative agency strategy room abstract visual',
      replaceableLabel: 'Replaceable Editorial Cover (16:9)',
      recommendedAspect: '16 / 9',
      variant: 'editorial-studio',
    },
    content: [
      {
        heading: 'The false divide between brand and demand',
        paragraphs: [
          'Performance campaigns without a distinct brand voice race to the bottom on discount-driven clicks. Brand campaigns without conversion architecture struggle to justify investment.',
          'When creative direction, search intent, and landing experiences share one strategy, every impression compounds future conversion efficiency.',
        ],
      },
    ],
  },
]
