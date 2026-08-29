# Implementation Prompt: Offline Video Ingestion Pipeline

## Goal
Implement a robust, production-grade **Offline Video Ingestion Pipeline** for **Vertex** that ingests transcripts and chapter markers from supported video providers (YouTube, Vimeo, Bunny) and generic subtitle/transcript formats (WebVTT, SRT, JSON, timestamped text), partitions transcripts into search-optimized timestamped chunks, extracts structured chapter tables of contents, builds grounded Sanity `video` documents with sanitized deterministic IDs, and provides both programmatic APIs and a CLI tool (`npm run ingest:video`) to write to Sanity or export to NDJSON/JSON datasets.

---

## Skills and Reference Documentation Read
- `agents.md`:
  - Section 1 (Platform scope: Vertex search links directly to exact video timestamp seconds and lesson notes).
  - Section 2 (How to work: read skills, inspect code, write implementation prompt in `prompts/`, get approval via interactive question panel, implement, run checks, concise report).
  - Section 5 (App structure & boundaries: "The video pipeline is offline tooling that ingests transcripts and chapters into video documents. It never runs in the request path.").
  - Section 7 (Decisions: "Video intelligence lives in dedicated video documents, one per unique video. Each holds a table of contents and the transcript split into timestamped pieces. Lessons link to them by video URL. Treat these documents as an internal lookup and never show them to the user as results. Timestamps resolve in two stages. Match chapters first, fall back to transcript... Supported providers are YouTube, Vimeo, and Bunny").
  - Section 8 (Data modeling: "A video document is built by the ingestion pipeline, one per unique video URL. It holds an id and url, a chapters array of `{ startSeconds, label }` for the table of contents, and a chunks array of `{ startSeconds, text }` for the transcript in short timestamped pieces. It never keeps the whole transcript in one field that a query would return wholesale.").
  - Section 9 (How videos get their transcripts: "Build the video documents with offline tooling, keyed by an id derived from the video URL, stripping any characters the datastore rejects in ids. Store the transcript as many short timestamped chunks, and store the source's chapter markers as the table of contents. Keep whole transcripts out of anything the request path returns. The supported providers are YouTube, Vimeo, and Bunny... Ingestion is specific to each provider: to support one you need a way to turn its captions into chunks, a source of chapters or authored ones, and a playback and seek case for its embed. Do not treat a provider as supported until both ingestion and playback exist for it.").
  - Section 12 (Things that will trip you up: Never return whole transcripts or chunks array to search model; Sanity ID character constraints `[a-zA-Z0-9_.-]`; write tokens server-only).
  - Section 13 (Checks: type check, lint, build, verify live/offline execution).
- `sanity-best-practices` (`SKILL.md`):
  - Model what content is; use schema definitions (`defineType`, `defineField`, `defineArrayMember`).
  - Keep video documents normalized and queryable.
- `sanity-migration` (`SKILL.md`):
  - Deterministic document IDs for idempotent reruns (`createOrReplace`).
  - Snapshot input files; validate schema compliance before committing to content lake.

---

## Code and Config Inspected
- Sanity Video Schema: `sanity/schemaTypes/videoType.ts` (`videoId`, `url`, `chapters: [{ startSeconds, label }]`, `chunks: [{ startSeconds, text }]`).
- Video Player Component: `components/lesson/video-player.tsx` (YouTube, Vimeo, Bunny, Direct embed handlers).
- Search Service: `lib/search-service.ts` (queries `video` documents, matches chapters first, chunks fallback, joins with lessons by `videoUrl`).
- Lesson Schema: `sanity/schemaTypes/lessonType.ts` (`videoUrl` property).
- Seed & Data Files: `sanity/seed-data.ndjson`, `sanity/videos.json`, `sanity/videos.ndjson`, `sanity/generate-seed.mjs`, `sanity/seed.mjs`.
- Environment & Sanity Client: `sanity/env.ts`, `sanity/lib/client.ts`, `.env.local`, `.env.example`.

---

## Decisions & Assumptions
1. **Module Architecture (`lib/video-ingestion/`)**:
   - `lib/video-ingestion/types.ts`: Comprehensive TypeScript interfaces for raw cues, parsed chapters, chunking options, provider info, and Sanity video documents.
   - `lib/video-ingestion/providers.ts`: URL parser & ID extractor for YouTube, Vimeo, Bunny, and generic direct URLs. Derives canonical IDs and generates Sanity-safe deterministic document IDs (`video-yt-<id>`, `video-vimeo-<id>`, `video-bunny-<id>`, or `video-<sanitized-hash/slug>`) that conform strictly to Sanity's ID regex `^[a-zA-Z0-9_.-]+$`.
   - `lib/video-ingestion/parsers/vtt-parser.ts`: High-precision WebVTT parser supporting cues, millisecond timestamps, cue text normalization, and tag stripping (`<v>`, `<b>`, `<i>`, inline timestamps).
   - `lib/video-ingestion/parsers/srt-parser.ts`: SubRip (`.srt`) subtitle parser handling sequence numbers, timestamp ranges `00:00:00,000 --> 00:00:00,000`, and multiline text.
   - `lib/video-ingestion/parsers/chapter-parser.ts`: Robust chapter / table of contents parser handling varied timestamp formats (`HH:MM:SS`, `MM:SS`, `SSs`, `[MM:SS] Label`, `1. 02:45 Label`), sorting chronologically, and normalizing labels.
   - `lib/video-ingestion/chunker.ts`: Transcript chunking engine grouping granular subtitle cues into coherent search-optimized chunks (~20 to 45 seconds / natural sentence boundaries), eliminating rolling caption duplicates, and assigning `startSeconds`.
   - `lib/video-ingestion/pipeline.ts`: Core orchestrator `ingestVideo()` combining provider parsing, transcript fetching/parsing, chapter parsing, chunking, and Sanity document construction.
   - `lib/video-ingestion/sanity-sync.ts`: Batch syncing utility to write video documents to Sanity Content Lake via `createOrReplace` or export to NDJSON/JSON files.
   - `lib/video-ingestion/index.ts`: Unified public export for the entire video ingestion subsystem.

2. **CLI Tooling (`scripts/ingest-video.ts` & `package.json`)**:
   - Registered CLI script: `npm run ingest:video`.
   - CLI flags:
     - `--url <videoUrl>`: Single video ingestion.
     - `--transcript <path>`: Local transcript file (`.vtt`, `.srt`, `.json`, `.txt`).
     - `--chapters <path>`: Local chapters file (`.txt`, `.json`, `.vtt`).
     - `--scan-sanity`: Fetch all distinct `videoUrl`s from Sanity `lesson` documents and ingest/sync missing video intelligence documents.
     - `--scan-seed`: Ingest videos from `sanity/seed-data.ndjson`.
     - `--out-ndjson <path>`: Export/append generated documents to NDJSON.
     - `--out-json <path>`: Export generated documents to JSON.
     - `--write`: Commit directly to Sanity Content Lake using `SANITY_API_WRITE_TOKEN`.
     - `--dry-run`: Validate and print ingestion summary without writing.

3. **Provider Support**:
   - **YouTube**: URL parsing (`watch?v=`, `youtu.be/`, `embed/`), YouTube captions fetching fallback & local transcript support, description chapter extraction.
   - **Vimeo**: URL parsing (`vimeo.com/`, `player.vimeo.com/`), VTT/SRT transcript ingestion, description/file chapter extraction.
   - **Bunny**: URL parsing (`mediadelivery.net/embed/`, `video.bunnycdn.com/`), Bunny VTT caption parsing, chapter extraction.
   - **Generic / Local MP4**: URL sanitization, VTT/SRT/JSON transcript parsing, timestamped chapter extraction.

4. **Safety & Sanity Requirements**:
   - Zero whole-transcript storage in single unchunked fields (strictly chunks array).
   - Sanitized deterministic IDs conforming to Sanity document ID rules.
   - Offline tooling only: never runs on user web request path.

---

## Files to Create / Modify
1. `lib/video-ingestion/types.ts`: Type definitions for ingestion pipeline.
2. `lib/video-ingestion/providers.ts`: Video provider parsers (YouTube, Vimeo, Bunny, generic) and ID sanitizers.
3. `lib/video-ingestion/parsers/vtt-parser.ts`: WebVTT parser and cleaner.
4. `lib/video-ingestion/parsers/srt-parser.ts`: SubRip SRT parser and cleaner.
5. `lib/video-ingestion/parsers/chapter-parser.ts`: Flexible timestamped chapters parser.
6. `lib/video-ingestion/chunker.ts`: Intelligent transcript chunking engine.
7. `lib/video-ingestion/pipeline.ts`: Main video ingestion pipeline orchestrator.
8. `lib/video-ingestion/sanity-sync.ts`: Sanity batch writer and NDJSON/JSON exporter.
9. `lib/video-ingestion/index.ts`: Barrel export.
10. `scripts/ingest-video.ts`: Executable CLI tool.
11. `scripts/test-video-ingestion.ts`: Comprehensive verification test suite for ingestion, parsing, chunking, and schema validation.
12. `package.json`: Add `"ingest:video": "node --loader ts-node/esm scripts/ingest-video.ts"` or `tsx scripts/ingest-video.ts` script.

---

## Acceptance Criteria
- [x] Supports YouTube, Vimeo, and Bunny URLs as well as generic video URLs.
- [x] Parses WebVTT (`.vtt`), SubRip (`.srt`), JSON, and raw timestamped text transcripts into structured cues.
- [x] Chunks granular transcript segments into short, clean timestamped chunks (~20-45s) without duplicate rolling captions.
- [x] Extracts chapter markers into ordered `{ startSeconds, label }` arrays.
- [x] Produces valid Sanity `video` documents with sanitized deterministic IDs (`_id`, `_type: "video"`, `videoId`, `url`, `chapters`, `chunks`).
- [x] CLI supports single video ingestion, batch scanning from Sanity/seed, exporting to NDJSON/JSON, and writing to Sanity with write token.
- [x] Passes all automated tests, TypeScript check, and lint without errors.

---

## Verification & Checks to Run
1. Run automated test suite: `npx tsx scripts/test-video-ingestion.ts`
2. Test CLI single video ingestion: `npx tsx scripts/ingest-video.ts --url "https://www.youtube.com/watch?v=gSSsZReIFRk" --dry-run`
3. Test CLI VTT & Chapters ingestion: parse sample VTT & chapters files into video document.
4. Run `npm run lint` and `npx tsc --noEmit` to verify type safety and code quality.
