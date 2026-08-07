# Networks & Nodes — Master SEO Audit and Implementation Plan

**Website:** https://www.networksandnodes.org/  
**Master plan date:** August 4, 2026  
**Primary conversion:** Form submission  
**Primary audience:** Established businesses, founder-led teams, and organizations with complex operations  
**Primary market:** United States preferred; South Florida only where truthful and operationally supported; global audience  
**Observed implementation:** Static multi-page HTML and vanilla JavaScript built with Vite, Vercel serverless form functions, and Cloudflare proxying  
**Governing standard:** `/Users/dw/Downloads/SEO-GUIDANCE-RESEARCH-STANDARD.md`  
**Status:** Consolidated planning document; no website changes were made

## 1. Purpose and source audits

This document combines, deduplicates, and reconciles three audits completed on August 4, 2026:

1. `NETWORKS-AND-NODES-SEO-COMPLIANCE-AUDIT-2026-08-04.md` — production-first audit with live HTTP, rendered-page, and PageSpeed evidence.
2. The source-backed audit beginning `# SEO audit — Networks & Nodes` — repository inspection at commit `d5b431828d2fc63daebaf58c98a081e786f0371e`, live comparisons, and 26 passing source tests.
3. The Codex implementation audit completed in the originating task — source, production, browser, mobile-layout, form-error-path, and governance review.

The master plan is the controlling backlog. It does not repeat every observation from every source; it preserves verified passes, resolves contradictions, combines overlapping findings, and turns the remaining work into sequenced tasks with acceptance criteria.

No rankings, traffic gains, rich results, crawling, or indexing are guaranteed by this plan.

## 2. Evidence and reconciliation method

Findings follow the research standard's distinction between Discovery, Crawling, Rendering, Indexing, Ranking, Search presentation, User experience, and Conversion.

### Evidence precedence

When the audits disagreed, this order was used:

1. Exact production response, browser, network, or element-level evidence.
2. Current production-matching source at commit `d5b431828d2fc63daebaf58c98a081e786f0371e`.
3. General source scans, automated summaries, and older source documentation.
4. Private system assumptions, which remain Unverified until dashboard or owner evidence is supplied.

### Reconciled conflicts

| Topic | Audit disagreement | Master conclusion |
|---|---|---|
| `robots.txt` | One audit rated the duplicate wildcard policy High; another rated it Low after standards-compliant parsing allowed Googlebot and Bingbot. | The file is objectively contradictory, but a current search-engine block was not verified. Treat cleanup as **Medium severity, Phase 1**, because it is inexpensive and prevents future crawler/platform ambiguity. |
| Analytics | A source/raw-HTML audit found no analytics; production browser inspection found a Cloudflare browser-insights beacon. | Cloudflare RUM is present through production injection. A business conversion event is still absent. The gap is conversion measurement, not total absence of telemetry. |
| Accessibility contrast | A broad source color scan reported tested pairs passing; production Lighthouse identified a specific project-label pair at 4.24:1. | Accept the exact production element-level result. Repair and retest the shared project-label token. |
| Core Web Vitals | One source audit could not run PageSpeed; the production audit captured a PageSpeed report. | Use the verified lab snapshot: mobile performance 73 and LCP 5.0 s; desktop LCP 0.6 s. Field CWV remains Unverified because no public field dataset was available. |
| Search Console | Public HTML lacked a verification tag; DNS contained a Google verification TXT record. | Domain verification is Partially verified. Ownership, sitemap processing, indexing, manual actions, performance, and CWV reports remain Unverified. |
| Production source | One audit lacked a repository and an older locator pointed to a Next/Vinext tree. | The Vite repository at the audited commit matches production and is the technical source of truth. Documentation and locator references still need correction. |
| Switchboard role | Some recommendations assumed it should rank; others treated it as an embedded experience. | Human decision required. The preferred default is embed-only unless the business commits to making it a useful standalone landing page. Sitemap, canonical, navigation, and robots signals must reflect one role. |

## 3. Consolidated executive summary

No Critical sitewide discovery, crawl, rendering, or indexing failure was verified. The site has a sound technical base: primary pages return real HTML, indexable pages expose content and metadata without JavaScript hydration, invalid routes return genuine 404s, primary canonicals are correct, the small sitemap is mostly accurate, titles and descriptions are distinct, Organization structured data matches visible content, and no scaled low-value or location-page generation was found.

The most serious remaining risks are business and production quality risks:

1. **Mobile payload and LCP:** The verified mobile lab run transferred roughly 11.1 MB and measured 5.0-second LCP, dominated by a 10.5 MB showcase video. The switchboard can also load a 3D runtime and multi-megabyte model before clear user intent.
2. **Lead reliability and attribution:** Form error paths work, but successful downstream delivery has not been verified. No non-PII conversion event records confirmed success, and the email-building code needs output escaping and current internal labels.
3. **Public trust content:** Privacy and terms pages are linked sitewide while visibly labeled as drafts and contain unresolved developer notes.
4. **Commercial architecture:** Several distinct services are compressed into the homepage and an interactive explorer. There are no focused service pages for the actual commercial intents.
5. **Evidence governance:** The approximately 10-hours-per-week outcome needs a retained source, method, review date, and client approval. Illustrative switchboard metrics need a visible demo-data label.
6. **Index-signal consistency:** Redirect variants, ambiguous switchboard indexability, duplicate wildcard robots groups, and manually duplicated route inventories create avoidable maintenance and crawler risk.
7. **Market alignment:** South Florida is a stated priority but is not established on the site. Local positioning must only be added after the owner verifies the actual location, service area, and any Google Business Profile eligibility.
8. **Operational monitoring:** Search Console and Bing dashboard status, conversion reporting, field CWV, and a recurring production QA process are not yet evidenced.

The likely business consequences are slower mobile engagement, lost or unattributed inquiries, reduced buyer trust, weak relevance for specific non-brand service searches, and regressions that remain undetected after deployment. These are constraints to remove, not promises of higher rankings.

## 4. Master prioritized issue register

| ID | Priority | Finding | Affected URL/file | SEO stage | Severity | Evidence | Owner | Recommended outcome |
|---|---:|---|---|---|---|---|---|---|
| M01 | P1 | Oversized video and early interactive-media loading drive poor mobile lab performance | `/`, carousel media, `/switchboard.html`, model assets | Ranking, User experience, Conversion | High | Verified | Developer | No full video, iframe, model-viewer, or GLB transfer before the approved interaction/post-LCP trigger |
| M02 | P1 | Confirmed form success is neither measured nor fully delivery-tested | `/`, `/api/send-quote`, analytics and inbox/CRM | Conversion | High | Partially verified | Developer + Operations | One successful test produces one downstream lead and one non-PII conversion event; failures produce neither |
| M03 | P1 | Public privacy and terms pages are unfinished drafts | `/privacy.html`, `/terms.html` | User experience, Conversion | High | Verified | Owner + Legal | Final truthful, approved policies replace all draft labels and developer notes |
| M04 | P1 | Core services lack focused commercial landing pages | `/`, navigation, proposed service routes | Discovery, Ranking, Conversion | High | Verified | Owner + SEO/Content | A small, evidence-backed service architecture supports the services actually sold |
| M05 | P1 | The 10-hours-per-week outcome lacks a retained primary proof record | `/`, `/work/transportation-solutions-lighting.html`, evidence register | Ranking, User experience, Conversion | High | Partially verified | Owner + Client approver | Retain substantiation and permission or remove the number |
| M06 | P1 | Production source documentation points to competing or stale implementations | README, source-locator documentation, deployment runbook | Discovery, Crawling, Rendering, Indexing, Ranking, Search presentation, User experience, Conversion | High | Verified | Developer + Owner | One documented production repository, deployment path, and release owner |
| M07 | P2 | Contradictory wildcard groups make `robots.txt` hard to reason about | `/robots.txt`, Cloudflare managed signals | Crawling | Medium | Verified | Developer | One unambiguous general search-crawler policy plus deliberate named crawler rules |
| M08 | P2 | Host and duplicate URL variants are not consolidated with direct permanent redirects | Apex HTTP/HTTPS, `/index.html`, `.html/` variant | Crawling, Indexing, User experience | Medium | Verified | Developer | Every nonpreferred variant reaches the canonical equivalent in one 301/308 |
| M09 | P2 | Switchboard indexability and standalone purpose are inconsistent | `/switchboard.html`, `/sitemap.xml`, homepage iframe/links | Discovery, Crawling, Indexing, Ranking, Search presentation, User experience | Medium | Verified | Owner + Developer + SEO | One approved embed-only or standalone-page policy implemented consistently |
| M10 | P2 | Route inventory, sitemap, build inputs, and tests duplicate route truth manually | `vite.config.mjs`, `sitemap.xml`, page links, tests | Discovery, Crawling, Indexing | Medium | Verified | Developer | One route manifest or CI parity check prevents route/sitemap/canonical drift |
| M11 | P2 | South Florida positioning is not evidenced on primary pages | `/`, future About/service content, Organization data | Discovery, Ranking, Conversion | Medium | Partially verified | Owner + SEO/Content | Truthful local context only if operational evidence and eligibility exist |
| M12 | P2 | Project-label contrast fails the exact production Lighthouse test | `/` project detail labels/CSS token | User experience, Conversion | Medium | Verified | Designer + Developer | Computed contrast is at least 4.5:1 in every state |
| M13 | P2 | Switchboard includes small labels/targets and mismatched tab-panel semantics | `/switchboard.html` | User experience, Conversion | Medium | Partially verified | Designer + Developer | Legible text, adequate targets/spacing, and correct tab-to-panel relationships |
| M14 | P2 | The primary mobile form appears very deep in the homepage journey | `/` | User experience, Conversion | Medium | Verified | Designer + Owner | A clear early CTA and short route to the form are available without weakening the narrative |
| M15 | P2 | Google Search Console operational status is not available | GSC Domain property and sitemap | Discovery, Crawling, Indexing, Ranking | Medium | Partially verified | Owner + SEO | Ownership, sitemap, URL Inspection, reports, and baseline are recorded |
| M16 | P2 | Bing Webmaster Tools configuration is not evidenced | Bing property and sitemap | Discovery, Crawling, Indexing | Medium | Unverified | Owner + SEO | Ownership/import, sitemap, URL inspection, and baseline are recorded |
| M17 | P2 | No documented recurring SEO, accessibility, claim, performance, and lead-flow process was supplied | Release and operating process | Discovery, Crawling, Rendering, Indexing, Ranking, Search presentation, User experience, Conversion | Medium | Unverified | Owner + Developer + SEO | Named owners, cadence, retained results, and escalation paths exist |
| M18 | P1 | Form email generation needs escaping and current business labels | `api/send-quote.js` | User experience, Conversion | High | Verified | Developer | User input is safely encoded and all notification wording matches Networks & Nodes |
| M19 | P3 | Synthetic switchboard metrics can look like real results | `/switchboard.html` | User experience, Conversion | Low | Verified | Content + Developer | Persistent visible “illustrative example data” disclosure |
| M20 | P3 | Cloudflare email obfuscation creates raw same-origin 404 targets | Delivered email anchors, `/cdn-cgi/l/email-protection` | Crawling, Rendering, User experience | Low | Verified | Developer | Raw anchors resolve to valid contact destinations without decoder dependence |
| M21 | P3 | Case studies reuse a generic social card; Organization logo asset is oversized | `work/*.html`, social metadata, `/images/favicon-image.png` | Search presentation, User experience | Low | Verified | Designer + Developer | Truthful route-specific cards and a fit-for-purpose stable logo asset |
| M22 | P3 | Raw footer year is stale and updated only by JavaScript | Shared page HTML/footer script | Rendering, User experience | Low | Verified | Developer | Correct year is present in built HTML |
| M23 | P3 | Field Core Web Vitals and real-device assistive-technology behavior are unknown | Production experience | Ranking, User experience, Conversion | Medium | Unverified | Developer + SEO/Accessibility | Field data is monitored when available and manual accessibility tests are retained |
| M24 | P3 | Broader authority-building plan has not yet been evidenced | Content and outreach operations | Discovery, Ranking | Medium | Unverified | Owner + SEO/Content | Useful first-hand resources and legitimate relationship-based citations are developed after foundation work |

### Classification and research-standard matrix

| ID | Rule classification | Evidence status | Applicable research-standard sections |
|---|---|---|---|
| M01 | Strong recommendation | Verified | §§1, 9, 14.6, 16.9, 22, 29 |
| M02 | Required | Partially verified | §§1, 9, 14.6, 16.10, 20, 22, 29 |
| M03 | Human review required | Verified | §§6, 9, 14.5, 20, 22, 29 |
| M04 | Strong recommendation | Verified | §§1, 9, 10, 12, 13, 16, 22, 29, 31 |
| M05 | Human review required | Partially verified | §§6, 9, 14.5, 15, 22, 29, 31 |
| M06 | Strong recommendation | Verified | §§9, 14, 17.2, 20, 22, 29 |
| M07 | Strong recommendation | Verified | §§1, 9, 14.1, 16.1, 22, 29 |
| M08 | Strong recommendation | Verified | §§9, 14.1, 16.1, 16.3, 22, 29 |
| M09 | Human review required | Verified | §§1, 9, 14.1, 16.1, 16.3, 22, 29 |
| M10 | Strong recommendation | Verified | §§9, 14.1, 16.1, 17.2, 20, 22 |
| M11 | Conditional | Partially verified | §§6, 9, 13, 14.5, 16.5, 22, 31 |
| M12 | Required | Verified | §§6, 9, 14.6, 16.10, 22, 29 |
| M13 | Human review required | Partially verified | §§6, 9, 14.6, 16.10, 22, 29 |
| M14 | Strong recommendation | Verified | §§1, 9, 14.6, 16.10, 20, 22, 29 |
| M15 | Human review required | Partially verified | §§1, 9, 19.2, 22, 24, 29 |
| M16 | Human review required | Unverified | §§6, 9, 22, 24, 29 |
| M17 | Strong recommendation | Unverified | §§9, 14, 15, 20, 22, 29, 31 |
| M18 | Required | Verified | §§6, 9, 14.6, 16.10, 20, 22, 29 |
| M19 | Human review required | Verified | §§6, 9, 14.3, 14.5, 16.5, 22, 31 |
| M20 | Strong recommendation | Verified | §§9, 14.1, 17.2, 22 |
| M21 | Strong recommendation | Verified | §§9, 14.3, 16.2, 22, 29 |
| M22 | Strong recommendation | Verified | §§9, 14.3, 17.2, 20, 22 |
| M23 | Human review required | Unverified | §§1, 9, 14.6, 16.9, 16.10, 22, 29 |
| M24 | Strong recommendation | Unverified | §§7, 9, 12, 13, 18, 22, 29, 31 |

## 5. Master implementation plan

### Phase 1 — Critical indexing and production failures

No Critical failure was found. This phase contains the highest-dependency production, trust, and conversion work.

#### 1.1 Establish production governance

- **Tasks:** M06, baseline portion of M17.
- **Action:** Declare `/Users/dw/Documents/GitHub/drawalker.github.io` and its verified deployment mapping as the current production source. Update the README, source-locator documentation, deployment checklist, hosting/CDN ownership, environment-variable ownership, and rollback procedure. Archive the older Next/Vinext reference or clearly label it nonproduction.
- **Dependency:** Owner confirms who controls GitHub, Vercel, Cloudflare, DNS, and the form mailbox/CRM.
- **Acceptance test:** A new maintainer can identify the production repository, active branch/deployment workflow, hosting/CDN layers, form destination owner, and rollback path without relying on oral history.

#### 1.2 Normalize crawl and canonical routing signals

- **Tasks:** M07, M08, M09.
- **Action:**
  - Replace duplicate wildcard robots groups with one clear general policy. Preserve only intentional named crawler restrictions and the canonical sitemap declaration.
  - Route every nonpreferred host/protocol directly to the equivalent `https://www.networksandnodes.org/...` URL with one 301/308.
  - Redirect `/index.html` to `/` and `.html/` variants to their non-trailing-slash equivalents.
  - Decide the switchboard role. Preferred default: make it embed-only with `noindex, follow` and remove it from the sitemap. If the owner chooses standalone indexing, add self-canonical, navigation/footer, unique social metadata, useful standalone introduction, and a contextual anchor from the homepage.
- **Dependency:** Switchboard owner decision.
- **Acceptance test:** Header and crawl checks show a single permanent hop, one effective robots policy, no duplicate 200 variants, and a switchboard configuration with no conflicting sitemap/canonical/robots/link signals.

#### 1.3 Finalize trust and claim evidence

- **Tasks:** M03, M05, M19.
- **Action:**
  - Owner and qualified counsel approve privacy and terms language based on actual form fields, processors, retention, contact procedures, jurisdiction, and service terms.
  - Create a claim register for the approximately 10-hours-per-week outcome: reporter, date, baseline, measurement/estimate method, period, approved wording, client approval, and next review date. Remove the number if the record cannot be maintained.
  - Add a persistent visible disclosure that switchboard names and metrics are illustrative example data.
- **Dependency:** Owner, legal counsel, and client/claim approver.
- **Acceptance test:** No public draft markers or developer notes remain; every quantitative claim traces to a dated approved record; demo values cannot reasonably be mistaken for customer results.

#### 1.4 Verify and harden the primary conversion path

- **Tasks:** M02, M18.
- **Action:**
  - Escape or safely encode every user-supplied value inserted into HTML email.
  - Replace stale “Portfolio Contact Submission” language with current Networks & Nodes project-review wording.
  - Validate allowed service values server-side.
  - Add delivery/error monitoring without exposing form content.
  - Perform one approved controlled submission with a unique test marker through Turnstile.
- **Dependency:** Approved test recipient and access to the downstream inbox/CRM and server logs.
- **Acceptance test:** The test returns a legitimate success response, arrives exactly once at the expected destination, has correct reply-to and safe rendering, and can be reconciled with server logs. Validation, Turnstile, API, and delivery failures show accessible error states.

### Phase 2 — Metadata, architecture, and content corrections

#### 2.1 Create a focused service architecture

- **Tasks:** M04.
- **Action:** Research and manually create only the service pages the company truly sells. The current evidence supports considering:
  - Websites and digital experiences
  - Custom software and internal tools
  - Automation and connected workflows

  Each page must state the buyer problem, fit and exclusions, scope, process, constraints/integrations, relevant approved case evidence, and a service-specific project-review CTA. Use unique titles, descriptions, H1s, self-canonicals, social metadata, contextual internal links, and sitemap inclusion. No arbitrary word count or fixed link count applies.
- **Dependency:** Owner confirms offer definitions, buyer fit, delivery capability, and evidence available for each page.
- **Acceptance test:** Every published service route returns 200, exposes complete content in raw HTML, has unique accurate metadata, is self-canonical and sitemap-listed, is reachable by relevant anchors, and contains no fabricated proof or generic keyword swaps.

#### 2.2 Decide local positioning before creating local content

- **Tasks:** M11.
- **Action:** Confirm the real business location, customer-facing service area, address publication policy, and Google Business Profile eligibility. If South Florida acquisition is genuine, add visible, natural location context and actual local availability/proof to the homepage/About/service pages. Consider one useful regional page only when it serves a distinct buyer need. If the evidence is not confirmed, retain national/global positioning.
- **Dependency:** Owner-supplied location and eligibility evidence.
- **Acceptance test:** Visible copy, contact information, Organization data, profiles, and regional claims agree. No invented address, office, client, city coverage, or mass city-page template exists.

#### 2.3 Make routes and metadata maintainable

- **Tasks:** M10, switchboard metadata portion of M09, M21, M22.
- **Action:**
  - Create one route manifest containing source path, public path, indexability, canonical intent, and sitemap inclusion, or add CI tests that enforce equivalent parity.
  - Generate or validate Vite inputs and sitemap against that source.
  - Implement switchboard metadata only according to the approved index policy.
  - Create approved case-specific social cards and a smaller stable Organization logo asset.
  - Put the current year in built HTML instead of depending on runtime correction.
- **Dependency:** Switchboard role and approved media.
- **Acceptance test:** CI fails when an indexable route is missing from the sitemap, redirects, errors, is noindexed, or has a nonmatching canonical. Raw HTML contains correct metadata and footer copy.

### Phase 3 — Performance, accessibility, and conversion improvements

#### 3.1 Remove early multi-megabyte transfers

> **Owner policy update — 2026-08-07:** The original interaction-gate proposal
> below is retained as audit history but is superseded for implementation.
> Hero videos now start automatically, muted, when the carousel approaches the
> viewport, with Pause/Resume available instead of a load or Play gate. The
> switchboard document and selected R2 model load automatically without a
> permission button, while only the active GLB stays attached. See the Batch 4
> follow-up in `docs/DEPLOYMENT-RUNBOOK.md` for the current acceptance checks and
> remaining cache/performance risk.

- **Tasks:** M01.
- **Action:**
  - Keep a responsive compressed poster through LCP.
  - Set videos to `preload="none"` and load on explicit user action or a measured safe post-LCP trigger.
  - Respect Save-Data and reduced-motion preferences; avoid full autoplay transfer on small/constrained devices.
  - Supply lower-bitrate 720p/1080p H.264 MP4 and modern alternatives or adaptive streaming; do not rely on MOV/HEVC as the only path; remove silent audio tracks.
  - Replace the initial iframe `src` with a placeholder/data source and attach it only at the approved proximity or interaction trigger.
  - Dynamically load model-viewer and GLB files only when the 3D panel is activated; compress models and textures.
  - Use content-hashed media URLs with long-lived immutable caching.
- **Dependency:** Media re-encoding/storage workflow and switchboard role.
- **Acceptance test:** A cold mobile waterfall shows no full showcase video, switchboard document, model-viewer bundle, or GLB before the approved trigger. Playback and 3D behavior work on current iOS Safari and Android Chrome. Repeated PageSpeed medians materially improve without regression in content or form behavior.

#### 3.2 Repair accessibility and interaction semantics

- **Tasks:** M12, M13, M23.
- **Action:**
  - Darken the shared project-detail label token until the computed production pair has at least 4.5:1 contrast in all states.
  - Increase small switchboard hit areas to at least 24×24 CSS pixels or provide compliant spacing, and raise information-bearing 0.5–0.6rem labels to a legible responsive token.
  - Give each ARIA tab the correct controlled panel relationship, or use a semantics pattern matching the actual single-panel implementation.
  - Complete keyboard-only, VoiceOver/NVDA, focus, error recovery, reduced-motion, and 200%/400% zoom/reflow testing.
- **Dependency:** Final switchboard interaction design.
- **Acceptance test:** axe/Lighthouse no longer reports the label contrast defect; all tabs, controls, status messages, and form errors are understandable and operable with keyboard and sampled screen readers; retained test notes identify devices and versions.

#### 3.3 Shorten the path to the primary conversion

- **Tasks:** M14 and measurement portion of M02.
- **Action:** Preserve a clear above-the-fold and post-proof CTA that anchors or navigates directly to the project-review form. Evaluate a shorter mobile sequence, a compact qualification step, or a persistent nonintrusive CTA. Do not remove proof merely to shorten the page. Record CTA click, form start, confirmed success, and failure as separate non-PII events.
- **Dependency:** Analytics provider and privacy decision.
- **Acceptance test:** At 390px width, users can reach the form from an early visible CTA without scrolling through the entire document. Analytics records one confirmed-success event only after a successful server response and records no PII.

#### 3.4 Resolve raw contact-link 404s

- **Tasks:** M20.
- **Action:** Disable Cloudflare email obfuscation for controlled contact links or replace them with a valid raw contact route/form. Avoid a raw same-origin `/cdn-cgi/l/email-protection` link that returns 404 without decoder JavaScript.
- **Dependency:** Owner decision on publishing an email address.
- **Acceptance test:** A raw-HTML crawl finds no false internal contact 404; keyboard and no-JavaScript contact paths remain valid.

### Phase 4 — Content expansion and authority building

#### 4.1 Deepen service and case-study usefulness

- **Tasks:** M04, M24.
- **Action:** Expand pages only with first-hand material: decisions, constraints, integrations, tradeoffs, screenshots, process detail, outcomes, and limitations. Preserve explicit disclosures when launch status or quantitative results are unavailable. Build supporting resources around real buyer decisions, not keyword-volume alone.
- **Acceptance test:** Each page has a distinct audience and task, unique first-hand value, a named maintainer, source-backed claims, and a clear relationship to an actual service.

#### 4.2 Build legitimate authority

- **Tasks:** M24.
- **Action:** Pursue client-approved references, relevant business profiles/directories, project partnerships, speaking, original practical resources, and useful expert contributions. Do not buy links, automate outreach spam, fabricate reviews, or manufacture city/service pages.
- **Acceptance test:** Every new citation or link reflects a real relationship, resource, or editorial choice. Vendor authority scores may be used comparatively but are never presented as Google metrics.

#### 4.3 Improve search and social presentation

- **Tasks:** M21 and ongoing title/snippet review.
- **Action:** Use approved project-specific social cards, monitor Google title/snippet selection in Search Console, and refine inaccurate or weak page metadata based on actual query/page data. Do not treat meta descriptions or Open Graph as direct ranking factors.
- **Acceptance test:** Each shared case URL resolves to a truthful distinct 1200×630 card with descriptive alternative metadata and no invented client result.

### Phase 5 — Monitoring and maintenance

#### 5.1 Establish webmaster-tool baselines

- **Tasks:** M15, M16.
- **Action:** Confirm a Google Search Console Domain property and appropriate team access; submit the canonical sitemap; inspect the homepage, case studies, service pages, and approved switchboard state; export Pages, Performance, Manual Actions, Security Issues, Links, and CWV baselines. Import or verify the site in Bing Webmaster Tools, submit the sitemap, and inspect representative URLs. Use IndexNow only if a named publishing owner will maintain it.
- **Acceptance test:** Ownership, least-privilege access, successful sitemap processing, representative URL inspections, and dated baseline exports are retained for both engines.

#### 5.2 Create the recurring operating cadence

- **Tasks:** M17, M23.
- **Action:**
  - **Every release:** status/redirect, robots, sitemap, canonical, title, schema, raw/rendered, console, form, accessibility smoke test.
  - **Monthly:** crawl; broken-link review; GSC/Bing indexing and query review; lead funnel and delivery review.
  - **Quarterly:** repeated PageSpeed plus field CWV when available; manual accessibility sample; media/cache review.
  - **Every six months or on change:** legal text, public claims, client approval, project status, profiles, service/location facts, processors, and screenshots.
  - **Immediately after infrastructure changes:** host redirects, Cloudflare transformations, robots, security headers, form delivery, and analytics.
- **Acceptance test:** Named owners, calendar entries, escalation routes, and at least one completed retained cycle exist. A policy document alone is not sufficient evidence.

## 6. Human decisions required before implementation

| Decision | Default recommendation | Required approver/evidence |
|---|---|---|
| Should `/switchboard.html` be indexable? | Embed-only/noindex unless it becomes a complete, useful standalone landing page | Owner + SEO + UX |
| Can the 10-hours-per-week claim remain? | Keep only with dated source, methodology, permission, and review date | Owner + client/claim approver |
| Can South Florida positioning be published? | Only after confirming real location/service area and profile eligibility | Owner evidence |
| Are privacy and terms ready? | Do not remove draft status until language matches real operations and is approved | Owner + qualified counsel |
| Which analytics platform should be used? | Choose the smallest consent-appropriate system that supports non-PII funnel events | Owner + legal/privacy + developer |
| May an end-to-end test inquiry be sent? | Yes, once a designated test recipient and marker are approved | Owner + operations |
| Should the public email link remain? | Keep only if a valid raw destination and spam policy are acceptable | Owner |

## 7. Verified controls to preserve

These items passed and should become regression checks rather than repair work:

- Preferred homepage and all current sitemap URLs return 200.
- Random invalid and tested legacy routes return genuine 404 responses with a noindex 404 document.
- Primary copy, headings, links, titles, descriptions, canonicals, and Organization JSON-LD are present in raw HTML.
- The implementation does not depend on React hydration for critical content.
- Homepage and case-study titles/descriptions are unique and broadly accurate.
- Homepage and case-study canonicals are absolute and stable.
- Legal noindex URLs are excluded from the sitemap.
- No restrictive X-Robots-Tag was found on intended indexable pages.
- Main navigation and case-study links use crawlable anchors.
- Heading structures are logical; no “exactly one H1” ranking rule is imposed.
- Organization structured data matches visible identity and does not invent reviews, ratings, address, service area, or credentials.
- Meaningful inspected images have useful alternative text; decorative images use empty alternatives; dimensions are generally reserved.
- Skip links, labels, focus styles, form status messages, reduced-motion behavior, and responsive breakpoints are present.
- No duplicate location pages, doorway pattern, mass AI page generation, lorem ipsum, fake testimonials, invented ratings, or arbitrary word-count deficiency was found.
- The 26 existing source tests passed at the audited commit.

## 8. Master validation checklist

### Production source and governance

- [ ] The production repository, branch/deployment process, Vercel project, Cloudflare zone, DNS owner, form destination, and rollback process are documented.
- [ ] Older Next/Vinext or locator references are archived or clearly labeled nonproduction.
- [ ] The release record identifies the commit and deployment tested.

### HTTP, robots, canonical, and sitemap

- [ ] Every nonpreferred host/protocol reaches the equivalent HTTPS `www` URL in one 301/308.
- [ ] `/index.html` and `.html/` variants permanently redirect to preferred URLs.
- [ ] Random invalid URLs return 404, not a soft 404 or homepage redirect.
- [ ] Production `robots.txt` contains one unambiguous wildcard policy and the canonical sitemap line.
- [ ] Googlebot and Bingbot can fetch intended indexable pages and required resources.
- [ ] Every sitemap URL is 200, indexable, canonical-intent, and self-canonical where appropriate.
- [ ] Redirects, errors, duplicate variants, and noindex legal pages are absent from the sitemap.
- [ ] Switchboard has exactly one approved index policy with matching robots, sitemap, canonical, navigation, and standalone content signals.
- [ ] No unintended meta robots or X-Robots-Tag blocks an intended page.

### Raw HTML and rendering

- [ ] View source contains the accurate title, description, canonical, main heading, primary copy, crawlable links, form labels, and applicable schema.
- [ ] Rendered DOM preserves the same canonical, title, robots state, and main content.
- [ ] JavaScript disabled still exposes the offer, cases, service links, and a valid contact path.
- [ ] No runtime, model-viewer, hydration, asset, or form error prevents primary tasks.
- [ ] Raw built HTML contains the correct footer year.

### Content and proof

- [ ] Every service page has a unique purpose, accurate metadata, real internal links, self-canonical, sitemap inclusion, and a service-specific CTA.
- [ ] No page is created to meet an arbitrary length, link count, or publishing cadence.
- [ ] Every number, testimonial, credential, client name/logo, project status, location, and service-area claim traces to retained approval/evidence.
- [ ] Switchboard example data is visibly labeled with JavaScript on and off.
- [ ] No draft marker, developer note, placeholder, or unapproved legal clause remains public.
- [ ] Any regional page provides unique, truthful utility and is not a city-name substitution template.
- [ ] Structured data validates and matches visible content; no unsupported review, rating, FAQ, price, or local property is added.
- [ ] Social previews use approved truthful images and accurate alternative metadata.

### Performance, mobile, and accessibility

- [ ] A cold mobile trace shows no full video bytes before interaction or the approved post-LCP trigger.
- [ ] The switchboard document, model-viewer runtime, and GLB files do not load before the approved trigger.
- [ ] Videos use compatible lower-bitrate/adaptive delivery and work on current iOS Safari and Android Chrome.
- [ ] Versioned media returns intended long-lived cache headers.
- [ ] At least three PageSpeed runs per form factor are archived and medians compared with the August 4 baseline.
- [ ] Field LCP, INP, and CLS are reviewed at the 75th percentile when enough data exists; Lighthouse is not presented as field data.
- [ ] Project labels meet at least 4.5:1 computed contrast in every state.
- [ ] Switchboard target size/spacing and label legibility pass at small widths and 200%/400% zoom.
- [ ] Tabs and panels expose correct programmatic relationships.
- [ ] Keyboard, focus, VoiceOver/NVDA, form-error, reduced-motion, and mobile reflow results are retained.

### Conversion and measurement

- [ ] User input is safely encoded before insertion into HTML email.
- [ ] Notification subjects and labels use current Networks & Nodes wording.
- [ ] Turnstile, server validation, API success, downstream receipt, and accessible success UI are verified in one controlled test.
- [ ] The test lead arrives exactly once at the intended destination.
- [ ] One non-PII conversion event fires only after confirmed server success.
- [ ] No conversion fires on client validation, Turnstile, network, API, or delivery failure; a separate error signal exists.
- [ ] Names, emails, project text, and other personal data do not enter analytics URLs or event parameters.
- [ ] Google Search Console and Bing ownership, sitemap processing, inspections, permissions, and baselines are recorded.

### Maintenance

- [ ] Route/sitemap/canonical parity is enforced by generation or CI.
- [ ] Monthly crawl, indexing, query, broken-link, lead, and delivery reviews have named owners.
- [ ] Quarterly performance and accessibility checks have retained results.
- [ ] Six-month claim, legal, project-status, location, processor, and profile reviews are scheduled.
- [ ] Infrastructure changes trigger immediate redirect, robots, sitemap, form, and analytics regression tests.

## 9. Recommended execution order and dependencies

1. **Week 1 — Decisions and ownership:** M06, switchboard decision, test-lead approval, claim evidence request, local-market evidence request, analytics/privacy decision.
2. **Weeks 1–2 — Production safety:** M07, M08, M03, M18, controlled form test, initial GSC/Bing access.
3. **Weeks 2–4 — Performance and accessibility:** M01, M12, M13, M14, M20, analytics success event.
4. **Weeks 3–8 — Architecture and content:** M04, M10, approved local positioning, social cards, raw footer cleanup.
5. **Ongoing — Authority and operations:** M15–M17, M21–M24, recurring reporting, evidence review, and legitimate authority building.

Work should not start on scaled content or regional pages before the production source, measurement, service definitions, and proof standards are settled.

## 10. Definition of completion

The master plan is complete only when:

1. Every P1 and P2 item is repaired, explicitly rejected by an authorized owner with rationale, or moved to a dated backlog with an accepted risk owner.
2. Each repair has production evidence, not only a source-code change.
3. Private-system items have dashboard or operational evidence rather than assumptions.
4. The controlled form test reconciles user response, server response, downstream receipt, and analytics.
5. The route, robots, sitemap, canonical, raw/rendered, performance, accessibility, and content-proof checks are part of an owned maintenance process.

This plan intentionally does not treat all recommendations as ranking factors, does not guarantee rankings, does not use Domain Authority as a Google metric, does not prescribe an arbitrary word count or exact internal-link count, does not require one H1 as a ranking rule, does not recommend schema that lacks visible support, and does not authorize invented proof, locations, testimonials, statistics, or scaled low-value pages.
