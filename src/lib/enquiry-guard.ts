import crypto from 'crypto'
import type { NextRequest } from 'next/server'

const RATE_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5
const MIN_COOLDOWN_MS = 4 * 1000 // 4 seconds between attempts from same IP
const DUPLICATE_TTL_MS = 10 * 60 * 1000 // 10 minutes
const MAX_CACHE_ENTRIES = 2000

const ipHits = new Map<string, number[]>()
const recentFingerprints = new Map<string, number>()

function pruneExpiredEntries(now: number) {
  if (ipHits.size > MAX_CACHE_ENTRIES) {
    for (const [ip, timestamps] of ipHits.entries()) {
      const valid = timestamps.filter((ts) => now - ts < RATE_WINDOW_MS)
      if (valid.length === 0) {
        ipHits.delete(ip)
      } else {
        ipHits.set(ip, valid)
      }
    }
  }

  if (recentFingerprints.size > MAX_CACHE_ENTRIES) {
    for (const [fp, ts] of recentFingerprints.entries()) {
      if (now - ts >= DUPLICATE_TTL_MS) {
        recentFingerprints.delete(fp)
      }
    }
  }
}

export function extractClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = req.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  return 'unknown'
}

export function checkEnquiryRateLimit(ip: string): {
  allowed: true
} | {
  allowed: false
  retryAfterSeconds: number
  reason: string
} {
  const now = Date.now()
  pruneExpiredEntries(now)

  const existing = (ipHits.get(ip) ?? []).filter((ts) => now - ts < RATE_WINDOW_MS)

  const latest = existing[existing.length - 1]
  if (latest && now - latest < MIN_COOLDOWN_MS) {
    const waitSeconds = Math.max(1, Math.ceil((MIN_COOLDOWN_MS - (now - latest)) / 1000))
    return {
      allowed: false,
      retryAfterSeconds: waitSeconds,
      reason: 'Please wait a moment before submitting another enquiry.',
    }
  }

  if (existing.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = existing[0] ?? now
    const retryAfterSeconds = Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000))
    return {
      allowed: false,
      retryAfterSeconds,
      reason: 'Too many enquiries submitted recently. Please try again in a few minutes.',
    }
  }

  existing.push(now)
  ipHits.set(ip, existing)
  return { allowed: true }
}

export function computeEnquiryFingerprint(input: {
  email: string
  requestedService: string
  message: string
}): string {
  const normalized = [
    input.email.trim().toLowerCase(),
    input.requestedService.trim().toLowerCase(),
    input.message.replace(/\s+/g, ' ').trim().toLowerCase(),
  ].join('|')

  return crypto.createHash('sha256').update(normalized).digest('hex')
}

export function isRecentInMemoryDuplicate(fingerprint: string): boolean {
  const now = Date.now()
  const ts = recentFingerprints.get(fingerprint)
  if (!ts) return false
  if (now - ts < DUPLICATE_TTL_MS) {
    return true
  }
  recentFingerprints.delete(fingerprint)
  return false
}

export function recordInMemoryFingerprint(fingerprint: string): void {
  recentFingerprints.set(fingerprint, Date.now())
}
