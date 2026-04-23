# Handoff: Services panel — Custom portfolio websites for visual creatives

**Single-agent scope:** The **Services** nav tile (`active === 'services'`) in [`Portfolio.html`](./Portfolio.html): the React `ServicesSection`. This handoff **replaces** the previous "mirror the main-site Solutions grid" direction. The five generalist tech cards (Custom Web Development, Analytics & Dashboards, Automation & Workflow, SEO Strategy, AI Consulting) and the `portfolio-faux-cta-ring` breathing animation on `Learn more →` buttons are **removed**. In their place: a single confident hero offering, a plain-language feature row, a two-panel engagement-models block, and a four-step process strip.

**Audience context:** This page now sells to **photographers, videographers, and artists** who want a modern, slick website but aren't technical enough to build one. Services must speak to a visual creative — not a tech buyer. No emoji icons, no tech stack name-drops, no jargon.

**Code anchor:** Search `Portfolio.html` for `function ServicesSection` (currently lines 860–925).

---

## In scope

| Area | Responsibility |
| ---- | --------------- |
| **`ServicesSection` React component** | Replace the existing JSX entirely with the layout described below. Keep `data-theme="dark"` and the `portfolioPanelShell` pattern used by other embed panels. |
| **Copy** | Eyebrow, title, lead, 4 feature bullets, both engagement-model panels (Turnkey + Ongoing partnership), the four process steps, closing line. |
| **In-section markup** | New structural elements: `div.pf-services-feature-row`, `div.pf-services-engagement`, `article.pf-services-engagement__panel`, `ol.pf-services-process`, etc. (exact names up to the agent, prefix-required). |
| **CTAs** | Every CTA in Services routes to Contact via the existing `onNavigate('contact')` pattern. Panel CTA label: `Talk about fit`. No `href` strings to external pages or to the main marketing site. |
| **Removals** | The five `solutions` cards and their emoji icons; the `.service__cta.portfolio-faux-cta` buttons; the `@keyframes portfolio-faux-cta-ring` animation (remove from the `Portfolio.html` `<style>` block if defined there; leave `css/styles.css` untouched unless that keyframe also lives there, in which case remove it with a comment pointing to this handoff). |
| **`CARDS` row for `id: 'services'`** | Update `label` (keep `'Services'`) and propose 2–3 `sub` string options to replace `'Solutions from the main site'`. Suggested starters: `'Portfolio sites, turnkey or ongoing'`, `'Custom portfolios for visual creatives'`, `'One-and-done or ongoing partnership'`. |

---

## Content brief (ship this copy unless the user edits)

**Eyebrow:** `Services`

**Title:** `Custom portfolio websites for visual creatives`

**Lead (2–3 sentences):**
> I design and build websites for photographers, videographers, and artists — the kind of site where your work leads and the interface stays out of the way. A background in architecture and infrastructure quietly shows up as fast load times, reliable deployments, and a site that stays stable as your work grows.

**Feature row (4 bullets, plain language — no emojis, no tech icons):**

- **Image-led layouts.** Built around the shape of your work, not around a template.
- **Mobile-first typography.** Type that reads well on a phone first, scales up from there.
- **SEO and analytics, done properly.** Findable without gimmicks, measurable without surveillance clutter.
- **Honest load times.** Fast because the site is built carefully — not because corners were cut.

**Engagement models — two side-by-side panels, no prices anywhere:**

**Panel A — Turnkey**

- Short label: `Turnkey`
- One-line summary: `One site, one engagement. Designed, built, launched, handed off.`
- Body (2–3 sentences):
  > For creatives who want a site, not an ongoing relationship. We move through discovery, design, build, and launch together, then you take the keys. Clean handoff, documentation, and a site that will stand up on its own.
- CTA: `Talk about fit` → `onNavigate('contact')`

**Panel B — Ongoing partnership**

- Short label: `Ongoing partnership`
- One-line summary: `Everything in Turnkey, plus someone still holding the other end of the line.`
- Body (2–3 sentences):
  > For creatives who want their site to stay current without thinking about it. Covers hosting, deployment, updates, monitoring, and seasonal refreshes — the professional-grade choice when the site is part of how you earn, not a one-time project.
- CTA: `Talk about fit` → `onNavigate('contact')`

Both panels are visually equal. Do **not** style one as "premium" or "recommended." The ongoing option is positioned as the professional default; the turnkey option is positioned as the right call when a one-time engagement genuinely fits.

**Process strip — four horizontal steps, short caption each:**

1. **Discovery** — A conversation about your work, your audience, and what the site actually needs to do.
2. **Design** — Layout, type, and motion proposals tailored to your work. No template wireframes.
3. **Build** — Development with care for speed, accessibility, and the details that don't show up until you look closely.
4. **Launch** — Deployment, handoff if Turnkey, or onboarding into the ongoing partnership.

Render as a numbered horizontal strip on desktop, stacked on narrow viewports.

**Closing line:**
> Ready to talk scope and timeline? **Contact** — I'll come back with a plan, not a pitch.

---

## CSS: preserve vs fair game

**Preserve — do not modify, override, or remove:**

- Dark-theme background system (`#0b1220`), the FluidParticles canvas, and the GSAP globe-crack intro on the page shell.
- The `NavCards` chrome (header tiles, back/sections controls).
- The **About** section's visual language (fonts, accents, spacing) — Services sits on the same page and must not make About look inconsistent.
- The **Contact** section's light-theme embed (`data-theme="light"` block).
- The **Work** section's styling and any class prefixed `pf-work-*` (owned by the Work agent running in parallel).
- Global layout tokens: `.container`, `.section`, `.card`, `.small`, `.muted`, `.accent`, `.lead`, `.title`, `.underline-accent`, and any selector already used by another section.
- Typography tokens on `:root` / `body`. Read them; do not redefine them globally.

**Explicit removals that are allowed (scoped to this section only):**

- The `.service`, `.service__icon-area`, `.service__icon`, `.service__body`, `.service__cta`, `.portfolio-faux-cta` class usages *inside `ServicesSection`* — stop referencing them. **Do not delete their definitions in `css/styles.css`** (other pages may use `.service*` classes; leave them alone).
- `@keyframes portfolio-faux-cta-ring` — if it lives in the `Portfolio.html` `<style>` block, remove it there. If it lives in `css/styles.css`, leave it unless a grep confirms it is unused across the whole repo.

**Fair game — you own these:**

- In-section typography: sizes, weights, leading, optical alignment, within Services only.
- New section-namespaced class names prefixed `pf-services-*` (e.g. `pf-services-feature-row`, `pf-services-engagement`, `pf-services-engagement__panel`, `pf-services-process`, `pf-services-process__step`).
- Internal grids, gaps, and spacing for the feature row, engagement panels, and process strip.
- New CSS placed either:
  - Inline inside the `Portfolio.html` `<style>` block (prefer for small additions), **or**
  - Appended to `css/styles.css`, wrapped in a `/* === pf-services === */ … /* === end pf-services === */` comment block for clean coexistence with the Work agent's additions.

Do not introduce new fonts. Use the families already loaded in `Portfolio.html` (`Inter`, `Instrument Serif`, `JetBrains Mono`).

---

## Out of scope

- **Work** section and the `WorkSection` component. The Work agent owns that file region and its `CARDS` row.
- **About** section, the Spotify card, the quote/book block, and the Connect rail.
- **Contact** section and its inquiry form (CTAs link *into* Contact but do not modify it).
- The GSAP globe-crack intro, the FluidParticles canvas, and the `NavCards` header chrome.
- Main marketing site (`index.html`, `about-me.html`, etc.) — no edits. Services on this page no longer mirrors `index.html#services`; that's intentional.
- Any form of pricing — no numbers, no "starting at," no tier names like Starter / Signature / Studio.
- Legacy solution cards and their emoji icons — these are removed, not refreshed.

---

## Coordination rules (parallel execution with Work agent)

1. Edit only `ServicesSection` in `Portfolio.html` and only the `id: 'services'` row in the `CARDS` array.
2. Namespace every new CSS class to `pf-services-*`. Do not use unprefixed names that could collide.
3. If appending to `css/styles.css`, wrap your additions in `/* === pf-services === */` … `/* === end pf-services === */`. Do not edit existing selectors.
4. Do not rename, remove, or reorder any class, variable, or selector used elsewhere on the page.
5. If you must touch a shared area (e.g. the `CARDS` array, the `<style>` block in `Portfolio.html`), edit only your lines and leave the rest byte-identical.
6. When removing `portfolio-faux-cta-ring`, confirm it isn't referenced by the Work agent's new markup before deleting. If unsure, leave the keyframe in place and simply stop referencing it from Services.

---

## Deliverables checklist

- [ ] Copy matches the content brief above (or the revision log documents intentional edits after user review).
- [ ] `ServicesSection` renders: eyebrow → title → lead → feature row → engagement-models two-panel block → process strip → closing line. No legacy 5-card grid remains.
- [ ] No emoji icons anywhere in Services.
- [ ] Both engagement panels are visually equal — neither styled as "premium" or "recommended."
- [ ] Every CTA in Services routes to Contact via `onNavigate('contact')` — no external links, no hash jumps to main marketing site.
- [ ] No prices of any kind appear in Services (no `$`, no "starting at," no tier names like Starter/Signature/Studio).
- [ ] Dark theme preserved (`data-theme="dark"`, `portfolioPanelShell` pattern).
- [ ] Responsive at 375 / 768 / 1280: engagement panels collapse to stacked on narrow viewports; process strip stacks vertically below ~768px.
- [ ] `portfolio-faux-cta-ring` animation no longer fires inside Services (either removed from `Portfolio.html` `<style>` or no longer referenced).
- [ ] No console errors; GSAP intro and FluidParticles still run.
- [ ] `CARDS.sub` for `id: 'services'` updated from `'Solutions from the main site'` to the chosen new string (2–3 candidates proposed in the revision log so the user can pick).
- [ ] `prefers-reduced-motion` honored — no unconditional new animations.

---

## Revision log

| Date | Author | What changed |
| ---- | ------ | ------------ |
| 2026-04-22 | Agent | Replaced tier `ServicesSection` with index-aligned **Solutions** grid; `button.service__cta.portfolio-faux-cta` + `portfolio-faux-cta-ring` animation in `Portfolio.html` `<style>`. Post-crack nav is **four** tiles; `services` `CARDS.sub`: "Solutions from the main site". |
| 2026-04-22 | Agent | Confirmed Solutions grid in `Portfolio.html`: `container` + `h2.accent` + `p.muted.small` + `services-grid` / `article.card.service`, icons as UTF-16 pairs matching `index.html` numeric entities, faux CTAs + `focus-visible`. Contact blurb points to Services as same Solutions list as main site. |
| 2026-04-22 | Agent | Re-verified `index.html` `#services` copy vs `solutions` array; corrected handoff revision log (four nav tiles); documented faux CTA hooks above. |
| 2026-04-23 | Planning | **Pivot to new audience (photographers / videographers / artists).** Handoff rewritten: remove the 5 legacy tech-buyer solution cards and the `portfolio-faux-cta-ring` animation; replace with a single hero offering ("Custom portfolio websites for visual creatives"), a 4-bullet feature row, a two-panel engagement-models block (Turnkey vs Ongoing partnership, no prices), and a 4-step process strip (Discovery → Design → Build → Launch). All CTAs route to Contact via `onNavigate`. CSS preserve/fair-game rules added. Coordination rules added for parallel execution with the Work agent. `CARDS.sub` to be replaced. |

---

## Paste into a new chat (Services agent)

You own **`ServicesSection`** in `test-pages-bad/test-pages-new/Portfolio.html`. Read [`portfolio-handoff-services-solutions-panel.md`](./portfolio-handoff-services-solutions-panel.md) in full before editing anything. The site sells custom portfolio websites to photographers, videographers, and artists — replace the existing 5-card Solutions grid entirely with: single hero offering ("Custom portfolio websites for visual creatives"), 4-bullet plain-language feature row, a two-panel engagement-models block (Turnkey vs Ongoing partnership — no prices, equal visual weight, CTAs labeled `Talk about fit` routing to Contact via `onNavigate('contact')`), and a 4-step process strip (Discovery → Design → Build → Launch). Remove the `portfolio-faux-cta-ring` animation from Services. No emoji icons. No pricing anywhere. Keep `data-theme="dark"` and the `portfolioPanelShell` pattern. All new CSS classes must be namespaced `pf-services-*`; if editing `css/styles.css`, wrap additions in `/* === pf-services === */ … /* === end pf-services === */`. Do not touch `WorkSection`, About, Contact, the globe intro, or the NavCards chrome. Propose 2–3 `CARDS.sub` candidates for `id: 'services'` in your revision log and let the user pick.
