import Link from 'next/link'
import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never
  }

type ButtonAsLink = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-modx-accent text-white hover:bg-[#7C3AED] shadow-[0_0_24px_-6px_rgba(139,92,246,0.65)] hover:shadow-[0_0_32px_-4px_rgba(139,92,246,0.85)] focus-visible:outline-modx-accent-light',
  secondary:
    'bg-modx-surface-elevated text-white border border-white/10 hover:border-modx-accent/50 hover:bg-[#1B1B29] focus-visible:outline-modx-accent-light',
  outline:
    'border border-white/15 bg-transparent text-white hover:border-modx-accent-light/60 hover:bg-white/[0.04] focus-visible:outline-modx-accent-light',
  ghost:
    'bg-transparent text-modx-muted hover:text-white hover:bg-white/[0.05] focus-visible:outline-modx-accent-light',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap shrink-0 transition-all duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const combined = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if ('href' in props && props.href !== undefined) {
    const { href, ...linkProps } = props
    return (
      <Link href={href} className={combined} {...linkProps}>
        {children}
      </Link>
    )
  }

  return (
    <button className={combined} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
