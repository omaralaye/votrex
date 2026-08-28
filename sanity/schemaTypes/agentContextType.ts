import { defineField, defineType } from 'sanity'
import { SparklesIcon } from '@sanity/icons'

export const agentContextType = defineType({
  name: 'sanity.agentContext',
  title: 'Agent Context (Search Config)',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Context Name',
      type: 'string',
      description: 'Display name for this agent context (e.g., "Vertex Search Agent")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / Key',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'groqFilter',
      title: 'Content Filter (GROQ)',
      type: 'text',
      rows: 3,
      description: 'A GROQ expression scoping which documents the agent can access (e.g. _type in ["course", "lesson", "video"])',
    }),
    defineField({
      name: 'instructions',
      title: 'Domain Instructions',
      type: 'text',
      rows: 6,
      description: 'Pure deltas: query guidance, video lookup via videoUrl, chapter resolution, and ranking rules',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current',
    },
  },
})
