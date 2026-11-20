import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access'
import { revalidateSiteSettings } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site & Agency Settings',
  admin: {
    group: 'Website Content',
    description:
      'Manage global agency details, homepage hero, introduction, CTA banner, About page content, and default SEO metadata.',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateSiteSettings()
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand & Contact',
          fields: [
            {
              name: 'agencyName',
              label: 'Agency Name',
              type: 'text',
              required: true,
              defaultValue: 'Modexa Digital Agency',
              maxLength: 100,
            },
            {
              name: 'brandMark',
              label: 'Header / Footer Brand Mark',
              type: 'text',
              required: true,
              defaultValue: 'MODX 2.0',
              maxLength: 40,
            },
            {
              name: 'tagline',
              label: 'Footer Tagline',
              type: 'textarea',
              defaultValue:
                'Modexa Digital Agency builds category-defining brand systems, high-speed web platforms, and full-funnel acquisition engines for ambitious businesses worldwide.',
              maxLength: 320,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactEmail',
                  label: 'Contact Email',
                  type: 'email',
                  defaultValue: 'hello@modexadigital.com',
                },
                {
                  name: 'contactPhone',
                  label: 'Phone / WhatsApp',
                  type: 'text',
                  defaultValue: '+91 (Studio Concierge)',
                  maxLength: 60,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'studioLocation',
                  label: 'Primary Studio Location',
                  type: 'text',
                  defaultValue: 'India · International Remote Operations',
                  maxLength: 140,
                },
                {
                  name: 'workingHours',
                  label: 'Working Hours',
                  type: 'text',
                  defaultValue: 'Monday – Friday · 10:00 AM to 7:00 PM IST',
                  maxLength: 120,
                },
              ],
            },
            {
              name: 'marketsServed',
              label: 'Markets Served',
              type: 'text',
              defaultValue: 'India · USA · UK · UAE · Australia',
              maxLength: 160,
            },
            {
              name: 'socialLinks',
              label: 'Social Media Links',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  label: 'Platform Label',
                  type: 'text',
                  required: true,
                  maxLength: 40,
                },
                {
                  name: 'url',
                  label: 'Profile URL',
                  type: 'text',
                  required: true,
                  maxLength: 240,
                },
              ],
            },
            {
              name: 'trustedBrandsHeading',
              label: 'Trusted Brands Heading',
              type: 'text',
              defaultValue: 'Trusted By Forward-Thinking Teams',
              maxLength: 100,
            },
            {
              name: 'trustedBrandsSubheading',
              label: 'Trusted Brands Subheading',
              type: 'text',
              defaultValue: 'Partnering with high-growth brands across SaaS, D2C, and Fintech',
              maxLength: 140,
            },
            {
              name: 'trustedBrands',
              label: 'Trusted Brands Strip',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  label: 'Brand Name',
                  type: 'text',
                  required: true,
                  maxLength: 80,
                },
                {
                  name: 'sector',
                  label: 'Industry / Sector',
                  type: 'text',
                  maxLength: 80,
                },
              ],
            },
          ],
        },
        {
          label: 'Homepage Hero & Intro',
          fields: [
            {
              name: 'heroEyebrow',
              label: 'Hero Eyebrow',
              type: 'text',
              defaultValue: 'Modexa Digital Agency · MODX 2.0',
              maxLength: 80,
            },
            {
              name: 'heroHeadlinePrefix',
              label: 'Hero Headline (Primary Line)',
              type: 'text',
              defaultValue: 'We Build Brands That',
              maxLength: 100,
            },
            {
              name: 'heroHeadlineHighlight',
              label: 'Hero Headline (Accent Highlight)',
              type: 'text',
              defaultValue: 'Move The World.',
              maxLength: 80,
            },
            {
              name: 'heroDescription',
              label: 'Hero Description',
              type: 'textarea',
              defaultValue:
                'We partner with ambitious companies to combine creative brand direction, full-funnel digital marketing, and high-speed web engineering—turning market attention into compounding business growth.',
              maxLength: 400,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroPrimaryCtaLabel',
                  label: 'Primary CTA Label',
                  type: 'text',
                  defaultValue: 'Start a Project',
                  maxLength: 50,
                },
                {
                  name: 'heroPrimaryCtaHref',
                  label: 'Primary CTA Link',
                  type: 'text',
                  defaultValue: '/contact',
                  maxLength: 120,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroSecondaryCtaLabel',
                  label: 'Secondary CTA Label',
                  type: 'text',
                  defaultValue: 'Explore Our Work',
                  maxLength: 50,
                },
                {
                  name: 'heroSecondaryCtaHref',
                  label: 'Secondary CTA Link',
                  type: 'text',
                  defaultValue: '/portfolio',
                  maxLength: 120,
                },
              ],
            },
            {
              name: 'heroMedia',
              label: 'Hero Visual (Image or Video)',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'introEyebrow',
              label: 'Agency Intro Eyebrow',
              type: 'text',
              defaultValue: 'About Modexa Digital',
              maxLength: 80,
            },
            {
              name: 'introHeadline',
              label: 'Agency Intro Headline',
              type: 'text',
              defaultValue:
                'A multidisciplinary growth studio engineered for the modern buyer journey.',
              maxLength: 160,
            },
            {
              name: 'introDescription',
              label: 'Agency Intro Description',
              type: 'textarea',
              defaultValue:
                'Most agencies split creative branding, paid media, SEO, and web engineering into disconnected silos. Modexa Digital brings senior strategists, creative directors, performance marketers, and Next.js engineers into one unified pod.',
              maxLength: 600,
            },
            {
              name: 'introMedia',
              label: 'Agency Intro Visual (Image or Video)',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'introHighlights',
              label: 'Agency Intro Highlights',
              type: 'array',
              maxRows: 4,
              fields: [
                {
                  name: 'title',
                  label: 'Title',
                  type: 'text',
                  required: true,
                  maxLength: 80,
                },
                {
                  name: 'description',
                  label: 'Description',
                  type: 'textarea',
                  required: true,
                  maxLength: 220,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'introCtaLabel',
                  label: 'Intro CTA Label',
                  type: 'text',
                  defaultValue: 'Discover Our Story',
                  maxLength: 50,
                },
                {
                  name: 'introCtaHref',
                  label: 'Intro CTA Link',
                  type: 'text',
                  defaultValue: '/about',
                  maxLength: 120,
                },
              ],
            },
          ],
        },
        {
          label: 'About Page & Team',
          fields: [
            {
              name: 'aboutEyebrow',
              label: 'About Page Eyebrow',
              type: 'text',
              defaultValue: 'About Modexa Digital',
              maxLength: 80,
            },
            {
              name: 'aboutHeadline',
              label: 'About Page Headline',
              type: 'text',
              defaultValue: 'Creative ambition backed by growth discipline.',
              maxLength: 160,
            },
            {
              name: 'aboutSummary',
              label: 'About Page Summary',
              type: 'textarea',
              defaultValue:
                'Modexa Digital Agency (MODX 2.0) was built to bridge the gap between high-craft brand experiences and measurable revenue acquisition. We partner with founders and marketing leaders across India, the USA, the UK, the UAE, and Australia.',
              maxLength: 600,
            },
            {
              name: 'aboutMedia',
              label: 'About Studio Visual (Image or Video)',
              type: 'upload',
              relationTo: 'media',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'missionEyebrow',
                  label: 'Mission Eyebrow',
                  type: 'text',
                  defaultValue: 'Our Mission',
                  maxLength: 60,
                },
                {
                  name: 'missionHeadline',
                  label: 'Mission Headline',
                  type: 'text',
                  defaultValue: 'Turn brand clarity into compounding demand.',
                  maxLength: 140,
                },
              ],
            },
            {
              name: 'missionDescription',
              label: 'Mission Description',
              type: 'textarea',
              defaultValue:
                'To help ambitious organizations build distinctive brands, lightning-fast digital flagships, and transparent acquisition systems across search, AI discovery, and paid social—without agency bloat or vanity reporting.',
              maxLength: 500,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'visionEyebrow',
                  label: 'Vision Eyebrow',
                  type: 'text',
                  defaultValue: 'Our Vision',
                  maxLength: 60,
                },
                {
                  name: 'visionHeadline',
                  label: 'Vision Headline',
                  type: 'text',
                  defaultValue: 'Set the global benchmark for modern growth studios.',
                  maxLength: 140,
                },
              ],
            },
            {
              name: 'visionDescription',
              label: 'Vision Description',
              type: 'textarea',
              defaultValue:
                'To become the trusted long-term growth partner for category leaders worldwide—where strategy, creative direction, AI search readiness, and full-stack web engineering operate as one seamless team.',
              maxLength: 500,
            },
            {
              name: 'coreValues',
              label: 'Core Values',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  label: 'Value Title',
                  type: 'text',
                  required: true,
                  maxLength: 80,
                },
                {
                  name: 'description',
                  label: 'Value Description',
                  type: 'textarea',
                  required: true,
                  maxLength: 260,
                },
              ],
            },
            {
              name: 'leadershipTitle',
              label: 'Leadership Section Title',
              type: 'text',
              defaultValue: 'Senior specialists leading your account.',
              maxLength: 120,
            },
            {
              name: 'leadershipDescription',
              label: 'Leadership Section Description',
              type: 'textarea',
              defaultValue:
                'Multidisciplinary directors across growth strategy, paid acquisition, brand craft, and web engineering.',
              maxLength: 260,
            },
            {
              name: 'teamMembers',
              label: 'Leadership Team Members',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  label: 'Full Name',
                  type: 'text',
                  required: true,
                  maxLength: 80,
                },
                {
                  name: 'role',
                  label: 'Role / Title',
                  type: 'text',
                  required: true,
                  maxLength: 80,
                },
                {
                  name: 'bio',
                  label: 'Short Bio',
                  type: 'textarea',
                  required: true,
                  maxLength: 260,
                },
                {
                  name: 'expertise',
                  label: 'Expertise Tags',
                  type: 'text',
                  maxLength: 120,
                },
                {
                  name: 'photo',
                  label: 'Portrait Photo',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: {
                    mimeType: {
                      contains: 'image/',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'CTA Banner & SEO',
          fields: [
            {
              name: 'ctaEyebrow',
              label: 'CTA Banner Eyebrow',
              type: 'text',
              defaultValue: "Let's Build Together",
              maxLength: 80,
            },
            {
              name: 'ctaHeadline',
              label: 'CTA Banner Headline',
              type: 'text',
              defaultValue: 'Ready to Grow Your Business?',
              maxLength: 120,
            },
            {
              name: 'ctaDescription',
              label: 'CTA Banner Description',
              type: 'textarea',
              defaultValue:
                'Tell us about your goals across branding, web development, SEO, or paid media—and we will craft a clear action plan tailored to your growth stage.',
              maxLength: 320,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaPrimaryLabel',
                  label: 'Primary Button Label',
                  type: 'text',
                  defaultValue: 'Start a Project',
                  maxLength: 50,
                },
                {
                  name: 'ctaPrimaryHref',
                  label: 'Primary Button Link',
                  type: 'text',
                  defaultValue: '/contact',
                  maxLength: 120,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaSecondaryLabel',
                  label: 'Secondary Button Label',
                  type: 'text',
                  defaultValue: 'Explore Services',
                  maxLength: 50,
                },
                {
                  name: 'ctaSecondaryHref',
                  label: 'Secondary Button Link',
                  type: 'text',
                  defaultValue: '/services',
                  maxLength: 120,
                },
              ],
            },
            {
              name: 'resultsMetrics',
              label: 'Performance Benchmarks (Optional CMS Metrics)',
              type: 'array',
              maxRows: 4,
              fields: [
                {
                  name: 'value',
                  label: 'Metric Value (e.g. 3.2x)',
                  type: 'text',
                  required: true,
                  maxLength: 30,
                },
                {
                  name: 'label',
                  label: 'Metric Label',
                  type: 'text',
                  required: true,
                  maxLength: 80,
                },
                {
                  name: 'context',
                  label: 'Supporting Context',
                  type: 'text',
                  maxLength: 160,
                },
              ],
            },
            {
              name: 'defaultSeoTitle',
              label: 'Default Site SEO Title',
              type: 'text',
              defaultValue: 'Modexa Digital (MODX 2.0) — Digital Marketing & Creative Growth Agency',
              maxLength: 80,
            },
            {
              name: 'defaultSeoDescription',
              label: 'Default Site SEO Description',
              type: 'textarea',
              defaultValue:
                'MODX 2.0 — Modexa Digital Agency builds brands that move the world through strategy, creative design, web engineering, and measurable growth.',
              maxLength: 180,
            },
            {
              name: 'defaultOgImage',
              label: 'Default Social Share Image (Open Graph)',
              type: 'upload',
              relationTo: 'media',
              filterOptions: {
                mimeType: {
                  contains: 'image/',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
