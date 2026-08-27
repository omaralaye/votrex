import { defineField, defineType } from 'sanity'
import { CheckmarkIcon } from '@sanity/icons'

export const learningOutcome = defineType({
  name: 'learningOutcome',
  title: 'Learning Outcome',
  type: 'object',
  icon: CheckmarkIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Outcome Title',
      type: 'string',
      validation: (rule) => rule.required().error('Outcome title is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'icon',
      title: 'Icon Identifier',
      type: 'string',
      description: 'Optional icon name (e.g. check, target, zap, code, server, database)',
      initialValue: 'check',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
