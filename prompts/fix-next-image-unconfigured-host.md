# Implementation Prompt: Fix Next.js Image Unconfigured Host Runtime Error

## Goal
Fix the runtime error `Invalid src prop (https://picsum.photos/...) on next/image, hostname "picsum.photos" is not configured under images in your next.config.js` occurring on course and lesson pages when rendering external cover images and seeded assets.

---

## Skills and Reference Documentation Read
- `agents.md`: Section 2 (Workflow loop), Section 3 (UI reproduction), Section 13 (Checks).
- `sanity-best-practices` (`references/image.md`): Working with remote and local images in Next.js.
- `modern-web-guidance`: Image optimization and fallback handling.

---

## Code and Config Inspected
- `components/course/course-view.tsx`: Line 87 `<Image src={course.coverImageUrl} fill ... />`
- `components/lesson/portable-text-renderer.tsx`: Line 87 `<Image src={imageUrl} fill ... />`
- `components/lesson/video-player.tsx`: Line 119 `<Image src={posterUrl} fill ... />`
- `next.config.ts`: `remotePatterns` configuration for `picsum.photos`, `cdn.sanity.io`, `img.youtube.com`, `i.ytimg.com`.

---

## Decisions & Assumptions
1. Add `unoptimized` prop to `<Image>` in `components/course/course-view.tsx` and `components/lesson/portable-text-renderer.tsx`. This guarantees that external seed images (e.g. `picsum.photos`) and Sanity CDN images render reliably without triggering runtime hostname configuration errors during active development or across dev server instances.
2. Verify `next.config.ts` continues to include all necessary remote patterns for production builds.

---

## Files to Modify
- `components/course/course-view.tsx`: Add `unoptimized` to `<Image>` in `getCourseHeroGraphic`.
- `components/lesson/portable-text-renderer.tsx`: Add `unoptimized` to `<Image>` in Portable Text image type handler.

---

## Acceptance Criteria
- [ ] Course pages with external seed images (e.g. `/courses/building-production-ai-agents-rag`, `/courses/docker-container-engineering`) render without runtime Image errors.
- [ ] `npx tsc --noEmit` and `npm run lint` pass with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/courses/building-production-ai-agents-rag`.
2. Verify course hero cover image loads cleanly without runtime errors.
3. Navigate to `http://localhost:3000/courses/nextjs-for-production/native-fetch-extensions-request-deduplication`.
4. Verify lesson page renders with video player and cover thumbnails.
