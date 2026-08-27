import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const resource = defineType({
  name: 'resource',
  title: 'Lesson Resource',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Resource Title',
      type: 'string',
      validation: (rule) => rule.required().error('Resource title is required'),
    }),
    defineField({
      name: 'type',
      title: 'Resource Type',
      type: 'string',
      options: {
        list: [
          { title: 'PDF Document', value: 'PDF' },
          { title: 'Code / GitHub Repository', value: 'Code' },
          { title: 'External Link / Article', value: 'Link' },
          { title: 'Cheatsheet', value: 'Cheatsheet' },
          { title: 'Slide Deck', value: 'Slides' },
          { title: 'Notes / Summary', value: 'Notes' },
        ],
      },
      initialValue: 'PDF',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Resource URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
          allowRelative: true,
        }).required().error('Valid URL is required'),
    }),
    defineField({
      name: 'fileFormat',
      title: 'File Format Label (e.g. PDF, ZIP, TS)',
      type: 'string',
      initialValue: 'PDF',
    }),
    defineField({
      name: 'fileSize',
      title: 'File Size Label (e.g. 1.2 MB)',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      format: 'fileFormat',
    },
    prepare({ title, subtitle, format }) {
      return {
        title,
        subtitle: format ? `${subtitle || 'Resource'} • ${format}` : subtitle,
      }
    },
  },
})
