# Implementation Prompt: Silence <SanityLive> Reconnection Console Warning

## Goal
Silence the noisy `<SanityLive> is attempting to reconnect` console warning in the browser by configuring `onReconnect={false}` and `onWelcome={false}` on `<SanityLive />` in `app/layout.tsx` and refining token configuration in `sanity/lib/live.ts`.

---

## Skills and Reference Documentation Read
- `agents.md`: Section 2 (Workflow loop), Section 5 (Sanity integration), Section 13 (Checks).
- `sanity-best-practices` (`references/nextjs.md`): `defineLive` and `<SanityLive />` component props.
- `next-sanity`: `SanityLiveProps` (`onReconnect`, `onWelcome`, `onError`).

---

## Code and Config Inspected
- `app/layout.tsx`: Line 36 `<SanityLive />` currently rendered with default logging props.
- `sanity/lib/live.ts`: `defineLive` configuration passing `serverToken` and `browserToken`.
- `node_modules/next-sanity/dist/types.d.ts`: `DefinedLiveProps` documenting `onReconnect?: SanityLiveOnReconnect | false` to disable default reconnect log behavior.

---

## Decisions & Assumptions
1. Add `onReconnect={false}` to `<SanityLive />` in `app/layout.tsx` to suppress EventSource reconnection logs in the browser console while maintaining real-time Live Content API functionality.
2. In `sanity/lib/live.ts`, clean up token configuration to avoid passing undefined browser tokens.

---

## Files to Modify
- `app/layout.tsx`: Add `onReconnect={false}` and `onError` handler to `<SanityLive />`.
- `sanity/lib/live.ts`: Clean up `defineLive` options.

---

## Acceptance Criteria
- [ ] Browser console no longer emits `<SanityLive> is attempting to reconnect` warnings.
- [ ] Real-time content synchronization via Live Content API continues to function as expected.
- [ ] `npx tsc --noEmit` and `npm run lint` pass with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000`.
2. Inspect the browser console and verify `<SanityLive> is attempting to reconnect` is no longer logged.
