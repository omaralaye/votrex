# Implementation Prompt: Fix PostHog 404 Ingest Console Error

## Goal
Fix the PostHog `Bad HTTP status: 404` console error by excluding `/ingest` from Clerk's middleware matcher in `proxy.ts` so Next.js rewrites can forward analytics requests without middleware interception, and updating `instrumentation-client.ts` to respect `NEXT_PUBLIC_POSTHOG_HOST`.

---

## Skills and Reference Documentation Read
- `agents.md`: Section 5 & 7 (PostHog product analytics integration), Section 12 (Clerk middleware and PostHog public keys), Section 13 (Checks to run).
- `nextjs` & `clerk` best practices: Excluding static and reverse-proxy paths (`/ingest`) from Clerk middleware matcher.

---

## Code and Config Inspected
- `proxy.ts`: Middleware matcher intercepting all non-static paths including `/ingest`.
- `next.config.ts`: Rewrites mapping `/ingest/:path*` to `https://us.i.posthog.com/:path*`.
- `instrumentation-client.ts`: PostHog client initialization with hardcoded `api_host: "/ingest"`.
- `.env.local`: `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`.

---

## Decisions & Assumptions
1. Update `proxy.ts` matcher negative lookahead to exclude `ingest` (`(?!_next|ingest|...)`), preventing Clerk middleware from capturing and rewriting reverse-proxied PostHog analytics traffic.
2. In `instrumentation-client.ts`, configure `api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest"` for flexible environment targeting.

---

## Files to Modify
- `proxy.ts`: Add `ingest` to the matcher's excluded paths.
- `instrumentation-client.ts`: Use `process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest"`.

---

## Acceptance Criteria
- [ ] Analytics ingest requests to `/ingest` or `https://us.i.posthog.com` succeed without 404 errors.
- [ ] `npx tsc --noEmit` and `npm run lint` pass with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/courses/nextjs-for-production/native-fetch-extensions-request-deduplication`.
2. Inspect the browser console to verify no `[PostHog.js] Bad HTTP status: 404` errors are logged.
