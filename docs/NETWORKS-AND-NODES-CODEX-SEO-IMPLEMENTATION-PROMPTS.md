# Networks & Nodes — Staged Codex SEO Implementation Prompts

**Companion to:** `Networks & Nodes — Master SEO Audit and Implementation Plan`  
**Prepared:** August 5, 2026  
**Purpose:** Turn the master backlog into controlled Codex runs with clear prerequisites, scope, stop points, and verification.

## How to use this file

Do not give Codex the entire implementation backlog as one command.

1. Make these two documents available in every Codex run:
   - `NETWORKS-AND-NODES-SEO-MASTER-PLAN.md`
   - `SEO-GUIDANCE-RESEARCH-STANDARD.md`
2. Either place them in the repository under `/docs` or attach them to the Codex thread. Do not use the Mac-only paths currently written in the master plan.
3. Use one continuing Codex thread when possible. If starting a new thread, also attach the latest preflight report and previous batch handoff.
4. Fill in every bracketed field before sending a prompt. Do not leave Codex to infer permissions, recipients, platform access, or approved facts.
5. Send only one batch prompt at a time.
6. Review Codex's changed-file list, test evidence, blockers, and preview before authorizing the next batch.
7. Keep production deployment disabled until the final deployment prompt.

The phases in the master audit describe business priority. The batches in this file control execution order. A task's `P1`, `P2`, or `P3` label does not override a dependency gate.

## Decisions already settled

- Networks & Nodes is a service business offering websites, custom software, and automation.
- The production implementation is expected to be a static multi-page Vite/HTML project with Vercel serverless form functions and Cloudflare in front of it.
- Preserve the current visual identity and core narrative.
- Keep **“Request a project review”** as the dominant conversion action.
- Never invent testimonials, clients, statistics, project outcomes, locations, credentials, legal terms, or service capabilities.
- Do not publish thin pages merely to target keywords.
- Do not claim a ranking, traffic, indexing, or Core Web Vitals result that was not measured.
- Default deployment authority is local changes and a preview only. Production requires separate approval.

## Owner decision sheet

Complete this once, then copy the relevant answers into each batch prompt.

```text
PRODUCTION_REPOSITORY: [URL OR CONFIRMED WORKSPACE REPOSITORY]
PRODUCTION_BRANCH: [BRANCH]
AUDIT_BASELINE_COMMIT: d5b431828d2fc63daebaf58c98a081e786f0371e

GITHUB_OWNER: [PERSON]
VERCEL_OWNER: [PERSON]
CLOUDFLARE_AND_R2_OWNER: [PERSON]
DNS_OWNER: [PERSON]
FORM_INBOX_OR_CRM_OWNER: [PERSON]
ROLLBACK_OWNER: [PERSON]

SWITCHBOARD_POLICY: [EMBED-ONLY / STANDALONE]
PUBLIC_EMAIL_POLICY: [PUBLISH VALID MAILTO / FORM ONLY]

ANALYTICS_PROVIDER: [PROVIDER / DEFERRED]
ANALYTICS_PROJECT_IDENTIFIER_AVAILABLE: [YES / NO]
PRIVACY_APPROVAL_FOR_EVENTS: [YES / NO]

CONTROLLED_FORM_TEST: [AUTHORIZED / NOT AUTHORIZED]
TEST_RECIPIENT: [APPROVED ADDRESS OR CRM DESTINATION]
TEST_MARKER: [UNIQUE NON-SENSITIVE MARKER]

LEGAL_ACTION: [PUBLISH APPROVED COPY / UNLINK UNTIL APPROVED / NO CHANGE]
APPROVED_PRIVACY_COPY: [FILE / NOT AVAILABLE]
APPROVED_TERMS_COPY: [FILE / NOT AVAILABLE]

TEN_HOUR_CLAIM_ACTION: [KEEP WITH EVIDENCE / REMOVE NUMBER / REWRITE QUALITATIVELY]
CLAIM_EVIDENCE_RECORD: [FILE / NOT AVAILABLE]
CLIENT_PERMISSION_RECORDED: [YES / NO]

SOUTH_FLORIDA_POSITIONING: [APPROVED WITH FACTS / DEFER]
PUBLIC_LOCATION_AND_SERVICE_AREA_FACTS: [FILE / NOT AVAILABLE]
GOOGLE_BUSINESS_PROFILE_ELIGIBILITY: [CONFIRMED / NOT CONFIRMED / NOT APPLICABLE]

APPROVED_SERVICE_OFFERS: [FILE / NOT AVAILABLE]
APPROVED_CASE_EVIDENCE: [FILE / NOT AVAILABLE]
APPROVED_SOCIAL_CARD_ASSETS: [DIRECTORY / NOT AVAILABLE]

CURRENT AUTHORITY: [INSPECT ONLY / EDIT LOCALLY / CREATE PREVIEW / DEPLOY PRODUCTION]
```

## Execution map

| Order | Batch | Send when | Required inputs | Audit IDs |
|---:|---|---|---|---|
| 0 | Repository preflight | Immediately after Codex has the production repository and both governing documents | Repository, expected production branch, audited commit | M06, baseline of M17, status of all M-items |
| 1 | Safe repository foundation | Preflight confirms the correct repository and no unresolved material drift | Switchboard policy, public email policy | M10, M12, M13, M19, M20, M22 |
| 2 | Crawl, redirect, and index signals | Switchboard role is approved and platform ownership/access is known | Switchboard policy, Vercel/Cloudflare scope, preview authority | M06, M07, M08, M09 |
| 3A | Form hardening and delivery | Approved recipient and downstream logs/inbox are available | Test authorization, recipient, marker | M02 operational portion, M18 |
| 3B | Analytics and conversion path | Analytics provider and privacy decision are approved | Provider identifier, permitted events, preview authority | M02 measurement portion, M14 |
| 4 | Performance, media, R2, and caching | Original media and current delivery/configuration are available | Media sources, R2/Cloudflare owner or configuration, trigger policy | M01 |
| 5 | Legal, claims, and local truth | Human-approved copy and evidence are supplied | Legal action/copy, claim decision/evidence, location facts | M03, M05, M11 |
| 6 | Service pages and authority foundation | Batches 1–5 are accepted and real offer/proof materials exist | Offer definitions, case evidence, approved media | M04, M21, M24 |
| 7 | Preview validation | All authorized repository changes are present on one preview | Preview URL, completed batch handoffs | M23 plus validation of all changed items |
| 8 | Production launch and monitoring | Preview is approved and production authority is explicit | Deploy/rollback owners, dashboards, test approval | M15, M16, M17, M23 and final closure |

## Batch 0 — Repository preflight and audit-drift check

### Send this when

- Codex is opened in the repository believed to deploy `https://www.networksandnodes.org/`.
- The master plan and research standard are available by attachment or repository-relative path.

### Do not continue to Batch 1 until

- Codex confirms the actual framework, repository, branch, build, and deployment relationship.
- Material changes since commit `d5b431828d2fc63daebaf58c98a081e786f0371e` have been reconciled.
- The existing test/build baseline is known.

### Prompt to send to Codex

```text
Read these documents completely before acting:
- [PATH OR ATTACHMENT: NETWORKS-AND-NODES-SEO-MASTER-PLAN.md]
- [PATH OR ATTACHMENT: SEO-GUIDANCE-RESEARCH-STANDARD.md]

This is a read-only preflight. Do not change source files, configuration,
dependencies, dashboards, DNS, Cloudflare, Vercel, or production.

Expected production repository: [PRODUCTION_REPOSITORY]
Expected production branch: [PRODUCTION_BRANCH]
Audit baseline commit: d5b431828d2fc63daebaf58c98a081e786f0371e

Confirm whether this is the production Vite repository for
https://www.networksandnodes.org/. Inspect repository instructions first.
Preserve all unrelated user changes.

Perform the following:
1. Report current branch, current HEAD, working-tree state, and material drift
   from the audited commit. Do not overwrite or discard anything.
2. Confirm the framework, build commands, build output, Vercel mapping,
   serverless form entry point, Cloudflare/R2 relationship, and source of
   robots, redirects, sitemap, metadata, and route definitions.
3. Identify stale references to a competing Next/Vinext or other nonproduction
   implementation.
4. Map every M01–M24 item to current files/configuration and classify it as:
   still open, already fixed, changed enough to re-audit, external, human
   approval required, or not applicable.
5. Identify the exact credentials/access or owner decisions needed for later
   batches without requesting or printing secrets.
6. Run the repository's existing tests and production build if they are safe
   and non-mutating. Do not upgrade or install unrelated dependencies.
7. Record the baseline result, including any existing failures.

Return:
- Production-source verdict
- Current HEAD versus audit-baseline summary
- M01–M24 status matrix
- Relevant file/configuration map
- Baseline test and build results
- External and human-controlled blockers
- Recommended batch changes, if current source drift makes the supplied order
  unsafe

Stop after reporting. Do not implement a repair, commit, push, create a PR, or
deploy.
```

## Batch 1 — Safe repository foundation

### Send this when

- Batch 0 confirms the repository.
- You have approved the switchboard and public-email decisions.
- Any working-tree changes are understood.

### Inputs to fill

```text
SWITCHBOARD_POLICY: [EMBED-ONLY / STANDALONE]
PUBLIC_EMAIL_POLICY: [PUBLISH VALID MAILTO / FORM ONLY]
AUTHORITY: EDIT LOCALLY; PREVIEW ONLY IF ALREADY AUTHORIZED
```

### Prompt to send to Codex

```text
Read the attached master SEO plan, research standard, and latest preflight
report. Work only in the confirmed production Vite repository.

Implement only M10, M12, M13, M19, M20, and M22 in this pass.

Approved decisions:
- Networks & Nodes is a service business.
- Preserve the current visual identity and “Request a project review” CTA.
- Switchboard policy: [SWITCHBOARD_POLICY]
- Public email policy: [PUBLIC_EMAIL_POLICY]
- Deployment authority: [EDIT LOCALLY / PREVIEW AUTHORIZED]

Required work:
1. M10: Create one maintainable route source of truth or an equivalent CI parity
   test for source path, public path, indexability, canonical intent, and sitemap
   inclusion. Do not add new service or regional routes in this batch.
2. M12: Repair the verified project-label contrast defect. Confirm the computed
   text/background pair reaches at least 4.5:1 in every relevant state.
3. M13: Correct switchboard tab/panel relationships, keyboard behavior, small
   information-bearing labels, and target size/spacing. Preserve the actual
   interaction design instead of forcing incorrect ARIA semantics.
4. M19: Add a persistent visible disclosure that switchboard names and metrics
   are illustrative example data. It must remain understandable without
   JavaScript.
5. M20: Ensure raw contact anchors lead to the approved valid destination and do
   not expose a same-origin /cdn-cgi/l/email-protection 404. Do not publish an
   address if FORM ONLY was selected.
6. M22: Put the correct year in built/raw HTML. Runtime enhancement may remain,
   but the source must not start stale.

Do not change hero media loading, R2 assets, form backend behavior, analytics,
legal copy, quantitative claims, service-page architecture, local positioning,
robots policy, host redirects, DNS, or production configuration in this pass.

Run focused tests, the existing test suite, and the production build. Perform
local browser/accessibility checks where supported.

Return:
1. Files changed
2. M-items corrected and exact implementation
3. Tests/build/browser checks performed
4. Before/after evidence for contrast and semantics
5. Remaining external or manual verification
6. Regressions or blockers

Do not push, merge, or deploy unless the authority field explicitly permits the
specific action. Stop for review.
```

## Batch 2 — Crawl, redirect, and index-signal consistency

### Send this when

- Batch 1 is accepted.
- The switchboard policy is final.
- You know whether Codex can edit only repository configuration or also inspect/change Vercel and Cloudflare settings.

### Inputs to fill

```text
SWITCHBOARD_POLICY: [EMBED-ONLY / STANDALONE]
PLATFORM_SCOPE: [REPOSITORY ONLY / VERCEL AUTHORIZED / CLOUDFLARE AUTHORIZED / BOTH AUTHORIZED]
DEPLOYMENT_AUTHORITY: [LOCAL ONLY / PREVIEW ONLY]
```

### Prompt to send to Codex

```text
Read the master SEO plan, research standard, preflight report, and Batch 1
handoff. Implement only M06, M07, M08, and M09 in this pass.

Approved decisions:
- Switchboard policy: [SWITCHBOARD_POLICY]
- Platform scope: [PLATFORM_SCOPE]
- Deployment authority: [DEPLOYMENT_AUTHORITY]

First inspect the current source of redirect and robots behavior. Do not assume
that a production-injected Cloudflare rule is controlled by repository files.

Required outcomes:
1. M06: Update production-source and release documentation so the repository,
   deployment workflow, hosting/CDN ownership, form owner, and rollback path are
   unambiguous. Clearly label older implementations as nonproduction; do not
   delete them without explicit authorization.
2. M07: Produce one deliberate general crawler policy and preserve only named
   crawler restrictions the owner has approved. Account for Cloudflare-injected
   managed directives. Do not claim the production policy is fixed until the
   final delivered robots.txt has been fetched and parsed.
3. M08: Configure direct permanent consolidation of HTTP/apex, /index.html, and
   .html/ variants to their exact HTTPS www canonical equivalents. Preserve path
   and query behavior where appropriate. Do not break /api routes, assets, or
   genuine 404 handling.
4. M09: Implement the approved switchboard policy consistently:
   - EMBED-ONLY: noindex, follow; remove from sitemap; keep the embed usable; do
     not create conflicting standalone/canonical/navigation signals.
   - STANDALONE: add useful standalone content, self-canonical, unique metadata,
     crawlable contextual link, navigation/contact path, and sitemap inclusion.
     Do not fabricate content or proof.

If platform access is not authorized, make only repository changes and return
exact owner dashboard actions. Leave those items partially verified; do not
pretend a source change altered production.

Verify with tests/build and the best available HTTP checks. For every redirect,
report status, hop count, destination, and whether the check was local, preview,
or production. Confirm sitemap, canonical, robots, and switchboard signals agree.

Return changed files, platform changes actually made, evidence, production-only
checks still required, and rollback notes. Do not deploy production. Stop for
review.
```

## Batch 3A — Form security, delivery, and controlled success test

### Send this when

- The form destination owner has approved a test.
- The approved recipient/CRM, unique test marker, and log access are available.
- If a live test is not authorized, change `CONTROLLED_FORM_TEST` to `NOT AUTHORIZED`; Codex must then leave downstream delivery unverified.

### Prompt to send to Codex

```text
Read the master SEO plan, research standard, preflight report, and accepted batch
handoffs. Implement only M18 and the operational/delivery portion of M02.

Approved test details:
- Controlled form test: [AUTHORIZED / NOT AUTHORIZED]
- Recipient/CRM owner: [OWNER]
- Approved destination: [DESTINATION]
- Unique test marker: [MARKER]
- Deployment authority: [LOCAL / PREVIEW]

Do not print, commit, or expose secrets or personal form contents.

Required work:
1. Safely encode every user-controlled value before inserting it into HTML email
   or logs. Preserve readable plain-text handling if present.
2. Replace stale “Portfolio Contact Submission” and other old labels with current
   Networks & Nodes project-review language.
3. Enforce allowed service values and required fields server-side; do not trust
   client validation alone.
4. Preserve Turnstile verification and accessible client success/error states.
5. Add non-PII operational error/delivery observability where the existing stack
   supports it. Do not log names, email addresses, project text, tokens, or full
   request bodies.
6. Test validation, Turnstile rejection, malformed input, provider/API failure,
   and duplicate-submission behavior safely.
7. If and only if the controlled test is authorized, submit one clearly marked
   inquiry through the approved environment and reconcile browser response,
   server result, downstream arrival, exact-once receipt, reply-to, and safe email
   rendering.

Do not add an analytics vendor or conversion events in this batch. Do not send a
live inquiry to an unapproved address.

Run focused tests, the full existing suite, and the production build. Return
files changed, security fixes, test matrix, delivery evidence actually observed,
and anything still unverified. Stop for review; do not deploy production.
```

## Batch 3B — Analytics and the mobile conversion path

### Send this when

- An analytics provider is chosen.
- Its normal project identifier/configuration is available through the approved secret/environment workflow.
- The owner/privacy reviewer approves the specific non-PII events.

### Prompt to send to Codex

```text
Read the governing documents and accepted batch handoffs. Implement only the
measurement portion of M02 and M14.

Approved configuration:
- Analytics provider: [PROVIDER]
- Project/site identifier source: [ENVIRONMENT VARIABLE OR APPROVED CONFIG]
- Approved events: [CTA CLICK, FORM START, CONFIRMED SUCCESS, FAILURE OR EDIT]
- Privacy approval: [APPROVER AND DATE]
- Deployment authority: [LOCAL / PREVIEW]

Use the existing provider if one is already deliberately installed. Do not add a
second analytics stack or consent system without approval. Never place names,
email addresses, phone numbers, project descriptions, tokens, or other personal
data in analytics events, URLs, logs, or parameters.

Required work:
1. Record the approved early CTA click, form start, confirmed server success, and
   failure states as distinct events.
2. Fire the success event only after a legitimate successful server response.
   It must not fire on client validation, Turnstile, network, API, or delivery
   failure.
3. Avoid double-firing during repeat clicks, retries, page transitions, or browser
   back/forward behavior.
4. Preserve an early visible “Request a project review” route to the form at
   390px width. Shorten the path without deleting proof or damaging the page
   narrative.
5. Keep event code resilient when analytics is blocked or unavailable.
6. Update privacy disclosure only if approved wording was supplied. Do not write
   legal language.

Test each success and failure path with event-debug evidence and confirm no PII
is transmitted. Run the test suite, build, and browser checks.

Return files changed, event schema, trigger conditions, network/debug evidence,
mobile CTA evidence, remaining dashboard setup, and blockers. Stop for review;
do not deploy production.
```

## Batch 4 — Mobile performance, video, R2, and interactive-media loading

> **Superseded policy note — 2026-08-07:** The owner replaced the manual loading
> policy preserved in this historical prompt. Current behavior is automatic,
> muted hero playback near the viewport and automatic loading of the selected
> Switchboard R2 model, with one active GLB, Pause/Resume and unload controls,
> reduced decorative motion, and bounded fallbacks. Use the current policy and
> validation steps in `docs/DEPLOYMENT-RUNBOOK.md`; do not reuse the click-gate
> instructions below for later work.

### Send this when

- Original or best-available media assets are accessible.
- You know which files are served from R2 and how cache headers are controlled.
- The owner accepts the mobile poster-first policy.

### Inputs to confirm

```text
MOBILE_VIDEO_POLICY: POSTER FIRST; LOAD/PLAY ONLY AFTER USER INTERACTION
DESKTOP_VIDEO_POLICY: POSTER THROUGH LCP; LOAD AFTER SAFE POST-LCP TRIGGER OR INTERACTION
SWITCHBOARD_POLICY: [EMBED-ONLY / STANDALONE]
MEDIA_SOURCE_LOCATION: [PATH/BUCKET REFERENCES]
R2/CACHE SCOPE: [REPOSITORY ONLY / CONFIGURATION AUTHORIZED]
DEPLOYMENT_AUTHORITY: [LOCAL / PREVIEW]
```

### Prompt to send to Codex

```text
Read the governing documents, preflight, and accepted batch handoffs. Implement
only M01 in this pass.

Approved policies:
- Mobile video: poster first; do not transfer or autoplay the full video until
  explicit user interaction.
- Desktop video: keep the poster through LCP; use only a measured safe post-LCP
  or interaction trigger.
- Switchboard: [SWITCHBOARD_POLICY]
- R2/cache scope: [R2/CACHE SCOPE]
- Deployment authority: [DEPLOYMENT_AUTHORITY]

Inspect the current waterfall and asset references before editing. Preserve old
media until new variants are verified; do not destructively overwrite or delete
bucket objects.

Required work:
1. Keep a responsive compressed poster through LCP.
2. Use preload="none" and delayed source attachment consistent with the approved
   policies. Respect Save-Data and reduced-motion.
3. Provide compatible, materially smaller variants appropriate to actual display
   size. Use H.264 MP4 as a broad fallback and modern alternatives or adaptive
   delivery where the existing stack supports them. Remove silent audio tracks.
   Do not rely on MOV/HEVC as the only path.
4. Prevent the switchboard document, model-viewer runtime, GLB files, and large
   textures from loading before the approved proximity/interaction trigger.
5. Compress models/textures only when source assets and visual validation are
   available.
6. Use versioned/content-hashed media URLs and long-lived immutable caching for
   immutable assets. Do not purge broad caches unless explicitly authorized and
   necessary.
7. Preserve a functional no-JavaScript offer/contact route and accessible media
   controls/fallbacks.

Verify with a cold mobile network trace. Report every large request before and
after the trigger, total transferred bytes, media behavior, and whether cache
headers were observed on the real response. Test current iOS Safari and Android
Chrome when those environments are available; otherwise mark them manual.

Run at least three comparable mobile PageSpeed/Lighthouse lab runs when network
access permits and compare the median with the August 4 baseline of 5.0-second
mobile LCP and roughly 11.1 MB. Do not present lab results as field CWV.

Return changed files/assets, new asset sizes/codecs, loading trigger behavior,
cache evidence, lab results, visual regressions, and external actions still
required. Stop for review; do not deploy production.
```

## Batch 5 — Legal pages, quantitative claims, and South Florida truth

### Send this when

- A human has made each legal, claim, and location decision.
- Approved source files/evidence are attached.
- If only one of the three topics is ready, remove the unready M-items from the prompt instead of asking Codex to guess.

### Prompt to send to Codex

```text
Read the master SEO plan, research standard, preflight, and accepted batch
handoffs. Implement only [SELECT READY ITEMS: M03, M05, M11].

Approved owner inputs:
- Legal action: [PUBLISH APPROVED COPY / UNLINK UNTIL APPROVED / NO CHANGE]
- Approved privacy copy: [PATH OR ATTACHMENT]
- Approved terms copy: [PATH OR ATTACHMENT]
- 10-hours-per-week claim action: [KEEP WITH EVIDENCE / REMOVE NUMBER /
  REWRITE QUALITATIVELY]
- Claim evidence and permission: [PATH OR ATTACHMENT]
- South Florida positioning: [APPROVED WITH FACTS / DEFER]
- Approved public location/service-area facts: [PATH OR ATTACHMENT]
- Google Business Profile eligibility: [CONFIRMED / NOT CONFIRMED / N/A]
- Deployment authority: [LOCAL / PREVIEW]

Human-supplied facts and approved wording control. Do not draft legal clauses,
infer a public address, invent a service area, imply an office, create client
permission, or manufacture substantiation.

For M03:
- Publish only the approved policy text and metadata.
- Remove draft markers and noindex only if final publication was explicitly
  approved.
- If UNLINK UNTIL APPROVED was selected, remove sitewide promotional links while
  preserving a lawful operational path selected by the owner; do not pretend the
  policies are final.

For M05:
- Keep the number only if the supplied record includes source, date, baseline,
  method/estimate, period, approved wording, client permission, and review date.
- Otherwise remove the number or use only the specifically approved qualitative
  wording across every occurrence.

For M11:
- Add natural South Florida context only from approved facts and only to pages
  where it helps a real buyer.
- Keep visible copy, contact data, Organization schema, and profiles consistent.
- Do not create city pages, duplicate regional templates, or LocalBusiness
  properties unsupported by visible facts.

Search the repository for every affected occurrence, then run tests, build,
metadata/schema validation, and raw/rendered checks.

Return files changed, supplied evidence used, exact claim/location occurrences
changed, indexability changes, checks performed, and approvals still required.
Stop for owner review; do not deploy production.
```

## Batch 6 — Focused service pages, case presentation, and authority foundation

### Send this when

- Batches 1–5 are accepted.
- The owner has approved the real offer definitions, buyer fit, delivery limits, and source-backed case evidence.
- Approved route-specific social assets exist, or you accept that M21 will remain partial.

### Prompt to send to Codex

```text
Read the governing documents, preflight, accepted handoffs, approved offer brief,
and case-evidence package. Implement only M04, M21, and the planning/foundation
portion of M24.

Approved service inputs:
- Offers to publish: [EXACT OFFER NAMES]
- Approved routes: [ROUTES]
- Buyer fit and exclusions: [SOURCE FILE]
- Scope/process/integration facts: [SOURCE FILE]
- Approved case evidence and disclosures: [SOURCE FILES]
- Approved project-specific social cards: [ASSET PATHS OR NOT AVAILABLE]
- Deployment authority: [LOCAL / PREVIEW]

Likely service categories are websites and digital experiences, custom software
and internal tools, and automation/connected workflows, but publish only the
offers explicitly approved above.

Required work:
1. Create a small focused architecture, not scaled landing pages. Each service
   page must have a distinct buyer problem, fit/exclusions, scope, process,
   constraints/integrations, approved evidence, and service-specific “Request a
   project review” CTA.
2. Provide unique accurate title, description, H1, self-canonical, social
   metadata, raw-HTML content, contextual internal links, and sitemap/route
   manifest inclusion.
3. Preserve explicit disclosures when a project is a demo, not launched, or has
   no approved quantitative result.
4. Use approved route-specific 1200x630 social cards when supplied. If assets are
   missing, do not fabricate project imagery or claim M21 complete.
5. Replace an oversized Organization logo only with a stable, fit-for-purpose,
   approved asset.
6. Create a practical authority-building backlog based on first-hand resources,
   client-approved references, legitimate profiles/partnerships, speaking, and
   useful expert contributions. Do not automate outreach, buy links, invent
   reviews, or create keyword/city page factories.

If any page lacks enough truthful source material, do not publish a placeholder.
Return the exact missing questions for that route and continue only with fully
supported routes.

Run route parity tests, full tests/build, raw/rendered metadata checks, internal
link crawl, schema validation, mobile/accessibility checks, and social preview
validation where possible.

Return files/routes changed, source evidence used per page, validation results,
missing inputs, and any M-item that remains partial. Stop for content and design
review; do not deploy production.
```

## Batch 7 — Full preview validation and release decision

### Send this when

- All accepted code/content batches are on one preview deployment.
- The preview URL is available.
- No production deployment has occurred from these changes.

### Prompt to send to Codex

```text
This is a validation and release-readiness pass. Read the master plan, research
standard, preflight, and every accepted batch handoff.

Preview URL: [PREVIEW URL]
Expected commit: [COMMIT]
Production deployment: NOT AUTHORIZED
Controlled form test on preview: [AUTHORIZED / NOT AUTHORIZED]

Do not make broad new implementation changes. You may make a narrowly scoped fix
only when it is clearly caused by the current batches, is reversible, and can be
fully retested. Report any larger defect instead.

Validate:
1. Working-tree/release diff contains only approved scope.
2. Existing tests and production build pass.
3. Route manifest, sitemap, indexability, canonical, title, robots, and status
   parity are correct for every public route.
4. Redirect behavior has the intended status/hop on an environment capable of
   testing it; identify production-only redirect checks separately.
5. Raw HTML and rendered DOM agree for primary content and metadata.
6. JavaScript-disabled offer, service links, and contact path remain usable.
7. No full hero video, switchboard document, model runtime, or GLB loads before
   the approved trigger on a cold mobile trace.
8. At least three comparable lab runs per available form factor are summarized by
   median. Keep lab and field data separate.
9. Contrast, tab/panel semantics, keyboard, focus, error recovery, reduced
   motion, and 200%/400% zoom/reflow pass. Mark physical iOS/Android and
   VoiceOver/NVDA checks unverified unless actually performed.
10. Form validation/failure behavior works. Perform no real submission unless
    explicitly authorized above.
11. Analytics success fires exactly once and only after confirmed server success;
    failure events contain no PII.
12. No draft note, invented proof, unsupported local claim, false demo metric, or
    stale year remains.
13. No raw internal contact 404, console-breaking error, or broken social/schema
    asset was introduced.

Return a release table with each applicable M01–M24 item marked PASS, FAIL,
PARTIAL, BLOCKED, DEFERRED, or NOT APPLICABLE. Include evidence, affected URL,
whether the check was source/local/preview/manual, and the exact next action.

Conclude with one of:
- READY FOR OWNER PRODUCTION APPROVAL
- NOT READY, with blocking failures

Do not push, merge, or deploy production. Stop for owner approval.
```

## Batch 8 — Production deployment, webmaster baselines, and maintenance

### Send this when

- Batch 7 says the preview is ready.
- You have reviewed the preview.
- Production deployment and rollback authority are explicit.
- Search Console/Bing access and a test recipient are available, or you accept that those checks will remain open.

### Prompt to send to Codex

```text
Read the master plan, research standard, preflight, all batch handoffs, and the
approved preview release report.

Complete the production-evidence portions of M15, M16, M17, and M23, then close
or accurately classify every M01–M24 item. Do not reopen unrelated implementation
scope unless a verified production regression requires it.

Production deployment authority: [EXPLICITLY AUTHORIZED / NOT AUTHORIZED]
Approved commit: [COMMIT]
Deployment method/owner: [METHOD AND OWNER]
Rollback owner and trigger: [OWNER AND CONDITIONS]
Google Search Console access: [AVAILABLE / NOT AVAILABLE]
Bing Webmaster Tools access: [AVAILABLE / NOT AVAILABLE]
Controlled production form test: [AUTHORIZED / NOT AUTHORIZED]
Approved test recipient/marker: [DESTINATION AND MARKER]

If production deployment is not explicitly authorized, do not deploy; return the
exact release command/checklist and stop.

If authorized:
1. Confirm the approved commit and clean release scope immediately before deploy.
2. Deploy through the documented production workflow. Do not alter DNS,
   Cloudflare, R2, environment variables, or unrelated project settings outside
   the approved plan.
3. Run post-deployment status, redirect, robots, sitemap, canonical, raw/rendered,
   console, media-waterfall, accessibility-smoke, form, and analytics checks.
4. If authorized, send exactly one marked production test inquiry and reconcile
   browser response, server result, downstream receipt, and conversion event.
5. Verify Search Console Domain ownership, sitemap processing, representative URL
   Inspection, Pages, Performance, Manual Actions, Security Issues, Links, and CWV
   baseline when access exists. Do not request indexing indiscriminately.
6. Verify/import Bing, submit the canonical sitemap, and inspect representative
   URLs when access exists.
7. Record field CWV only when sufficient real-user data exists. Do not substitute
   Lighthouse for field data.
8. Establish named owners and retained evidence for release checks, monthly crawl
   and lead review, quarterly performance/accessibility review, six-month
   legal/claim/location review, and immediate infrastructure-change regression
   checks.
9. If a blocking production regression appears, follow the documented rollback
   procedure and report it; do not improvise a destructive rollback.

Return:
- Deployed commit and production URL
- Changes actually deployed
- Post-deployment evidence
- Form/analytics reconciliation
- GSC/Bing status with unavailable items left unverified
- Final M01–M24 closure table: repaired, rejected with owner rationale, accepted
  risk, dated backlog, or blocked
- Named maintenance owners/cadence
- Rollback status and unresolved risks

Do not mark legal, inbox, dashboard, physical-device, screen-reader, field-CWV,
or recurring-process work complete unless it was actually verified.
```

## Stop rules for every batch

Codex must stop and ask for direction when:

- The open repository does not match production.
- Current HEAD has material drift that invalidates the audited finding.
- A required owner decision or approved source file is missing.
- Completing the work would require raw credentials, a new vendor, new cost, or broader platform authority.
- A change would invent or materially reinterpret legal, location, client, claim, or service facts.
- Production deployment, DNS changes, broad cache purges, destructive asset replacement, or real form submission was not explicitly authorized.
- Existing user changes overlap the requested files and cannot be preserved safely.

## Required handoff format after every implementation batch

```text
1. Scope completed
2. Files and external configuration changed
3. Audit IDs addressed
4. Verification performed and evidence
5. Existing tests/build result
6. Production-only or human/manual checks remaining
7. Regressions or unresolved decisions
8. Safe rollback notes
9. Recommended next batch: READY / NOT READY
```

This staged plan does not guarantee rankings or authorize changes outside the selected batch.
