import type { CollectionConfig } from 'payload'

import { hasAdminRole, hasEditorialRole, isAdmin, isAdminField, isAdminOrSelf } from '../access'

const publicOrigin =
  process.env.NEXT_PUBLIC_SERVER_URL?.trim() || process.env.APP_URL?.trim() || ''
const useSecureCookies =
  publicOrigin.startsWith('https://') || process.env.VERCEL === '1'

export const Users: CollectionConfig = {
  slug: 'users',
  defaultSort: '-createdAt',
  admin: {
    group: 'Administration',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    listSearchableFields: ['name', 'email'],
    hidden: ({ user }) => !hasAdminRole(user as { role?: string | null } | null),
  },
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600000,
    cookies: {
      secure: useSecureCookies,
      sameSite: 'Lax',
    },
  },
  access: {
    admin: ({ req: { user } }) =>
      hasEditorialRole(user as { role?: string | null } | null),
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            overrideAccess: true,
          })
          if (totalDocs === 0) {
            return {
              ...data,
              role: 'admin',
            }
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 80,
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
    },
  ],
}
