import { serverClient, client } from '@/sanity/lib/client';

export type SearchResultType = 'video' | 'lesson';

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  courseTitle: string;
  courseSlug: string;
  courseIconIdentifier?: string;
  moduleLabel: string; // e.g. "Module 5"
  moduleTitle?: string; // e.g. "Data Fetching & Caching"
  lessonLabel: string; // e.g. "Lesson 5.1"
  lessonSlug: string;
  duration?: string; // e.g. "12:45"
  startSeconds?: number; // e.g. 765
  timestampFormatted?: string; // e.g. "12:45"
  thumbnailUrl?: string;
  keyPoints?: string[];
  score: number;
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  coursesCount: number;
  results: SearchResultItem[];
}

function formatSeconds(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

interface RawCourseData {
  _id: string;
  title: string;
  slug?: { current?: string };
  iconIdentifier?: string;
  modules?: Array<{
    _key: string;
    title: string;
    summary?: string;
    duration?: string;
    lessons?: Array<{
      _id: string;
      title: string;
      slug?: { current?: string };
      videoUrl?: string;
      thumbnailUrl?: string;
      duration?: string;
      summary?: string;
      keyPoints?: string[];
    }>;
  }>;
}

interface RawVideoData {
  _id: string;
  videoId?: string;
  url?: string;
  chapters?: Array<{
    _key: string;
    label: string;
    startSeconds: number;
  }>;
  chunks?: Array<{
    _key: string;
    text: string;
    startSeconds: number;
  }>;
}

/**
 * Execute grounded intelligent search across courses, lessons, and video intelligence.
 */
export async function searchContent(
  query: string,
  sort: 'relevance' | 'newest' | 'duration' = 'relevance'
): Promise<SearchResponse> {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    return {
      query: '',
      totalResults: 0,
      coursesCount: 0,
      results: [],
    };
  }

  const sanity = serverClient || client;
  const searchTerms = trimmed
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 0);

  // Fetch all courses with full hierarchical structure (modules and populated lessons)
  // along with all video documents
  const [coursesData, videosData] = await Promise.all([
    sanity.fetch<RawCourseData[]>(`
      *[_type == "course" && defined(slug.current)] {
        _id,
        title,
        slug,
        iconIdentifier,
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
            thumbnailUrl,
            duration,
            summary,
            keyPoints
          }, [])
        }, [])
      }
    `),
    sanity.fetch<RawVideoData[]>(`
      *[_type == "video"] {
        _id,
        videoId,
        url,
        chapters,
        chunks
      }
    `),
  ]);

  // Index video data by URL and videoId for fast lookup
  const videoByUrl = new Map<string, RawVideoData>();
  for (const v of videosData || []) {
    if (v.url) {
      videoByUrl.set(v.url, v);
    }
    if (v.videoId) {
      videoByUrl.set(v.videoId, v);
    }
  }

  // Build a flat lookup of every lesson with its parent course, module info, and derived numbers
  interface LessonMeta {
    lesson: NonNullable<NonNullable<NonNullable<RawCourseData['modules']>[0]['lessons']>[0]>;
    courseTitle: string;
    courseSlug: string;
    courseIconIdentifier?: string;
    moduleNumber: number;
    moduleTitle: string;
    lessonNumber: number;
    lessonLabel: string;
    moduleLabel: string;
  }

  const allLessons: LessonMeta[] = [];
  for (const course of coursesData || []) {
    const courseTitle = course.title || 'Untitled Course';
    const courseSlug = course.slug?.current || course._id;
    const courseIcon = course.iconIdentifier;

    (course.modules || []).forEach((mod, modIdx) => {
      const moduleNumber = modIdx + 1;
      const moduleTitle = mod.title || `Module ${moduleNumber}`;
      (mod.lessons || []).forEach((les, lesIdx) => {
        const lessonNumber = lesIdx + 1;
        allLessons.push({
          lesson: les,
          courseTitle,
          courseSlug,
          courseIconIdentifier: courseIcon,
          moduleNumber,
          moduleTitle,
          lessonNumber,
          moduleLabel: `Module ${moduleNumber}`,
          lessonLabel: `Lesson ${moduleNumber}.${lessonNumber}`,
        });
      });
    });
  }

  const results: SearchResultItem[] = [];
  const queryLower = trimmed.toLowerCase();

  // Helper to compute match score
  function computeTextScore(text: string | undefined): number {
    if (!text) return 0;
    const lower = text.toLowerCase();
    if (lower === queryLower) return 100;
    if (lower.includes(queryLower)) return 85;
    let termMatches = 0;
    for (const term of searchTerms) {
      if (lower.includes(term)) termMatches++;
    }
    if (termMatches === searchTerms.length) return 70;
    if (termMatches > 0) return 40 * (termMatches / searchTerms.length);
    return 0;
  }

  // 1. Process Video Moments (Chapters table of contents first, then transcript chunks)
  for (const meta of allLessons) {
    const { lesson, courseTitle, courseSlug, courseIconIdentifier, moduleLabel, moduleTitle, lessonLabel } = meta;
    if (!lesson.videoUrl) continue;

    const video = videoByUrl.get(lesson.videoUrl);
    if (!video) continue;

    let matchedMoment: {
      title: string;
      description: string;
      startSeconds: number;
      score: number;
    } | null = null;

    // A. Check chapters (Table of Contents) - High Priority
    if (video.chapters && video.chapters.length > 0) {
      let bestChapterScore = 0;
      let bestChapter: (typeof video.chapters)[0] | null = null;

      for (const ch of video.chapters) {
        const score = computeTextScore(ch.label);
        if (score > bestChapterScore && score >= 35) {
          bestChapterScore = score;
          bestChapter = ch;
        }
      }

      if (bestChapter && bestChapterScore > 0) {
        matchedMoment = {
          title: bestChapter.label,
          description: lesson.summary || `Learn how to master ${bestChapter.label} with best practices and hands-on examples.`,
          startSeconds: bestChapter.startSeconds || 0,
          score: bestChapterScore + 15, // Chapter boost
        };
      }
    }

    // B. Fallback to transcript chunks if no chapter matched
    if (!matchedMoment && video.chunks && video.chunks.length > 0) {
      let bestChunkScore = 0;
      let bestChunk: (typeof video.chunks)[0] | null = null;

      for (const chunk of video.chunks) {
        const score = computeTextScore(chunk.text);
        if (score > bestChunkScore && score >= 40) {
          bestChunkScore = score;
          bestChunk = chunk;
        }
      }

      if (bestChunk && bestChunkScore > 0) {
        matchedMoment = {
          title: lesson.title,
          description: bestChunk.text.slice(0, 150) + '...',
          startSeconds: bestChunk.startSeconds || 0,
          score: bestChunkScore,
        };
      }
    }

    if (matchedMoment) {
      const timestampFormatted = formatSeconds(matchedMoment.startSeconds);
      results.push({
        id: `video-${lesson._id}-${matchedMoment.startSeconds}`,
        type: 'video',
        title: matchedMoment.title,
        description: matchedMoment.description,
        courseTitle,
        courseSlug,
        courseIconIdentifier,
        moduleLabel,
        moduleTitle,
        lessonLabel,
        lessonSlug: lesson.slug?.current || lesson._id,
        duration: lesson.duration || '12:45',
        startSeconds: matchedMoment.startSeconds,
        timestampFormatted,
        thumbnailUrl: lesson.thumbnailUrl,
        score: matchedMoment.score,
      });
    }
  }

  // 2. Process Lesson Results (Matching topic, title, key points, summary)
  for (const meta of allLessons) {
    const { lesson, courseTitle, courseSlug, courseIconIdentifier, moduleLabel, moduleTitle, lessonLabel } = meta;

    const titleScore = computeTextScore(lesson.title);
    const summaryScore = computeTextScore(lesson.summary);
    const keyPointsScore = (lesson.keyPoints || []).reduce((max, kp) => Math.max(max, computeTextScore(kp)), 0);

    const overallLessonScore = Math.max(titleScore * 1.1, keyPointsScore * 0.9, summaryScore * 0.7);

    if (overallLessonScore >= 35) {
      results.push({
        id: `lesson-${lesson._id}`,
        type: 'lesson',
        title: lesson.title,
        description: lesson.summary || `Explore the core architecture, key concepts, and practical implementation patterns.`,
        courseTitle,
        courseSlug,
        courseIconIdentifier,
        moduleLabel,
        moduleTitle,
        lessonLabel,
        lessonSlug: lesson.slug?.current || lesson._id,
        duration: lesson.duration || '15:00',
        keyPoints: lesson.keyPoints && lesson.keyPoints.length > 0
          ? lesson.keyPoints.slice(0, 3)
          : ['Core implementation patterns', 'Architecture & best practices', 'Production deployment'],
        score: overallLessonScore,
      });
    }
  }

  // 3. Apply sorting
  if (sort === 'relevance') {
    results.sort((a, b) => b.score - a.score);
  } else if (sort === 'newest') {
    results.sort((a, b) => b.id.localeCompare(a.id));
  } else if (sort === 'duration') {
    results.sort((a, b) => (b.startSeconds || 0) - (a.startSeconds || 0));
  }

  // 4. Calculate unique courses count
  const uniqueCourses = new Set(results.map((r) => r.courseSlug));

  return {
    query: trimmed,
    totalResults: results.length,
    coursesCount: uniqueCourses.size,
    results,
  };
}
