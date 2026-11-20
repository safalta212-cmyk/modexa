import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOnlyOrStaff } from '../access'
import { revalidateCategories } from '../lib/revalidate'
import { formatSlugHook, validateSlug } from '../lib/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  defaultSort: 'name',
  admin: {
    group: 'Blog Management',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'categoryType', 'status', 'updatedAt'],
    listSearchableFields: ['name', 'slug', 'description'],
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
        revalidateCategories()
      },
    ],
    afterDelete: [
      () => {
        revalidateCategories()
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: 'Category Name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 80,
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
        beforeValidate: [formatSlugHook('name')],
      },
      admin: {
        description: 'Auto-generated from Category Name when left blank.',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      maxLength: 300,
    },
    {
      name: 'categoryType',
      label: 'Category Type',
      type: 'select',
      required: true,
      defaultValue: 'blog',
      index: true,
      options: [
        { label: 'Blog', value: 'blog' },
        { label: 'Project', value: 'project' },
      ],
    },
    {
      name: 'status',
      label: 'Published Status',
      type: 'select',
      required: true,
      defaultValue: 'published',
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
