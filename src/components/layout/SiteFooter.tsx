import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Container } from '@/components/ui/Container'
import {
  type CmsServiceItem,
  DEFAULT_SITE_SETTINGS,
  type SiteSettingsViewModel,
} from '@/lib/cms'
import { sanitizeExternalUrl } from '@/lib/seo'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

interface SiteFooterProps {
  settings?: SiteSettingsViewModel
  services?: CmsServiceItem[]
}

export function SiteFooter({
  settings = DEFAULT_SITE_SETTINGS,
  services = [],
}: SiteFooterProps) {
  const safeSocials = settings.socialLinks
    .map((item) => ({
      label: item.label,
      url: sanitizeExternalUrl(item.url),
    }))
    .filter((item): item is { label: string; url: string } => Boolean(item.url))

  return (
    <footer className="border-t border-white/10 bg-modx-bg text-modx-muted">
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-white whitespace-nowrap"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-modx-accent to-modx-accent-deep text-xs font-extrabold text-white"
              >
                {settings.brandMark.charAt(0) || 'M'}
              </span>
              <span>{settings.brandMark}</span>
            </Link>
            <p className="text-sm leading-relaxed text-modx-muted max-w-sm">
              {settings.tagline}
            </p>
            {safeSocials.length > 0 ? (
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {safeSocials.map((social) => (
                  <a
                    key={`${social.label}-${social.url}`}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-modx-muted hover:text-modx-accent-light transition-colors"
                  >
                    <span>{social.label}</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            {services.length > 0 ? (
              <ul className="space-y-2.5 text-sm">
                {services.slice(0, 8).map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2.5 text-sm">
                <p className="text-modx-muted/80">
                  Explore our full-funnel digital services.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-modx-accent-light hover:underline"
                >
                  <span>View Services</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-modx-accent-light shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-modx-accent-light shrink-0 mt-0.5" aria-hidden="true" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-modx-accent-light shrink-0 mt-0.5" aria-hidden="true" />
                <span>{settings.studioLocation}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-modx-muted">
          <p>
            © {new Date().getFullYear()} {settings.agencyName} ({settings.brandMark}). All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">
              Start a Project
            </Link>
            <Link href="/portfolio" className="hover:text-white transition-colors">
              Explore Work
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
