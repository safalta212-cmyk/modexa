import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Inbox,
  MessageSquareQuote,
  Plus,
  Shield,
  Sparkles,
  Users as UsersIcon,
} from 'lucide-react'
import Link from 'next/link'
import type { Payload, TypedUser } from 'payload'
import React from 'react'

import { hasAdminRole } from '@/access'
import type { ContactEnquiry } from '@/payload-types'

interface DashboardOverviewProps {
  payload: Payload
  user?: (TypedUser & { name?: string | null; role?: string | null }) | null
}

function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const STATUS_LABELS: Record<ContactEnquiry['enquiryStatus'], string> = {
  new: 'New',
  contacted: 'Contacted',
  'in-progress': 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
}

export async function DashboardOverview({ payload, user }: DashboardOverviewProps) {
  const isAdmin = hasAdminRole(user as { role?: string | null } | null)
  const displayName =
    (user as { name?: string | null } | null)?.name?.trim() ||
    user?.email ||
    'Team Member'

  let loadError: string | null = null

  let totalServices = 0
  let publishedServices = 0
  let totalProjects = 0
  let publishedProjects = 0
  let totalBlogPosts = 0
  let publishedBlogPosts = 0
  let totalTestimonials = 0
  let publishedTestimonials = 0
  let totalMedia = 0

  let totalEnquiries = 0
  let newEnquiries = 0
  let inProgressEnquiries = 0
  let completedEnquiries = 0
  let recentEnquiries: ContactEnquiry[] = []

  try {
    const baseQueries = await Promise.all([
      payload.count({ collection: 'services', overrideAccess: false, user: user ?? undefined }),
      payload.count({
        collection: 'services',
        where: { status: { equals: 'published' } },
        overrideAccess: false,
        user: user ?? undefined,
      }),
      payload.count({ collection: 'projects', overrideAccess: false, user: user ?? undefined }),
      payload.count({
        collection: 'projects',
        where: { status: { equals: 'published' } },
        overrideAccess: false,
        user: user ?? undefined,
      }),
      payload.count({ collection: 'blog-posts', overrideAccess: false, user: user ?? undefined }),
      payload.count({
        collection: 'blog-posts',
        where: { status: { equals: 'published' } },
        overrideAccess: false,
        user: user ?? undefined,
      }),
      payload.count({ collection: 'testimonials', overrideAccess: false, user: user ?? undefined }),
      payload.count({
        collection: 'testimonials',
        where: { status: { equals: 'published' } },
        overrideAccess: false,
        user: user ?? undefined,
      }),
      payload.count({ collection: 'media', overrideAccess: false, user: user ?? undefined }),
    ])

    totalServices = baseQueries[0].totalDocs
    publishedServices = baseQueries[1].totalDocs
    totalProjects = baseQueries[2].totalDocs
    publishedProjects = baseQueries[3].totalDocs
    totalBlogPosts = baseQueries[4].totalDocs
    publishedBlogPosts = baseQueries[5].totalDocs
    totalTestimonials = baseQueries[6].totalDocs
    publishedTestimonials = baseQueries[7].totalDocs
    totalMedia = baseQueries[8].totalDocs

    if (isAdmin) {
      const enquiryQueries = await Promise.all([
        payload.count({
          collection: 'contact-enquiries',
          overrideAccess: false,
          user: user ?? undefined,
        }),
        payload.count({
          collection: 'contact-enquiries',
          where: { enquiryStatus: { equals: 'new' } },
          overrideAccess: false,
          user: user ?? undefined,
        }),
        payload.count({
          collection: 'contact-enquiries',
          where: { enquiryStatus: { equals: 'in-progress' } },
          overrideAccess: false,
          user: user ?? undefined,
        }),
        payload.count({
          collection: 'contact-enquiries',
          where: { enquiryStatus: { equals: 'completed' } },
          overrideAccess: false,
          user: user ?? undefined,
        }),
        payload.find({
          collection: 'contact-enquiries',
          sort: '-submissionDate',
          limit: 5,
          depth: 0,
          overrideAccess: false,
          user: user ?? undefined,
        }),
      ])

      totalEnquiries = enquiryQueries[0].totalDocs
      newEnquiries = enquiryQueries[1].totalDocs
      inProgressEnquiries = enquiryQueries[2].totalDocs
      completedEnquiries = enquiryQueries[3].totalDocs
      recentEnquiries = enquiryQueries[4].docs as ContactEnquiry[]
    }
  } catch {
    loadError =
      'Unable to load live CMS metrics right now. Verify your MongoDB connection and reload.'
  }

  return (
    <section className="modx-admin-panel" aria-label="MODX 2.0 Agency Dashboard">
      <div className="modx-admin-hero">
        <div>
          <p className="modx-admin-eyebrow">MODX 2.0 · Agency Command Center</p>
          <h1 className="modx-admin-heading">Welcome back, {displayName}</h1>
          <p className="modx-admin-subtitle">
            Manage services, portfolio projects, blog publications, testimonials, media assets,
            {isAdmin ? ' customer enquiries, and team access' : ' and editorial content'} from real
            MongoDB records.
          </p>
        </div>

        <div className="modx-admin-actions">
          <span className="modx-role-badge">
            <Shield size={13} aria-hidden="true" />
            <span>{isAdmin ? 'Administrator' : 'Editor'}</span>
          </span>

          {isAdmin ? (
            <Link href="/admin/enquiries" className="modx-btn modx-btn--primary">
              <Inbox size={15} aria-hidden="true" />
              <span>Open Enquiry Desk</span>
            </Link>
          ) : null}

          <Link href="/admin/collections/services/create" className="modx-btn modx-btn--secondary">
            <Plus size={14} aria-hidden="true" />
            <span>New Service</span>
          </Link>

          <Link href="/admin/collections/projects/create" className="modx-btn modx-btn--secondary">
            <Plus size={14} aria-hidden="true" />
            <span>New Project</span>
          </Link>

          <Link
            href="/admin/collections/blog-posts/create"
            className="modx-btn modx-btn--secondary"
          >
            <Plus size={14} aria-hidden="true" />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      {loadError ? (
        <div className="modx-alert modx-alert--error" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{loadError}</span>
        </div>
      ) : null}

      {isAdmin ? (
        <div className="modx-stats-grid" aria-label="Enquiry Pipeline Statistics">
          <Link href="/admin/enquiries" className="modx-stat-card">
            <div className="modx-stat-top">
              <span className="modx-stat-label">Total Enquiries</span>
              <span className="modx-stat-icon">
                <Inbox size={16} aria-hidden="true" />
              </span>
            </div>
            <div className="modx-stat-value">{totalEnquiries}</div>
            <span className="modx-stat-meta">All customer submissions</span>
          </Link>

          <Link href="/admin/enquiries?status=new" className="modx-stat-card">
            <div className="modx-stat-top">
              <span className="modx-stat-label">New Enquiries</span>
              <span className="modx-stat-icon">
                <Sparkles size={16} aria-hidden="true" />
              </span>
            </div>
            <div className="modx-stat-value">{newEnquiries}</div>
            <span className="modx-stat-meta">Awaiting first response</span>
          </Link>

          <Link href="/admin/enquiries?status=in-progress" className="modx-stat-card">
            <div className="modx-stat-top">
              <span className="modx-stat-label">In Progress Enquiries</span>
              <span className="modx-stat-icon">
                <Clock size={16} aria-hidden="true" />
              </span>
            </div>
            <div className="modx-stat-value">{inProgressEnquiries}</div>
            <span className="modx-stat-meta">Active client discovery</span>
          </Link>

          <Link href="/admin/enquiries?status=completed" className="modx-stat-card">
            <div className="modx-stat-top">
              <span className="modx-stat-label">Completed Enquiries</span>
              <span className="modx-stat-icon">
                <CheckCircle2 size={16} aria-hidden="true" />
              </span>
            </div>
            <div className="modx-stat-value">{completedEnquiries}</div>
            <span className="modx-stat-meta">Closed &amp; fulfilled</span>
          </Link>
        </div>
      ) : (
        <div className="modx-alert modx-alert--info" role="status">
          <Shield size={16} aria-hidden="true" />
          <span>
            You are signed in with <strong>Editor</strong> permissions. You can create and manage
            Services, Projects, Blog Posts, Categories, Testimonials, and Media. Customer
            enquiries and user administration are restricted to Administrators.
          </span>
        </div>
      )}

      <div className="modx-stats-grid" aria-label="Content Statistics">
        <Link href="/admin/collections/services" className="modx-stat-card">
          <div className="modx-stat-top">
            <span className="modx-stat-label">Total Services</span>
            <span className="modx-stat-icon">
              <Briefcase size={16} aria-hidden="true" />
            </span>
          </div>
          <div className="modx-stat-value">{totalServices}</div>
          <span className="modx-stat-meta">{publishedServices} published</span>
        </Link>

        <Link href="/admin/collections/projects" className="modx-stat-card">
          <div className="modx-stat-top">
            <span className="modx-stat-label">Total Projects</span>
            <span className="modx-stat-icon">
              <FolderKanban size={16} aria-hidden="true" />
            </span>
          </div>
          <div className="modx-stat-value">{totalProjects}</div>
          <span className="modx-stat-meta">{publishedProjects} published</span>
        </Link>

        <Link href="/admin/collections/blog-posts" className="modx-stat-card">
          <div className="modx-stat-top">
            <span className="modx-stat-label">Total Blog Posts</span>
            <span className="modx-stat-icon">
              <FileText size={16} aria-hidden="true" />
            </span>
          </div>
          <div className="modx-stat-value">{totalBlogPosts}</div>
          <span className="modx-stat-meta">{publishedBlogPosts} published</span>
        </Link>

        <Link href="/admin/collections/testimonials" className="modx-stat-card">
          <div className="modx-stat-top">
            <span className="modx-stat-label">Total Testimonials</span>
            <span className="modx-stat-icon">
              <MessageSquareQuote size={16} aria-hidden="true" />
            </span>
          </div>
          <div className="modx-stat-value">{totalTestimonials}</div>
          <span className="modx-stat-meta">{publishedTestimonials} published</span>
        </Link>
      </div>

      {isAdmin ? (
        <div className="modx-card">
          <div className="modx-card-header">
            <h2 className="modx-card-title">Recent Customer Enquiries</h2>
            <div className="modx-admin-actions">
              <Link href="/admin/collections/media" className="modx-btn modx-btn--secondary modx-btn--sm">
                <ImageIcon size={13} aria-hidden="true" />
                <span>Media ({totalMedia})</span>
              </Link>
              <Link href="/admin/collections/users" className="modx-btn modx-btn--secondary modx-btn--sm">
                <UsersIcon size={13} aria-hidden="true" />
                <span>Manage Users</span>
              </Link>
              <Link href="/admin/enquiries" className="modx-btn modx-btn--primary modx-btn--sm">
                <span>Manage All Enquiries</span>
              </Link>
            </div>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="modx-empty-state">
              No customer enquiries have been submitted yet. New enquiries from the public Contact
              Us page will appear here automatically.
            </div>
          ) : (
            <div className="modx-table-wrap">
              <table className="modx-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnquiries.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>{item.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{item.email}</div>
                      </td>
                      <td>{item.requestedService}</td>
                      <td>{item.budget || 'Not specified'}</td>
                      <td>
                        <span className={`modx-status-pill modx-status-pill--${item.enquiryStatus}`}>
                          {STATUS_LABELS[item.enquiryStatus] || item.enquiryStatus}
                        </span>
                      </td>
                      <td>{formatDate(item.submissionDate)}</td>
                      <td>
                        <Link
                          href={`/admin/collections/contact-enquiries/${item.id}`}
                          className="modx-btn modx-btn--secondary modx-btn--sm"
                        >
                          Open Record
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}
