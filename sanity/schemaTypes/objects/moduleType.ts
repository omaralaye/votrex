import { defineArrayMember, defineField, defineType } from 'sanity'
import { SplitVerticalIcon } from '@sanity/icons'

export const moduleType = defineType({
  name: 'module',
  title: 'Course Module',
  type: 'object',
  icon: SplitVerticalIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Module Title',
      type: 'string',
      validation: (rule) => rule.required().error('Module title is required'),
    }),
    defineField({
      name: 'summary',
      title: 'Module Summary',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons in this Module',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'lesson' }],
        }),
      ],
      validation: (rule) => rule.min(1).error('A module must contain at least 1 lesson'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      lessons: 'lessons',
    },
    prepare({ title, lessons }) {
      const count = Array.isArray(lessons) ? lessons.length : 0
      return {
        title,
        subtitle: `${count} ${count === 1 ? 'lesson' : 'lessons'}`,
      }
    },
  },
})
