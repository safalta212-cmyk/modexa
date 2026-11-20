'use client'

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

import type { ContactEnquiry } from '@/payload-types'

type EnquiryStatus = ContactEnquiry['enquiryStatus']
type StatusFilter = 'all' | EnquiryStatus

const STATUS_OPTIONS: Array<{ value: EnquiryStatus; label: string }> = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
]

const STATUS_LABEL_MAP: Record<EnquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  'in-progress': 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
}

function formatDateTime(iso?: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export interface EnquiryManagerClientProps {
  initialDocs: ContactEnquiry[]
  initialTotalDocs: number
  initialTotalPages: number
  initialStatusFilter?: StatusFilter
}

export function EnquiryManagerClient({
  initialDocs,
  initialTotalDocs,
  initialTotalPages,
  initialStatusFilter = 'all',
}: EnquiryManagerClientProps) {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>(initialDocs)
  const [totalDocs, setTotalDocs] = useState(initialTotalDocs)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [page, setPage] = useState(1)

  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatusFilter)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null)
  const [editStatus, setEditStatus] = useState<EnquiryStatus>('new')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<ContactEnquiry | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchEnquiries = useCallback(
    async (targetPage: number, filter: StatusFilter, search: string) => {
      setLoading(true)
      setErrorMsg(null)

      try {
        const params = new URLSearchParams()
        params.set('sort', '-submissionDate')
        params.set('limit', '20')
        params.set('page', String(targetPage))
        params.set('depth', '0')

        if (filter !== 'all') {
          params.set('where[enquiryStatus][equals]', filter)
        }

        if (search) {
          params.set('where[or][0][fullName][contains]', search)
          params.set('where[or][1][email][contains]', search)
        }

        const res = await fetch(`/api/contact-enquiries?${params.toString()}`, {
          credentials: 'include',
        })

        const json = (await res.json().catch(() => null)) as {
          docs?: ContactEnquiry[]
          totalDocs?: number
          totalPages?: number
          errors?: Array<{ message?: string }>
        } | null

        if (!res.ok) {
          throw new Error(
            json?.errors?.[0]?.message || 'Failed to load enquiries from Payload API.'
          )
        }

        setEnquiries(json?.docs ?? [])
        setTotalDocs(json?.totalDocs ?? 0)
        setTotalPages(Math.max(1, json?.totalPages ?? 1))
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Unable to fetch customer enquiries.')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const [hasInitialized, setHasInitialized] = useState(false)
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true)
      return
    }
    void fetchEnquiries(page, statusFilter, debouncedSearch)
  }, [page, statusFilter, debouncedSearch, fetchEnquiries, hasInitialized])

  useEffect(() => {
    if (!deleteTarget && !selectedEnquiry) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (deleteTarget && !deleting) {
        setDeleteTarget(null)
        return
      }
      if (selectedEnquiry && !saving) {
        setSelectedEnquiry(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [deleteTarget, deleting, selectedEnquiry, saving])

  const openInspector = (item: ContactEnquiry) => {
    setSelectedEnquiry(item)
    setEditStatus(item.enquiryStatus)
    setEditNotes(item.internalNotes || '')
    setErrorMsg(null)
    setSuccessMsg(null)
  }

  const handleSaveEnquiry = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedEnquiry || saving) return

    setSaving(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch(`/api/contact-enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enquiryStatus: editStatus,
          internalNotes: editNotes,
        }),
      })

      const json = (await res.json().catch(() => null)) as {
        doc?: ContactEnquiry
        errors?: Array<{ message?: string }>
      } | null

      if (!res.ok || !json?.doc) {
        throw new Error(json?.errors?.[0]?.message || 'Failed to update enquiry record.')
      }

      const updated = json.doc
      setEnquiries((prev) => prev.map((row) => (row.id === updated.id ? updated : row)))
      setSelectedEnquiry(updated)
      setSuccessMsg(`Updated enquiry status for ${updated.fullName} to "${STATUS_LABEL_MAP[updated.enquiryStatus]}".`)
      void fetchEnquiries(page, statusFilter, debouncedSearch)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to update enquiry.')
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget || deleting) return

    setDeleting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch(`/api/contact-enquiries/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) {
        const json = (await res.json().catch(() => null)) as {
          errors?: Array<{ message?: string }>
        } | null
        throw new Error(json?.errors?.[0]?.message || 'Failed to delete enquiry.')
      }

      if (selectedEnquiry?.id === deleteTarget.id) {
        setSelectedEnquiry(null)
      }

      const deletedName = deleteTarget.fullName
      setDeleteTarget(null)
      setSuccessMsg(`Deleted enquiry from ${deletedName}.`)
      void fetchEnquiries(page, statusFilter, debouncedSearch)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to delete enquiry.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="modx-admin-panel">
      <div className="modx-admin-hero">
        <div>
          <p className="modx-admin-eyebrow">Customer Management · Live MongoDB</p>
          <h1 className="modx-admin-heading">Enquiry Desk</h1>
          <p className="modx-admin-subtitle">
            Search enquiries by customer name or email, filter by pipeline status, update internal
            notes, and manage lead progression.
          </p>
        </div>

        <div className="modx-admin-actions">
          <button
            type="button"
            className="modx-btn modx-btn--secondary"
            disabled={loading}
            onClick={() => void fetchEnquiries(page, statusFilter, debouncedSearch)}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
            <span>Refresh ({totalDocs})</span>
          </button>
        </div>
      </div>

      {errorMsg ? (
        <div className="modx-alert modx-alert--error" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      {successMsg ? (
        <div className="modx-alert modx-alert--success" role="status">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      ) : null}

      <div className="modx-card">
        <div className="modx-toolbar">
          <div className="modx-search-box">
            <Search size={15} className="modx-search-icon" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search enquiries by customer name or email"
              placeholder="Search by customer name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="modx-input modx-input--with-icon"
            />
          </div>

          <div className="modx-filter-tabs" role="tablist" aria-label="Filter by enquiry status">
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'all'}
              onClick={() => {
                setStatusFilter('all')
                setPage(1)
              }}
              className={`modx-filter-tab ${
                statusFilter === 'all' ? 'modx-filter-tab--active' : ''
              }`}
            >
              All
            </button>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={statusFilter === opt.value}
                onClick={() => {
                  setStatusFilter(opt.value)
                  setPage(1)
                }}
                className={`modx-filter-tab ${
                  statusFilter === opt.value ? 'modx-filter-tab--active' : ''
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading && enquiries.length === 0 ? (
          <div className="modx-empty-state">
            <Loader2 size={18} style={{ display: 'inline', marginRight: 8 }} aria-hidden="true" />
            Loading customer enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="modx-empty-state">
            No enquiries match your current search or status filter.
          </div>
        ) : (
          <div className="modx-table-wrap">
            <table className="modx-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone &amp; Company</th>
                  <th>Service &amp; Budget</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>{item.fullName}</div>
                      <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{item.email}</div>
                    </td>
                    <td>
                      <div>{item.phone}</div>
                      <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
                        {item.company || 'Independent'}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: '#ffffff' }}>{item.requestedService}</div>
                      <div style={{ fontSize: '12px', color: '#a1a1aa' }}>
                        {item.budget || 'Not specified'}
                      </div>
                    </td>
                    <td>
                      <span className={`modx-status-pill modx-status-pill--${item.enquiryStatus}`}>
                        {STATUS_LABEL_MAP[item.enquiryStatus] || item.enquiryStatus}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {formatDateTime(item.submissionDate)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={() => openInspector(item)}
                          className="modx-btn modx-btn--secondary modx-btn--sm"
                        >
                          <Eye size={13} aria-hidden="true" />
                          <span>Inspect</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="modx-btn modx-btn--danger modx-btn--sm"
                          aria-label={`Delete enquiry from ${item.fullName}`}
                        >
                          <Trash2 size={13} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 ? (
          <div className="modx-card-header">
            <span style={{ fontSize: '12px', color: '#a1a1aa' }}>
              Page {page} of {totalPages} · {totalDocs} total
            </span>
            <div className="modx-admin-actions">
              <button
                type="button"
                className="modx-btn modx-btn--secondary modx-btn--sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button
                type="button"
                className="modx-btn modx-btn--secondary modx-btn--sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {selectedEnquiry ? (
        <div
          className="modx-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-detail-title"
        >
          <div className="modx-modal">
            <div className="modx-card-header">
              <div>
                <p className="modx-admin-eyebrow">Enquiry Record · {selectedEnquiry.id}</p>
                <h2 id="enquiry-detail-title" className="modx-card-title" style={{ fontSize: 20 }}>
                  {selectedEnquiry.fullName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="modx-btn modx-btn--secondary modx-btn--sm"
                aria-label="Close enquiry details"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            <div className="modx-detail-grid">
              <div className="modx-detail-item">
                <span className="modx-detail-label">Email Address</span>
                <span className="modx-detail-value">{selectedEnquiry.email}</span>
              </div>
              <div className="modx-detail-item">
                <span className="modx-detail-label">Phone Number</span>
                <span className="modx-detail-value">{selectedEnquiry.phone}</span>
              </div>
              <div className="modx-detail-item">
                <span className="modx-detail-label">Company</span>
                <span className="modx-detail-value">{selectedEnquiry.company || 'Not provided'}</span>
              </div>
              <div className="modx-detail-item">
                <span className="modx-detail-label">Requested Service</span>
                <span className="modx-detail-value">{selectedEnquiry.requestedService}</span>
              </div>
              <div className="modx-detail-item">
                <span className="modx-detail-label">Estimated Budget</span>
                <span className="modx-detail-value">{selectedEnquiry.budget || 'Not specified'}</span>
              </div>
              <div className="modx-detail-item">
                <span className="modx-detail-label">Submitted At</span>
                <span className="modx-detail-value">
                  {formatDateTime(selectedEnquiry.submissionDate)}
                </span>
              </div>
            </div>

            <div className="modx-detail-item">
              <span className="modx-detail-label">Project Details / Message</span>
              <div
                style={{
                  backgroundColor: '#08080c',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '10px',
                  padding: '13px',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  color: '#e4e4e7',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedEnquiry.message}
              </div>
            </div>

            <form onSubmit={handleSaveEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="modx-detail-item">
                <label htmlFor="enquiry-status-select" className="modx-detail-label">
                  Enquiry Status
                </label>
                <select
                  id="enquiry-status-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as EnquiryStatus)}
                  className="modx-select"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modx-detail-item">
                <label htmlFor="enquiry-internal-notes" className="modx-detail-label">
                  Internal Notes (Admin Only)
                </label>
                <textarea
                  id="enquiry-internal-notes"
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add call notes, proposal links, or follow-up dates..."
                  className="modx-textarea"
                />
              </div>

              <div className="modx-card-header">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selectedEnquiry)}
                  className="modx-btn modx-btn--danger modx-btn--sm"
                >
                  <Trash2 size={14} aria-hidden="true" />
                  <span>Delete Enquiry</span>
                </button>

                <div className="modx-admin-actions">
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(null)}
                    className="modx-btn modx-btn--secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="modx-btn modx-btn--primary">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div
          className="modx-modal-backdrop"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div className="modx-modal modx-modal--sm">
            <h2 id="confirm-delete-title" className="modx-card-title" style={{ fontSize: 18 }}>
              Confirm Enquiry Deletion
            </h2>
            <p className="modx-admin-subtitle">
              Are you sure you want to permanently delete the enquiry from{' '}
              <strong style={{ color: '#ffffff' }}>{deleteTarget.fullName}</strong> (
              {deleteTarget.email})? This action cannot be undone.
            </p>
            <div className="modx-card-header" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="modx-btn modx-btn--secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleConfirmDelete()}
                className="modx-btn modx-btn--danger"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
