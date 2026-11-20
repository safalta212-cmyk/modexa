import {
  Code2,
  FileText,
  Globe,
  Layers,
  MousePointerClick,
  Palette,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import React from 'react'

import type { Service } from '@/payload-types'

const ICON_MAP = {
  TrendingUp,
  Search,
  Share2,
  MousePointerClick,
  Layers,
  Code2,
  Palette,
  FileText,
  Sparkles,
  Globe,
}

export function ServiceIcon({
  name,
  className = 'h-5 w-5 text-modx-accent-light',
}: {
  name?: Service['icon'] | string | null
  className?: string
}) {
  const Icon = (name && name in ICON_MAP ? ICON_MAP[name as keyof typeof ICON_MAP] : TrendingUp)
  return <Icon className={className} aria-hidden="true" />
}
