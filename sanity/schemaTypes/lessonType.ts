import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const lessonType = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Lesson Title',
      type: 'string',
      validation: (rule) => rule.required().error('Lesson title is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Lesson slug is required'),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Embed URL from YouTube, Vimeo, or Bunny',
      validation: (rule) =>
        rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'thumbnailUrl',
      title: 'Thumbnail URL (e.g. Picsum seed)',
      type: 'url',
      description: 'Direct image/thumbnail URL (e.g. Picsum seed or YouTube poster)',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail / Poster Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration (e.g. 12:45 or 18m)',
      type: 'string',
      placeholder: '12:45',
      validation: (rule) => rule.required().error('Lesson duration is required'),
    }),
    defineField({
      name: 'isFreePreview',
      title: 'Free Preview',
      type: 'boolean',
      description: 'Whether this lesson is marked as a free preview',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count (Display)',
      type: 'number',
      description: 'Number of students who have completed or viewed this lesson',
      initialValue: 0,
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'keyPoints',
      title: 'Key Points ("In this lesson you will")',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Key takeaways and concepts covered in this lesson',
    }),
    defineField({
      name: 'proTip',
      title: 'Pro Tip',
      type: 'text',
      rows: 3,
      description: 'Optional pro tip or insider advice highlighted for the learner',
    }),
    defineField({
      name: 'resources',
      title: 'Lesson Resources',
      type: 'array',
      of: [defineArrayMember({ type: 'resource' })],
    }),
    defineField({
      name: 'content',
      title: 'Lesson Notes (Portable Text)',
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
      duration: 'duration',
      isFreePreview: 'isFreePreview',
      media: 'thumbnail',
    },
    prepare({ title, duration, isFreePreview, media }) {
      const parts = []
      if (duration) parts.push(duration)
      if (isFreePreview) parts.push('Free Preview')
      return {
        title,
        subtitle: parts.join(' • '),
        media,
      }
    },
  },
})
