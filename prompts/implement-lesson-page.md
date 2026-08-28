# Implementation Prompt: Lesson Page with Video Playback & Seeded Sanity Content

## Goal
Implement the high-fidelity **Lesson Page** for **Vertex** exactly matching the provided UI design (`/home/omara/Downloads/votrex/design/vertex-lesson.png`), fully wired to the seeded Sanity CMS content lake, featuring embedded video playback (YouTube, Vimeo, Bunny, HTML5), interactive curriculum navigation sidebar, lesson overview, key points checklist, pro tip callout, resources grid, rich Portable Text notes tab, lesson navigation bar (Previous / Next Lesson), and PostHog analytics tracking.

---

## Skills and Reference Documentation Read
- `agents.md`:
  - Section 3 (UI reproduction: exact layout, typography, colors, responsive fallback).
  - Section 5 (Structure & boundaries: read-only server-side data access, server routes, no token leakage).
  - Section 7 (Decisions: embedded provider video playback, start seconds query param, no custom player, Clerk auth, progress tracking, PostHog events).
  - Section 8 (Data modeling: lesson document, module derived numbers like Lesson 5.1, resources, proTip, keyPoints, reverse course lookup).
  - Section 12 (Security & gotchas: server-side Sanity queries, private read token).
  - Section 13 (Checks to run: type check, lint, build).
- `sanity-best-practices` (`references/groq.md`, `references/nextjs.md`, `references/portable-text.md`):
  - Strict GROQ query structure with `defineQuery`.
  - Type-safe data fetching with `sanityFetch`.
  - Rich text rendering via `@portabletext/react` / `next-sanity`.
- `modern-web-guidance`:
  - Semantic HTML, accessible keyboard navigation, responsive grid and flexbox patterns, clean iframe embed wrappers with aspect-ratio.

---

## Code and Config Inspected
- Design image: `/home/omara/Downloads/votrex/design/vertex-lesson.png`
- `sanity/schemaTypes/lessonType.ts` & `sanity/schemaTypes/courseType.ts`
- `sanity/lib/queries.ts` (`LESSON_BY_SLUG_QUERY`, `COURSE_BY_SLUG_QUERY`, `ALL_LESSONS_QUERY`)
- `sanity/lib/data.ts` (`getLessonBySlug`, `getCourseBySlug`, `getAllLessons`, `LessonDetail`, `CourseDetail`)
- `sanity/seed-data.ndjson` (10 courses, 120 lessons with video URLs, keyPoints, proTips, resources, content blocks)
- `components/course/course-view.tsx` (course detail UI and patterns)
- `components/navigation/navbar.tsx` (top navigation bar)
- `components/ui/` (`badge.tsx`, `button.tsx`, `breadcrumbs.tsx`, `progress-bar.tsx`, `status-indicator.tsx`, `bottom-bars.tsx`)
- `components/cards/` (`resource-card.tsx`, `lesson-video-card.tsx`, `lesson-topic-card.tsx`)
- `components/icons/index.tsx` (icon registry)

---

## Decisions & Assumptions
1. **Routing Strategy**:
   - Primary route: `app/courses/[slug]/[lessonSlug]/page.tsx` for clean hierarchical URLs (`/courses/nextjs-for-production/native-fetch-extensions-request-deduplication`).
   - Sibling direct route: `app/lesson/[slug]/page.tsx` (and `app/courses/[slug]/lesson/[lessonSlug]/page.tsx` redirect/alias) for direct lesson access and search result landing links.
   - Dynamic parameters resolved via Server Components with metadata generation and static params support.
2. **Video Playback & Embeds (`agents.md` Section 7)**:
   - Provider embeds for YouTube (`youtube-nocookie.com/embed/${id}`), Vimeo (`player.vimeo.com/video/${id}`), Bunny Stream (`iframe.mediadelivery.net`), or direct HTML5 video.
   - Supports `start` / `t` / `seconds` URL query parameters for seeking directly to video timestamps.
   - Responsive `aspect-video` container with rounded corners and high-contrast dark styling.
3. **Module & Lesson Number Derivation (`agents.md` Section 8)**:
   - Module index and lesson index are calculated dynamically from the parent course's `modules` and `lessons` arrays (e.g., Module 5, Lesson 5.1).
   - Sibling and adjacent lesson calculation for bottom bar "Previous Lesson" and "Next Lesson" links.
4. **Interactive Sidebar**:
   - Back to course link (`← Back to course`).
   - Course summary badge with icon, title, and progress percentage with progress bar.
   - Modules accordion list with completed checkmark icons for prior modules, active expanded module with red/orange circle number, current lesson with "Now playing" indicator and play icon, and collapsed future modules.
   - Collapsible / responsive drawer on smaller screens.
5. **Tabs & Content Sections**:
   - `Lesson Content` tab:
     - Overview text
     - "In this lesson you will:" checklist with custom circular checkmarks
     - "Pro Tip" callout card with icon and highlighted advice
     - "Resources" grid using `ResourceCard` components
   - `Notes` tab:
     - Full Portable Text rendering with styled typography, code blocks, lists, links, and callouts.
6. **Bottom Navigation Bar**:
   - Previous lesson button + previous module/lesson title & duration.
   - Next lesson module/lesson title & duration + Next lesson primary action button.
7. **PostHog Analytics**:
   - Instrument `lesson_viewed`, `lesson_tab_switched`, `lesson_resource_clicked`, `lesson_navigated`, and `lesson_bookmarked`.

---

## Files to Create / Modify
1. `components/lesson/lesson-view.tsx`: Main client/server interactive lesson view component matching `design/vertex-lesson.png`.
2. `components/lesson/video-player.tsx`: Embedded video player handling YouTube, Vimeo, Bunny, and HTML5 video with start time parameter support.
3. `components/lesson/portable-text-renderer.tsx`: Custom Portable Text components for styled lesson notes.
4. `app/courses/[slug]/[lessonSlug]/page.tsx`: Course + Lesson route handler.
5. `app/lesson/[slug]/page.tsx`: Direct lesson route handler.
6. `app/courses/[slug]/lesson/[lessonSlug]/page.tsx`: Route alias handler.
7. `sanity/lib/queries.ts`: Update `LESSON_BY_SLUG_QUERY` to ensure module durations and all nested lesson metadata are fully returned.
8. `sanity/lib/data.ts`: Update `getLessonBySlug` and helper types if needed.
9. `components/course/course-view.tsx`: Wire curriculum lesson links directly to the new lesson pages.

---

## Security Considerations
- Server-side data fetching only using existing token isolation (`SANITY_API_READ_TOKEN` never exposed to client).
- Video URLs sanitised and parsed to prevent XSS in iframe `src` attributes.
- External resource links rendered with `rel="noopener noreferrer"`.
- Responsive layout handles safe user inputs and HTML entity escaping.

---

## Acceptance Criteria
- [ ] Lesson page matches `design/vertex-lesson.png` across layout, colors, typography, spacing, icons, and components.
- [ ] Video player automatically loads and plays the seeded video URL (YouTube, Vimeo, etc.) with timestamp seeking support.
- [ ] Sidebar accurately displays all course modules with derived numbers (e.g. Module 5 of 12, Lesson 5.1), completed states, and active "Now playing" indicator.
- [ ] "Lesson Content" tab displays Overview, Key Points checklist, Pro Tip box, and Resources grid.
- [ ] "Notes" tab displays full Portable Text rich content.
- [ ] Previous and Next lesson navigation buttons correctly navigate between sequential lessons.
- [ ] Responsive design functions seamlessly on desktop and mobile.
- [ ] TypeScript compilation (`tsc --noEmit`), ESLint (`npm run lint`), and Next.js production build (`npm run build`) pass cleanly.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/courses/nextjs-for-production/native-fetch-extensions-request-deduplication` (or direct `/lesson/native-fetch-extensions-request-deduplication`).
2. Verify breadcrumbs: `All Courses > Next.js for Production > Data Fetching & Caching > Native Fetch Extensions & Request Deduplication`.
3. Verify Lesson header: badge `LESSON 5.1`, title, subtitle, duration `22:40`, level `Intermediate`, and student count.
4. Verify video plays embedded on the page.
5. Verify Overview, "In this lesson you will" bullet points, "Pro Tip" card, and Resources list match the design.
6. Click "Notes" tab and verify Portable Text notes render cleanly.
7. Click "Next Lesson" and verify navigation to Lesson 5.2.
8. Verify sidebar module accordion toggling and active state styling.
