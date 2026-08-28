import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

export function getLessonThumbnailUrl(lesson: {
  _id?: string
  slug?: { current: string } | string
  thumbnail?: SanityImageSource | { asset?: { _ref: string } }
  thumbnailUrl?: string
}): string {
  if (lesson.thumbnailUrl) return lesson.thumbnailUrl
  if (lesson.thumbnail && typeof lesson.thumbnail === 'object' && 'asset' in lesson.thumbnail && lesson.thumbnail.asset?._ref) {
    try {
      return urlFor(lesson.thumbnail as SanityImageSource).width(640).height(360).url()
    } catch {
      // fallback
    }
  }
  const seed = (typeof lesson.slug === 'string' ? lesson.slug : lesson.slug?.current) || lesson._id || 'lesson'
  return `https://picsum.photos/seed/${seed}/640/360`
}

export function getCourseCoverImageUrl(course: {
  _id?: string
  slug?: { current: string } | string
  coverImage?: SanityImageSource | { asset?: { _ref: string } }
  coverImageUrl?: string
}): string {
  if (course.coverImageUrl) return course.coverImageUrl
  if (course.coverImage && typeof course.coverImage === 'object' && 'asset' in course.coverImage && course.coverImage.asset?._ref) {
    try {
      return urlFor(course.coverImage as SanityImageSource).width(1280).height(720).url()
    } catch {
      // fallback
    }
  }
  const seed = (typeof course.slug === 'string' ? course.slug : course.slug?.current) || course._id || 'course'
  return `https://picsum.photos/seed/${seed}/1280/720`
}

export function getInstructorAvatarUrl(instructor: {
  _id?: string
  slug?: { current: string } | string
  avatar?: SanityImageSource | { asset?: { _ref: string } }
  avatarUrl?: string
}): string {
  if (instructor.avatarUrl) return instructor.avatarUrl
  if (instructor.avatar && typeof instructor.avatar === 'object' && 'asset' in instructor.avatar && instructor.avatar.asset?._ref) {
    try {
      return urlFor(instructor.avatar as SanityImageSource).width(400).height(400).url()
    } catch {
      // fallback
    }
  }
  const seed = (typeof instructor.slug === 'string' ? instructor.slug : instructor.slug?.current) || instructor._id || 'instructor'
  return `https://picsum.photos/seed/${seed}/400/400`
}

