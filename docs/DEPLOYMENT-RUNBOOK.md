# Deployment and rollback runbook

## Authority and scope

The site owner controls GitHub, Vercel, Cloudflare/R2, DNS, form delivery, and
all preview, production, and rollback approvals. Local repository work does not
authorize an external platform action.

The deployment path is:

```text
confirmed Git commit
  -> Vercel build/deployment (`drawalker-github-io`)
  -> Cloudflare public edge
  -> https://www.networksandnodes.org/
```

The repository contains `vercel.json` for repository-controlled redirect
policy. It does not contain a GitHub Actions deployment workflow or encode the
active Vercel Git integration and production-branch trigger. It therefore does
not prove whether pushes to `main` deploy automatically. Before the next
authorized preview or production release, the site owner must confirm those
settings in the Vercel dashboard and record the observed trigger here or in the
release record.

## Environment inventory

Store deployment values in the owner-controlled platform environment. Keep only
the blank variable inventory in `.env.example`; never commit or print values.

| Variable | Purpose | Exposure |
|---|---|---|
| `VITE_ASSET_URL` | Build-time external asset base | Public after build |
| `SMTP_HOST` | SMTP host; source defaults to `smtp.porkbun.com` | Configuration |
| `SMTP_PORT` | SMTP port; source defaults to `587` | Configuration |
| `SMTP_USER` | SMTP authentication and sender account | Sensitive |
| `SMTP_PASS` | SMTP authentication secret | Secret |
| `CONTACT_EMAIL` | Project-review and song-suggestion destination | Sensitive operational configuration |
| `TURNSTILE_SITE_KEY` | Browser-visible Turnstile site key | Public |
| `TURNSTILE_SECRET_KEY` | Server-side Turnstile verification | Secret |
| `SPOTIFY_CLIENT_ID` | Spotify integration client | Configuration |
| `SPOTIFY_CLIENT_SECRET` | Spotify integration credential | Secret |
| `SPOTIFY_REFRESH_TOKEN` | Spotify account refresh token | Secret |
| `SPOTIFY_REDIRECT_URI` | Spotify authorization callback | Configuration |
| `PORT` | Legacy local Express-server port | Local configuration |

All environment values and their rotation are owned by the site owner. The
presence of a variable name in source does not verify that a deployed value is
current or correct.

## Local release preparation

1. Confirm the canonical repository, branch, commit, and working tree:

   ```sh
   git status --short --branch
   git rev-parse HEAD
   git remote get-url origin
   ```

2. Preserve unrelated changes. Do not reset, overwrite, or include them in the
   release.
3. Do not run `npm ci` in the canonical working copy while `node_modules/`
   remains tracked. If dependencies need installation, use a disposable clean
   checkout or worktree, run `npm ci` there, and keep its dependency churn out
   of the release diff.
4. Run `npm test` using the reviewed dependency state.
5. Run `npm run build` and confirm that `dist/` contains the intended HTML,
   assets, `robots.txt`, and `sitemap.xml`.
6. Review the changed-file list and `git diff --check`.
7. Record the candidate commit. A dirty working tree is not a reproducible
   release candidate.

## Preview and production procedure

1. Obtain explicit site-owner authority for the specific preview or production
   action.
2. Confirm that the target is the Vercel project `drawalker-github-io` and that
   its current domain and branch settings are correct. Do not infer the trigger
   from the local `.vercel` link.
3. Create the deployment through the owner-confirmed Vercel workflow. Record its
   deployment URL/ID, commit, trigger method, environment, and time.
4. On a preview, validate the changed routes, functions, metadata, crawler
   signals, console output, responsive behavior, keyboard behavior, and form
   error paths applicable to the release. Do not send a live form submission
   without separate approval.
5. Obtain site-owner acceptance of the preview and exact commit before a
   production action.
6. After an authorized production release, verify the public Cloudflare-served
   response rather than treating the Vercel build result as production proof.

Minimum production checks:

- Preferred URLs and representative assets return the intended status.
- Redirects reach the exact canonical destination with the expected hop count.
- `robots.txt`, `sitemap.xml`, canonical tags, and robots directives agree.
- Raw and rendered HTML expose the intended title, primary content, links, and
  conversion path.
- No new console, JavaScript, hydration, function, or asset error blocks a
  primary task.
- Form validation and error states work. A real delivery test requires its own
  approved recipient, marker, and downstream reconciliation.

## Batch 2 external follow-up

No Vercel or Cloudflare dashboard setting was changed during the repository-only
Batch 2 work. The site owner must complete or review these actions before the
host redirect portion of M08 can be marked verified:

1. In **Cloudflare → Rules → Redirect Rules → Single Redirects**, place the
   exact-path rules before the general host rule. Scope the exact rules to
   `networksandnodes.org` and `www.networksandnodes.org`, return `308`, enable
   **Preserve query string**, and send each path directly to its HTTPS `www`
   destination:
   - `/index.html` and `/index.html/` → `https://www.networksandnodes.org/`
   - `/switchboard.html/` → `https://www.networksandnodes.org/switchboard.html`
   - each deployed `/work/*.html/` variant → its matching non-trailing-slash URL
   - `/privacy.html/` and `/terms.html/` → their matching non-trailing-slash URLs
2. After those exact rules, create or review the general apex rule with the
   expression `http.host eq "networksandnodes.org"`, a dynamic destination of
   `concat("https://www.networksandnodes.org", http.request.uri.path)`, status
   `308`, and **Preserve query string** enabled. Use Cloudflare Trace to confirm
   these rules run before the existing scheme-only HTTPS redirect. This order
   prevents combined apex + duplicate-path requests from taking a second Vercel
   hop.
3. In **Vercel → Project → Settings → Domains**, edit the
   `networksandnodes.org` redirect to target `www.networksandnodes.org` with a
   permanent `308` instead of the currently observed temporary `307`. Treat the
   host-conditioned rule in `vercel.json` as a deployment fallback; the current
   Vercel domain redirect may execute before deployment routes.
4. In **Cloudflare → Security → Bots** (or Security Settings filtered to bot
   traffic), retain the owner-approved managed robots policy:
   `search=yes, ai-train=no, use=reference` and the currently managed named
   crawler restrictions.
5. After the repository deployment and dashboard review, fetch the public
   redirect variants and `robots.txt` again. Record every redirect status, hop,
   destination, and query-string result. The final delivered `robots.txt` must
   contain Cloudflare's single wildcard policy, its approved named groups, and
   the repository sitemap declaration without a conflicting repository group.

The exact-path redirects in `vercel.json` use absolute production destinations.
On a Vercel preview, following one of those redirects will leave the preview and
open production. Record the preview response headers, and do not mistake the
destination page for evidence that the preview itself served the redirected
content.

## Batch 3A external follow-up

Repository tests use synthetic form data and provider stubs. They do not prove
production inbox delivery. Before closing M02 operationally, the site owner must:

1. Rotate the Turnstile secret if it has appeared in terminal, tool, or chat
   output. During Cloudflare's documented rotation grace period, update
   `TURNSTILE_SECRET_KEY` in the Vercel environment and the ignored local `.env`,
   then deploy and verify the new value without printing either value. Do not
   commit the local environment file.
2. In **Cloudflare → Security → WAF → Rate limiting rules**, create or review a
   rule scoped exactly to `POST /api/send-quote`. Choose the threshold and
   mitigation from observed legitimate volume rather than an arbitrary default.
   Verify that limited requests receive the intended response and never reach
   Turnstile validation or SMTP delivery.
3. Confirm the Turnstile widget hostname allowlist contains only the approved
   production and separately authorized preview hosts. Production must not allow
   `localhost` or `127.0.0.1`.
4. Authorize a controlled form test separately. Record the approved environment,
   recipient/CRM owner, destination, unique non-sensitive marker, Vercel-log
   access, and downstream inbox/CRM access before submitting anything.
5. For that single test, reconcile the browser response and request ID with the
   non-PII Vercel event, exactly one downstream arrival, reply-to behavior, and
   safe HTML/plain-text rendering. Do not call provider acceptance proof of final
   inbox delivery.

Client in-flight suppression and Turnstile single-use rejection reduce accidental
duplicates. They do not guarantee exactly-once delivery after an ambiguous
network failure or across separate serverless instances. A durable exactly-once
claim would require an approved shared idempotency/outbox design.

## Batch 3B analytics and mobile-conversion follow-up

The site owner supplied the Umami Cloud tracking code and public Website ID on
August 5, 2026. The repository configuration is intentionally event-only:

- Cloudflare Web Analytics remains the pageview and real-user-performance source.
- Umami automatic pageviews are disabled to avoid duplicate traffic reporting.
- Tracking runs only on `www.networksandnodes.org`, honors Do Not Track, and
  excludes URL search parameters and fragments.
- The application sends handcrafted payloads containing only the public website
  ID, the fixed `/` path, one allowlisted event name, and—when applicable—one
  fixed placement or failure-stage value.
- The application never calls Umami identification. Its handcrafted event body
  contains no form values, email addresses, project text, Turnstile tokens,
  request IDs, error messages, referrers, titles, language, screen data, query
  strings, or URL fragments. Ordinary request metadata and vendor-side processing
  remain subject to Umami, browser, and network behavior and require privacy
  review.

Approved local event contract:

| Event | Trigger | Allowed event data |
| --- | --- | --- |
| `project_review_cta_click` | First activation of the early hero CTA per document | `placement: hero` |
| `project_review_form_start` | First input/change on an approved visible form field | none |
| `project_review_failure` | One terminal failed submission attempt | one of `validation`, `security`, `network`, `api`, `delivery` |
| `project_review_success` | Only after an HTTP response with `ok: true` | none |

Before closing M02 measurement or deploying this batch:

1. Record the analytics/privacy approver by name or business role. Supplying the
   tracking ID authorized the local integration but did not supply approved
   public privacy wording. The draft privacy notice must not be presented as
   final legal approval.
2. Review the effective Cloudflare/Vercel Content Security Policy. If one is
   active, merge `https://cloud.umami.is` into the applicable `script-src` (and
   `script-src-elem`, when separately declared), and merge
   `https://gateway.umami.is` into `connect-src`. Preserve all existing self,
   Turnstile, nonce/hash, frame, and other policies. Umami Cloud moved its
   collection endpoint to `gateway.umami.is` on June 6, 2026; verify the actual
   deployed request destination before finalizing the policy.
3. On an authorized deployment, confirm the tracker script loads without a CSP
   violation and automatic pageview requests do not fire.
4. With synthetic interactions, inspect the real Umami collection requests to
   `gateway.umami.is`.
   Confirm only the fixed payload keys and allowlisted values above are present;
   queries, hashes, referrers, form values, tokens, and error text must be absent.
5. Confirm one early CTA activation, one form start, and each mocked failure path
   appears correctly in Umami. Analytics blocking must not affect navigation,
   validation, error recovery, or form success.
6. A real successful form test still requires the separate Batch 3A authorization
   and downstream inbox reconciliation. Provider acceptance alone is not inbox
   delivery proof.
7. At `390×844` and `390×667`, verify that the hero CTA is visible early, lands
   on `#project-review-form` below the sticky header, transfers focus safely, and
   causes no horizontal overflow. Confirm the mobile menu summary measures at
   least 44×44 CSS pixels with normal and reduced motion.

The owner reported that the Vercel project uses the free Hobby plan. Vercel's
current plan documentation restricts Hobby to personal, non-commercial use. This
service-business deployment therefore requires an owner billing/eligibility
review; repository tests cannot resolve plan compliance. Recheck the
[Vercel Hobby plan documentation](https://vercel.com/docs/plans/hobby) before
production closure. Recheck the
[Umami tracker configuration](https://docs.umami.is/docs/tracker-configuration)
and [Umami Cloud changelog](https://docs.umami.is/docs/cloud/changelog) when
performing the authorized deployment validation.

## Batch 4 M01 media-performance follow-up

Batch 4 changed the repository only. It did not deploy the site, upload,
overwrite, or delete an R2 object, purge a cache, or change a Cloudflare, Mux,
or Vercel setting. The original media remains available for rollback and no
post-deployment result is claimed here.

Before the current implementation, the homepage could attach three full-file
R2 videos totaling 31,076,263 bytes. The public objects measured during the
audit were:

| Previous asset | Measured bytes | Relevant pre-change risk |
| --- | ---: | --- |
| `Immersive-designs.MP4` | 10,527,343 | Full H.264 MP4 rather than adaptive delivery |
| `Language-translation.MOV` | 9,270,884 | HEVC-only QuickTime compatibility and full-file delivery |
| `Realtor-redesign.mp4` | 11,278,036 | Full H.264 MP4 delivery |
| Chicago shoe GLB | 7,921,968 | Initial interactive-scene payload |
| Building GLB | 40,601,176 | Large scene payload |
| Drone GLB | 10,018,464 | Large scene payload |
| Shirt GLB | 23,694,740 | Large scene payload |

The repository implementation now:

- keeps the raw homepage HTML source-free for video delivery, dynamically loads
  the Mux player when the carousel approaches the viewport, and starts the
  selected hero video automatically, muted and inline, after page readiness;
- provides a visible pause/retry control, pauses playback when the document is
  hidden or the carousel leaves the viewport, and removes the active playback
  source after 20 seconds offscreen;
- honors explicit Save-Data and reduced-motion preferences by keeping the poster
  visible until the visitor presses Play; this preference-based exception is
  the only manual hero-video start path;
- loads the switchboard document automatically and loads its currently selected
  R2 model automatically. Selecting the shirt, shoe, building, or drone requests
  that scene without a global permission gate, while cancellation and element
  replacement keep only the active GLB attached;
- keeps every scene available on mobile, disables decorative model rotation for
  Save-Data or reduced-motion users, and exposes a retry action only after a
  load error or timeout; and
- appends ETag-derived version query tokens to GLB URLs. These tokens separate
  repository asset versions but do not themselves provide immutable caching.

The automatic-loading policy above was approved by the owner on 2026-08-07.
It replaces the earlier Batch 4 click-to-load policy. Do not reintroduce a
per-video or per-model permission gate as a generic performance treatment.
Preserve efficiency through adaptive delivery, proximity-based module loading,
one-active-model lifecycle management, pause/unload behavior, responsive
posters, explicit user preferences, and correct CDN caching.

This policy intentionally accepts a measurable transfer tradeoff: the eager
Switchboard can request the approximately 1 MB model-viewer runtime and 23.7 MB
shirt GLB during a homepage visit, and selecting the building can request a
40.6 MB GLB. R2 removes the need for a manual permission gate, but storage on a
CDN hostname does not make those bytes free or prove an edge cache hit. Track
this as an owner-approved M01 policy exception until production waterfall and
field data show the impact is acceptable.

On 2026-08-07, direct checks of all four deployed GLB URLs returned `200`,
`Content-Type: model/gltf-binary`, byte-range support, and
`Access-Control-Allow-Origin: https://www.networksandnodes.org`. This verifies
object availability and production-origin CORS at that time. The same responses
reported Cloudflare `DYNAMIC` and no explicit immutable `Cache-Control` policy,
so an R2 custom hostname alone must not be treated as evidence of an edge cache
hit or long-lived browser caching.

Model compression was not performed because the required source assets and
side-by-side visual-validation path were unavailable. The measured GLBs contain
large embedded textures, so any later texture resizing or KTX2 conversion must
use new versioned objects and pass visual review rather than overwrite the
preserved originals.

No audio track was removed or source video overwritten. The audit could inspect
track metadata but could not human-verify that the AAC tracks in two originals
were intentionally silent. If new renditions are later created, verify the
audio editorially first, then publish silent H.264/adaptive variants under new
versioned keys only when removing audio is correct.

Complete these checks after an authorized deployment:

1. Run a cold, cache-disabled network trace. Initial homepage load must request
   no Mux runtime or playback stream until the hero carousel reaches its
   proximity threshold. At that point, only the selected adaptive Mux stream
   should start. The automatically requested switchboard may load its viewer and
   selected shirt GLB; it must not request all four GLBs.
2. Select the shoe, building, drone, and shirt in sequence. Confirm each chosen
   R2 URL loads without a permission click, the previous scene is detached or
   cancelled, the building remains available on mobile, and failure states show
   the static fallback plus a retry control. Repeat with Save-Data and reduced
   motion: models may load automatically but must not rotate automatically, and
   hero video playback must wait for Play.
3. Test iOS Safari and Android Chrome at `390x844` and `390x667`, including
   keyboard/focus behavior, poster and control sizing, orientation changes,
   horizontal overflow, load/error recovery, and the no-JavaScript contact
   route.
4. Run three comparable cold mobile Lighthouse or PageSpeed tests with the same
   location and profile. Preserve every result and report the median request
   count, transferred bytes, LCP, INP or its lab proxy, and CLS against the
   earlier 5.0-second / 11.1-MB lab reference. Do not present lab results as
   field Core Web Vitals.
5. Recheck response headers for every deployed media URL. Audit-time responses
   for the measured R2 GLB objects did not expose an
   immutable `Cache-Control` policy and were served as Cloudflare `DYNAMIC`.
   The Cloudflare/R2 owner must publish new versioned objects with an appropriate
   long-lived policy such as `public, max-age=31536000, immutable`, then confirm
   both browser policy and repeated-request `HIT`/`Age` evidence at the public
   hostname. Change the version token whenever the bytes change; do not overwrite
   an object behind an immutable URL.
6. Inspect the effective production CSP and browser console. Permit only the
   exact Mux player, poster, and stream origins observed in the deployed flow,
   preserve the existing Turnstile and analytics rules, and do not add broad
   wildcards. Confirm that deferred iframe and media requests are not blocked.
7. Record raw and rendered HTML, trace files, device/browser versions, the three
   performance runs, response headers, errors, and acceptance decision in the
   release record. Until these checks pass, M01 is repository-implemented but
   not production-verified under the owner-approved automatic-loading policy.

Local validation on 2026-08-07 passed 103 repository tests and a production
Vite build. The build emitted the initial homepage script at approximately
17.0 kB minified / 6.4 kB gzip and kept the approximately 1 MB Mux and
model-viewer libraries in separate deferred chunks. A browser waterfall and
real-device visual/accessibility pass were not available in the audit
environment and remain required after deployment.

## Batch 5 repository-safe progress

The following owner-independent work is complete in the repository:

- the numeric “approximately 10 hours per week” claim was removed in favor of
  the approved qualitative reported-outcome wording across the homepage and
  Transportation Solutions case study;
- Redeemed Hands is reachable from the homepage as an additional documented
  project, eliminating its internal-link orphan state without displacing the
  four featured project cards;
- the production build now copies only public template runtime files and blocks
  internal `app`, `node_modules`, package/configuration, Markdown, and TypeScript
  material from `dist/templates`; and
- canonical/redirect coverage now includes the public template index variants
  and AERON directory-index variants.

The legal-policy and South Florida portions of Batch 5 remain open. Privacy and
terms must stay clearly marked as drafts and `noindex` until the owner and an
appropriate legal reviewer supply and approve text that matches the real form,
processors, retention, contact, jurisdiction, and service practices. Do not add
South Florida office, address, service-area, Google Business Profile, client, or
city-page claims until the owner supplies the underlying facts. These open items
are human-review dependencies, not repository implementation failures.

## Release record

Retain one record per preview and production release. Do not include secrets,
form contents, personal information, or full environment values.

```text
Release date/time:
Environment: preview / production
Approved by:
Executed by:
Repository:
Branch:
Commit:
Working tree clean: yes / no
Vercel project:
Vercel deployment URL or ID:
Deployment trigger: dashboard / CLI / Git integration / other
Cloudflare-served URL checked:
Files or M-items included:
npm test result:
npm run build result:
HTTP/redirect checks:
Robots/sitemap/canonical checks:
Raw/rendered checks:
Accessibility/performance checks:
Form checks and authorization scope:
Known limitations:
Rollback target:
Final disposition: accepted / rejected / rolled back
```

## Rollback

Use a recoverable two-stage rollback. The site owner's approved order is to
restore service by promoting the previous known-good Vercel deployment first,
then reconcile Git history with a revert.

1. Stop further production releases and notify the site owner.
2. Identify the affected release record and the last known-good Vercel
   deployment. Verify its commit and environment before changing production.
3. With site-owner approval, promote the previous known-good Vercel deployment
   to production.
4. Run the minimum production checks against the Cloudflare-served site and
   record the result.
5. In the canonical repository, create a normal `git revert` of the faulty
   release commit or commits. Do not use `git reset --hard`, rewrite shared
   history, or restore from the old Next/Vinext archive.
6. Run `npm test` and `npm run build` on the reverted state.
7. With site-owner approval, deploy the tested revert through the confirmed
   Vercel workflow so repository history and production converge.
8. Purge or change Cloudflare caches only when the failure requires it and the
   site owner has explicitly approved the exact scope. A broad purge is not a
   default rollback step.
9. Record the incident, promoted deployment, revert commit, validation, and any
   follow-up action in the release record.

If the previous deployment cannot be positively identified or its environment
is incompatible, stop and obtain site-owner direction. Do not improvise a
destructive rollback.
