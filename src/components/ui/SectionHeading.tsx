import React from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const alignClasses = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-2xl space-y-3 ${alignClasses} ${className}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-wider text-modx-accent-light uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.625rem] font-bold text-white leading-[1.14]">
        {title}
      </h2>
      {description ? (
        <p className="text-base text-modx-muted leading-relaxed">{description}</p>
      ) : null}
    </div>
  )
}
