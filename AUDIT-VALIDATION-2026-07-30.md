# Networks & Nodes — P0 Audit Implementation Validation

**Validation date:** 2026-07-30  
**Source audit:** Networks & Nodes — Live Website Audit & Improvement Report  
**Scope:** Existing homepage structure, switchboard, first owned case study, conversion paths, SEO, and rich-media lifecycle

## Completed

- `POSITION-001`
  - Hero category line now exposes web design, software, automation, and growth.
  - Supporting copy names websites, custom software, AI workflows, CRM, lead generation, and U.S.-market adaptation in crawlable HTML.
  - One semantic H1 remains on the homepage.
- `HERO-002`
  - Primary CTA is now **Start a project**.
  - **View selected work** remains the secondary action.
- `CONTENT-003`
  - Six commercial capabilities are present in semantic homepage HTML before the switchboard.
- `PROOF-004` first implementation step
  - Transportation Solutions & Lighting now has an owned internal case-study route.
  - The client website is a secondary link.
  - The existing dispatch result is explicitly labeled as a reported outcome; no new metric was invented.
- `SWITCH-005`
  - Added orientation copy before the active module.
  - Added a business outcome and project CTA to every service state.
  - Touch-first instructions are now universal; F-key language is secondary.
  - Existing real-button, focus, arrow-key, Home/End, Enter/Space, and tab semantics are preserved.
- `CONV-006`
  - Contact choices now include website, automation/AI, custom software/CRM, marketing/lead generation, U.S.-market adaptation, and an unsure option.
  - Added an honest email-based discovery-call request path. A hosted scheduler still requires a real scheduling URL.
- `SEO-007`
  - Stabilized homepage and switchboard titles and descriptions.
  - Added the internal case study and switchboard to the sitemap.
- `MEDIA-009`
  - Hero media renders Mux posters before player initialization.
  - Player initialization is deferred until the carousel is near the viewport and the browser is idle.
  - Inactive/offscreen and hidden-tab players are unloaded.
  - Manual carousel interaction disables auto-rotation.
  - Reduced-motion mode disables auto-rotation and loads paused players with controls.
  - The switchboard’s 3D runtime and model are intent-loaded only after Product 3D is selected.
  - The 39 MB construction model is excluded from the mobile carousel and explicitly unloaded if the viewport changes to mobile while it is active.
- Process preservation
  - Restored **Review → Define → Build → Improve** with a tangible artifact for each stage.
- Turnstile lifecycle
  - Turnstile is initialized near the contact section or on first form focus rather than at initial page load.

## Automated validation

- Production build: pass
- Node audit tests: 8/8 pass
- Homepage route: HTTP 200
- Switchboard route: HTTP 200
- TS&L case-study route: HTTP 200
- Local HTML asset/link check: pass
- Switchboard inline JavaScript syntax: pass
- Git whitespace validation: pass
- Four Mux poster endpoints: HTTP 200, `image/webp`

### Production bundle output

| Artifact | Raw | Gzip |
|---|---:|---:|
| Homepage HTML | 17.41 kB | 4.93 kB |
| Homepage JavaScript | 8.26 kB | 3.28 kB |
| Shared site CSS | 16.82 kB | 4.47 kB |
| TS&L case-study HTML | 6.97 kB | 2.24 kB |
| Case-study CSS | 2.75 kB | 0.92 kB |

### Transfer baseline

Local production preview, three homepage requests:

- TTFB: 0.0007–0.0013 s
- Total HTML transfer: 0.0008–0.0013 s
- HTML transferred: 17,408 bytes

Current public homepage, three requests before deployment of this pass:

- TTFB: 0.151–0.249 s
- Total HTML transfer: 0.171–0.251 s
- HTML transferred: 13,297 bytes

These transfer timings are not substitutes for Core Web Vitals.

## Validation limits

- The in-app browser service reported no available browser, so screenshots and real device-width interaction checks could not be captured in this run.
- The PageSpeed Insights API returned HTTP 429 because the available project has zero daily query quota.
- Lighthouse desktop/mobile ×3, accessibility-tree inspection, 200% zoom, and throttled Android traces therefore remain unclaimed.

## Next required step

After these changes are staged or deployed:

1. Run Lighthouse desktop ×3 and mobile ×3 and record medians.
2. Capture visual/interaction QA at 1440, 1280, 1024, 768, 430, 390, and 360 px.
3. Verify keyboard flow, 200% zoom, large text, reduced motion, and slow-network behavior.
4. Replace the email-based discovery-call request with the real hosted scheduling URL when supplied.
5. Add verified media and approved outcomes to the TS&L case study, then build the CodeLink and Redeemed Hands narratives.
