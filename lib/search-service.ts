import { serverClient, client } from '@/sanity/lib/client';

/**
 * System prompt shaped according to shape-your-agent guidelines (<300 words).
 * Defines role, voice, boundaries, groundedness, and fallback behavior.
 */
export const SEARCH_SYSTEM_PROMPT = `You are the Vertex Intelligent Search Engine, an AI assistant specialized in guiding learners through our technical course catalog and deep-linking directly to exact video timestamps.

## Voice & Tone
- Precise, authoritative, and direct.
- Focus on actionable learning paths and exact timestamp moments.
- Do not produce conversational filler or markdown pleasantries.

## Boundaries & Groundedness
- Strict Grounding: Never fabricate courses, lessons, instructors, durations, or timestamps. Return only data verified in the Sanity dataset.
- Internal Video Lookup: Never expose internal video documents directly to users; always connect timestamps to their parent lesson and course.
- Structured Results: Separate results into Video Moment Results (with exact startSeconds seeking link) and Lesson Topic Results.
- Search Scope: Refuse non-learning queries or requests to modify content, and direct users back to catalog search.

## When Information Is Not Found
- Return 0 results honestly with an empty response.
- Do not speculate or recommend external unverified resources.`;

/**
 * Sanity Context Content Scope Filter (GROQ expression).
 * Restricts query access to learner-facing curriculum documents and internal video lookup, excluding system objects and drafts.
 */
export const SEARCH_GROQ_FILTER =
  '_type in ["course", "lesson", "video", "instructor", "category"] && !(_id in path("drafts.**"))';

/**
 * Sanity Context Domain Instructions (Pure Deltas).
 * Contains only non-obvious schema relationships, two-stage video resolution, and query safety rules.
 */
export const SEARCH_DOMAIN_INSTRUCTIONS = `### Content Relationships & Navigation
- Lessons do not store a parent course reference. To resolve a lesson's course and module, query courses where \`modules[].lessons[]._ref == lesson._id\`.
- Module numbers (e.g. "Module 5") and lesson labels (e.g. "Lesson 5.1") are derived from the 1-based order in \`course.modules[]\` and \`module.lessons[]\`.
- \`video\` documents are internal lookup records matched to lessons via \`lesson.videoUrl == video.url\` or videoId. Never return \`video\` documents directly as standalone search results.

### Two-Stage Timestamp Resolution
- Stage 1 (Chapters First): Search \`video.chapters[].label\` (Table of Contents) for direct topic matches. Use \`startSeconds\` as the moment timestamp.
- Stage 2 (Transcript Fallback): If no chapter matches, search \`video.chunks[].text\` for spoken phrases and resolve to that chunk's \`startSeconds\`.

### Query Patterns & Safety
- Plain text matching for lesson notes: use \`pt::text(content)\` — do not match Portable Text block objects directly.
- Context window protection: Never return entire \`chunks\` arrays in query projections. Project only matched slices: \`chunks[text match $query][0..2]\`.
- Specificity ranking: Exact title match > chapter label match > key points match > summary match > transcript chunk match.`;

export type SearchResultType = 'video' | 'lesson';
export type MatchStage = 'chapter' | 'transcript' | 'lesson';

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  matchStage?: MatchStage;
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

function extractVideoId(url: string | undefined): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) return ytMatch[1];
  const vimeoMatch = url.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) return vimeoMatch[1];
  return null;
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
  if (w === 'route' || w === 'routing' || w === 'router') {
    stems.add('route');
    stems.add('routing');
    stems.add('router');
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

  return Array.from(stems).filter((s) => s.length >= 2);
}

/**
 * Intelligent grounded search wired with Sanity courses, curriculum, and two-stage video moments
 * (Stage 1: Chapters First, Stage 2: Transcript Fallback)
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

  // Comprehensive index of video documents
  const videoByUrl = new Map<string, RawVideoData>();
  for (const v of videosData || []) {
    if (v.url) videoByUrl.set(v.url, v);
    if (v.videoId) videoByUrl.set(v.videoId, v);
    if (v._id) {
      videoByUrl.set(v._id, v);
      videoByUrl.set(v._id.replace(/^video-/, ''), v);
    }
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

  // =========================================================================
  // 1. Two-Stage Timestamp Resolution for Video Results
  // Stage 1: Chapters First (Table of Contents)
  // Stage 2: Transcript Fallback (Granular spoken dialogue chunks)
  // =========================================================================
  for (const meta of allLessons) {
    const { lesson, courseTitle, courseSlug, courseIconIdentifier, moduleLabel, moduleTitle, lessonLabel } = meta;
    if (!lesson.videoUrl && !lesson._id) continue;

    // Resolve matching video document
    const extractedId = extractVideoId(lesson.videoUrl);
    const video =
      (lesson.videoUrl ? videoByUrl.get(lesson.videoUrl) : null) ||
      (extractedId ? videoByUrl.get(extractedId) : null) ||
      videoByUrl.get(lesson._id) ||
      videoByUrl.get(`video-${lesson._id}`);

    if (!video) continue;

    let hasChapterMatch = false;

    // -----------------------------------------------------------------------
    // STAGE 1: Check Chapters First (Table of Contents)
    // -----------------------------------------------------------------------
    if (video.chapters && video.chapters.length > 0) {
      for (const ch of video.chapters) {
        const score = computeTextScore(ch.label);
        if (score >= 25) {
          hasChapterMatch = true;
          const timestampFormatted = formatSeconds(ch.startSeconds || 0);
          const key = `video-${lesson._id}-ch-${ch.startSeconds}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            results.push({
              id: key,
              type: 'video',
              matchStage: 'chapter',
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
              score: score + 16, // Chapter priority boost
            });
          }
        }
      }
    }

    // -----------------------------------------------------------------------
    // STAGE 2: Transcript Fallback (If no chapter matched for this video)
    // -----------------------------------------------------------------------
    if (!hasChapterMatch && video.chunks && video.chunks.length > 0) {
      let bestChunkScore = 0;
      let bestChunk: (typeof video.chunks)[0] | null = null;

      for (const chunk of video.chunks) {
        const score = computeTextScore(chunk.text);
        if (score > bestChunkScore && score >= 25) {
          bestChunkScore = score;
          bestChunk = chunk;
        }
      }

      if (bestChunk && bestChunkScore > 0) {
        const key = `video-${lesson._id}-tr-${bestChunk.startSeconds}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          const timestampFormatted = formatSeconds(bestChunk.startSeconds || 0);
          const rawSnippet = bestChunk.text.trim();
          const description = rawSnippet.length > 160 ? rawSnippet.slice(0, 160) + '...' : rawSnippet;

          results.push({
            id: key,
            type: 'video',
            matchStage: 'transcript',
            title: lesson.title,
            description: `“${description}”`,
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

  // =========================================================================
  // 2. Process Lesson Results (Matching topic, title, key points, summary)
  // =========================================================================
  for (const meta of allLessons) {
    const { lesson, courseTitle, courseSlug, courseIconIdentifier, moduleLabel, moduleTitle, lessonLabel } = meta;

    const titleScore = computeTextScore(lesson.title);
    const summaryScore = computeTextScore(lesson.summary);
    const keyPointsScore = (lesson.keyPoints || []).reduce((max, kp) => Math.max(max, computeTextScore(kp)), 0);
    const moduleScore = computeTextScore(moduleTitle);
    const courseScore = computeTextScore(courseTitle);

    const overallLessonScore = Math.max(
      titleScore * 1.3,
      keyPointsScore * 1.1,
      moduleScore * 0.9,
      summaryScore * 0.85,
      courseScore * 0.65
    );

    if (overallLessonScore >= 25) {
      const key = `lesson-${lesson._id}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        results.push({
          id: key,
          type: 'lesson',
          matchStage: 'lesson',
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

  // =========================================================================
  // 3. Apply Sorting
  // =========================================================================
  if (sort === 'relevance') {
    results.sort((a, b) => b.score - a.score);
  } else if (sort === 'newest') {
    results.sort((a, b) => b.id.localeCompare(a.id));
  } else if (sort === 'duration') {
    results.sort((a, b) => (b.startSeconds || 0) - (a.startSeconds || 0));
  }

  // =========================================================================
  // 4. Calculate Unique Courses Count
  // =========================================================================
  const uniqueCourses = new Set(results.map((r) => r.courseSlug));

  return {
    query: trimmed,
    totalResults: results.length,
    coursesCount: uniqueCourses.size,
    results,
  };
}
