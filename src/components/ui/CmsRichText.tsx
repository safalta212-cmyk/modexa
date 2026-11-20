import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

type RichTextData = Parameters<typeof RichText>[0]['data']

interface CmsRichTextProps {
  data: RichTextData | null | undefined
  className?: string
}

export function CmsRichText({ data, className = '' }: CmsRichTextProps) {
  if (!data || typeof data !== 'object' || !('root' in data)) {
    return null
  }

  return (
    <div
      className={`modx-richtext space-y-5 text-base text-modx-muted leading-[1.75] [&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:font-extrabold [&_h1]:text-white [&_h1]:pt-4 [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:pt-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:pt-3 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-white [&_p]:text-modx-muted [&_p]:leading-[1.75] [&_strong]:text-white [&_strong]:font-semibold [&_a]:text-modx-accent-light [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:text-modx-muted [&_blockquote]:border-l-2 [&_blockquote]:border-modx-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/90 [&_hr]:border-white/10 [&_hr]:my-6 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-modx-accent-light [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-modx-surface [&_pre]:p-4 ${className}`}
    >
      <RichText data={data} />
    </div>
  )
}
