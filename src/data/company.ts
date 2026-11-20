import type { SampleMetric, SampleTestimonial, TeamMember } from './types'

export const TRUSTED_BRANDS_SAMPLE = [
  { name: 'Velora Cloud', sector: 'Enterprise SaaS' },
  { name: 'Kuro Atelier', sector: 'Luxury D2C' },
  { name: 'Aether Pay', sector: 'Fintech' },
  { name: 'Nordic Grid', sector: 'CleanTech' },
  { name: 'Solaris Health', sector: 'Digital Health' },
  { name: 'Lumina AI', sector: 'Applied AI' },
]

export const WHY_CHOOSE_US_ITEMS = [
  {
    number: '01',
    title: 'Strategy Before Spend',
    description:
      'Every engagement starts with market diagnostics, unit economics modeling, and funnel audits before deploying a single ad dollar.',
  },
  {
    number: '02',
    title: 'Creative Built to Convert',
    description:
      'Brand identity, motion direction, and landing UX are crafted by the same squad optimizing your paid and organic acquisition.',
  },
  {
    number: '03',
    title: 'AI-Era Search Readiness',
    description:
      'We engineer websites and content ecosystems for both classic search rankings and modern AI assistant visibility.',
  },
  {
    number: '04',
    title: 'Transparent Weekly Rhythm',
    description:
      'Plain-language reporting focused on qualified leads, pipeline contribution, and contribution margin—zero vanity fluff.',
  },
]

export const PROCESS_STEPS = [
  {
    step: '01',
    name: 'Discover',
    summary:
      'Audit existing analytics, search visibility, ad accounts, brand positioning, and competitor gaps to uncover real growth leverage.',
  },
  {
    step: '02',
    name: 'Strategize',
    summary:
      'Define target buyer personas, channel priorities, 90-day sprint milestones, and clean attribution benchmarks.',
  },
  {
    step: '03',
    name: 'Create',
    summary:
      'Produce high-converting web experiences, brand visuals, ad creative systems, and authority content built for action.',
  },
  {
    step: '04',
    name: 'Launch',
    summary:
      'Deploy campaigns, technical SEO foundations, and Next.js web builds with verified end-to-end conversion tracking.',
  },
  {
    step: '05',
    name: 'Optimize',
    summary:
      'Continuously test hooks, refine landing flows, reallocate budget toward winners, and compound long-term returns.',
  },
]

export const SAMPLE_RESULTS_METRICS: SampleMetric[] = [
  {
    id: 'metric-pipeline',
    value: '3.2x',
    label: 'Target Pipeline Velocity',
    context: 'Sample benchmark template · Placeholder until verified client data is connected',
    isSample: true,
  },
  {
    id: 'metric-roas',
    value: '4.1x',
    label: 'Blended Paid Return Target',
    context: 'Sample benchmark template · Placeholder until verified client data is connected',
    isSample: true,
  },
  {
    id: 'metric-speed',
    value: '<1.0s',
    label: 'Core Web Vitals LCP Target',
    context: 'Sample engineering standard · Next.js App Router performance architecture',
    isSample: true,
  },
  {
    id: 'metric-sprint',
    value: '14 Days',
    label: 'Audit-to-Launch Sprint',
    context: 'Sample onboarding cadence · Structured initial launch timeline',
    isSample: true,
  },
]

export const SAMPLE_TESTIMONIALS: SampleTestimonial[] = [
  {
    id: 'test-1',
    quote:
      'Sample testimonial placeholder: Modexa aligned our technical SEO, paid search, and landing page redesign under one cohesive squad, turning fragmented traffic into predictable enterprise demos.',
    author: 'Elena Vance',
    role: 'VP of Marketing',
    company: 'Velora Cloud (Sample Client)',
    engagementType: 'SEO & Web Flagship',
    isSample: true,
  },
  {
    id: 'test-2',
    quote:
      'Sample testimonial placeholder: Their weekly Meta creative sprints and conversion-first product pages cut wasted spend while elevating how our brand feels across every channel.',
    author: 'Marcus Chen',
    role: 'Co-Founder',
    company: 'Kuro Atelier (Sample Client)',
    engagementType: 'Paid Social & Brand',
    isSample: true,
  },
  {
    id: 'test-3',
    quote:
      'Sample testimonial placeholder: Rare combination of sharp brand taste and rigorous performance accountability. Every sprint shipped on time with crystal-clear reporting.',
    author: 'Priya Nair',
    role: 'Head of Growth',
    company: 'Aether Pay (Sample Client)',
    engagementType: 'Full-Funnel Growth',
    isSample: true,
  },
]

export const AGENCY_VALUES = [
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
]

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Aarav Mehta (Sample)',
    role: 'Founder & Growth Strategist',
    bio: 'Leads full-funnel acquisition strategy, search architecture, and executive partner roadmaps.',
    expertise: 'Growth Architecture · B2B & D2C',
    isSample: true,
    media: {
      id: 'team-photo-1',
      alt: 'Sample leadership portrait placeholder for Aarav Mehta',
      replaceableLabel: 'Replaceable Team Portrait (1:1)',
      recommendedAspect: '1 / 1',
      variant: 'portrait',
    },
  },
  {
    id: 'team-2',
    name: 'Nadia Kapoor (Sample)',
    role: 'Head of Performance Media',
    bio: 'Architects high-efficiency Google Ads and Meta Ads scaling frameworks driven by creative testing.',
    expertise: 'Google Ads · Meta Ads · Attribution',
    isSample: true,
    media: {
      id: 'team-photo-2',
      alt: 'Sample leadership portrait placeholder for Nadia Kapoor',
      replaceableLabel: 'Replaceable Team Portrait (1:1)',
      recommendedAspect: '1 / 1',
      variant: 'portrait',
    },
  },
  {
    id: 'team-3',
    name: 'Daniel Brooks (Sample)',
    role: 'Creative & Brand Director',
    bio: 'Directs visual identity systems, campaign art direction, and high-impact digital brand worlds.',
    expertise: 'Branding · Art Direction · UI Systems',
    isSample: true,
    media: {
      id: 'team-photo-3',
      alt: 'Sample leadership portrait placeholder for Daniel Brooks',
      replaceableLabel: 'Replaceable Team Portrait (1:1)',
      recommendedAspect: '1 / 1',
      variant: 'portrait',
    },
  },
  {
    id: 'team-4',
    name: 'Sora Takahashi (Sample)',
    role: 'Lead Web Architect',
    bio: 'Engineers modular Next.js, TypeScript, and headless CMS platforms built for speed and conversion.',
    expertise: 'Next.js · Headless CMS · Performance',
    isSample: true,
    media: {
      id: 'team-photo-4',
      alt: 'Sample leadership portrait placeholder for Sora Takahashi',
      replaceableLabel: 'Replaceable Team Portrait (1:1)',
      recommendedAspect: '1 / 1',
      variant: 'portrait',
    },
  },
]
