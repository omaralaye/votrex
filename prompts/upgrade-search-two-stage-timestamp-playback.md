# Implementation Prompt: Two-Stage Timestamp Resolution Search & On-Site Timestamped Playback

## Goal
Upgrade the search engine and video playback experience on **Vertex** with:
1. **Two-Stage Timestamp Resolution**:
   - **Stage 1 (Chapters First)**: High-confidence semantic matching against video chapter markers (Table of Contents). If matching chapters are found for a lesson, resolve to that chapter's exact timestamp (`startSeconds`) with chapter metadata and relevance boost.
   - **Stage 2 (Transcript Fallback)**: If no chapter matches the query for a video lesson, fall back to searching timestamped transcript chunks (`video.chunks`), resolving to the exact second where the spoken dialogue occurs, with contextual snippet extraction.
2. **On-Site Timestamped Playback & Deep Linking**:
   - Result cards link directly to the lesson page with the exact matched timestamp parameter (`/courses/[courseSlug]/[lessonSlug]?t=[seconds]`).
   - The embedded player (supporting YouTube, Vimeo, Bunny, and Direct HTML5 video) automatically seeks to and plays from the matched second on-site, with visual timestamp indicators, resume affordances, and PostHog analytics tracking.

---

## Skills and Reference Documentation Read
- `agents.md`:
  - Section 1 (Scope: plain language query returning ranked, clickable cards linking straight to video timestamps and lesson notes).
  - Section 2 (Workflow: inspect code, write prompt in `prompts/`, get approval via interactive question panel, implement, run checks, concise report).
  - Section 5 (App boundaries: server-side search API, client search UI, no client token leakage).
  - Section 7 (Decisions: two-stage timestamp resolution: chapters first then transcript chunks; embedded provider player on lesson page with start seconds query param; grounded results only).
  - Section 8 (Data modeling: video document with chapters `{startSeconds, label}` and chunks `{startSeconds, text}`).
  - Section 11 (Search behavior: full results page, count summary, sort control, video results and lesson results, token-based text match with wildcards and OR logic, rank by specificity).
  - Section 12 (Security & gotchas: server-only tokens, never return whole transcript).
  - Section 13 (Checks: type check, lint, build).
- `sanity-best-practices` (`SKILL.md`):
  - Server-side data fetching, type-safe GROQ queries, structured data models.
- `modern-web-guidance` (`SKILL.md`):
  - Accessible video controls, keyboard shortcuts, high-contrast badges, responsive layouts.

---

## Code and Config Inspected
- Search Service: `lib/search-service.ts`
- Search API Route: `app/api/search/route.ts`
- Search Page & UI: `app/search/page.tsx`, `components/search/search-results-view.tsx`
- Result Cards: `components/cards/lesson-video-card.tsx`, `components/cards/lesson-topic-card.tsx`
- Video Player: `components/lesson/video-player.tsx`
- Lesson Page & View: `components/lesson/lesson-view.tsx`, `app/courses/[slug]/[lessonSlug]/page.tsx`, `app/courses/[slug]/lesson/[lessonSlug]/page.tsx`, `app/lesson/[slug]/page.tsx`
- Video Schemas & Seed: `sanity/schemaTypes/videoType.ts`, `sanity/schemaTypes/lessonType.ts`, `sanity/videos.json`, `sanity/seed-data.ndjson`

---

## Decisions & Assumptions
1. **Two-Stage Timestamp Resolution Algorithm (`lib/search-service.ts`)**:
   - For each course lesson with a linked video:
     - **Stage 1 (Chapters First)**:
       - Match query tokens and morphological stems against all chapter labels in `video.chapters`.
       - If matching chapters score above threshold (`score >= 25`), resolve the highest-scoring chapter moment with `startSeconds`, `timestampFormatted`, chapter title, and chapter boost (+12 pts).
       - Mark result item with `matchStage: 'chapter'`.
     - **Stage 2 (Transcript Fallback)**:
       - If no chapter matched the query for that video (or chapters scored below threshold):
       - Scan `video.chunks` to find the highest-scoring transcript chunk matching the query terms/stems (`score >= 30`).
       - If a matching chunk is found, resolve to that chunk's `startSeconds`, formatted timestamp, and excerpt snippet.
       - Mark result item with `matchStage: 'transcript'`.
   - **Lesson Topic Matching**:
     - Also search lessons on their title, key points, module title, and summary to generate `LESSON` cards (`type: 'lesson'`).
   - **Specificity Ranking**:
     - Exact title match > chapter label match > key points match > summary match > transcript chunk match.
     - Support sort modes: `relevance` (default), `newest`, and `duration`.

2. **Result Cards Deep Linking (`components/search/search-results-view.tsx` & `components/cards/lesson-video-card.tsx`)**:
   - Video result cards generate href: `/courses/${courseSlug}/${lessonSlug}?t=${startSeconds}`.
   - Display clear "Watch from MM:SS" call-to-action with play icon.
   - Lesson result cards link to `/courses/${courseSlug}/${lessonSlug}`.
   - Click handlers capture rich PostHog analytics (`search_result_clicked` and `search_result_opened`).

3. **On-Site Timestamped Playback (`components/lesson/video-player.tsx` & `components/lesson/lesson-view.tsx`)**:
   - Lesson routes parse `start`, `t`, `seconds` URL search parameters into `startSeconds`.
   - `VideoPlayer` component handles playback initialization and dynamic seeking across all providers:
     - **YouTube**: Loads embed with `start=${Math.floor(startSeconds)}` and `autoplay=1&enablejsapi=1`. If already mounted and timestamp changes, sends `seekTo` postMessage.
     - **Vimeo**: Loads embed with `#t=${Math.floor(startSeconds)}s` and `autoplay=1`. If already mounted, sends `setCurrentTime` postMessage.
     - **Bunny**: Appends `?t=${Math.floor(startSeconds)}&autoplay=true`.
     - **HTML5 Direct Video**: Seeks `video.currentTime = startSeconds` on metadata load and play, with `#t=${startSeconds}` media fragment identifier.
   - **Visual Feedback**:
     - Poster display shows "Resume at MM:SS" or "Play from MM:SS" with pre-filled progress bar at `startSeconds`.
     - Displays an active "Playing from MM:SS" badge when deep linked with a timestamp, with a quick "Restart from 00:00" button.
   - **Analytics**:
     - PostHog tracks `video_played` (with `start_seconds`, `is_resumed: true`), `video_resume_used`, and milestone watch depths (`video_watch_depth`).

---

## Files to Touch / Modify
1. `lib/search-service.ts`:
   - Implement clear two-stage timestamp resolution logic (Chapters First -> Transcript Fallback).
   - Add `matchStage` ('chapter' | 'transcript' | 'lesson') to `SearchResultItem`.
   - Refine tokenization, stemming, scoring, and specificity ranking.
2. `components/lesson/video-player.tsx`:
   - Ensure robust timestamp seeking across YouTube, Vimeo, Bunny, and HTML5 Direct video.
   - Add postMessage seeking support for active iframe players.
   - Add timestamp badge indicator with "Restart from 00:00" quick action when starting from a timestamp.
3. `components/search/search-results-view.tsx`:
   - Ensure accurate deep link URLs (`/courses/[courseSlug]/[lessonSlug]?t=[seconds]`).
   - Enhance PostHog tracking for timestamped clicks.
4. `components/cards/lesson-video-card.tsx`:
   - Verify timestamp formatting, hover states, and "Watch from MM:SS" link actions.
5. `components/lesson/lesson-view.tsx`:
   - Pass `startSeconds` to `VideoPlayer` and instrument resume tracking.

---

## Security & Architectural Considerations
- Data fetching remains server-side only; tokens are not exposed to the client.
- Video documents remain internal lookup structures and are never exposed wholesale to users.
- URLs and query parameters are safely parsed and sanitized.
- All external links retain `rel="noopener noreferrer"`.

---

## Acceptance Criteria
- [ ] Search executes two-stage timestamp resolution: chapters first, then transcript chunks fallback if no chapter matches.
- [ ] Video search results accurately reflect matched timestamp (`startSeconds`), formatted time (`timestampFormatted`), and chapter/transcript metadata.
- [ ] Video result cards deep link directly to `/courses/[courseSlug]/[lessonSlug]?t=[seconds]` (or `/courses/[courseSlug]/lesson/[lessonSlug]?t=[seconds]`).
- [ ] Clicking a video result card opens the lesson page and the embedded player seeks to the matched second.
- [ ] The player visually displays the starting timestamp and allows jumping to start (00:00) or seeking.
- [ ] YouTube, Vimeo, Bunny, and Direct video formats all seek correctly to `startSeconds`.
- [ ] PostHog analytics tracks `search_performed`, `search_result_clicked`, `video_played`, and `video_resume_used`.
- [ ] TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`) pass cleanly with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Exact Manual Test Steps
1. Navigate to `http://localhost:3000/search?q=App+Router`.
2. Observe results:
   - Video result for Chapter: "Evolution from Pages Router to full App Router architecture" resolved at timestamp `03:00` (`180s`) via Stage 1 (Chapter match).
3. Click "Watch from 03:00" on the result card.
4. Verify browser navigates to `/courses/nextjs-for-production/nextjs-15-react-19-architecture-overview?t=180`.
5. Verify the video player shows "Resume at 3:00" on the poster and begins playback at second 180 (03:00).
6. Search for a specific spoken phrase from transcript fallback (e.g. `http chunked transfer encoding` or `Direct database access`).
7. Verify Stage 2 (Transcript fallback) resolves the exact timestamp second (e.g. `435s` or `190s`) with spoken snippet text.
8. Click the result card and verify the video player seeks directly to that exact second.
9. Test sorting options (`Most Relevant`, `Newest`, `Duration`) and verify correct ordering.
