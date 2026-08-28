import { defineQuery } from 'next-sanity'

/**
 * All courses query with instructor, category, and derived counts
 */
export const COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    description,
    level,
    price,
    duration,
    isPopular,
    studentCount,
    iconIdentifier,
    coverImage,
    coverImageUrl,
    category->{
      _id,
      title,
      slug
    },
    instructor->{
      _id,
      name,
      slug,
      role,
      avatar,
      avatarUrl
    },
    "modulesCount": count(modules),
    "lessonsCount": count(modules[].lessons[])
  }
`)

/**
 * Filtered courses query with optional category and level parameters
 */
export const COURSES_FILTERED_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current) &&
    (!defined($categorySlug) || category->slug.current == $categorySlug) &&
    (!defined($level) || level == $level) &&
    (!defined($search) || title match $search || description match $search)
  ] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    description,
    level,
    price,
    duration,
    isPopular,
    studentCount,
    iconIdentifier,
    coverImage,
    coverImageUrl,
    category->{
      _id,
      title,
      slug
    },
    instructor->{
      _id,
      name,
      slug,
      role,
      avatar,
      avatarUrl
    },
    "modulesCount": count(modules),
    "lessonsCount": count(modules[].lessons[])
  }
`)

/**
 * Detailed single course query by slug
 */
export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    description,
    level,
    price,
    duration,
    isPopular,
    studentCount,
    iconIdentifier,
    coverImage,
    coverImageUrl,
    overview,
    category->{
      _id,
      title,
      slug,
      description,
      icon
    },
    instructor->{
      _id,
      name,
      slug,
      role,
      avatar,
      avatarUrl,
      bio
    },
    "learningOutcomes": coalesce(learningOutcomes[]{
      _key,
      title,
      description,
      icon
    }, []),
    "modules": coalesce(modules[]{
      _key,
      title,
      summary,
      duration,
      "lessons": coalesce(lessons[]->{
        _id,
        title,
        slug,
        videoUrl,
        thumbnail,
        thumbnailUrl,
        duration,
        isFreePreview,
        studentCount,
        summary
      }, [])
    }, []),
    "totalModules": count(modules),
    "totalLessons": count(modules[].lessons[])
  }
`)

/**
 * Query to fetch all course slugs for static paths / sitemaps
 */
export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)]{
    "slug": slug.current
  }
`)

/**
 * Lesson detail query with reverse lookup to its parent course and siblings
 */
export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    videoUrl,
    thumbnail,
    thumbnailUrl,
    duration,
    isFreePreview,
    studentCount,
    summary,
    keyPoints,
    proTip,
    "resources": coalesce(resources[]{
      _key,
      title,
      type,
      description,
      url,
      fileFormat,
      fileSize
    }, []),
    content,
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      slug,
      iconIdentifier,
      level,
      coverImage,
      coverImageUrl,
      category->{
        _id,
        title,
        slug
      },
      instructor->{
        _id,
        name,
        slug,
        role,
        avatar,
        avatarUrl
      },
      "modules": coalesce(modules[]{
        _key,
        title,
        summary,
        "lessons": coalesce(lessons[]->{
          _id,
          title,
          slug,
          videoUrl,
          thumbnail,
          thumbnailUrl,
          duration,
          isFreePreview
        }, [])
      }, [])
    }
  }
`)

/**
 * All lessons query
 */
export const ALL_LESSONS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    slug,
    videoUrl,
    thumbnail,
    thumbnailUrl,
    duration,
    isFreePreview,
    studentCount,
    summary,
    "course": *[_type == "course" && references(^._id)][0]{
      _id,
      title,
      slug
    }
  }
`)

/**
 * All categories query with course count
 */
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    slug,
    description,
    icon,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`)

/**
 * Single category query with associated courses
 */
export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    "courses": *[_type == "course" && references(^._id)] | order(_createdAt desc) {
      _id,
      title,
      slug,
      description,
      level,
      price,
      duration,
      isPopular,
      studentCount,
      iconIdentifier,
      coverImage,
      coverImageUrl,
      instructor->{
        _id,
        name,
        slug,
        role,
        avatar,
        avatarUrl
      },
      "modulesCount": count(modules),
      "lessonsCount": count(modules[].lessons[])
    }
  }
`)

/**
 * All instructors query with course count
 */
export const INSTRUCTORS_QUERY = defineQuery(`
  *[_type == "instructor" && defined(slug.current)] | order(name asc) {
    _id,
    name,
    slug,
    role,
    avatar,
    avatarUrl,
    bio,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`)

/**
 * Single instructor query with authored courses
 */
export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    role,
    avatar,
    avatarUrl,
    bio,
    "courses": *[_type == "course" && references(^._id)] | order(_createdAt desc) {
      _id,
      title,
      slug,
      description,
      level,
      price,
      duration,
      isPopular,
      studentCount,
      iconIdentifier,
      coverImage,
      coverImageUrl,
      category->{
        _id,
        title,
        slug
      },
      "modulesCount": count(modules),
      "lessonsCount": count(modules[].lessons[])
    }
  }
`)

/**
 * Popular / featured courses query
 */
export const POPULAR_COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current) && isPopular == true] | order(studentCount desc, _createdAt desc)[0...$limit] {
    _id,
    title,
    slug,
    description,
    level,
    price,
    duration,
    isPopular,
    studentCount,
    iconIdentifier,
    coverImage,
    coverImageUrl,
    category->{
      _id,
      title,
      slug
    },
    instructor->{
      _id,
      name,
      slug,
      role,
      avatar,
      avatarUrl
    },
    "modulesCount": count(modules),
    "lessonsCount": count(modules[].lessons[])
  }
`)
