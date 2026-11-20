import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, HydrateAuthProvider, SetStepNav } from '@payloadcms/ui'
import { Shield } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { hasAdminRole } from '@/access'
import type { ContactEnquiry } from '@/payload-types'
import { EnquiryManagerClient } from './EnquiryManagerClient'

const VALID_STATUSES = new Set<ContactEnquiry['enquiryStatus']>([
  'new',
  'contacted',
  'in-progress',
  'completed',
  'rejected',
])

export async function EnquiriesView(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props
  const { locale, permissions, req, visibleEntities } = initPageResult
  const user = req.user

  if (!user) {
    redirect('/admin/login')
  }

  const isAdmin = hasAdminRole(user as { role?: string | null } | null)
  const rawStatus =
    typeof searchParams?.status === 'string' ? searchParams.status : 'all'
  const initialStatusFilter = VALID_STATUSES.has(
    rawStatus as ContactEnquiry['enquiryStatus']
  )
    ? (rawStatus as ContactEnquiry['enquiryStatus'])
    : 'all'

  let initialDocs: ContactEnquiry[] = []
  let initialTotalDocs = 0
  let initialTotalPages = 1

  if (isAdmin) {
    try {
      const result = await req.payload.find({
        collection: 'contact-enquiries',
        sort: '-submissionDate',
        limit: 20,
        depth: 0,
        overrideAccess: false,
        user,
        ...(initialStatusFilter !== 'all'
          ? {
              where: {
                enquiryStatus: {
                  equals: initialStatusFilter,
                },
              },
            }
          : {}),
      })

      initialDocs = result.docs as ContactEnquiry[]
      initialTotalDocs = result.totalDocs
      initialTotalPages = Math.max(1, result.totalPages)
    } catch {
      initialDocs = []
    }
  }

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={user}
      viewType="dashboard"
      visibleEntities={{
        collections: [...(visibleEntities?.collections || [])],
        globals: [...(visibleEntities?.globals || [])],
      }}
    >
      <HydrateAuthProvider permissions={permissions} />
      <SetStepNav
        nav={[
          {
            label: 'Enquiry Desk',
            url: '/admin/enquiries',
          },
        ]}
      />
      <Gutter>
        {isAdmin ? (
          <EnquiryManagerClient
            initialDocs={initialDocs}
            initialTotalDocs={initialTotalDocs}
            initialTotalPages={initialTotalPages}
            initialStatusFilter={initialStatusFilter}
          />
        ) : (
          <section className="modx-admin-panel">
            <div className="modx-card">
              <div className="modx-alert modx-alert--error" role="alert">
                <Shield size={18} aria-hidden="true" />
                <div>
                  <strong>Administrator Access Required</strong>
                  <p style={{ margin: '6px 0 0 0' }}>
                    Customer enquiry records contain private client details and are restricted to
                    users with the Administrator role.
                  </p>
                </div>
              </div>
              <div>
                <Link href="/admin" className="modx-btn modx-btn--secondary">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </section>
        )}
      </Gutter>
    </DefaultTemplate>
  )
}
