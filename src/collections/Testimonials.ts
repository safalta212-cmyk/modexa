import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOnlyOrStaff } from '../access'
import { revalidateTestimonials } from '../lib/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  defaultSort: 'displayOrder',
  admin: {
    group: 'Website Content',
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'company', 'rating', 'displayOrder', 'status', 'updatedAt'],
    listSearchableFields: ['clientName', 'clientDesignation', 'company', 'review'],
  },
  access: {
    read: publishedOnlyOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTestimonials()
      },
    ],
    afterDelete: [
      () => {
        revalidateTestimonials()
      },
    ],
  },
  fields: [
    {
      name: 'clientName',
      label: 'Client Name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      name: 'clientDesignation',
      label: 'Client Designation',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'company',
      label: 'Company',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'clientPhoto',
      label: 'Client Photo',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: {
          contains: 'image/',
        },
      },
    },
    {
      name: 'review',
      label: 'Review',
      type: 'textarea',
      required: true,
      minLength: 10,
      maxLength: 1000,
    },
    {
      name: 'rating',
      label: 'Rating',
      type: 'number',
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
      admin: {
        step: 1,
        description: 'Rating from 1 to 5.',
      },
    },
    {
      name: 'displayOrder',
      label: 'Display Order',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Published Status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
