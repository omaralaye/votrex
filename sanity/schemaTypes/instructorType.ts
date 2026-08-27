import { defineArrayMember, defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const instructorType = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().error('Instructor name is required'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required().error('Instructor slug is required'),
    }),
    defineField({
      name: 'role',
      title: 'Role / Expertise Area',
      type: 'string',
      description: 'Headline or area of expertise (e.g. Senior Full-Stack Architect)',
      validation: (rule) => rule.required().error('Role or expertise area is required'),
    }),
    defineField({
      name: 'avatarUrl',
      title: 'Avatar URL (e.g. Picsum seed)',
      type: 'url',
      description: 'Direct avatar image URL (e.g. Picsum seed)',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar / Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
    },
  },
})
