'use client'

import { useAuth } from '@payloadcms/ui'
import { ExternalLink, Inbox, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export function AdminNavQuickLinks() {
  const { user } = useAuth()
  const pathname = usePathname()
  const isAdmin = Boolean(user && (user as { role?: string | null }).role === 'admin')

  return (
    <div className="modx-nav-section" aria-label="MODX 2.0 Workspace Shortcuts">
      <p className="modx-nav-label">MODX 2.0 Workspace</p>

      <Link
        href="/admin"
        className={`modx-nav-link ${pathname === '/admin' ? 'modx-nav-link--active' : ''}`}
      >
        <LayoutDashboard size={15} aria-hidden="true" />
        <span>Dashboard Overview</span>
      </Link>

      {isAdmin ? (
        <Link
          href="/admin/enquiries"
          className={`modx-nav-link ${
            pathname === '/admin/enquiries' ? 'modx-nav-link--active' : ''
          }`}
        >
          <Inbox size={15} aria-hidden="true" />
          <span>Enquiry Desk</span>
        </Link>
      ) : null}

      <Link href="/" className="modx-nav-link">
        <ExternalLink size={15} aria-hidden="true" />
        <span>Public Website</span>
      </Link>
    </div>
  )
}
