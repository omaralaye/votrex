import type { PortableTextBlock } from 'sanity'
import { sanityFetch } from './live'
import { urlFor } from './image'
import {
  COURSES_QUERY,
  COURSES_FILTERED_QUERY,
  COURSE_BY_SLUG_QUERY,
  COURSE_SLUGS_QUERY,
  LESSON_BY_SLUG_QUERY,
  ALL_LESSONS_QUERY,
  CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  INSTRUCTORS_QUERY,
  INSTRUCTOR_BY_SLUG_QUERY,
  POPULAR_COURSES_QUERY,
} from './queries'

export interface SanitySlug {
  _type?: 'slug'
  current: string
}

export interface SanityImageReference {
  _type?: 'image'
  asset?: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface CategorySummary {
  _id: string
  title: string
  slug: SanitySlug
  description?: string
  icon?: string
  courseCount?: number
}

export interface InstructorSummary {
  _id: string
  name: string
  slug: SanitySlug
  role: string
  avatar?: SanityImageReference
  avatarUrl?: string
  courseCount?: number
}

export interface InstructorDetail extends InstructorSummary {
  bio?: PortableTextBlock[]
  courses?: CourseSummary[]
}

export interface LearningOutcome {
  _key: string
  title: string
  description?: string
  icon?: string
}

export interface LessonResource {
  _key: string
  title: string
  type: string
  description?: string
  url: string
  fileFormat?: string
  fileSize?: string
}

export interface LessonSummary {
  _id: string
  title: string
  slug: SanitySlug
  videoUrl?: string
  thumbnail?: SanityImageReference
  thumbnailUrl?: string
  duration: string
  isFreePreview?: boolean
  studentCount?: number
  summary?: string
}

export interface ModuleSummary {
  _key: string
  title: string
  summary?: string
  lessons: LessonSummary[]
}

export interface CourseSummary {
  _id: string
  _createdAt?: string
  title: string
  slug: SanitySlug
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | string
  price?: number
  duration?: string
  isPopular?: boolean
  studentCount?: number
  iconIdentifier?: string
  coverImage?: SanityImageReference
  coverImageUrl?: string
  category?: {
    _id: string
    title: string
    slug: SanitySlug
  }
  instructor?: {
    _id: string
    name: string
    slug: SanitySlug
    role: string
    avatar?: SanityImageReference
    avatarUrl?: string
  }
  modulesCount?: number
  lessonsCount?: number
}

export interface CourseDetail extends CourseSummary {
  overview?: PortableTextBlock[]
  learningOutcomes?: LearningOutcome[]
  modules: ModuleSummary[]
  totalModules?: number
  totalLessons?: number
}

export interface LessonDetail {
  _id: string
  _createdAt?: string
  title: string
  slug: SanitySlug
  videoUrl?: string
  thumbnail?: SanityImageReference
  thumbnailUrl?: string
  duration: string
  isFreePreview?: boolean
  studentCount?: number
  summary?: string
  keyPoints?: string[]
  proTip?: string
  resources?: LessonResource[]
  content?: PortableTextBlock[]
  course?: {
    _id: string
    title: string
    slug: SanitySlug
    iconIdentifier?: string
    level?: string
    coverImage?: SanityImageReference
    coverImageUrl?: string
    category?: {
      _id: string
      title: string
      slug: SanitySlug
    }
    instructor?: {
      _id: string
      name: string
      slug: SanitySlug
      role: string
      avatar?: SanityImageReference
      avatarUrl?: string
    }
    modules: {
      _key: string
      title: string
      summary?: string
      lessons: {
        _id: string
        title: string
        slug: SanitySlug
        videoUrl?: string
        thumbnail?: SanityImageReference
        thumbnailUrl?: string
        duration: string
        isFreePreview?: boolean
      }[]
    }[]
  }
}

export interface CategoryDetail extends CategorySummary {
  courses: CourseSummary[]
}

export interface LessonWithCourse extends LessonSummary {
  course?: { _id: string; title: string; slug: SanitySlug }
}

// ==========================================
// Image URL Helper Functions with Picsum Seed Fallback
// ==========================================

export function getLessonThumbnailUrl(lesson: {
  _id?: string
  slug?: SanitySlug | string
  thumbnail?: SanityImageReference
  thumbnailUrl?: string
}): string {
  if (lesson.thumbnailUrl) return lesson.thumbnailUrl
  if (lesson.thumbnail?.asset?._ref) {
    try {
      return urlFor(lesson.thumbnail).width(640).height(360).url()
    } catch {
      // fallback
    }
  }
  const seed = (typeof lesson.slug === 'string' ? lesson.slug : lesson.slug?.current) || lesson._id || 'lesson'
  return `https://picsum.photos/seed/${seed}/640/360`
}

export function getCourseCoverImageUrl(course: {
  _id?: string
  slug?: SanitySlug | string
  coverImage?: SanityImageReference
  coverImageUrl?: string
}): string {
  if (course.coverImageUrl) return course.coverImageUrl
  if (course.coverImage?.asset?._ref) {
    try {
      return urlFor(course.coverImage).width(1280).height(720).url()
    } catch {
      // fallback
    }
  }
  const seed = (typeof course.slug === 'string' ? course.slug : course.slug?.current) || course._id || 'course'
  return `https://picsum.photos/seed/${seed}/1280/720`
}

export function getInstructorAvatarUrl(instructor: {
  _id?: string
  slug?: SanitySlug | string
  avatar?: SanityImageReference
  avatarUrl?: string
}): string {
  if (instructor.avatarUrl) return instructor.avatarUrl
  if (instructor.avatar?.asset?._ref) {
    try {
      return urlFor(instructor.avatar).width(400).height(400).url()
    } catch {
      // fallback
    }
  }
  const seed = (typeof instructor.slug === 'string' ? instructor.slug : instructor.slug?.current) || instructor._id || 'instructor'
  return `https://picsum.photos/seed/${seed}/400/400`
}

// ==========================================
// Data Access Functions
// ==========================================

/**
 * Get all courses or filtered courses
 */
export async function getCourses(filters?: {
  categorySlug?: string
  level?: string
  search?: string
}): Promise<CourseSummary[]> {
  if (filters?.categorySlug || filters?.level || filters?.search) {
    const { data } = await sanityFetch({
      query: COURSES_FILTERED_QUERY,
      params: {
        categorySlug: filters.categorySlug ?? null,
        level: filters.level ?? null,
        search: filters.search ? `*${filters.search}*` : null,
      },
    })
    return (data as CourseSummary[]) || []
  }

  const { data } = await sanityFetch({
    query: COURSES_QUERY,
  })
  return (data as CourseSummary[]) || []
}

/**
 * Get course detail by slug
 */
export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  const { data } = await sanityFetch({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
  })
  return (data as CourseDetail) || null
}

/**
 * Get all course slugs for static paths
 */
export async function getAllCourseSlugs(): Promise<string[]> {
  const { data } = await sanityFetch({
    query: COURSE_SLUGS_QUERY,
  })
  return ((data as { slug: string }[]) || []).map((item) => item.slug)
}

/**
 * Get lesson by slug with reverse course lookup
 */
export async function getLessonBySlug(slug: string): Promise<LessonDetail | null> {
  const { data } = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
  })
  return (data as LessonDetail) || null
}

/**
 * Get all lessons
 */
export async function getAllLessons(): Promise<LessonWithCourse[]> {
  const { data } = await sanityFetch({
    query: ALL_LESSONS_QUERY,
  })
  return (data as LessonWithCourse[]) || []
}

/**
 * Get all categories with course counts
 */
export async function getAllCategories(): Promise<CategorySummary[]> {
  const { data } = await sanityFetch({
    query: CATEGORIES_QUERY,
  })
  return (data as CategorySummary[]) || []
}

/**
 * Get category by slug with its courses
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryDetail | null> {
  const { data } = await sanityFetch({
    query: CATEGORY_BY_SLUG_QUERY,
    params: { slug },
  })
  return (data as CategoryDetail) || null
}

/**
 * Get all instructors with course counts
 */
export async function getAllInstructors(): Promise<InstructorSummary[]> {
  const { data } = await sanityFetch({
    query: INSTRUCTORS_QUERY,
  })
  return (data as InstructorSummary[]) || []
}

/**
 * Get instructor by slug with authored courses
 */
export async function getInstructorBySlug(slug: string): Promise<InstructorDetail | null> {
  const { data } = await sanityFetch({
    query: INSTRUCTOR_BY_SLUG_QUERY,
    params: { slug },
  })
  return (data as InstructorDetail) || null
}

/**
 * Get popular courses
 */
export async function getPopularCourses(limit: number = 6): Promise<CourseSummary[]> {
  const { data } = await sanityFetch({
    query: POPULAR_COURSES_QUERY,
    params: { limit },
  })
  return (data as CourseSummary[]) || []
}
