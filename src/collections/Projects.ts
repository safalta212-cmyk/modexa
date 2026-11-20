import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOnlyOrStaff } from '../access'
import { revalidateProjects } from '../lib/revalidate'
import { formatSlugHook, validateSlug } from '../lib/slug'

function validateOptionalUrl(value: unknown): string | true {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return true
  }

  try {
    const parsed = new URL(value.trim())
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'Project URL must start with http:// or https://'
    }
    return true
  } catch {
    return 'Please enter a valid URL (e.g., https://example.com).'
  }
}

export const Projects: CollectionConfig = {
  slug: 'projects',
  defaultSort: '-completionDate',
  admin: {
    group: 'Services & Projects',
    useAsTitle: 'projectName',
    defaultColumns: ['projectName', 'clientName', 'category', 'featured', 'status', 'completionDate'],
    listSearchableFields: ['projectName', 'slug', 'clientName', 'description'],
  },
  access: {
    read: publishedOnlyOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        revalidateProjects(doc?.slug)
        if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
          revalidateProjects(previousDoc.slug)
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateProjects(doc?.slug)
      },
    ],
  },
  fields: [
    {
      name: 'projectName',
      label: 'Project Name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 140,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: validateSlug,
      hooks: {
        beforeValidate: [formatSlugHook('projectName')],
      },
      admin: {
        description: 'Auto-generated from Project Name when left blank.',
      },
    },
    {
      name: 'clientName',
      label: 'Client Name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'category',
      label: 'Project Category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      filterOptions: {
        categoryType: {
          equals: 'project',
        },
      },
    },
    {
      name: 'description',
      label: 'Project Description',
      type: 'textarea',
      required: true,
      maxLength: 2000,
    },
    {
      name: 'featuredImage',
      label: 'Featured Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: {
          contains: 'image/',
        },
      },
    },
    {
      name: 'gallery',
      label: 'Project Gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          label: 'Gallery Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            mimeType: {
              contains: 'image/',
            },
          },
        },
        {
          name: 'caption',
          label: 'Caption',
          type: 'text',
          maxLength: 200,
        },
      ],
    },
    {
      name: 'projectVideo',
      label: 'Project Video',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: {
          contains: 'video/',
        },
      },
    },
    {
      name: 'technologiesUsed',
      label: 'Technologies Used',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Technology / Platform',
          type: 'text',
          required: true,
          maxLength: 80,
        },
      ],
    },
    {
      name: 'projectUrl',
      label: 'Project URL',
      type: 'text',
      validate: validateOptionalUrl,
      admin: {
        placeholder: 'https://example.com',
      },
    },
    {
      name: 'completionDate',
      label: 'Completion Date',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'featured',
      label: 'Featured Status',
      type: 'checkbox',
      defaultValue: false,
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
