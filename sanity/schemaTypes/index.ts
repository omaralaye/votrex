import { type SchemaTypeDefinition } from 'sanity'
import { categoryType } from './categoryType'
import { courseType } from './courseType'
import { instructorType } from './instructorType'
import { lessonType } from './lessonType'
import { videoType } from './videoType'
import { moduleType } from './objects/moduleType'
import { learningOutcome } from './objects/learningOutcome'
import { resource } from './objects/resource'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    courseType,
    lessonType,
    instructorType,
    categoryType,
    videoType,

    // Embedded Objects
    moduleType,
    learningOutcome,
    resource,
  ],
}
