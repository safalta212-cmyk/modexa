'use client'

import { AlertCircle, CheckCircle2, Loader2, RotateCcw, Send } from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { AGENCY_SERVICES } from '@/data/services'
import {
  BUDGET_OPTIONS,
  type ContactValidationErrors,
  validateContactInput,
} from '@/lib/contact-validation'

interface ContactFormValues {
  fullName: string
  email: string
  phone: string
  company: string
  requestedService: string
  budget: string
  message: string
  privacyConsent: boolean
  website: string
}

interface SubmittedReceipt {
  id: string
  fullName: string
  email: string
  requestedService: string
  budget?: string
  submissionDate: string
  customerConfirmed: boolean
}

export interface ContactServiceOption {
  slug: string
  title: string
}

export function ContactForm({
  initialService = '',
  serviceOptions,
}: {
  initialService?: string
  serviceOptions?: ContactServiceOption[]
}) {
  const availableServices =
    serviceOptions && serviceOptions.length > 0
      ? serviceOptions
      : AGENCY_SERVICES.map((s) => ({ slug: s.slug, title: s.title }))

  const matchedInitialService =
    availableServices.find(
      (s) => s.title === initialService || s.slug === initialService
    )?.title ?? ''

  const [values, setValues] = useState<ContactFormValues>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    requestedService: matchedInitialService,
    budget: '',
    message: '',
    privacyConsent: false,
    website: '',
  })

  const [errors, setErrors] = useState<ContactValidationErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [receipt, setReceipt] = useState<SubmittedReceipt | null>(null)

  const handleFieldChange = <K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (field !== 'website' && errors[field as keyof ContactValidationErrors]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field as keyof ContactValidationErrors]
        return next
      })
    }
    if (submitError) {
      setSubmitError(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    setSubmitError(null)

    const clientCheck = validateContactInput({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      company: values.company,
      requestedService: values.requestedService,
      budget: values.budget,
      message: values.message,
      privacyConsent: values.privacyConsent,
      website: values.website,
    })

    if (!clientCheck.ok) {
      setErrors(clientCheck.errors)
      setSubmitError(clientCheck.message)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: clientCheck.data.fullName,
          email: clientCheck.data.email,
          phone: clientCheck.data.phone,
          company: clientCheck.data.company,
          requestedService: clientCheck.data.requestedService,
          budget: clientCheck.data.budget,
          message: clientCheck.data.message,
          privacyConsent: clientCheck.data.privacyConsent,
          website: values.website,
        }),
      })

      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean
        id?: string
        message?: string
        errors?: ContactValidationErrors
        enquiry?: {
          fullName?: string
          email?: string
          requestedService?: string
          budget?: string
          submissionDate?: string
        }
        notification?: {
          customerConfirmed?: boolean
        }
      } | null

      if (!response.ok || !payload?.ok) {
        if (payload?.errors) {
          setErrors(payload.errors)
        }
        setSubmitError(
          payload?.message || 'Unable to submit your enquiry right now. Please try again.'
        )
        return
      }

      setReceipt({
        id: payload.id || '',
        fullName: payload.enquiry?.fullName || clientCheck.data.fullName,
        email: payload.enquiry?.email || clientCheck.data.email,
        requestedService:
          payload.enquiry?.requestedService || clientCheck.data.requestedService,
        budget: payload.enquiry?.budget || clientCheck.data.budget || undefined,
        submissionDate: payload.enquiry?.submissionDate || new Date().toISOString(),
        customerConfirmed: Boolean(payload.notification?.customerConfirmed),
      })
    } catch {
      setSubmitError(
        'Network error while sending your enquiry. Please check your connection and try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setReceipt(null)
    setSubmitError(null)
    setErrors({})
    setValues({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      requestedService: matchedInitialService,
      budget: '',
      message: '',
      privacyConsent: false,
      website: '',
    })
  }

  if (receipt) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-modx-accent/40 bg-modx-surface p-8 sm:p-10 space-y-6"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-modx-accent/15 text-modx-accent-light">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Enquiry Received</h3>
          <p className="text-sm text-modx-muted leading-relaxed">
            Thank you, <span className="text-white font-medium">{receipt.fullName}</span>. Your
            project details for{' '}
            <span className="text-modx-accent-light font-medium">{receipt.requestedService}</span>{' '}
            have been saved for our studio team.
          </p>
          {receipt.customerConfirmed ? (
            <p className="text-xs text-modx-muted leading-relaxed">
              A confirmation email has been sent to{' '}
              <span className="text-white">{receipt.email}</span>.
            </p>
          ) : null}
        </div>

        <div className="rounded-xl border border-white/10 bg-modx-bg p-4 text-xs space-y-2 text-modx-muted">
          {receipt.id ? (
            <p>
              <span className="text-white font-medium">Reference ID:</span>{' '}
              <span className="font-mono text-modx-accent-light">{receipt.id}</span>
            </p>
          ) : null}
          <p>
            <span className="text-white font-medium">Email:</span> {receipt.email}
          </p>
          <p>
            <span className="text-white font-medium">Service:</span> {receipt.requestedService}
          </p>
          {receipt.budget ? (
            <p>
              <span className="text-white font-medium">Estimated Budget:</span> {receipt.budget}
            </p>
          ) : null}
        </div>

        <Button type="button" variant="outline" size="md" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Submit Another Inquiry</span>
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-white/10 bg-modx-surface p-6 sm:p-8 space-y-6"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white">Start a conversation</h2>
        <p className="text-sm text-modx-muted">
          Share your goals and timeline. Fields marked with * are required.
        </p>
      </div>

      {submitError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-200"
        >
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      ) : null}

      {/* Honeypot field for automated spam filtering */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => handleFieldChange('website', e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-name" className="block text-xs font-semibold text-white">
            Full Name *
          </label>
          <input
            id="contact-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            disabled={isSubmitting}
            value={values.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'contact-name-error' : undefined}
            className={`w-full rounded-lg border bg-modx-bg px-4 py-3 text-sm text-white placeholder:text-modx-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-modx-accent-light transition-colors disabled:opacity-60 ${
              errors.fullName
                ? 'border-rose-400 focus:border-rose-400'
                : 'border-white/15 focus:border-modx-accent'
            }`}
          />
          {errors.fullName ? (
            <p id="contact-name-error" role="alert" className="text-xs text-rose-400">
              {errors.fullName}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className="block text-xs font-semibold text-white">
            Email Address *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            disabled={isSubmitting}
            value={values.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={`w-full rounded-lg border bg-modx-bg px-4 py-3 text-sm text-white placeholder:text-modx-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-modx-accent-light transition-colors disabled:opacity-60 ${
              errors.email
                ? 'border-rose-400 focus:border-rose-400'
                : 'border-white/15 focus:border-modx-accent'
            }`}
          />
          {errors.email ? (
            <p id="contact-email-error" role="alert" className="text-xs text-rose-400">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-phone" className="block text-xs font-semibold text-white">
            Phone Number *
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            disabled={isSubmitting}
            value={values.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            className={`w-full rounded-lg border bg-modx-bg px-4 py-3 text-sm text-white placeholder:text-modx-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-modx-accent-light transition-colors disabled:opacity-60 ${
              errors.phone
                ? 'border-rose-400 focus:border-rose-400'
                : 'border-white/15 focus:border-modx-accent'
            }`}
          />
          {errors.phone ? (
            <p id="contact-phone-error" role="alert" className="text-xs text-rose-400">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-company" className="block text-xs font-semibold text-white">
            Company Name <span className="text-modx-muted font-normal">(Optional)</span>
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Your company or brand"
            disabled={isSubmitting}
            value={values.company}
            onChange={(e) => handleFieldChange('company', e.target.value)}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? 'contact-company-error' : undefined}
            className={`w-full rounded-lg border bg-modx-bg px-4 py-3 text-sm text-white placeholder:text-modx-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-modx-accent-light transition-colors disabled:opacity-60 ${
              errors.company
                ? 'border-rose-400 focus:border-rose-400'
                : 'border-white/15 focus:border-modx-accent'
            }`}
          />
          {errors.company ? (
            <p id="contact-company-error" role="alert" className="text-xs text-rose-400">
              {errors.company}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="contact-service" className="block text-xs font-semibold text-white">
            Service Interested In *
          </label>
          <select
            id="contact-service"
            name="requestedService"
            disabled={isSubmitting}
            value={values.requestedService}
            onChange={(e) => handleFieldChange('requestedService', e.target.value)}
            aria-invalid={Boolean(errors.requestedService)}
            aria-describedby={errors.requestedService ? 'contact-service-error' : undefined}
            className={`w-full rounded-lg border bg-modx-bg px-4 py-3 text-sm text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-modx-accent-light transition-colors disabled:opacity-60 ${
              errors.requestedService
                ? 'border-rose-400 focus:border-rose-400'
                : 'border-white/15 focus:border-modx-accent'
            }`}
          >
            <option value="">Select a service...</option>
            {availableServices.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.requestedService ? (
            <p id="contact-service-error" role="alert" className="text-xs text-rose-400">
              {errors.requestedService}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-budget" className="block text-xs font-semibold text-white">
            Estimated Budget <span className="text-modx-muted font-normal">(Optional)</span>
          </label>
          <select
            id="contact-budget"
            name="budget"
            disabled={isSubmitting}
            value={values.budget}
            onChange={(e) => handleFieldChange('budget', e.target.value)}
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? 'contact-budget-error' : undefined}
            className={`w-full rounded-lg border bg-modx-bg px-4 py-3 text-sm text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-modx-accent-light transition-colors disabled:opacity-60 ${
              errors.budget
                ? 'border-rose-400 focus:border-rose-400'
                : 'border-white/15 focus:border-modx-accent'
            }`}
          >
            <option value="">Select a budget range...</option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.budget ? (
            <p id="contact-budget-error" role="alert" className="text-xs text-rose-400">
              {errors.budget}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="block text-xs font-semibold text-white">
          Project Details / Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell us about your brand, current bottlenecks, and growth objectives..."
          disabled={isSubmitting}
          value={values.message}
          onChange={(e) => handleFieldChange('message', e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`w-full rounded-lg border bg-modx-bg px-4 py-3 text-sm text-white placeholder:text-modx-muted/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-modx-accent-light transition-colors disabled:opacity-60 ${
            errors.message
              ? 'border-rose-400 focus:border-rose-400'
              : 'border-white/15 focus:border-modx-accent'
          }`}
        />
        {errors.message ? (
          <p id="contact-message-error" role="alert" className="text-xs text-rose-400">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contact-consent"
          className="flex items-start gap-3 text-xs sm:text-sm text-modx-muted cursor-pointer select-none"
        >
          <input
            id="contact-consent"
            name="privacyConsent"
            type="checkbox"
            disabled={isSubmitting}
            checked={values.privacyConsent}
            onChange={(e) => handleFieldChange('privacyConsent', e.target.checked)}
            aria-invalid={Boolean(errors.privacyConsent)}
            aria-describedby={errors.privacyConsent ? 'contact-consent-error' : undefined}
            className="mt-1 h-4 w-4 rounded border border-white/25 bg-modx-bg accent-modx-accent shrink-0 cursor-pointer"
          />
          <span className="leading-relaxed">
            I agree to Modexa Digital Agency processing my enquiry details to respond to this
            request in accordance with our privacy policy. *
          </span>
        </label>
        {errors.privacyConsent ? (
          <p id="contact-consent-error" role="alert" className="text-xs text-rose-400 pl-7">
            {errors.privacyConsent}
          </p>
        ) : null}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-xs text-modx-muted">
          Protected submission · Your details remain confidential.
        </p>
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <span>Submit Enquiry</span>
              <Send className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
