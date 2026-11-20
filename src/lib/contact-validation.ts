export const BUDGET_OPTIONS = [
  'Under $2,500',
  '$2,500 – $5,000',
  '$5,000 – $15,000',
  '$15,000 – $30,000',
  '$30,000+',
  'Flexible / Not Sure Yet',
] as const

export interface ContactSubmissionInput {
  fullName: string
  email: string
  phone: string
  company?: string
  requestedService: string
  budget?: string
  message: string
  privacyConsent: boolean
  website?: string
}

export interface SanitizedContactSubmission {
  fullName: string
  email: string
  phone: string
  company: string
  requestedService: string
  budget: string
  message: string
  privacyConsent: true
}

export type ContactValidationField =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'company'
  | 'requestedService'
  | 'budget'
  | 'message'
  | 'privacyConsent'

export type ContactValidationErrors = Partial<Record<ContactValidationField, string>>

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
const PHONE_ALLOWED_REGEX = /^[+\d()\s.-]+$/

export function sanitizeSingleLine(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

export function sanitizeMultiline(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/\r\n/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength)
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function validateContactInput(raw: Record<string, unknown>): {
  ok: true
  data: SanitizedContactSubmission
} | {
  ok: false
  isBot?: boolean
  errors: ContactValidationErrors
  message: string
} {
  const honeypot = typeof raw.website === 'string' ? raw.website.trim() : ''
  if (honeypot.length > 0) {
    return {
      ok: false,
      isBot: true,
      errors: {},
      message: 'Submission could not be processed.',
    }
  }

  const fullName = sanitizeSingleLine(raw.fullName, 100)
  const email = sanitizeSingleLine(raw.email, 160).toLowerCase()
  const phone = sanitizeSingleLine(raw.phone, 32)
  const company = sanitizeSingleLine(raw.company, 120)
  const requestedService = sanitizeSingleLine(raw.requestedService, 120)
  const budget = sanitizeSingleLine(raw.budget, 80)
  const message = sanitizeMultiline(raw.message, 4000)
  const privacyConsent = raw.privacyConsent === true

  const errors: ContactValidationErrors = {}

  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).'
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  const phoneDigits = phone.replace(/[^\d]/g, '')
  if (
    !phone ||
    !PHONE_ALLOWED_REGEX.test(phone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    errors.phone = 'Please enter a valid phone number (7 to 15 digits).'
  }

  if (!requestedService || requestedService.length < 2) {
    errors.requestedService = 'Please select the service you are interested in.'
  }

  if (!message || message.length < 15) {
    errors.message = 'Please share your project details (at least 15 characters).'
  }

  if (!privacyConsent) {
    errors.privacyConsent = 'Please confirm privacy policy consent before submitting.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      message: 'Please review the highlighted fields and try again.',
    }
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone,
      company,
      requestedService,
      budget,
      message,
      privacyConsent: true,
    },
  }
}
