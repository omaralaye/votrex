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

// In-memory cache for Sanity catalog data to provide sub-10ms search responses
let cachedData: {
  courses: RawCourseData[];
  videos: RawVideoData[];
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 60 * 1000; // 1 minute TTL

async function getCachedSanityCatalog(): Promise<{
  courses: RawCourseData[];
  videos: RawVideoData[];
}> {
  const now = Date.now();
  if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
    return { courses: cachedData.courses, videos: cachedData.videos };
  }

  const sanity = serverClient || client;
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

  cachedData = {
    courses: coursesData || [],
    videos: videosData || [],
    timestamp: now,
  };

  return { courses: cachedData.courses, videos: cachedData.videos };
}

/**
 * Generate common morphological stems for a word (e.g. "fetching" -> ["fetching", "fetch"])
 */
function getWordStems(word: string): string[] {
  const w = word.toLowerCase().trim();
  const stems = new Set<string>([w]);

  if (w.endsWith('ing')) stems.add(w.slice(0, -3));
  if (w.endsWith('es')) stems.add(w.slice(0, -2));
  if (w.endsWith('s')) stems.add(w.slice(0, -1));
  if (w.endsWith('ed')) stems.add(w.slice(0, -2));
  if (w.endsWith('tion')) stems.add(w.slice(0, -4));
  if (w.endsWith('ment')) stems.add(w.slice(0, -4));

  // Common programming aliases & inflections
  if (w === 'fetch' || w === 'fetching') {
    stems.add('fetch');
    stems.add('fetching');
    stems.add('fetched');
  }
  if (w === 'cache' || w === 'caching') {
    stems.add('cache');
    stems.add('caching');
    stems.add('revalidate');
  }
  if (w === 'route' || w === 'routing') {
    stems.add('route');
    stems.add('routing');
  }
  if (w === 'render' || w === 'rendering') {
    stems.add('render');
    stems.add('rendering');
    stems.add('ssr');
  }
  if (w === 'component' || w === 'components') {
    stems.add('component');
    stems.add('components');
    stems.add('rsc');
  }
  if (w === 'hook' || w === 'hooks') {
    stems.add('hook');
    stems.add('hooks');
    stems.add('useeffect');
    stems.add('usestate');
  }

  return Array.from(stems).filter((s) => s.length >= 3);
}

/**
 * Intelligent grounded search wired with Sanity courses, curriculum, and video moments
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

  const { courses: coursesData, videos: videosData } = await getCachedSanityCatalog();

  const queryLower = trimmed.toLowerCase();
  const searchTerms = queryLower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 0);

  const termStems = searchTerms.map((term) => getWordStems(term));

  // Map videos by URL and videoId
  const videoByUrl = new Map<string, RawVideoData>();
  for (const v of videosData || []) {
    if (v.url) videoByUrl.set(v.url, v);
    if (v.videoId) videoByUrl.set(v.videoId, v);
  }

  function computeTextScore(text: string | undefined): number {
    if (!text) return 0;
    const lower = text.toLowerCase();
    if (lower === queryLower) return 100;
    if (lower.includes(queryLower)) return 90;

    let exactMatches = 0;
    let stemMatches = 0;

    searchTerms.forEach((term, idx) => {
      if (lower.includes(term)) {
        exactMatches++;
      } else {
        const stems = termStems[idx] || [];
        if (stems.some((st) => lower.includes(st))) {
          stemMatches++;
        }
      }
    });

    const totalMatched = exactMatches + stemMatches;
    if (totalMatched === searchTerms.length) {
      return 75 + (exactMatches === searchTerms.length ? 15 : 0);
    }
    if (totalMatched > 0) {
      return (totalMatched / searchTerms.length) * 55;
    }
    return 0;
  }

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
  const seenKeys = new Set<string>();

  // 1. Process Video Moments (Chapters table of contents and transcript chunks)
  for (const meta of allLessons) {
    const { lesson, courseTitle, courseSlug, courseIconIdentifier, moduleLabel, moduleTitle, lessonLabel } = meta;
    if (!lesson.videoUrl) continue;

    const video = videoByUrl.get(lesson.videoUrl);
    if (!video) continue;

    // A. Check chapters (Table of Contents)
    if (video.chapters && video.chapters.length > 0) {
      for (const ch of video.chapters) {
        const score = computeTextScore(ch.label);
        if (score >= 25) {
          const timestampFormatted = formatSeconds(ch.startSeconds || 0);
          const key = `video-${lesson._id}-${ch.startSeconds}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            results.push({
              id: key,
              type: 'video',
              title: ch.label,
              description: lesson.summary || `Learn how to master ${ch.label} with hands-on examples and production best practices.`,
              courseTitle,
              courseSlug,
              courseIconIdentifier,
              moduleLabel,
              moduleTitle,
              lessonLabel,
              lessonSlug: lesson.slug?.current || lesson._id,
              duration: lesson.duration || '12:45',
              startSeconds: ch.startSeconds || 0,
              timestampFormatted,
              thumbnailUrl: lesson.thumbnailUrl,
              score: score + 12, // Chapter boost
            });
          }
        }
      }
    }

    // B. Check transcript chunks for high-relevance matches
    if (video.chunks && video.chunks.length > 0) {
      let bestChunkScore = 0;
      let bestChunk: (typeof video.chunks)[0] | null = null;

      for (const chunk of video.chunks) {
        const score = computeTextScore(chunk.text);
        if (score > bestChunkScore && score >= 35) {
          bestChunkScore = score;
          bestChunk = chunk;
        }
      }

      if (bestChunk && bestChunkScore > 0) {
        const key = `video-${lesson._id}-${bestChunk.startSeconds}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          const timestampFormatted = formatSeconds(bestChunk.startSeconds || 0);
          results.push({
            id: key,
            type: 'video',
            title: lesson.title,
            description: bestChunk.text.slice(0, 150) + '...',
            courseTitle,
            courseSlug,
            courseIconIdentifier,
            moduleLabel,
            moduleTitle,
            lessonLabel,
            lessonSlug: lesson.slug?.current || lesson._id,
            duration: lesson.duration || '12:45',
            startSeconds: bestChunk.startSeconds || 0,
            timestampFormatted,
            thumbnailUrl: lesson.thumbnailUrl,
            score: bestChunkScore,
          });
        }
      }
    }
  }

  // 2. Process Lesson Results (Matching topic, title, key points, summary, module)
  for (const meta of allLessons) {
    const { lesson, courseTitle, courseSlug, courseIconIdentifier, moduleLabel, moduleTitle, lessonLabel } = meta;

    const titleScore = computeTextScore(lesson.title);
    const summaryScore = computeTextScore(lesson.summary);
    const keyPointsScore = (lesson.keyPoints || []).reduce((max, kp) => Math.max(max, computeTextScore(kp)), 0);
    const moduleScore = computeTextScore(moduleTitle);
    const courseScore = computeTextScore(courseTitle);

    const overallLessonScore = Math.max(
      titleScore * 1.25,
      keyPointsScore * 1.05,
      moduleScore * 0.9,
      summaryScore * 0.8,
      courseScore * 0.65
    );

    if (overallLessonScore >= 25) {
      const key = `lesson-${lesson._id}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        results.push({
          id: key,
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
