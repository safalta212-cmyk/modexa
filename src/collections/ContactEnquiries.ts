import type { CollectionConfig } from 'payload'

import { hasAdminRole, isAdmin, isAdminField } from '../access'

function validatePhone(value: unknown): string | true {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return 'Phone number is required.'
  }

  const digits = value.replace(/[^\d]/g, '')
  if (digits.length < 7 || digits.length > 15) {
    return 'Please provide a valid phone number (7 to 15 digits).'
  }

  return true
}

export const ContactEnquiries: CollectionConfig = {
  slug: 'contact-enquiries',
  defaultSort: '-submissionDate',
  admin: {
    group: 'Customer Management',
    useAsTitle: 'fullName',
    description:
      'Incoming project and consultation enquiries. Filter by Enquiry Status or search by customer name, email, or company.',
    defaultColumns: [
      'fullName',
      'email',
      'requestedService',
      'budget',
      'enquiryStatus',
      'submissionDate',
    ],
    listSearchableFields: ['fullName', 'email', 'company', 'requestedService', 'message'],
    hidden: ({ user }) => !hasAdminRole(user as { role?: string | null } | null),
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create') {
          const isAuthorizedAdmin = hasAdminRole(
            req.user as { role?: string | null } | undefined
          )

          const sanitized: Record<string, unknown> = {
            ...data,
            submissionDate:
              isAuthorizedAdmin && data?.submissionDate
                ? data.submissionDate
                : new Date().toISOString(),
          }

          if (!isAuthorizedAdmin) {
            sanitized.enquiryStatus = 'new'
            delete sanitized.internalNotes
          }

          return sanitized
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      required: true,
      validate: validatePhone,
    },
    {
      name: 'company',
      label: 'Company',
      type: 'text',
      maxLength: 120,
    },
    {
      name: 'requestedService',
      label: 'Requested Service',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 120,
    },
    {
      name: 'serviceRecord',
      label: 'Linked Service',
      type: 'relationship',
      relationTo: 'services',
      admin: {
        position: 'sidebar',
        description: 'Optional internal link to a CMS Service document.',
      },
      access: {
        create: isAdminField,
        update: isAdminField,
      },
    },
    {
      name: 'budget',
      label: 'Budget',
      type: 'text',
      maxLength: 80,
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      minLength: 10,
      maxLength: 4000,
    },
    {
      name: 'privacyConsent',
      label: 'Privacy Policy Consent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      validate: (value: unknown) => {
        if (value !== true) {
          return 'Privacy policy consent is required.'
        }
        return true
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'enquiryStatus',
      label: 'Enquiry Status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Rejected', value: 'rejected' },
      ],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'internalNotes',
      label: 'Internal Notes',
      type: 'textarea',
      maxLength: 4000,
      access: {
        read: isAdminField,
        create: isAdminField,
        update: isAdminField,
      },
    },
    {
      name: 'submissionDate',
      label: 'Submission Date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
