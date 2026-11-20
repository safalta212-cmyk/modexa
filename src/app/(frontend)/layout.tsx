import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { getPublishedServices, getSiteSettings } from '@/lib/cms'
import { getSiteBaseUrl, resolveAbsoluteMediaUrl } from '@/lib/seo'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settingsRes = await getSiteSettings()
  const settings = settingsRes.data
  const ogImageUrl = resolveAbsoluteMediaUrl(settings.defaultOgImage, 'hero')

  return {
    metadataBase: new URL(getSiteBaseUrl()),
    title: {
      default: settings.defaultSeoTitle,
      template: `%s | Modexa Digital`,
    },
    description: settings.defaultSeoDescription,
    openGraph: {
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      siteName: 'Modexa Digital',
      type: 'website',
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.defaultSeoTitle,
      description: settings.defaultSeoDescription,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  }
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [settingsRes, servicesRes] = await Promise.all([
    getSiteSettings(),
    getPublishedServices({ limit: 8 }),
  ])

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-modx-bg text-modx-text antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-modx-accent focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <SiteHeader brandMark={settingsRes.data.brandMark} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter settings={settingsRes.data} services={servicesRes.data} />
      </body>
    </html>
  )
}
