import { AlertCircle, ArrowRight, DatabaseZap, FolderOpen } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/Button'
import type { CmsStatus } from '@/lib/cms'

interface CmsEmptyStateProps {
  status: CmsStatus
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
  className?: string
}

export function CmsEmptyState({
  status,
  title,
  description,
  actionHref,
  actionLabel,
  className = '',
}: CmsEmptyStateProps) {
  const Icon =
    status === 'unconfigured'
      ? DatabaseZap
      : status === 'error'
        ? AlertCircle
        : FolderOpen

  const resolvedTitle =
    status === 'unconfigured'
      ? 'CMS Database Not Connected'
      : status === 'error'
        ? 'Content Temporarily Unavailable'
        : title

  const resolvedDescription =
    status === 'unconfigured'
      ? 'Configure MONGODB_URI and PAYLOAD_SECRET in your environment to load live published records from Payload CMS.'
      : status === 'error'
        ? 'We could not load live records from the CMS right now. Please try again shortly.'
        : description

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-modx-surface p-8 sm:p-12 text-center space-y-4 ${className}`}
    >
      <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-modx-accent/35 bg-modx-accent/10 text-modx-accent-light">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="max-w-lg mx-auto space-y-2">
        <h3 className="text-lg font-bold text-white">{resolvedTitle}</h3>
        <p className="text-sm text-modx-muted leading-relaxed">{resolvedDescription}</p>
      </div>
      {actionHref && actionLabel ? (
        <div className="pt-2">
          <Button href={actionHref} variant="outline" size="sm">
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
