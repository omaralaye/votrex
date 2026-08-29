import type { StructureResolver } from 'sanity/structure'
import { BookIcon, PlayIcon, SparklesIcon, TagIcon, UserIcon } from '@sanity/icons'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Vertex Content Studio')
    .items([
      // Courses item
      S.listItem()
        .title('Courses')
        .icon(BookIcon)
        .child(
          S.documentList()
            .title('All Courses')
            .filter('_type == "course"')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),

      // Categories
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(
          S.documentList()
            .title('Categories')
            .filter('_type == "category"')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // Instructors
      S.listItem()
        .title('Instructors')
        .icon(UserIcon)
        .child(
          S.documentList()
            .title('Instructors')
            .filter('_type == "instructor"')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),

      S.divider(),

      // Lessons
      S.listItem()
        .title('Lessons')
        .icon(PlayIcon)
        .child(
          S.documentList()
            .title('All Lessons')
            .filter('_type == "lesson"')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      S.divider(),

      // Search Agent Context
      S.listItem()
        .title('Agent Context (Search Config)')
        .icon(SparklesIcon)
        .child(
          S.documentList()
            .title('Agent Contexts')
            .filter('_type == "sanity.agentContext"')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
    ])

