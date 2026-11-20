import type { Access, FieldAccess } from 'payload'

type UserWithRole = {
  id?: string
  role?: string | null
} | null | undefined

export function hasAdminRole(user: UserWithRole): boolean {
  return Boolean(user && user.role === 'admin')
}

export function hasEditorialRole(user: UserWithRole): boolean {
  return Boolean(user && (user.role === 'admin' || user.role === 'editor'))
}

export const isAdmin: Access = ({ req: { user } }) => hasAdminRole(user as UserWithRole)

export const isAdminOrEditor: Access = ({ req: { user } }) =>
  hasEditorialRole(user as UserWithRole)

export const isAdminField: FieldAccess = ({ req: { user } }) =>
  hasAdminRole(user as UserWithRole)

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  const typedUser = user as UserWithRole
  if (!typedUser?.id) return false
  if (hasAdminRole(typedUser)) return true

  return {
    id: {
      equals: typedUser.id,
    },
  }
}

export const publishedOnlyOrStaff: Access = ({ req: { user } }) => {
  if (hasEditorialRole(user as UserWithRole)) {
    return true
  }

  return {
    status: {
      equals: 'published',
    },
  }
}
