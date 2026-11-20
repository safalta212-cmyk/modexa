import type { FieldHook } from 'payload'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatSlugHook(sourceField: string): FieldHook {
  return ({ data, operation, value }) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      return toSlug(value)
    }

    if ((operation === 'create' || !value) && data && typeof data[sourceField] === 'string') {
      return toSlug(data[sourceField])
    }

    return value
  }
}

export function validateSlug(value: unknown): string | true {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 'Slug is required.'
  }

  const normalized = toSlug(value)
  if (!SLUG_PATTERN.test(normalized)) {
    return 'Slug may only contain lowercase letters, numbers, and hyphens.'
  }

  return true
}
