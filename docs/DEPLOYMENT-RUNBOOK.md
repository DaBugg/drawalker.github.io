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
