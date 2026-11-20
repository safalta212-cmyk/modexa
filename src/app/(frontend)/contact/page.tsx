import { Clock, Globe2, Mail, MapPin, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import React from 'react'

import { ContactForm } from '@/components/interactive/ContactForm'
import { FadeIn } from '@/components/motion/FadeIn'
import { Container } from '@/components/ui/Container'
import { getPublishedServices, getSiteSettings } from '@/lib/cms'
import { buildPageMetadata } from '@/lib/seo'

type ContactPageProps = {
  searchParams: Promise<{ service?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const settingsRes = await getSiteSettings()
  return buildPageMetadata({
    title: 'Contact',
    description:
      'Start a project with Modexa Digital Agency (MODX 2.0). Reach out for digital marketing, SEO, paid ads, branding, or web development.',
    path: '/contact',
    image: settingsRes.data.defaultOgImage,
    type: 'website',
  })
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const [{ service }, settingsRes, servicesRes] = await Promise.all([
    searchParams,
    getSiteSettings(),
    getPublishedServices({ limit: 50 }),
  ])

  const settings = settingsRes.data
  const serviceOptions = servicesRes.data.map((item) => ({
    slug: item.slug,
    title: item.title,
  }))

  return (
    <section className="relative overflow-hidden bg-modx-bg pt-16 pb-24 sm:pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[440px] w-[780px] -translate-x-1/2 purple-glow"
      />

      <Container className="relative space-y-14">
        <FadeIn immediate className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-modx-accent-light">
            Contact Us
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08]">
            Let&apos;s plan your next growth milestone.
          </h1>
          <p className="text-base sm:text-lg text-modx-muted leading-relaxed">
            Tell us about your brand, target markets, and priority channels. Our team works across{' '}
            {settings.marketsServed}.
          </p>
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <ContactForm
              initialService={service ?? ''}
              serviceOptions={serviceOptions}
            />
          </div>

          <aside className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-modx-surface p-7 space-y-6">
              <h2 className="text-xl font-bold text-white">Direct Studio Channels</h2>

              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-3.5">
                  <Mail className="h-5 w-5 text-modx-accent-light shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-modx-muted hover:text-white transition-colors"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <Phone className="h-5 w-5 text-modx-accent-light shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">Phone / WhatsApp</p>
                    <p className="text-modx-muted">{settings.contactPhone}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <MapPin className="h-5 w-5 text-modx-accent-light shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">Primary Studio</p>
                    <p className="text-modx-muted">{settings.studioLocation}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <Clock className="h-5 w-5 text-modx-accent-light shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">Working Hours</p>
                    <p className="text-modx-muted">{settings.workingHours}</p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <Globe2 className="h-5 w-5 text-modx-accent-light shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-white">Markets Served</p>
                    <p className="text-modx-muted">{settings.marketsServed}</p>
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}
