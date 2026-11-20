import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, publishedOnlyOrStaff } from '../access'
import { revalidateBlogPosts } from '../lib/revalidate'
import { formatSlugHook, validateSlug } from '../lib/slug'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  defaultSort: '-publishedDate',
  admin: {
    group: 'Blog Management',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', 'status', 'publishedDate', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
  },
  access: {
    read: publishedOnlyOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.status === 'published' && !data.publishedDate) {
          return {
            ...data,
            publishedDate: new Date().toISOString(),
          }
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc }) => {
        revalidateBlogPosts(doc?.slug)
        if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
          revalidateBlogPosts(previousDoc.slug)
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateBlogPosts(doc?.slug)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      label: 'Blog Title',
      type: 'text',
      required: true,
      minLength: 4,
      maxLength: 160,
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
        description: 'Auto-generated from Blog Title when left blank.',
      },
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
      name: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      required: true,
      maxLength: 360,
    },
    {
      name: 'content',
      label: 'Rich Text Content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      label: 'Author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hooks: {
        beforeValidate: [
          ({ req, value }) => {
            if (!value && req.user?.id) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      filterOptions: {
        categoryType: {
          equals: 'blog',
        },
      },
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          label: 'Tag',
          type: 'text',
          required: true,
          maxLength: 50,
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
      name: 'publishedDate',
      label: 'Published Date',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      label: 'Draft / Published Status',
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
