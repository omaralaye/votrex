import type { PortableTextBlock } from 'sanity'
import { sanityFetch } from './live'
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
    }
    modules: {
      _key: string
      title: string
      summary?: string
      lessons: {
        _id: string
        title: string
        slug: SanitySlug
        duration: string
        isFreePreview?: boolean
      }[]
    }[]
  }
}

export interface CategoryDetail extends CategorySummary {
  courses: CourseSummary[]
}

export type LessonWithCourse = LessonSummary & {
  course?: { _id: string; title: string; slug: SanitySlug }
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
