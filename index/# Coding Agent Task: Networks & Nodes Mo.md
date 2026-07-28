# Coding Agent Task: Networks & Nodes Mobile-First Rebuild

## Objective

Implement the mobile-first performance, navigation, layout, and conversion improvements identified in the Networks & Nodes audit.

Live reference: https://www.networksandnodes.org/

Primary goal: make the mobile experience fast, immediately understandable, fully navigable, and free of clipping or horizontal overflow.

Secondary goal: preserve the existing dark visual identity and improve desktop performance without allowing desktop effects to compromise mobile.

## Working rules

- Do not create a pull request.
- Do not push or deploy unless the user explicitly asks.
- Work directly in the provided local repository.
- Preserve unrelated user changes.
- Inspect the actual repository before assuming filenames or framework structure.
- Prefer small, reviewable commits—one commit per completed phase.
- Keep the site functional after every phase.
- Do not replace working content with placeholder text.
- Do not remove case studies, contact information, or form submission behavior.
- If a phase requires credentials, deployment access, or a product decision, complete all independent work first and document the blocker.

## Expected starting structure

The current production site appears to contain:

- A large `index.html`
- Inline JSX in a `text/babel` script
- React, ReactDOM, and Babel loaded from UNPKG
- Shared styles in `css/styles.css`
- Decorative SVGs under `test-pages-new/`
- Contact security logic in `js/form-security.js`
- Spotify logic in `test-pages-new/spotify-embed.js`

Confirm the local structure before editing.

## Required agent output

At the end of each phase, report:

1. Files changed
2. Behavior changed
3. Tests performed
4. Before/after performance measurements when applicable
5. Remaining phases or blockers

At final handoff, provide:

- A complete file-change list
- Test results
- Mobile and desktop screenshots or equivalent visual verification
- Remaining known issues
- Exact commands needed to run and build the site

---

# Phase 0 — Establish the baseline

## Tasks

- [ ] Inspect repository instructions and current Git status.
- [ ] Identify the production entry point and deployment/build configuration.
- [ ] Run the existing site locally without changing code.
- [ ] Record the current build command, development command, and test commands.
- [ ] Test these viewport widths:
  - [ ] 320 × 700
  - [ ] 360 × 800
  - [ ] 390 × 844
  - [ ] 412 × 915
  - [ ] 430 × 932
  - [ ] 768 × 1024
  - [ ] 1440 × 900
- [ ] Record baseline measurements:
  - [ ] Initial JavaScript transfer
  - [ ] Total initial transfer
  - [ ] LCP
  - [ ] INP or Total Blocking Time when INP is unavailable
  - [ ] CLS
  - [ ] Console warnings/errors
  - [ ] Horizontal overflow
- [ ] Confirm the existing contact-form submission path before editing it.

## Baseline defects to reproduce

- [ ] Production uses `@babel/standalone`.
- [ ] Production contains `text/babel`.
- [ ] Mobile content is gated by the swipe/zoom intro.
- [ ] Services CTAs targeting `#contact` do not activate Contact.
- [ ] Featured Builds CTAs targeting `#contact` or `#services` do not activate those sections.
- [ ] About content extends below the visible mobile viewport.
- [ ] Featured Builds cards overflow their mobile container.
- [ ] Mobile section navigation controls are approximately 30–34 px tall.
- [ ] Particle animation continues while other content is open.
- [ ] Reduced-motion preferences do not stop JavaScript animation loops.

## Phase completion

Do not begin refactoring until the site runs locally and the baseline defects have been reproduced or explicitly documented as no longer present.

---

# Phase 1 — Remove runtime Babel and create a production build

This is the highest-priority performance task.

## Tasks

- [ ] Use the repository's existing build system if one exists.
- [ ] If no build system exists, add a minimal production build using Vite or an equally lightweight tool.
- [ ] Move inline JSX out of `index.html` into source modules.
- [ ] Precompile JSX during the build.
- [ ] Import React and ReactDOM through the package build instead of UNPKG script tags.
- [ ] Remove `@babel/standalone`.
- [ ] Remove all `text/babel` scripts.
- [ ] Remove synchronous third-party scripts from the document head.
- [ ] Minify and content-hash production JavaScript and CSS.
- [ ] Preserve the existing visual design and behavior during this phase.
- [ ] Preserve `form-security.js` behavior or migrate it without weakening validation/security.
- [ ] Ensure the production output can be deployed by the existing host.

## Initial HTML requirement

The production HTML must contain meaningful content before JavaScript executes.

At minimum, the HTML response must expose:

- [ ] Site name
- [ ] Primary heading
- [ ] Short value proposition
- [ ] Primary project/contact action
- [ ] Link to Featured Builds

Use static rendering, prerendering, or a static HTML shell that remains valid without JavaScript. Do not leave production with only an empty `#root`.

## Verification

- [ ] No `babel.min.js` request
- [ ] No `text/babel`
- [ ] No Babel warning in the console
- [ ] No React or ReactDOM request from UNPKG
- [ ] Site remains usable with JavaScript delayed
- [ ] Production build completes successfully
- [ ] Development server starts successfully
- [ ] Form behavior remains intact

## Performance target

- Initial application JavaScript: under **150 KB compressed**

If the target is not met, report the bundle composition and the next reduction opportunity.

---

# Phase 2 — Stop expensive animation work

## Mobile behavior

- [ ] Do not render the particle canvas below 768 px.
- [ ] Use a static optimized background or illustration instead.
- [ ] Do not require touch gestures to reveal the main site.
- [ ] Do not autoplay the globe zoom on mobile.

## Reduced motion

- [ ] Detect `(prefers-reduced-motion: reduce)` in JavaScript.
- [ ] Do not start particle or zoom animation loops for reduced-motion users.
- [ ] Show the final usable state immediately.
- [ ] Keep CSS reduced-motion handling as a second layer of protection.

## Background and visibility behavior

- [ ] Pause animation when `document.hidden` is true.
- [ ] Resume only when the page is visible and animation is still allowed.
- [ ] Stop and clean up all `requestAnimationFrame`, interval, timeout, pointer, and resize handlers when components unmount.
- [ ] Unmount the intro animation after it is no longer visible.
- [ ] Remove permanent `will-change` declarations after transitions complete.

## Desktop particle limits

If the desktop particle effect is retained:

- [ ] Cap the particle count rather than scaling indefinitely with viewport area.
- [ ] Reduce work on high-DPR screens.
- [ ] Target a stable frame rate without continuous main-thread pressure.
- [ ] Do not run particles behind opaque section content.
- [ ] Provide a static fallback when device/network capability is limited.

## Verification

- [ ] Mobile DOM contains no particle canvas.
- [ ] Reduced-motion mode contains no running animation loop.
- [ ] Hidden browser tabs perform no animation work.
- [ ] Opening Services, Work, About, or Contact stops/unmounts intro work.
- [ ] No leaked event listeners after repeated navigation.

---

# Phase 3 — Replace the mobile intro with an immediate homepage

## Mobile hero

Render this content immediately:

### Heading

> Business systems that connect instead of fight each other.

### Supporting copy

> Websites, automation, analytics, and infrastructure for owner-led businesses that need reliable growth and fewer manual handoffs.

### Primary actions

- Start a Project
- View Featured Builds

## Requirements

- [ ] Useful content appears without a swipe.
- [ ] Useful content does not wait for a four-second timer.
- [ ] The primary heading exists in initial HTML.
- [ ] The primary CTA opens/navigates to Contact.
- [ ] Featured Builds opens/navigates to the Work section.
- [ ] Mobile hero uses optimized static artwork.
- [ ] Mobile hero fits within the first viewport without hiding the primary action.
- [ ] Desktop may retain a restrained intro effect only as progressive enhancement.
- [ ] Provide an immediately visible skip/continue action if any desktop intro remains.

## Recommended homepage order

1. Header
2. Hero and primary actions
3. Three service paths
4. Featured Builds
5. Four-step process
6. Trust/proof
7. Contact

Do not make visitors pass through a visual section-selection screen before seeing the value proposition.

---

# Phase 4 — Implement real navigation and fix every CTA

## Navigation model

Use real routes or a hash-based navigation model that supports:

- Browser back and forward
- Deep links
- Reloading a section URL
- Scroll restoration
- Keyboard navigation
- Correct focus placement

Acceptable examples:

- `/services`
- `/work`
- `/about`
- `/contact`

or:

- `#services`
- `#work`
- `#about`
- `#contact`

Do not use inert hash links whose target is not mounted.

## Required CTA behavior

Fix and verify:

- [ ] Request a Systems Review → Contact
- [ ] Start a Local Launch → Contact with Local Launch context
- [ ] Build a Growth Engine → Contact with Growth Engine context
- [ ] Plan an Automation Sprint → Contact with Automation context
- [ ] Build Something Similar → Contact
- [ ] Build a Product Like This → Contact
- [ ] Launch a Local Business Site → Contact
- [ ] View Local Launch Kit → Services
- [ ] Header brand → Home
- [ ] Section footer navigation → Correct previous/next destination

## Focus and scroll requirements

After navigation:

- [ ] Scroll to the beginning of the destination.
- [ ] Move programmatic focus to the destination heading when appropriate.
- [ ] Do not leave focus on a removed button.
- [ ] Do not land halfway through a newly rendered section.

## Verification

- [ ] Every internal CTA works from every section.
- [ ] Reloading each route/hash restores the correct section.
- [ ] Browser Back restores the previous state.
- [ ] No nonexistent local hash targets remain.

---

# Phase 5 — Restore native mobile scrolling

## Tasks

- [ ] Remove global `overflow: hidden` from `html` and `body`.
- [ ] Use normal document scrolling for content.
- [ ] Remove the fixed full-viewport nested-scroll architecture where possible.
- [ ] Avoid relying on `100vh` for content height on mobile.
- [ ] Prefer modern viewport units only where necessary:
  - `svh`
  - `dvh`
- [ ] Ensure the mobile browser address bar can collapse/expand normally.
- [ ] Preserve visible focus and anchor behavior.
- [ ] Implement deliberate route/section scroll restoration.

## About clipping fix

Remove the layout combination that produces:

- Header: 160 px
- About panel: 844 px
- Combined content: 1004 px inside an 844 px shell

If the flex shell temporarily remains, use:

```css
.portfolio-panel-body {
  flex: 1 1 0;
  min-height: 0;
}
```

Remove the About-specific `min-height: 100%` override.

## Verification

- [ ] Entire About section is reachable at 320–430 px widths.
- [ ] Final Contact controls are reachable above mobile browser chrome.
- [ ] Page scroll position behaves normally after rotation.
- [ ] No nested scroll trap remains.
- [ ] Keyboard focus can scroll controls into view.

---

# Phase 6 — Rebuild the mobile header and menu

## Header requirements

- [ ] Target height: 56–64 px.
- [ ] Single-row layout.
- [ ] Brand/home link.
- [ ] Current section label when useful.
- [ ] One menu button.
- [ ] Optional Start a Project action only if it fits without crowding.
- [ ] Header remains understandable at 320 px.

## Menu requirements

- [ ] Replace the horizontally scrolling section-tab row on mobile.
- [ ] Use an accessible menu, drawer, or disclosure.
- [ ] Services, Featured Builds, About, and Contact are all visible after one menu action.
- [ ] Escape closes the menu.
- [ ] Focus is managed on open and close.
- [ ] Background content is not interactable while a modal drawer is open.
- [ ] Active destination is exposed semantically.

## Touch target requirements

- [ ] Primary interactive controls are at least 44 px tall.
- [ ] Aim for 48 × 48 px for isolated icon/menu controls.
- [ ] Provide adequate spacing between adjacent controls.

---

# Phase 7 — Fix responsive overflow and component sizing

## Featured Builds

The audited mobile state had 332 px cards with 393 px internal content.

Apply appropriate constraints:

```css
min-width: 0;
max-width: 100%;
```

Use `overflow: clip` or `hidden` only at intentional visual boundaries.

Check:

- [ ] Card grid
- [ ] Browser mockup
- [ ] Media wrapper
- [ ] Metrics lists
- [ ] Tag lists
- [ ] CTA rows
- [ ] Long URLs

## About

- [ ] Remove the 41–74 px horizontal overflow observed in About wrappers.
- [ ] Ensure quote, book, and Spotify blocks fit at 320 px.
- [ ] Move Section Navigation to the true end of About.

## Global verification

For every required viewport:

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

Also inspect nested components for clipped content even when the document itself does not overflow.

---

# Phase 8 — Replace eager video players with click-to-load media

## Services and Featured Builds

- [ ] Render an optimized poster image initially.
- [ ] Add an accessible Play button.
- [ ] Mount the Mux iframe only after the user activates Play.
- [ ] Preserve each video's title.
- [ ] Reserve the final media aspect ratio to prevent layout shift.
- [ ] Do not preload video-player JavaScript for cards below the fold.
- [ ] Stop/unmount a player when leaving its section if continued playback is not intended.

## Verification

- [ ] No Mux iframe exists on initial homepage load.
- [ ] No Mux iframe exists when a section card has not been played.
- [ ] Player loads after one deliberate activation.
- [ ] Keyboard activation works.
- [ ] Poster dimensions prevent CLS.

---

# Phase 9 — Optimize artwork, fonts, and caching

## Artwork

Prioritize these measured resources:

- `services.svg`: approximately 1.21 MB compressed
- `Contact-background.svg`: approximately 771 KB compressed
- `cracked-globe.svg`: approximately 250 KB compressed
- `work-background.svg`: approximately 119 KB compressed

Tasks:

- [ ] Run suitable SVG artwork through SVGO.
- [ ] Remove hidden metadata, redundant precision, and unused definitions.
- [ ] Create smaller mobile-specific assets.
- [ ] Convert highly detailed decorative artwork to AVIF/WebP when raster is smaller.
- [ ] Provide intrinsic dimensions.
- [ ] Do not download all four section backgrounds before they are needed.
- [ ] Do not use full desktop artwork as a tiny mobile tile background.

## Fonts

- [ ] Reduce the current four-family font set.
- [ ] Keep only weights actually used.
- [ ] Prefer variable fonts when they reduce total transfer.
- [ ] Self-host production fonts when practical.
- [ ] Use WOFF2.
- [ ] Preserve `font-display: swap`.
- [ ] Preload only the font needed for above-the-fold text.

## Caching

For hashed static assets:

```http
Cache-Control: public, max-age=31536000, immutable
```

- [ ] Use content-hashed filenames.
- [ ] Keep HTML revalidatable.
- [ ] Give versioned JavaScript, CSS, fonts, images, and artwork long-lived caching.
- [ ] Verify deployed response headers after release.

## Performance target

- Initial mobile transfer before interaction: under **800 KB compressed**

---

# Phase 10 — Simplify the Contact experience

## Replace the three-step gate

Remove the mandatory eight-role choice followed by eight service choices.

Use one concise form:

- [ ] Name
- [ ] Email
- [ ] Organization, optional
- [ ] Project type, optional select
- [ ] What is not working today?
- [ ] Desired outcome/project description
- [ ] Timeline, optional
- [ ] Budget range, optional
- [ ] Submit

## Content changes

Replace portfolio-only language:

- "Tell me about your next site"
- "Links to your profile"
- "Your body of work"

Use language that supports websites, automation, analytics, infrastructure, and systems work.

Suggested heading:

> Tell me what is not working—and what a better system should do.

## Requirements

- [ ] Visitor can begin typing immediately.
- [ ] Existing form endpoint and anti-spam/security behavior remain operational.
- [ ] Server-side validation remains authoritative.
- [ ] Client validation has clear inline errors.
- [ ] Error messages use `role="alert"` or an appropriate live region.
- [ ] Form preserves entered data after a recoverable error.
- [ ] Direct email remains visible.
- [ ] Success state is clear and does not submit twice.

Do not submit a real production inquiry during automated testing.

---

# Phase 11 — Align content and information architecture

## Positioning hierarchy

Use this order consistently:

1. Business systems and automation
2. Websites and growth systems
3. Infrastructure and AI readiness

## Tasks

- [ ] Rewrite About so it matches the Services and metadata positioning.
- [ ] Remove repetitive About paragraphs.
- [ ] Keep creative/portfolio experience as supporting evidence, not the primary audience.
- [ ] Update Contact language to match the same positioning.
- [ ] Ensure headings describe business outcomes before technologies.
- [ ] Keep case-study metrics and concrete proof.
- [ ] Move quote/book/Spotify content after the complete primary About narrative.
- [ ] Consider removing entertainment widgets from the primary conversion path.

Do not invent clients, metrics, testimonials, or credentials.

---

# Phase 12 — Final accessibility, performance, and regression pass

## Accessibility

- [ ] One clear `h1` per route/page state.
- [ ] Heading levels are sequential.
- [ ] Navigation uses links for navigation and buttons for actions.
- [ ] Current page/section is exposed with `aria-current`.
- [ ] Hidden intro content is unmounted, inert, or `aria-hidden`.
- [ ] Decorative artwork has empty alt text or CSS presentation.
- [ ] Meaningful images have useful alt text.
- [ ] Keyboard focus is always visible.
- [ ] Menu and form are fully keyboard accessible.
- [ ] Reduced-motion mode has no forced pan, scale, or particle motion.
- [ ] Color contrast is checked in light and dark content areas.

## Mobile

- [ ] No horizontal overflow at any required width.
- [ ] No content clipped below a fixed shell.
- [ ] Header remains one row at 320 px.
- [ ] Primary CTA appears in the first viewport.
- [ ] All primary controls meet touch-size requirements.
- [ ] Text remains readable at 200% zoom.
- [ ] Rotation does not break scroll or navigation.

## Performance

- [ ] Initial JavaScript under 150 KB compressed
- [ ] Initial transfer under 800 KB compressed
- [ ] No runtime Babel
- [ ] No eager Mux players
- [ ] No mobile particle canvas
- [ ] LCP under 2.5 seconds at the 75th percentile target
- [ ] INP under 200 ms at the 75th percentile target
- [ ] CLS under 0.1 at the 75th percentile target
- [ ] No console errors
- [ ] No production warnings

## Functional regression

- [ ] Home navigation
- [ ] Services navigation and CTAs
- [ ] Featured Builds external links and CTAs
- [ ] About resume and social links
- [ ] Contact validation
- [ ] Contact success and error states using a safe test environment
- [ ] Spotify widget failure does not block About
- [ ] Browser Back/Forward
- [ ] Deep-link reloads
- [ ] 404 behavior if real routes are introduced

---

# Definition of done

The task is complete only when:

1. Production no longer compiles JSX in the browser.
2. Mobile visitors see the value proposition and primary CTA immediately.
3. Mobile has no particle canvas or forced intro interaction.
4. Normal document scrolling replaces the mobile scroll trap.
5. About is fully reachable.
6. Featured Builds has no clipped or overflowing content.
7. Every internal CTA reaches the correct destination.
8. Video players load only after user intent.
9. Contact is a concise, business-aligned form.
10. Performance and accessibility targets are measured and reported.
11. Desktop retains the brand's visual character without continuous unnecessary rendering work.
12. The agent provides a complete local handoff without creating a pull request.

## Supporting audit

See:

`networks-and-nodes-mobile-first-audit.md`

Reference guidance:

- https://babeljs.io/docs/babel-standalone/
- https://web.dev/articles/optimize-lcp
- https://developer.chrome.com/docs/lighthouse/seo/tap-targets
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
