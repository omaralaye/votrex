# Implementation Prompt: Vertex Intelligent Search & Results Experience

## Goal
Implement the production-style **Intelligent Search** for **Vertex** exactly matching the provided UI design (`design/vertex-search.png`). This includes connecting the Sanity Context configuration and MCP server integration, building the robust server-side search API route (`/api/search`), and creating the full Search Results page (`app/search/page.tsx` & `components/search/search-results-view.tsx`) that renders ranked video moments and lesson results over courses and lessons, with grounded data retrieval, tokenized search, specificity ranking, and PostHog analytics tracking.

---

## Skills and Reference Documentation Read
- `agents.md`:
  - Section 1 (Platform scope: plain language query returning ranked, clickable cards linking straight to video timestamps and lesson notes).
  - Section 2 (How to work: read skills, inspect code, write prompt in `prompts/`, get approval, implement, run checks, concise report).
  - Section 3 (UI reproduction: exact match to `design/vertex-search.png`, desktop layout, spacing, typography, color, and responsive fallback).
  - Section 5 (App structure & boundaries: server-only data access with read token, server search route, client search UI, no token leakage).
  - Section 6 (Tech stack: Next.js App Router, Sanity Studio, next-sanity, Tailwind CSS, TypeScript, PostHog, Clerk).
  - Section 7 (Decisions: search is Sanity Context MCP + grounded LLM/GROQ engine, surface as result cards not a chatbox, video documents as internal lookup, two-stage timestamp resolution: chapters first then transcript chunks, embedded player with start seconds param, grounded results only).
  - Section 8 (Data modeling: course, module, lesson, instructor, category, video document with chapters `{startSeconds, label}` and chunks `{startSeconds, text}`, agent context document).
  - Section 10 (Search config document: Sanity Context document holding content filter and query instructions).
  - Section 11 (Search behavior: full results page, count summary e.g. "Found 28 results across 8 courses", sort control, video results and lesson results, merge both, token-based text match with wildcards and OR logic, rank by specificity).
  - Section 12 (Security & gotchas: deployed Studio requirement for MCP, fallback to token-based GROQ search if MCP/embeddings unavailable, server-only tokens, never return whole transcript).
  - Section 13 (Checks: type check, lint, production build).
- `create-agent-with-sanity-context` (`SKILL.md`, `references/nextjs-agent.md`, `references/studio-setup.md`):
  - MCP connection pattern over HTTP with Bearer token.
  - Initial context schema injection.
  - Content filtering and tool discovery.
- `dial-your-context` (`SKILL.md`):
  - Pure deltas for dataset instructions: video lookup via `videoUrl`, chapters table of contents matching, transcript fallback, reverse course lookup.
- `shape-your-agent` (`SKILL.md`):
  - Groundedness guardrails and search ranking policy.
- `sanity-best-practices`:
  - Type-safe GROQ queries with `defineQuery`.
  - Server-side data fetching.
- `modern-web-guidance`:
  - Accessible search input, keyboard shortcut (`⌘ K`), semantic HTML, high-contrast badges, responsive layout.

---

## Code and Config Inspected
- Design image: `design/vertex-search.png`
- Schema definitions: `sanity/schemaTypes/videoType.ts`, `sanity/schemaTypes/lessonType.ts`, `sanity/schemaTypes/courseType.ts`, `sanity/schemaTypes/index.ts`
- Sanity client & data layer: `sanity/lib/client.ts`, `sanity/lib/queries.ts`, `sanity/lib/data.ts`
- Dataset files: `sanity/videos.ndjson`, `sanity/seed-data.ndjson`
- Navigation & Cards: `components/navigation/navbar.tsx`, `components/cards/lesson-video-card.tsx`, `components/cards/lesson-topic-card.tsx`, `components/cards/course-card.tsx`
- Icons: `components/icons/index.tsx`
- Home page: `app/page.tsx`
- Layout: `app/layout.tsx`
- Environment config: `.env.local`, `.env.example`

---

## Decisions & Assumptions
1. **Search Experience & Routing**:
   - Dedicated Search Results page at `app/search/page.tsx` accessible via `/search?q=<query>&sort=<sort>` wrapped in `Suspense`.
   - Home page search input (`app/page.tsx`) and any global search inputs will navigate to `/search?q=<query>` upon submission / pressing Enter.
   - Live query updating and URL synchronization on the search page.
2. **Server-Side Grounded Search Engine (`lib/search-service.ts` & `app/api/search/route.ts`)**:
   - Connects to the Sanity Context MCP endpoint (`https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}`) with Bearer `SANITY_API_READ_TOKEN`.
   - Incorporates a high-performance, grounded GROQ search engine that executes multi-token keyword queries with wildcards and OR logic:
     - **Video Moments Search**: Queries `video` documents, checks table of contents `chapters[].label` (high specificity match) and `chunks[].text` (transcript fallback match), resolves the exact `startSeconds`, and joins with the parent `lesson` via `videoUrl`.
     - **Lesson Topics Search**: Queries `lesson` documents, matches `title`, `summary`, `keyPoints`, and plain text content (`pt::text(content)`).
     - **Course & Module Derivation**: Derives the parent course (title, slug, icon identifier), module number (e.g. `Module 5`), lesson number (e.g. `Lesson 5.1`), and module title (e.g. `Data Fetching & Caching`).
   - **Ranking by Specificity**:
     - Exact title match > chapter label match > key points match > summary match > transcript chunk match.
   - **Grounded Guarantee**: Only returns real, verified courses and lessons from the datastore. Never fabricates records or timestamps.
3. **UI Implementation (`design/vertex-search.png`)**:
   - **Header Section**:
     - Top pill badge: `SEARCH RESULTS` in soft peach/orange styling.
     - Headline: Serif font `Results for “<query>”` with the query in bold orange (`#EA580C` / `#FF4405`).
     - Subtitle: `Found <X> results across <Y> courses` in neutral gray.
     - Search bar: With search icon, active query, clear button, and `⌘ K` keyboard shortcut badge.
   - **Results Controls**:
     - `<X> results` counter on the left.
     - Custom styled sort selector dropdown (`Most Relevant`, `Newest`, `Duration`) on the right.
   - **Two Dedicated Result Card Components**:
     - **Video Result Card**:
       - Left container: Dark preview thumbnail with prominent play button circle and duration overlay (e.g. `12:45`).
       - Right container: Course icon + title (`[N] Next.js for Production`), orange `VIDEO` badge, chapter/moment title (`Data Fetching in Server Components`), description, footer with `[Document] Lesson 5.1  •  [Folder] Data Fetching & Caching` on left, and `[Orange Play] Watch from 12:45  >` on right linking to `/courses/[courseSlug]/[lessonSlug]?t=[seconds]` (or `/lesson/[lessonSlug]?t=[seconds]`).
     - **Lesson Result Card**:
       - Left container: Light gray key points box with bulleted items (`• Fetching strategies`, `• Caching techniques`) and check circle icon.
       - Right container: Course icon + title (`[N] Next.js for Production`), purple `LESSON` badge, lesson title (`Data Fetching & Caching`), description, footer with `Module 5` on left, and `View lesson ↗ >` on right linking to `/courses/[courseSlug]/[lessonSlug]` (or `/lesson/[lessonSlug]`).
   - **Bottom Banner ("Can't find what you're looking for?")**:
     - Soft orange square icon container with search icon.
     - Title: `Can't find what you're looking for?`.
     - Subtitle: `Try different keywords or browse our full course catalog.`.
     - Action: `Browse all courses →` button linking to `/courses`.
4. **Sanity Context Schema**:
   - Register `agentContextType.ts` (`sanity.agentContext` / `agent.context`) in Sanity schema definitions so Studio editors can author instructions and content filters.
5. **PostHog Analytics**:
   - Instrument `search_performed` (query, results count, courses count), `search_result_clicked` (result type, id, title, target URL, timestamp), and `search_sort_changed`.

---

## Files to Create / Modify
1. `sanity/schemaTypes/agentContextType.ts`: Schema definition for Sanity Context documents.
2. `sanity/schemaTypes/index.ts`: Register `agentContextType` in schema types list.
3. `lib/search-service.ts`: Server-side search service implementing MCP integration, grounded GROQ queries, video chapter/transcript resolution, and specificity ranking.
4. `app/api/search/route.ts`: Server API endpoint for search requests (`GET` and `POST`).
5. `components/icons/index.tsx`: Add `FolderIcon` and any missing utility icons.
6. `components/cards/lesson-video-card.tsx`: Enhance and align card to horizontal video result design.
7. `components/cards/lesson-topic-card.tsx`: Enhance and align card to horizontal lesson result design.
8. `components/search/search-results-view.tsx`: Main interactive search results view component.
9. `app/search/page.tsx`: Search page route with Suspense boundary and metadata.
10. `app/page.tsx`: Update home page search bar to submit and navigate to `/search?q=...`.

---

## Security Considerations
- `SANITY_API_READ_TOKEN` is used strictly server-side and never exposed to client-side bundles.
- Search queries are tokenized and sanitized to prevent injection into GROQ queries.
- External links use `rel="noopener noreferrer"`.
- Results are strictly validated and formatted before output.

---

## Acceptance Criteria
- [ ] Dedicated `/search` page accurately reproduces `design/vertex-search.png` layout, typography, colors, badges, and spacing.
- [ ] Server search route (`/api/search`) executes multi-term token-based grounded search over courses, lessons, and video chapters/transcripts.
- [ ] Video results display course icon & name, `VIDEO` badge, moment title, description, module & lesson labels, and link to lesson page with timestamp seeking parameter (`?t=<seconds>`).
- [ ] Lesson results display course icon & name, `LESSON` badge, lesson title, description, key points box, module label, and link to lesson page.
- [ ] Results count summary ("Found X results across Y courses") and sort selector work properly.
- [ ] Bottom discovery banner ("Can't find what you're looking for?") renders with `Browse all courses →` button.
- [ ] Home page hero search input navigates to `/search?q=<query>` on Enter / Submit.
- [ ] Keyboard shortcut `⌘ K` focuses the search bar.
- [ ] PostHog analytics captures search and click events.
- [ ] TypeScript (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`) pass cleanly.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/` and type `data fetching` in the hero search box, then press Enter.
2. Verify browser navigates to `http://localhost:3000/search?q=data+fetching`.
3. Verify the page displays `Results for “data fetching”` with the search term in orange, and `Found 28 results across 8 courses` (or matching count).
4. Verify video result cards render with dark video preview on left with duration overlay, orange `VIDEO` badge, course icon/title, topic title, description, `Lesson 5.1 • Data Fetching & Caching`, and `Watch from 12:45 >`.
5. Click `Watch from 12:45 >` and verify it navigates to the lesson page with the timestamp parameter (`?t=765` or `?start=765`).
6. Verify lesson result cards render with key points box on left, purple `LESSON` badge, course icon/title, lesson title, description, `Module 5`, and `View lesson ↗ >`.
7. Test sorting selector (`Most Relevant`, `Newest`, `Duration`).
8. Test searching other topics (e.g. `Docker`, `TypeScript`, `Server Components`, `Authentication`).
9. Search for a nonexistent term (e.g. `xyznonexistent`) and verify the empty state.
