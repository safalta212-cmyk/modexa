import type { Metadata } from 'next'
import React from 'react'

import { FadeIn } from '@/components/motion/FadeIn'
import { CtaBannerSection } from '@/components/sections/CtaBannerSection'
import { CmsMedia } from '@/components/ui/CmsMedia'
import { Container } from '@/components/ui/Container'
import { ReplaceableMedia } from '@/components/ui/ReplaceableMedia'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { MediaAssetSpec } from '@/data/types'
import { getSiteSettings } from '@/lib/cms'
import { buildPageMetadata } from '@/lib/seo'

const FALLBACK_STUDIO_MEDIA: MediaAssetSpec = {
  id: 'about-page-studio',
  alt: 'Modexa Digital Agency studio environment visual',
  replaceableLabel: 'Agency Culture Visual',
  recommendedAspect: '16 / 9',
  variant: 'editorial-studio',
}

export async function generateMetadata(): Promise<Metadata> {
  const settingsRes = await getSiteSettings()
  const settings = settingsRes.data

  return buildPageMetadata({
    title: 'About Us',
    description: settings.aboutSummary,
    path: '/about',
    image: settings.aboutMedia?.raw || settings.defaultOgImage || null,
    type: 'website',
  })
}

export default async function AboutPage() {
  const settingsRes = await getSiteSettings()
  const settings = settingsRes.data

  return (
    <>
      <section className="relative overflow-hidden bg-modx-bg pt-16 pb-20 sm:pt-24 sm:pb-24 border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[760px] -translate-x-1/2 purple-glow"
        />
        <Container className="relative space-y-12">
          <FadeIn immediate className="max-w-3xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-modx-accent-light">
              {settings.aboutEyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08]">
              {settings.aboutHeadline}
            </h1>
            <p className="text-base sm:text-lg text-modx-muted leading-relaxed">
              {settings.aboutSummary}
            </p>
          </FadeIn>

          <FadeIn immediate delay={0.1}>
            {settings.aboutMedia ? (
              <CmsMedia
                media={settings.aboutMedia}
                altFallback={FALLBACK_STUDIO_MEDIA.alt}
                aspectRatio="16 / 9"
                sizeVariant="hero"
                sizes="100vw"
                priority
                showCaption={Boolean(settings.aboutMedia.caption)}
              />
            ) : (
              <ReplaceableMedia
                media={FALLBACK_STUDIO_MEDIA}
                priority
                showReplaceableCaption={false}
              />
            )}
          </FadeIn>
        </Container>
      </section>

      <section className="py-20 bg-modx-surface border-b border-white/10">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <FadeIn>
              <div className="h-full rounded-2xl border border-white/10 bg-modx-bg p-8 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-modx-accent-light">
                  {settings.missionEyebrow}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {settings.missionHeadline}
                </h2>
                <p className="text-sm sm:text-base text-modx-muted leading-relaxed">
                  {settings.missionDescription}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-modx-bg p-8 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-modx-accent-light">
                  {settings.visionEyebrow}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {settings.visionHeadline}
                </h2>
                <p className="text-sm sm:text-base text-modx-muted leading-relaxed">
                  {settings.visionDescription}
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 bg-modx-bg">
        <Container>
          <SectionHeading
            eyebrow="Core Values"
            title="Principles that guide every client engagement."
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {settings.coreValues.map((value, idx) => (
              <FadeIn key={`${value.title}-${idx}`} delay={idx * 0.05}>
                <div className="h-full rounded-xl card-surface p-6 space-y-3 card-surface-hover">
                  <span className="font-mono text-xs font-semibold text-modx-accent-light tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-white">{value.title}</h3>
                  <p className="text-sm text-modx-muted leading-relaxed">{value.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {settings.teamMembers.length > 0 ? (
        <section className="py-20 sm:py-24 bg-modx-surface border-t border-white/10">
          <Container>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
              <SectionHeading
                eyebrow="Leadership"
                title={settings.leadershipTitle}
                description={settings.leadershipDescription}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {settings.teamMembers.map((member, idx) => (
                <FadeIn key={member.id} delay={idx * 0.05}>
                  <div className="h-full rounded-2xl border border-white/10 bg-modx-bg p-5 space-y-4 card-surface-hover">
                    <CmsMedia
                      media={member.photo}
                      altFallback={member.name}
                      aspectRatio="1 / 1"
                      sizeVariant="card"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="text-xs font-semibold text-modx-accent-light">{member.role}</p>
                      <p className="text-sm text-modx-muted leading-relaxed pt-1">{member.bio}</p>
                    </div>
                    {member.expertise ? (
                      <p className="font-mono text-[11px] text-white/70 pt-3 border-t border-white/[0.06]">
                        {member.expertise}
                      </p>
                    ) : null}
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBannerSection settings={settings} />
    </>
  )
}
