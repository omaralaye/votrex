# Implementation Prompt: Sanity Content Model, Studio & Server-Side Data Layer

## Goal
Implement the complete Sanity content model, Studio structure, server-side read client, and data access layer for **Vertex** according to `AGENTS.md` specifications. This encompasses schema types for `course`, embedded `module` objects, `lesson`, `instructor`, and `category`, along with supporting object types (`learningOutcome`, `resource`), Studio structure organization, secure server-side client configuration reading from private datasets with token support, typed GROQ queries, data access functions (catalog, course detail, lesson view with reverse lookup, instructor profile, category listing), updated seed data (`sanity/seed-data.ndjson` & `sanity/seed.mjs`), and canonical `.env.example`.

---

## Skills and Reference Documentation Read
- `AGENTS.md`: Section 5 (Structure & boundaries), Section 7 (Decisions), Section 8 (Data modeling specifications), Section 12 (Private dataset & security), Section 13 (Checks).
- `sanity-best-practices` (`references/schema.md`, `references/groq.md`, `references/nextjs.md`): Strict definition syntax (`defineType`, `defineField`, `defineArrayMember`), data > presentation modeling, query maintenance with `defineQuery`, `next-sanity` server live queries, and private token handling.
- Existing project files in `sanity/`, `app/`, and `components/`.

---

## Code and Config Inspected
- `sanity/schemaTypes/`: Existing partial `courseType.ts`, `lessonType.ts`, `instructorType.ts`, `tagType.ts`, `index.ts`.
- `sanity/lib/client.ts`, `sanity/lib/live.ts`, `sanity/lib/queries.ts`, `sanity/lib/image.ts`, `sanity/env.ts`.
- `sanity.config.ts`, `sanity.cli.ts`, `sanity/structure.ts`.
- `sanity/seed-data.ndjson`, `sanity/seed.mjs`.
- `.env.local` (containing project IDs, dataset, and Clerk keys).

---

## Decisions & Assumptions
1. **Content Architecture (`AGENTS.md` Section 8)**:
   - **`category` (Document)**: `title` (string, req), `slug` (slug, req), `description` (text), `icon` (string identifier or icon name).
   - **`instructor` (Document)**: `name` (string, req), `slug` (slug, req), `role` (string headline/expertise), `avatar` (image with hotspot), `bio` (portable text).
   - **`lesson` (Document)**: `title` (string, req), `slug` (slug, req), `videoUrl` (url/string), `thumbnail` (image with hotspot), `duration` (string, e.g. "12:45"), `isFreePreview` (boolean), `studentCount` (number), `summary` (text), `content` / `notes` (portable text), `keyPoints` (array of strings / key points), `proTip` (text), `resources` (array of resource objects with title, type, description, url, fileSize, fileFormat). Reverse-reference to course will be used in queries rather than storing parent course in document.
   - **`module` (Embedded Object)**: Embedded inside `course.modules[]`. Contains `title` (string, req), `summary` (text), `lessons` (array of references to `lesson`).
   - **`course` (Document)**: `title` (string, req), `slug` (slug, req), `description` / `summary` (text), `coverImage` (image with hotspot), `level` (string: Beginner, Intermediate, Advanced), `price` (number, default 0 or null for free), `duration` (string, e.g. "18h 24m"), `isPopular` (boolean), `studentCount` (number), `iconIdentifier` (string: nextjs, docker, typescript, react, node, etc.), `learningOutcomes` (array of outcome objects: icon, title, description), `instructor` (reference to `instructor`), `category` (reference to `category`), `modules` (array of `module` objects), `overview` (portable text).
   - **Helper Objects**: `learningOutcome` object and `resource` object cleanly modularized in `sanity/schemaTypes/objects/`.
2. **Studio Structure (`sanity/structure.ts`)**:
   - Organized desk structure with categorized list items: Courses, Categories, Instructors, Lessons, with distinct icons and preview subtitles (e.g. course level, module count, lesson duration, category count).
3. **Server-Side Read Client & Security (`AGENTS.md` Section 5 & 12)**:
   - Server-only client (`sanity/lib/server.ts` and updated `sanity/lib/client.ts` / `sanity/lib/live.ts`) using `serverToken: process.env.SANITY_API_READ_TOKEN` ensuring private dataset reads never leak tokens to the browser.
   - Export standard `sanityFetch` with live revalidation & tag cache options.
4. **Data Access Layer (`sanity/lib/data.ts` & `sanity/lib/queries.ts`)**:
   - Fully-typed server functions wrapping `defineQuery` for:
     - `getCourses(filters?: { categorySlug?: string; level?: string; search?: string })`
     - `getCourseBySlug(slug: string)`: Deeply resolves instructor, category, modules with all referenced lessons, learning outcomes, and overview.
     - `getAllCourseSlugs()`: For static generation / routing.
     - `getLessonBySlug(courseSlug: string, lessonSlug: string)` or `getLessonBySlug(slug: string)`: Resolves lesson details, parent course metadata, module position (e.g., Module 2, Lesson 2.3), next lesson, previous lesson, instructor, and resources.
     - `getAllCategories()` & `getCategoryBySlug(slug: string)` (with associated courses).
     - `getAllInstructors()` & `getInstructorBySlug(slug: string)` (with authored courses).
     - `getPopularCourses(limit?: number)`.
5. **Seed Data & Environment**:
   - Update `sanity/seed-data.ndjson` and `sanity/seed.mjs` with rich, coherent seed data (Next.js for Production, Docker Essentials, TypeScript Deep Dive with real modules, lessons, instructors, categories, key points, resources, and learning outcomes).
   - Create `.env.example` documenting all client and server environment variables.

---

## Files to Create / Modify
- `sanity/schemaTypes/objects/learningOutcome.ts`: Define learning outcome object schema.
- `sanity/schemaTypes/objects/resource.ts`: Define lesson resource object schema.
- `sanity/schemaTypes/objects/moduleType.ts`: Define embedded course module object schema.
- `sanity/schemaTypes/categoryType.ts`: Define category document schema.
- `sanity/schemaTypes/instructorType.ts`: Update instructor document schema.
- `sanity/schemaTypes/lessonType.ts`: Update lesson document schema with video URL, thumbnail, duration, free preview, notes, key points, pro tip, resources.
- `sanity/schemaTypes/courseType.ts`: Update course document schema with modules, outcomes, price, isPopular, studentCount, category reference, instructor reference.
- `sanity/schemaTypes/index.ts`: Register all document and object schema types.
- `sanity/structure.ts`: Configure organized Sanity Studio desk structure with grouped document views and icons.
- `sanity/lib/client.ts`: Configure client and server token handling.
- `sanity/lib/live.ts`: Configure `defineLive` with server token from `SANITY_API_READ_TOKEN`.
- `sanity/lib/queries.ts`: Comprehensive GROQ queries using `defineQuery` for courses, modules, lessons, instructors, categories, and reverse lookups.
- `sanity/lib/data.ts`: High-level data access layer functions for fetching and formatting typed content lake responses.
- `sanity/seed-data.ndjson`: Comprehensive NDJSON seed file representing the full data model.
- `sanity/seed.mjs`: Updated seed script verifying dataset insertion.
- `.env.example`: Canonical template of all environment variables.

---

## Acceptance Criteria
- [x] All 5 core content types (`course`, `module`, `lesson`, `instructor`, `category`) and support objects (`learningOutcome`, `resource`) are strictly defined using `defineType`, `defineField`, and `defineArrayMember`.
- [x] Sanity Studio is mounted cleanly at `/studio` with custom Structure displaying organized navigation and accurate document previews.
- [x] Server-side read client safely reads from Sanity with token isolation (no token leaked to client).
- [x] Data access layer provides clean, typed functions for all primary queries (all courses, course by slug with nested modules & lessons, lesson by slug with course context & navigation, instructors, categories).
- [x] Seed dataset is updated and compatible with the new schema types.
- [x] TypeScript compilation and Next.js lint pass without errors.

---

## Checks to Run
- `npm run lint` (ESLint checks across the codebase)
- `npx tsc --noEmit` (TypeScript type check)
- `npm run build` (Next.js production build verification)

---

## Manual Test Steps
1. Run `npm run dev` and navigate to `http://localhost:3000/studio`.
2. Inspect the Studio structure: verify Course, Category, Instructor, and Lesson document lists render with proper icons.
3. Open a Course document: verify fields for Category, Instructor, Modules (with embedded lesson references), Learning Outcomes, Price, Level, Duration, and Overview.
4. Verify server-side data fetching functions work cleanly in Next.js Server Components.
