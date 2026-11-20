import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor } from '../access'
import { revalidateMedia } from '../lib/revalidate'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  defaultSort: '-createdAt',
  admin: {
    group: 'Media Library',
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'category', 'filename', 'mimeType', 'filesize', 'updatedAt'],
    listSearchableFields: ['alt', 'caption', 'filename'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateMedia()
      },
    ],
    afterDelete: [
      () => {
        revalidateMedia()
      },
    ],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1440,
        height: 900,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text',
      type: 'text',
      required: true,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 2) {
          return 'Alt text is required and must be at least 2 characters.'
        }
        if (value.trim().length > 200) {
          return 'Alt text must be 200 characters or fewer.'
        }
        return true
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'text',
      maxLength: 300,
    },
    {
      name: 'category',
      label: 'Asset Category',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Brand & Hero', value: 'brand' },
        { label: 'Portfolio', value: 'portfolio' },
        { label: 'Blog & Editorial', value: 'blog' },
        { label: 'Team & Studio', value: 'team' },
      ],
    },
  ],
}
