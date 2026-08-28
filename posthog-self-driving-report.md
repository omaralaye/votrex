# PostHog Self-driving Setup Report

_Generated 2026-08-28 for project Votrex (PostHog project 580211)_

## Summary

PostHog Self-driving has been configured for Votrex — a Next.js App Router video learning platform. Session Replay, Error Tracking, and Support were enabled server-side; six signal sources were wired to the inbox; a scout troop of 8 scouts (5 built-in + 3 custom) is now running daily; and two Replay Vision scanners are armed on course pages. Findings will start appearing in the [Self-driving inbox](https://us.posthog.com/project/580211/inbox) within ~30 minutes.

---

## AI data processing

**Status:** Approved (organization-level AI consent granted before this run).

---

## GitHub

| Item | Status |
|---|---|
| GitHub App integration | Connected during this run (account: omaralaye, integration id: 257812) |
| Repos accessible | 1 repository (the votrex repo) |

Self-driving can now research findings against the codebase and open draft fix PRs.

---

## Products enabled

| Product | Status | Notes |
|---|---|---|
| Session Replay | **Enabled** | `posthog.init` has no `disable_session_recording` override — server flip is effective |
| Error Tracking | **Enabled** | `capture_exceptions: true` already set in `instrumentation-client.ts` |
| Support (Conversations) | **Enabled** | Tickets arrive only once an inbound channel is connected — see follow-ups |

---

## Signal sources

| source_product | source_type | Action |
|---|---|---|
| `signals_scout` | `cross_source_issue` | On by default — no config row needed |
| `health_checks` | `health_issue` | Enabled (id: 01a04843-581c-7575-8790-6eaab02d37f9) |
| `error_tracking` | `issue_created` | Enabled (id: 01a04843-5fa7-7d48-956a-6780cc2519cb) |
| `error_tracking` | `issue_reopened` | Enabled (id: 01a04843-6551-77a3-bed7-7c5f0031cf71) |
| `error_tracking` | `issue_spiking` | Enabled (id: 01a04843-6799-7f29-b2be-ce81e5704b86) |
| `session_replay` | `session_analysis_cluster` | Enabled — 10% sample rate default (id: 01a04843-6a6c-7a75-a29c-366ca3ee3fa0) |
| `conversations` | `ticket` | Enabled — dormant until inbound channel connected (id: 01a04843-6d01-722e-bfdc-25c12bb65441) |
| `replay_vision` | — | Self-authorizing via scanner `emits_signals` flag — no config row created |

---

## Connected tools

| Tool | Status |
|---|---|
| GitHub Issues | Not used (not selected) |
| Linear | Not used (not selected) |
| Jira | Not used (not selected) |
| Sentry | Not used (not selected) |
| Zendesk | Not used (not selected) |

No external issue tracker or support tool was selected. All connected-tool sources skipped.

---

## Scout troop

**Run budget:** 100 runs/day (early-access default, verified via `scout-metadata-get`). 0 runs used today.
**Banner:** "Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."

### Enabled scouts (8 total)

| Scout | Why enabled |
|---|---|
| `signals-scout-general` | Always on — cross-product correlations and surfaces no specialist covers |
| `signals-scout-product-analytics` | Primary surface: course enrollment/retention funnels |
| `signals-scout-web-analytics` | Web app with page traffic, referrer attribution, and landing-page health to watch |
| `signals-scout-feature-flags` | Clerk auth + posthog-js installed; flags likely in active use |
| `signals-scout-observability-gaps` | Fresh install — finds high-volume events with no insight coverage |
| `signals-scout-course-catalog-clickthrough` _(custom)_ | Watches course_card_clicked / catalog pageview ratio — not covered by any built-in |
| `signals-scout-course-search-quality` _(custom)_ | Watches course_searched zero-result share — unique to this product's event schema |
| `signals-scout-learner-engagement` _(custom)_ | Watches module_expanded + continue_learning_clicked rates per course visit |

### Disabled scouts (22)

All other canonical scouts disabled. Notable ones to re-enable if you adopt those surfaces:

- `signals-scout-surveys` — enable when PostHog surveys are in use
- `signals-scout-experiments` — enable when A/B experiments are running
- `signals-scout-revenue-analytics` — enable if a payment SDK (Stripe etc.) is added
- `signals-scout-ai-observability` — enable if LLM analytics (`$ai_*` events) are captured
- `signals-scout-error-tracking` — **intentionally off**: error tracking reaches the inbox as a native source (step 4), not via scout
- `signals-scout-session-replay` — **intentionally off**: session replay reaches the inbox as a native source (step 4), not via scout

**Noise escape hatch:** set `emit: false` on any scout's config in PostHog to put it into dry-run mode (it runs and logs, but posts nothing to the inbox).

---

## Custom scouts

### signals-scout-course-catalog-clickthrough

- **Watches:** The ratio of `course_card_clicked` to `$pageview` on catalog pages (`/` and `/courses`)
- **Discriminator:** CTR drop while pageviews hold steady (>25% drop over 2+ days) — this shape separates a catalog or filter regression from an organic traffic drop
- **Gap filled:** `signals-scout-product-analytics` watches saved funnel insights — none exist yet, so it's idle. `signals-scout-web-analytics` watches page-level traffic, not event-level CTR. No built-in covers this ratio.
- **Explore patterns:** CTR regression SQL (14d window), filter dead-end sessions (filter events with no click-through), per-course CTR breakdown

### signals-scout-course-search-quality

- **Watches:** `course_searched` events where `results_count = 0`; rising zero-result share and specific failing query terms
- **Discriminator:** Share of zero-result searches rising >10pp vs baseline over 2+ days, OR 3+ distinct queries consistently returning zero results
- **Gap filled:** No built-in scout watches search quality or the `results_count` property. The `course_searched` event captures this property directly in the Votrex codebase.
- **Explore patterns:** Zero-result share over time SQL, failing query terms SQL (with distinct-user check), source breakdown (home vs courses-page search)

### signals-scout-learner-engagement

- **Watches:** `module_expanded` and `continue_learning_clicked` rates relative to `/courses/<slug>` page views
- **Discriminator:** Engagement ratio drops >30% vs baseline over 2+ days while course page views hold steady
- **Gap filled:** Session replay native source handles per-session cluster analysis; this scout tracks the event-level aggregate trend (not individual sessions), which is a different surface. No built-in scout owns this metric.
- **Explore patterns:** Engagement ratio over time SQL, per-course breakdown, CTA effectiveness by source (hero vs progress_bar), zero-engagement course sessions

**Surfaces considered and ruled out:**

| Surface | Filter that killed it |
|---|---|
| Auth funnel health (Clerk sign-in) | Not explicitly captured — no `$user_authenticated` or auth-specific events confirmed in repo; surface not ready |
| Bookmark engagement | Single event (`course_bookmarked`) with a boolean toggle — surface too thin for a trend scout |
| Sanity content delivery | No observable events for CMS fetch success/failure — not watchable |

---

## Replay Vision scanners

Replay Vision scanners are LLMs that watch individual session recordings on a schedule and push what they find directly to the inbox. Each observation arrives at half weight; two corroborating observations from **different** sessions promote to a full report. These are the only parts of this setup that spend Replay Vision quota. The project has no recordings yet — both scanners are armed and start scanning the day recordings arrive.

| Scanner | Type | Query scope | Sampling rate | Est. monthly credits | Status |
|---|---|---|---|---|---|
| Course page breakage | Monitor | `$current_url` icontains `/courses/` | 0.5 | 0 (no recordings yet) | **Created** |
| Learner frustration | Monitor | `$rageclick` sessions only | 1.0 | 0 (no recordings yet) | **Created** |

**Course page breakage** watches for unambiguous product breakage on course pages: curriculum loading blank, the Continue Learning CTA not responding, module accordions not expanding, hero graphics failing to render, and the floating progress bar being unresponsive. URL-scoped to `/courses/` — this is the product's key engagement flow and where silent breakage costs the most.

**Learner frustration** watches for rage-click sessions where learners are visibly stuck: hammering filter pills, clicking the Continue Learning button repeatedly, tapping non-expanding module headers, cycling through zero-result searches, and repeatedly clicking Bookmark. Gated exclusively on `$rageclick` — these queries stay disjoint (URL vs event) so each scanner provides independent corroboration.

---

## Follow-ups

- [ ] **Connect a Support inbound channel** — Conversations is enabled but the `ticket` source will stay dormant until you connect an email, inbox, or Slack channel in PostHog → Settings → Conversations.
- [ ] **Verify env vars are set in production** — ensure `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` are set in your deployment environment so recordings and events actually flow.
- [ ] **Create course funnel insights** — once traffic is flowing, create saved funnel/retention insights in PostHog so `signals-scout-product-analytics` has flows to watch. Until then it runs but finds nothing to compare.
- [ ] **Enable `signals-scout-replay-vision`** if you want trend analysis across Replay Vision observations — it reads patterns _across_ accumulated scanner observations and is worth enabling once a few weeks of recordings have been scanned.
- [ ] **Add more connected tools** if you adopt Linear, Jira, GitHub Issues, or a support desk — run `/self-driving-setup` or add sources manually at https://us.posthog.com/project/580211/pipeline/new/source.

---

## What happens next

- The scout coordinator picks up the new configs within ~30 minutes; first runs fire from there.
- Scout runs draw from the project's daily budget (100 runs/day during early access).
- Replay Vision scanners start scanning the moment session recordings exist.
- Findings cluster into reports in the inbox; immediately-actionable ones can kick off coding tasks.
- Visit your inbox: https://us.posthog.com/project/580211/inbox
