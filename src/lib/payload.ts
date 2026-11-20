import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

export interface CmsEnvironmentStatus {
  hasMongoUri: boolean
  hasValidMongoScheme: boolean
  hasPayloadSecret: boolean
  hasStrongSecret: boolean
  serverURL: string | null
  missingVars: string[]
  warnings: string[]
  isReady: boolean
}

const PLACEHOLDER_SECRETS = new Set([
  'REPLACE_WITH_SECURE_RANDOM_SECRET',
  'your-secret-here',
  'secret',
  'changeme',
])

export function sanitizeMongoErrorMessage(error: unknown): string {
  const raw =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown MongoDB error'

  return raw.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, 'mongodb$1://<redacted>@')
}

export function getCmsEnvironmentStatus(): CmsEnvironmentStatus {
  const mongoUri = process.env.MONGODB_URI?.trim() || ''
  const payloadSecret = process.env.PAYLOAD_SECRET?.trim() || ''
  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim() || ''
  const serverUrlRaw =
    process.env.NEXT_PUBLIC_SERVER_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    (vercelHost ? `https://${vercelHost}` : '')

  const hasMongoUri = Boolean(mongoUri)
  const hasValidMongoScheme =
    hasMongoUri && (mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://'))

  const hasPayloadSecret = Boolean(payloadSecret) && !PLACEHOLDER_SECRETS.has(payloadSecret)
  const hasStrongSecret = hasPayloadSecret && payloadSecret.length >= 32

  const missingVars: string[] = []
  const warnings: string[] = []

  if (!hasMongoUri) {
    missingVars.push('MONGODB_URI')
  } else if (!hasValidMongoScheme) {
    warnings.push('MONGODB_URI must begin with mongodb:// or mongodb+srv://')
  }

  if (!hasPayloadSecret) {
    missingVars.push('PAYLOAD_SECRET')
  } else if (!hasStrongSecret) {
    warnings.push('PAYLOAD_SECRET should be at least 32 random characters for production security.')
  }

  const serverURL =
    serverUrlRaw && serverUrlRaw !== 'MY_APP_URL' ? serverUrlRaw.replace(/\/+$/, '') : null

  if (!serverURL) {
    warnings.push('NEXT_PUBLIC_SERVER_URL is not set; defaulting to relative server origin.')
  }

  return {
    hasMongoUri,
    hasValidMongoScheme,
    hasPayloadSecret,
    hasStrongSecret,
    serverURL,
    missingVars,
    warnings,
    isReady: hasMongoUri && hasValidMongoScheme && hasPayloadSecret,
  }
}

export async function getPayloadClient(): Promise<Payload> {
  const status = getCmsEnvironmentStatus()

  if (!status.hasMongoUri) {
    throw new Error('MONGODB_URI environment variable is not configured.')
  }

  if (!status.hasValidMongoScheme) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://.')
  }

  if (!status.hasPayloadSecret) {
    throw new Error('PAYLOAD_SECRET environment variable is missing or uses a placeholder value.')
  }

  try {
    return await getPayload({ config })
  } catch (error) {
    const safeMessage = sanitizeMongoErrorMessage(error)
    console.error('[Payload Init Error]:', safeMessage)
    throw new Error(`Failed to initialize Payload CMS / MongoDB connection: ${safeMessage}`)
  }
}

export async function checkCmsConnection(): Promise<
  { ok: true; payload: Payload } | { ok: false; reason: string; status: CmsEnvironmentStatus }
> {
  const status = getCmsEnvironmentStatus()

  if (!status.isReady) {
    const issues: string[] = []
    if (status.missingVars.length > 0) {
      issues.push(`Missing environment variable(s): ${status.missingVars.join(', ')}`)
    }
    if (status.hasMongoUri && !status.hasValidMongoScheme) {
      issues.push('MONGODB_URI must start with mongodb:// or mongodb+srv://')
    }
    return {
      ok: false,
      reason: issues.join('. '),
      status,
    }
  }

  try {
    const payload = await getPayloadClient()
    return { ok: true, payload }
  } catch (error) {
    return {
      ok: false,
      reason: sanitizeMongoErrorMessage(error),
      status,
    }
  }
}
