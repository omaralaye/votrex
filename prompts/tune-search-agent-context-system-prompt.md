# Implementation Prompt: Tune Search Agent Context, Scope Filter, Instructions & System Prompt

## Goal
Tune the intelligent search engine for **Vertex** by:
1. Writing the **Sanity Context document scope filter** (`groqFilter`) and **domain instructions** (`instructions`) following the `dial-your-context` skill (pure deltas, second-order reference resolution, two-stage video moment lookup, Portable Text handling, and token limits).
2. Shaping the **System Prompt** following the `shape-your-agent` skill (<400 words, strict groundedness guardrails, role definition, voice, boundaries, and fallback behavior).
3. Registering the **Agent Context document** in Sanity Studio structure (`sanity/structure.ts`), generating and seeding the live `sanity.agentContext` document into the Sanity dataset, and syncing the system prompt and context configuration inside the server-side search engine (`lib/search-service.ts`).

---

## Skills and Reference Documentation Read
- `agents.md`:
  - Section 1 (Platform scope: plain language query returning ranked, clickable cards linking straight to video timestamps and lesson notes).
  - Section 2 (Workflow: inspect code, write prompt in `prompts/`, get approval via interactive question panel, implement, run checks, concise report).
  - Section 5 (App boundaries: server-only data access with token, server search route, client search UI, no token leakage).
  - Section 7 (Decisions: search is Sanity Context MCP + grounded LLM/GROQ engine, video documents as internal lookup, two-stage timestamp resolution: chapters first then transcript chunks, grounded results only).
  - Section 8 (Data modeling: course, module, lesson, instructor, category, video document with chapters and chunks, agent context document).
  - Section 10 (Search config document: Sanity Context document holding content filter and query instructions).
  - Section 11 (Search behavior: full results page, count summary, sort control, video results and lesson results, merge both, token-based text match with wildcards and OR logic, rank by specificity).
  - Section 12 (Security & gotchas: Context document deltas, inline system prompt redundancy, escaping backticks in prompt templates, cache handling, never return whole transcript).
  - Section 13 (Checks: type check, lint, build).
- `dial-your-context` (`SKILL.md`):
  - Pure deltas principle: only include what the schema doesn't make obvious.
  - Scope filter: strict GROQ expression scoping visible documents to relevant content types while excluding drafts and system objects.
  - Non-obvious data relationships: reverse course derivation from `modules[].lessons[]`, video lookup via `videoUrl`, two-stage timestamp resolution (chapters ToC first, then transcript chunks fallback).
  - Context window protection: never return wholesale transcript chunks arrays.
  - Plain text search on Portable Text using `pt::text(content)`.
- `shape-your-agent` (`SKILL.md`):
  - System prompt defines behavior, personality, voice, boundaries, and refusal/fallback policies.
  - Keep under 400 words (concise, factual, no duplicate schema or GROQ mechanics).
  - Strict groundedness: only return verified courses, lessons, and timestamps; never fabricate data.
  - The cut test: only include rules with concrete trigger scenarios.

---

## Code and Config Inspected
- Schemas:
  - `sanity/schemaTypes/agentContextType.ts`: `sanity.agentContext` schema with `name`, `slug`, `groqFilter`, and `instructions`.
  - `sanity/schemaTypes/courseType.ts`: Course document holding `modules[]` array of embedded objects with `lessons[]` references.
  - `sanity/schemaTypes/lessonType.ts`: Lesson document holding `videoUrl`, `duration`, `summary`, `keyPoints`, and Portable Text `content`.
  - `sanity/schemaTypes/videoType.ts`: Internal video lookup document holding `videoId`, `url`, `chapters[]`, and `chunks[]`.
  - `sanity/schemaTypes/instructorType.ts` & `sanity/schemaTypes/categoryType.ts`.
  - `sanity/schemaTypes/index.ts`: Schema registry.
- Studio Structure & Seeding:
  - `sanity/structure.ts`: Studio desk structure builder.
  - `sanity/generate-seed.mjs`, `sanity/seed.mjs`, `sanity/seed-data.ndjson`.
- Search & API Layer:
  - `lib/search-service.ts`: Server-side search engine, scoring, tokenization, and two-stage timestamp resolution.
  - `app/api/search/route.ts`: Search route handler with PostHog analytics.
  - `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID="kuezkn7a"`, `NEXT_PUBLIC_SANITY_DATASET="production"`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`.

---

## Decisions & Assumptions

### 1. Sanity Context Scope Filter (`groqFilter`)
The content filter restricts search access strictly to learner-facing curriculum documents and the internal video intelligence lookup, excluding system objects (`system.group`, `system.retention`) and unpublished drafts:
```groq
_type in ["course", "lesson", "video", "instructor", "category"] && !(_id in path("drafts.**"))
```

### 2. Sanity Context Domain Instructions (`instructions` - Pure Deltas)
Following `dial-your-context`, include only non-obvious schema nuances, relationships, query patterns, and safety constraints:
```markdown
### Content Relationships & Navigation
- Lessons do not store a parent course reference. To resolve a lesson's course and module, query courses where `modules[].lessons[]._ref == lesson._id`.
- Module numbers (e.g. "Module 5") and lesson labels (e.g. "Lesson 5.1") are derived from the 1-based order in `course.modules[]` and `module.lessons[]`.
- `video` documents are internal lookup records matched to lessons via `lesson.videoUrl == video.url` or videoId. Never return `video` documents directly as standalone search results.

### Two-Stage Timestamp Resolution
- Stage 1 (Chapters First): Search `video.chapters[].label` (Table of Contents) for direct topic matches. Use `startSeconds` as the moment timestamp.
- Stage 2 (Transcript Fallback): If no chapter matches, search `video.chunks[].text` for spoken phrases and resolve to that chunk's `startSeconds`.

### Query Patterns & Safety
- Plain text matching for lesson notes: use `pt::text(content)` — do not match Portable Text block objects directly.
- Context window protection: Never return entire `chunks` arrays in query projections. Project only matched slices: `chunks[text match $query][0..2]`.
- Specificity ranking: Exact title match > chapter label match > key points match > summary match > transcript chunk match.
```

### 3. Shaped System Prompt (`shape-your-agent`)
Following `shape-your-agent`, create a clean, high-impact prompt (<300 words) defining role, voice, boundaries, and fallbacks:
```markdown
You are the Vertex Intelligent Search Engine, an AI assistant specialized in guiding learners through our technical course catalog and deep-linking directly to exact video timestamps.

## Voice & Tone
- Precise, authoritative, and direct.
- Focus on actionable learning paths and exact timestamp moments.
- Do not produce conversational filler or markdown pleasantries.

## Boundaries & Groundedness
- Strict Grounding: Never fabricate courses, lessons, instructors, durations, or timestamps. Return only data verified in the Sanity dataset.
- Internal Video Lookup: Never expose internal `video` documents directly to users; always connect timestamps to their parent `lesson` and `course`.
- Structured Results: Separate results into Video Moment Results (with exact `startSeconds` seeking link) and Lesson Topic Results.
- Search Scope: Refuse non-learning queries or requests to modify content, and direct users back to catalog search.

## When Information Is Not Found
- Return 0 results honestly with an empty response.
- Do not speculate or recommend external unverified resources.
```

### 4. Studio Structure & Dataset Seeding
- Add `Agent Context (Search Config)` with `SparklesIcon` to `sanity/structure.ts` so editors can inspect and adjust the document in the Studio.
- Create and seed `sanity.agentContext` document (`id: agent-context-vertex-search`, `slug: vertex-search`) with the tuned scope filter and instructions into Sanity Content Lake (`kuezkn7a/production`).
- Update `sanity/seed-data.ndjson` and `sanity/generate-seed.mjs` to keep seed artifacts consistent.

### 5. Search Engine Synchronization
- Update `lib/search-service.ts` to export and integrate the shaped system prompt, scope filter, and domain instructions.
- Ensure runtime query scoring and two-stage timestamp resolution adhere to the pure deltas and ranking guidelines.

---

## Files to Create / Modify
1. `sanity/structure.ts`: Add `Agent Context (Search Config)` document list to Sanity Studio desk structure.
2. `sanity/generate-seed.mjs`: Include `sanity.agentContext` document in the seed generator.
3. `sanity/seed-data.ndjson`: Add the `sanity.agentContext` document.
4. `scripts/seed-agent-context.mjs`: Standalone script to seed or update the `sanity.agentContext` document in the live Sanity dataset.
5. `lib/search-service.ts`: Export the tuned `SEARCH_SYSTEM_PROMPT`, `SEARCH_GROQ_FILTER`, and `SEARCH_DOMAIN_INSTRUCTIONS`, ensuring two-stage resolution and ranking consistency.

---

## Security Considerations
- Sanity read/write tokens are used strictly on the server or in offline scripts, never exposed in client bundles.
- Queries are sanitized against injection.
- Video documents remain internal lookup structures only.

---

## Acceptance Criteria
- [ ] `sanity.agentContext` document is seeded into Sanity (`kuezkn7a/production`) with `_id: "agent-context-vertex-search"`, valid slug, `groqFilter`, and pure-delta `instructions`.
- [ ] Sanity Studio desk structure (`sanity/structure.ts`) includes `Agent Context (Search Config)` with `SparklesIcon`.
- [ ] System prompt adheres to `shape-your-agent` guidelines (<400 words, voice, strict groundedness, boundaries, fallback).
- [ ] `lib/search-service.ts` integrates the tuned system prompt and domain instructions.
- [ ] Two-stage timestamp resolution and specificity ranking execute accurately.
- [ ] TypeScript check (`npx tsc --noEmit`), ESLint (`npm run lint`), and Next.js build (`npm run build`) pass cleanly.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

---

## Exact Manual Test Steps
1. Run `node scripts/seed-agent-context.mjs` to verify the Sanity Context document is created/updated in the dataset.
2. Run a verification query to verify `sanity.agentContext` in Sanity:
   `*[_type == "sanity.agentContext"] { _id, name, slug, groqFilter, instructions }`
3. Navigate to `http://localhost:3000/studio` and verify "Agent Context (Search Config)" appears in the left navigation sidebar.
4. Click on "Vertex Search Agent Context" in Studio and confirm `groqFilter` and `instructions` are rendered and editable.
5. Search for `App Router` on `http://localhost:3000/search?q=App+Router` and verify two-stage video moment and lesson results render.
6. Verify video result cards link with `?t=<seconds>` and deep-seek in the player.
