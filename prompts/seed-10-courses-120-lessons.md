# Implementation Prompt: 10 Comprehensive Courses, 120 Unique Lessons, YouTube Video URLs & Seeded Picsum Thumbnails

## Goal
Generate and seed a production-ready catalog of **10 comprehensive tech courses** comprising **~120 individual lessons** into Sanity. Every lesson will feature a **unique, domain-relevant YouTube video URL** and deterministic **Lorem Picsum image thumbnails by seed** (`https://picsum.photos/seed/<seed>/...`). In addition, update Sanity schemas, GROQ queries, data access layer, Next.js image configurations, `videos.json`, `videos.ndjson`, `seed-data.ndjson`, and `seed.mjs` to seamlessly support direct seeded image URLs alongside Sanity image assets.

---

## Skills and Reference Documentation Read
- `AGENTS.md`: Section 2 (Loop & prompts), Section 8 (Data modeling specifications), Section 9 (Video transcript ingestion), Section 11 (Search behavior), Section 13 (Checks).
- `sanity-best-practices` (`references/schema.md`, `references/groq.md`, `references/nextjs.md`): Schema definitions (`defineType`, `defineField`), GROQ projections, typed queries with `defineQuery`.
- `sanity-migration`: Structuring and importing `.ndjson` files into Sanity content lake.

---

## Code and Config Inspected
- `sanity/schemaTypes/courseType.ts`: Schema for course document.
- `sanity/schemaTypes/lessonType.ts`: Schema for lesson document (video URL, thumbnail, duration, notes, resources).
- `sanity/schemaTypes/instructorType.ts`: Schema for instructor document (name, avatar, bio).
- `sanity/schemaTypes/categoryType.ts`: Schema for category document.
- `sanity/seed-data.ndjson`: Existing 11 courses / 48 lessons using duplicate video URL `wm5gMKuwSYk`.
- `sanity/videos.json` & `sanity/videos.ndjson`: Existing video transcript intelligence records.
- `sanity/seed.mjs`: Script for bulk transactional import into Sanity Content Lake.
- `sanity/lib/queries.ts` & `sanity/lib/data.ts`: Server-side GROQ queries and data access layer.
- `next.config.ts`: Remote image domain whitelist for `picsum.photos`.

---

## Decisions & Assumptions

1. **Course & Lesson Catalog Structure**:
   - Exactly **10 flagship courses** across 6 core categories (Frontend, DevOps, Languages, AI & Machine Learning, Backend, Cybersecurity):
     1. `course-nextjs`: Next.js for Production (3 modules, 12 lessons)
     2. `course-docker`: Docker & Container Engineering (3 modules, 12 lessons)
     3. `course-typescript`: TypeScript Deep Dive & Metaprogramming (3 modules, 12 lessons)
     4. `course-ai-agents`: Building Production AI Agents & RAG Systems (3 modules, 12 lessons)
     5. `course-react-patterns`: Advanced React 19 & State Architecture (3 modules, 12 lessons)
     6. `course-kubernetes`: Kubernetes & Cloud-Native Architecture (3 modules, 12 lessons)
     7. `course-nodejs-microservices`: High-Throughput Node.js Microservices (3 modules, 12 lessons)
     8. `course-postgresql-mastery`: PostgreSQL Deep Dive & Database Tuning (3 modules, 12 lessons)
     9. `course-python-ai-data`: Python for Data Engineering & Machine Learning (3 modules, 12 lessons)
     10. `course-web-security`: Full-Stack Web Security & Penetration Testing (3 modules, 12 lessons)
   - Total: **10 courses, 30 modules, 120 lessons**.

2. **Unique, Domain-Relevant YouTube Videos**:
   - Every single one of the 120 lessons has its own **unique, topic-specific YouTube video URL** (`https://www.youtube.com/watch?v=<videoId>`).
   - Corresponding video intelligence data (`videoId`, `url`, `chapters`, and timestamped `chunks`) generated in `sanity/videos.json`, `sanity/videos.ndjson`, and `sanity/seed-data.ndjson` for grounded search and chapter navigation.

3. **Seeded Lorem Picsum Image Thumbnails**:
   - Every lesson has a deterministic thumbnail URL: `https://picsum.photos/seed/<lesson-id-or-slug>/640/360`.
   - Every course has a deterministic cover image URL: `https://picsum.photos/seed/<course-id-or-slug>/1280/720`.
   - Every instructor has a deterministic avatar URL: `https://picsum.photos/seed/<instructor-id-or-slug>/400/400`.
   - Update schemas (`lessonType.ts`, `courseType.ts`, `instructorType.ts`) to support `thumbnailUrl`, `coverImageUrl`, `avatarUrl` alongside standard Sanity `image` fields.
   - Update `sanity/lib/queries.ts` and `sanity/lib/data.ts` to return direct URL fields with automatic fallback to Picsum seed URLs when asset references are not uploaded.
   - Update `next.config.ts` to allow `picsum.photos` in `images.remotePatterns`.

4. **Rich Content Completeness**:
   - Every lesson includes `title`, `slug`, `duration`, `isFreePreview`, `studentCount`, `summary`, `keyPoints` (3-4 bullet strings), `proTip`, `resources` (downloadable files/repos/specs), and `content` (Portable Text blocks).
   - Every course includes `title`, `slug`, `description`, `level`, `price`, `duration`, `isPopular`, `studentCount`, `iconIdentifier`, `category` reference, `instructor` reference, `learningOutcomes` (3 structured outcomes), `modules` (3 embedded modules referencing 4 lessons each), and `overview` (Portable Text blocks).

---

## Files to Create / Modify
- `sanity/schemaTypes/lessonType.ts`: Add `thumbnailUrl` field definition.
- `sanity/schemaTypes/courseType.ts`: Add `coverImageUrl` field definition.
- `sanity/schemaTypes/instructorType.ts`: Add `avatarUrl` field definition.
- `sanity/lib/queries.ts`: Update GROQ queries to project `thumbnailUrl`, `coverImageUrl`, `avatarUrl`.
- `sanity/lib/data.ts`: Update TypeScript interfaces to include optional URL fields with fallback helpers.
- `sanity/seed-data.ndjson`: Comprehensive NDJSON file containing 10 courses, 120 lessons, 6 instructors, 6 categories, and 120 video intelligence documents.
- `sanity/videos.json`: Formatted JSON array containing all 120 video intelligence documents with chapters & transcript chunks.
- `sanity/videos.ndjson`: Line-delimited JSON of all 120 video intelligence documents.
- `sanity/seed.mjs`: Script to import all seed data into Sanity content lake.
- `next.config.ts`: Add `picsum.photos` and `img.youtube.com` / `i.ytimg.com` to `remotePatterns`.

---

## Acceptance Criteria
- [x] Exactly 10 distinct, cohesive tech courses defined with 3 modules each.
- [x] Exactly 120 unique lessons across the 10 courses (12 lessons per course).
- [x] Every lesson contains a 100% unique YouTube video URL matching its specific lesson topic.
- [x] Every lesson, course, and instructor contains a deterministic Lorem Picsum image URL based on its unique seed.
- [x] Video intelligence files (`videos.json`, `videos.ndjson`, `seed-data.ndjson`) populated with chapter markers and transcript chunks.
- [x] Sanity schema types and GROQ queries support `thumbnailUrl`, `coverImageUrl`, and `avatarUrl`.
- [x] `next.config.ts` configured for remote images from `picsum.photos`.
- [x] `npm run lint` and `npx tsc --noEmit` pass with zero errors.

---

## Checks to Run
- `node -e "..."` validation script verifying 10 courses, 120 lessons, 120 unique YouTube URLs, and Picsum seed URLs.
- `npx tsc --noEmit` (TypeScript type check across the entire project)
- `npm run lint` (ESLint verification)
- `npm run build` (Next.js production build verification)

---

## Manual Test Steps
1. Inspect `sanity/seed-data.ndjson` to verify 10 courses and 120 lessons.
2. Run validation script to confirm all 120 `videoUrl` entries are unique valid YouTube links and all thumbnail URLs use `https://picsum.photos/seed/...`.
3. Start development server with `npm run dev` and navigate to `http://localhost:3000`.
4. Verify catalog displays courses with proper metadata and image thumbnails.
5. Open Sanity Studio at `http://localhost:3000/studio` and verify all 120 lessons and 10 courses render with clean previews.
