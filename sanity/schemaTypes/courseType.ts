import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      validation: (rule) => rule.required().error('Course title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Course slug is required'),
    }),
    defineField({
      name: 'description',
      title: 'Marketing Summary / Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().error('Course description is required'),
    }),
    defineField({
      name: 'coverImageUrl',
      title: 'Cover Image URL (e.g. Picsum seed)',
      type: 'url',
      description: 'Direct cover image URL (e.g. Picsum seed)',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'level',
      title: 'Skill Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
        ],
        layout: 'radio',
      },
      initialValue: 'Beginner',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      description: 'Course price in USD (0 for free)',
      initialValue: 0,
    }),
    defineField({
      name: 'duration',
      title: 'Estimated Duration (e.g. 18h 24m)',
      type: 'string',
      placeholder: '18h 24m',
    }),
    defineField({
      name: 'isPopular',
      title: 'Popular Badge',
      type: 'boolean',
      description: 'Highlight this course with a Popular badge in listings',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count (Display)',
      type: 'number',
      description: 'Display count of enrolled learners',
      initialValue: 0,
    }),
    defineField({
      name: 'iconIdentifier',
      title: 'Icon Type / Logo',
      type: 'string',
      description: 'Predefined logo identifier (e.g. nextjs, docker, typescript, react, node, cloud)',
      options: {
        list: [
          { title: 'Next.js', value: 'nextjs' },
          { title: 'Docker', value: 'docker' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'React', value: 'react' },
          { title: 'Node.js', value: 'node' },
          { title: 'Cloud / DevOps', value: 'cloud' },
          { title: 'Database', value: 'database' },
          { title: 'AI / Machine Learning', value: 'ai' },
          { title: 'Python', value: 'python' },
          { title: 'Rust', value: 'rust' },
          { title: 'Security', value: 'security' },
          { title: 'Custom / Other', value: 'custom' },
        ],
      },
      initialValue: 'custom',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required().error('Category is required'),
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
      validation: (rule) => rule.required().error('Instructor is required'),
    }),
    defineField({
      name: 'learningOutcomes',
      title: "What You'll Learn (Learning Outcomes)",
      type: 'array',
      of: [defineArrayMember({ type: 'learningOutcome' })],
    }),
    defineField({
      name: 'modules',
      title: 'Course Curriculum (Modules & Lessons)',
      type: 'array',
      of: [defineArrayMember({ type: 'module' })],
      validation: (rule) => rule.min(1).error('A course must have at least 1 module'),
    }),
    defineField({
      name: 'overview',
      title: 'Course Overview & Curriculum Notes',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'level',
      media: 'coverImage',
      modules: 'modules',
    },
    prepare({ title, subtitle, media, modules }) {
      const moduleCount = Array.isArray(modules) ? modules.length : 0
      return {
        title,
        subtitle: `${subtitle || 'Course'} • ${moduleCount} ${moduleCount === 1 ? 'module' : 'modules'}`,
        media,
      }
    },
  },
})
