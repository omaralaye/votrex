import { defineArrayMember, defineField, defineType } from 'sanity'
import { VideoIcon } from '@sanity/icons'

export const videoType = defineType({
  name: 'video',
  title: 'Video Intelligence',
  type: 'document',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'videoId',
      title: 'Video ID / Key',
      type: 'string',
      description: 'Clean sanitized ID derived from video URL',
      validation: (rule) => rule.required().error('Video ID is required'),
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'Source video URL (e.g. YouTube, Vimeo, Bunny)',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['http', 'https'] })
          .error('Valid video URL is required'),
    }),
    defineField({
      name: 'chapters',
      title: 'Table of Contents (Chapters)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Time (Seconds)',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'label',
              title: 'Chapter Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              startSeconds: 'startSeconds',
            },
            prepare({ title, startSeconds }) {
              const mins = Math.floor((startSeconds || 0) / 60)
              const secs = (startSeconds || 0) % 60
              const timestamp = `${mins}:${secs.toString().padStart(2, '0')}`
              return {
                title: title || 'Untitled Chapter',
                subtitle: `Starts at ${timestamp} (${startSeconds}s)`,
              }
            },
          },
        }),
      ],
      description: 'Ordered chapter timestamps and headings for the table of contents',
    }),
    defineField({
      name: 'chunks',
      title: 'Transcript Chunks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chunk',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Time (Seconds)',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'text',
              title: 'Transcript Text',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              text: 'text',
              startSeconds: 'startSeconds',
            },
            prepare({ text, startSeconds }) {
              const mins = Math.floor((startSeconds || 0) / 60)
              const secs = (startSeconds || 0) % 60
              const timestamp = `${mins}:${secs.toString().padStart(2, '0')}`
              return {
                title: text ? (text.length > 50 ? text.slice(0, 50) + '...' : text) : 'Empty chunk',
                subtitle: `Timestamp ${timestamp} (${startSeconds}s)`,
              }
            },
          },
        }),
      ],
      description: 'Timestamped transcript segments for granular semantic/keyword search lookup',
    }),
  ],
  preview: {
    select: {
      title: 'videoId',
      subtitle: 'url',
    },
  },
})
