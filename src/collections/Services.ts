import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOnlyOrStaff } from '../access'
import { revalidateServices } from '../lib/revalidate'
import { formatSlugHook, validateSlug } from '../lib/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  defaultSort: 'displayOrder',
  admin: {
    group: 'Services & Projects',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'displayOrder', 'featured', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'shortDescription'],
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
        revalidateServices(doc?.slug)
        if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
          revalidateServices(previousDoc.slug)
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateServices(doc?.slug)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Service Title',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 120,
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
        beforeValidate: [formatSlugHook('title')],
      },
      admin: {
        description: 'Auto-generated from Service Title when left blank.',
      },
    },
    {
      name: 'shortDescription',
      label: 'Short Description',
      type: 'textarea',
      required: true,
      maxLength: 320,
    },
    {
      name: 'fullDescription',
      label: 'Full Description',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      label: 'Featured Image',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: {
          contains: 'image/',
        },
      },
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'select',
      required: true,
      defaultValue: 'TrendingUp',
      options: [
        { label: 'TrendingUp (Digital Marketing)', value: 'TrendingUp' },
        { label: 'Search (SEO Optimization)', value: 'Search' },
        { label: 'Share2 (Social Media Marketing)', value: 'Share2' },
        { label: 'MousePointerClick (Google Ads)', value: 'MousePointerClick' },
        { label: 'Layers (Meta Ads)', value: 'Layers' },
        { label: 'Code2 (Website Development)', value: 'Code2' },
        { label: 'Palette (Branding & Creative Design)', value: 'Palette' },
        { label: 'FileText (Content Marketing)', value: 'FileText' },
        { label: 'Sparkles (Strategy & Innovation)', value: 'Sparkles' },
        { label: 'Globe (Global Growth)', value: 'Globe' },
      ],
    },
    {
      name: 'benefits',
      label: 'Benefits',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Benefit Title',
          type: 'text',
          required: true,
          maxLength: 120,
        },
        {
          name: 'description',
          label: 'Benefit Description',
          type: 'textarea',
          maxLength: 300,
        },
      ],
    },
    {
      name: 'features',
      label: 'Features',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Feature Item',
          type: 'text',
          required: true,
          maxLength: 160,
        },
      ],
    },
    {
      name: 'seoTitle',
      label: 'SEO Title',
      type: 'text',
      maxLength: 70,
    },
    {
      name: 'seoDescription',
      label: 'SEO Description',
      type: 'textarea',
      maxLength: 160,
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
