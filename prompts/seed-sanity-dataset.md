# Implementation Prompt: Seed Sanity Dataset from seed-data.ndjson & videos.json

## Goal
Seed the Sanity Content Lake (`production` dataset on project `kuezkn7a`) using the Sanity CLI (`sanity datasets import`) with the provided `sanity/seed-data.ndjson` (19 core content documents: 4 categories, 3 instructors, 9 lessons, 3 courses) and structured `sanity/videos.json` (video intelligence documents for the 3 unique lesson video URLs with chapters and timestamped transcript chunks per `AGENTS.md` sections 8 & 9). Verify document counts and reference integrity in Sanity Content Lake post-import.

---

## Skills and Reference Documentation Read
- `AGENTS.md`:
  - Section 2: How to work (read skills, inspect code, write prompt in `prompts/`, obtain confirmation via question panel, execute, verify, report).
  - Section 4: Skills to lean on (`sanity-best-practices`, `sanity-migration`).
  - Section 5: App structure & boundaries (Studio workspace vs Web workspace, private dataset token isolation).
  - Section 7: Decisions made (search grounded in data, video documents as internal lookups with TOC chapters and transcript chunks).
  - Section 8: Content model specification (`course`, embedded `module`, `lesson`, `instructor`, `category`, `video` document).
  - Section 9: Video ingestion structure (unique video URLs, chapters array of `{ startSeconds, label }`, chunks array of `{ startSeconds, text }`).
  - Section 12: Private dataset security & token management.
  - Section 13: Checks to run (import verification, typecheck, lint).
- `sanity-best-practices` (`references/schema.md`, `references/groq.md`, `references/nextjs.md`): Schema definitions, GROQ verification queries.
- `sanity-migration` (`references/general.md`): Idempotent imports (`--replace`), deterministic document IDs, post-migration verification.

---

## Code and Config Inspected
- `sanity/seed-data.ndjson`: 19 valid documents:
  - 4 categories: `category-frontend`, `category-devops`, `category-languages`, `category-backend`
  - 3 instructors: `instructor-alex`, `instructor-sarah`, `instructor-marcus`
  - 9 lessons: `lesson-nextjs-101`, `lesson-nextjs-102`, `lesson-nextjs-201`, `lesson-nextjs-202`, `lesson-docker-101`, `lesson-docker-102`, `lesson-docker-201`, `lesson-ts-101`, `lesson-ts-102`
  - 3 courses: `course-nextjs`, `course-docker`, `course-typescript`
- `sanity/schemaTypes/`: `categoryType.ts`, `courseType.ts`, `instructorType.ts`, `lessonType.ts`, `objects/`.
- `sanity.cli.ts` & `sanity.config.ts`: Sanity CLI and Studio configuration.
- `.config/sanity/config.json`: Authenticated CLI configuration.
- `.env.local`: Project ID (`kuezkn7a`), Dataset (`production`).

---

## Decisions & Assumptions
1. **Import Tooling**:
   - Use official Sanity CLI: `npx sanity datasets import <file> production --replace` for atomic, idempotent document seeding.
2. **Video Documents & `videos.json`**:
   - Provide `sanity/videos.json` (and `sanity/videos.ndjson`) containing 3 dedicated `video` documents matching the 3 unique lesson video URLs:
     - `video-wm5gMKuwSYk` (Next.js App Router full course video with chapters & timestamped transcript chunks)
     - `video-gAkwW2tuIqE` (Docker Essentials course video with chapters & timestamped transcript chunks)
     - `video-d56mG7DezGs` (TypeScript Deep Dive course video with chapters & timestamped transcript chunks)
   - Ensure the `video` schema type is registered in `sanity/schemaTypes/videoType.ts` and `sanity/schemaTypes/index.ts` so Sanity Studio and Content Lake recognise the schema structure.
3. **Verification**:
   - Execute GROQ count queries via Sanity CLI to confirm document counts by `_type` (categories, instructors, lessons, courses, videos).
   - Verify reference integrity (courses resolve categories and instructors, course modules resolve lessons).

---

## Files to Create / Modify
- `sanity/videos.json`: Structured video intelligence dataset for the 3 course video sources with chapters and transcript chunks.
- `sanity/videos.ndjson`: NDJSON format of video documents for Sanity CLI import.
- `sanity/schemaTypes/videoType.ts`: Schema definition for video intelligence documents (`url`, `chapters`, `chunks`).
- `sanity/schemaTypes/index.ts`: Register `videoType` in Sanity Studio schema.
- `prompts/seed-sanity-dataset.md`: This implementation prompt.

---

## Requirements
- Use Sanity CLI `sanity datasets import` with `--replace` flag.
- Do not generate ungrounded content; strictly use the defined seed data and video structures.
- Verify document counts post-import with GROQ.

---

## Security Considerations
- Sanity API tokens and CLI credentials remain local in `.env.local` and `~/.config/sanity/config.json`.
- Tokens are never exposed to browser bundles or committed into source control.

---

## Acceptance Criteria
- [x] All 19 documents from `sanity/seed-data.ndjson` are imported into the Sanity `production` dataset.
- [x] 3 `video` documents from `sanity/videos.ndjson` / `sanity/videos.json` are imported into the Sanity `production` dataset.
- [x] Post-import document count verification query returns:
  - 4 categories
  - 3 instructors
  - 9 lessons
  - 3 courses
  - 3 videos
  - Total: 22 documents
- [x] TypeScript validation (`npx tsc --noEmit`) and linting (`npm run lint`) succeed without errors.

---

## Checks to Run
1. `npx sanity datasets import sanity/seed-data.ndjson production --replace`
2. `npx sanity datasets import sanity/videos.ndjson production --replace`
3. `npx sanity documents query '{"total": count(*[_type in ["category", "instructor", "lesson", "course", "video"]]), "categories": count(*[_type == "category"]), "instructors": count(*[_type == "instructor"]), "lessons": count(*[_type == "lesson"]), "courses": count(*[_type == "course"]), "videos": count(*[_type == "video"])}' --dataset production --project-id kuezkn7a`
4. `npm run lint`
5. `npx tsc --noEmit`

---

## Exact Manual Test Steps
1. Execute the Sanity CLI import command for `seed-data.ndjson` and `videos.ndjson`.
2. Run the verification GROQ query to ensure all 22 documents exist in the dataset.
3. Query a sample course with nested modules and resolved lessons to verify reference resolution.
