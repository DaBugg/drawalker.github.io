# Handoff: Work panel — Selected work (concept + style range)

**Single-agent scope:** The **Work** nav tile (`active === 'work'`) in [`Portfolio.html`](./Portfolio.html): the React `WorkSection`. This handoff retires the previous "placeholder until case studies ship" framing and replaces it with a **Selected work** layout that presents two concept/spec sites + a style-range gallery. Real-client case studies will supersede the concept blocks as projects publish.

**Audience context:** This page now sells to **photographers, videographers, and artists** who want a modern, slick website but aren't technical enough to build one. Everything in this section should read to a visual creative — not to a tech buyer.

**Code anchor:** Search `Portfolio.html` for `function WorkSection` (currently lines 834–857).

---

## In scope

| Area | Responsibility |
| ---- | --------------- |
| **`WorkSection` React component** | Replace the existing placeholder JSX with the Selected-work layout described below. Keep `data-theme="dark"` and the `portfolioPanelShell` pattern used by other embed panels. |
| **Copy** | Eyebrow, title, lead, the two concept blocks (copy + placeholder imagery), the style gallery tiles and their one-line captions, closing line. |
| **In-section markup** | New elements for concept blocks (`section.pf-work-concept`), layout thumbnail rows (`div.pf-work-concept__thumbs`), and the style gallery strip (`ul.pf-work-gallery`). |
| **Images** | Use placeholder `<img>` elements with meaningful `alt` text and explicit `width`/`height` or aspect-ratio CSS. Do not commit mockup images; reserve slots. |
| **`CARDS` row for `id: 'work'`** | Update `label` (keep `'Work'`) and propose 2–3 `sub` string options to replace `'Case studies when ready'`. Suggested starters: `'Concept work and style range'`, `'Selected work — concept + studies'`, `'Concept portfolios and UI studies'`. |

---

## Content brief (ship this copy unless the user edits)

**Eyebrow:** `Work`

**Title:** `Selected work`

**Lead (1–2 sentences):**
> These are concept sites — designed for a specific kind of creative to show how I work before real client case studies publish here. Each one is a complete point of view, not a mockup.

**Concept #1 — fictional photographer**

- Working brief line (small caps / mono): `Concept · Editorial photographer`
- Fictional subject: an NYC-based editorial photographer. (The agent may pick a name; keep it plausible and brief, e.g. `Noa Levi`.)
- Hero image slot: single full-bleed `<img>` placeholder, alt `"Hero frame — editorial photographer concept"`.
- 2–3 layout thumbnails: `<img>` placeholders at ~4:5 or 3:4, alt text describing each (e.g. `"Series index layout"`, `"Single-image detail view"`, `"Contact sheet grid"`).
- One paragraph (problem/solve):
  > How do you let large editorial stills breathe without drowning them in UI? The answer here is a quiet shell: full-bleed heroes, generous caption space, an image-first index, and type that stays out of the photograph's way. Loading is paced so the work lands before anything else.

**Concept #2 — fictional videographer**

- Working brief line: `Concept · Videographer / director of photography`
- Fictional subject: an LA-based motion director/DP (e.g. `Atlas Motion`).
- Hero frame: single poster-frame `<img>` placeholder, alt `"Hero poster frame — videographer concept"`.
- 2–3 layout thumbnails: one reel index, one single-project layout, one dense piece-to-piece navigator. Alt text accordingly.
- One paragraph:
  > Reels-first sites often choke on load or fight the viewer with autoplay and heavy chrome. This concept keeps the site motion-forward but performant — poster frames first, lazy-loaded reels, quick navigation from piece to piece — so the work moves only when someone is ready to watch it.

**Style gallery strip (6–8 tiles, one-line caption each):**

- Type study — display serif vs. grotesque body pairing.
- Loading state — paced fade-in with reserved image geometry.
- Grid variant — asymmetric series index.
- Button / link treatments — at-rest, hover, focused.
- Transition — page-to-page fade and slight translate.
- Color mood — warm editorial palette sample.
- (Optional) Caption system — anchored caption that breathes with full-bleed.
- (Optional) Mobile type scale — 375px reading rhythm.

Each tile: a small placeholder `<img>` or styled block, plus a single line of caption text. Keep copy to one clause. No case-study narrative in the gallery.

**Closing line:**
> Want a site with this kind of care? See **Services** for how I build them, or go straight to **Contact** to talk specifics.

Inline references to `Services` and `Contact` should route via the existing `onNavigate` prop / `NavCards` pattern (do not hard-link to the main marketing site from inside Work).

---

## CSS: preserve vs fair game

**Preserve — do not modify, override, or remove:**

- Dark-theme background system (`#0b1220`), the FluidParticles canvas, and the GSAP globe-crack intro on the page shell.
- The `NavCards` chrome (header tiles, back/sections controls).
- The **About** section's visual language (fonts, accents, spacing) — Work sits on the same page and must not make About look inconsistent.
- The **Contact** section's light-theme embed (`data-theme="light"` block).
- Global layout tokens: `.container`, `.section`, `.card`, `.small`, `.muted`, `.accent`, `.lead`, `.title`, `.underline-accent`, and any selector already used by another section.
- Typography tokens on `:root` / `body` (font families, base size, color variables). You may *read* them; do not redefine them globally.

**Fair game — you own these:**

- In-section typography: sizes, weights, leading, optical alignment, within Work only.
- New section-namespaced class names prefixed `pf-work-*` (e.g. `pf-work-concept`, `pf-work-concept__hero`, `pf-work-concept__thumbs`, `pf-work-gallery`, `pf-work-gallery__tile`, `pf-work-gallery__caption`).
- Internal grids, gaps, and spacing for concept blocks and the gallery strip.
- New CSS placed either:
  - Inline inside the `Portfolio.html` `<style>` block (prefer for small additions), **or**
  - Appended to `css/styles.css`, wrapped in a `/* === pf-work === */ … /* === end pf-work === */` comment block for clean coexistence with the Services agent's additions.
- Aspect-ratio rules and `object-fit` on the placeholder images.

Do not introduce new fonts. Use the families already loaded in `Portfolio.html` (`Inter`, `Instrument Serif`, `JetBrains Mono`).

---

## Out of scope

- **Services** section and the `ServicesSection` component. The Services agent owns that file region and its `CARDS` row.
- **About** section, the Spotify card, the quote/book block, and the Connect rail.
- **Contact** section and its inquiry form.
- The GSAP globe-crack intro, the FluidParticles canvas, and the `NavCards` header chrome.
- Main marketing site (`index.html`, `about-me.html`, etc.) — no edits.
- Image mockups. Ship placeholder `<img>` slots; real art direction comes in a follow-up task.
- Pricing of any kind. There are no prices on this page.

---

## Coordination rules (parallel execution with Services agent)

1. Edit only `WorkSection` in `Portfolio.html` and only the `id: 'work'` row in the `CARDS` array.
2. Namespace every new CSS class to `pf-work-*`. Do not use unprefixed names that could collide.
3. If appending to `css/styles.css`, wrap your additions in `/* === pf-work === */` … `/* === end pf-work === */`. Do not edit existing selectors.
4. Do not rename, remove, or reorder any class, variable, or selector used elsewhere on the page.
5. If you must touch a shared area (e.g. `CARDS` array, the `<style>` block in `Portfolio.html`), edit only your lines and leave the rest byte-identical.

---

## Deliverables checklist

- [ ] Copy matches the content brief above (or the revision log documents intentional edits after user review).
- [ ] Two concept blocks and a style gallery strip render inside `WorkSection`; no "case studies in progress" / "coming soon" language remains.
- [ ] Placeholder `<img>` elements use meaningful `alt` text and have reserved geometry (no layout shift on image swap).
- [ ] Dark theme preserved (`data-theme="dark"`, `portfolioPanelShell` pattern).
- [ ] Responsive at 375 / 768 / 1280: concept thumb rows reflow; gallery strip becomes horizontally scrollable or wraps cleanly on narrow viewports.
- [ ] All in-section CTAs/links that reference Services or Contact route via `onNavigate` (no hard hash-links to the main marketing site).
- [ ] No prices appear anywhere in Work.
- [ ] No console errors; GSAP intro and FluidParticles still run.
- [ ] `CARDS.sub` for `id: 'work'` updated from `'Case studies when ready'` to the chosen new string (2–3 candidates proposed in the revision log so the user can pick).
- [ ] `prefers-reduced-motion` honored — no unconditional new animations.

---

## Revision log

| Date | Author | What changed |
| ---- | ------ | ------------ |
| 2026-04-22 | Agent | Work tile restored; `WorkSection` ships as placeholder only. |
| 2026-04-22 | Agent | Audited against handoff: placeholder tightened (why the grid stays), `aria-labelledby` on section, muted cross-link to Services/Contact; `CARDS.sub` → "Case studies when ready"; out-of-scope line updated for Services Solutions grid. |
| 2026-04-23 | Planning | **Pivot to new audience (photographers / videographers / artists).** Handoff rewritten from placeholder to **Selected work**: two concept/spec sites (editorial photographer + motion director) with hero + layout thumbs + problem/solve paragraph, plus a style-range gallery strip of 6–8 captioned tiles. CSS preserve/fair-game rules added. Coordination rules added for parallel execution with the Services agent. `CARDS.sub` to be replaced. |

---

## Paste into a new chat (Work agent)

You own **`WorkSection`** in `test-pages-bad/test-pages-new/Portfolio.html`. Read [`portfolio-handoff-work-panel.md`](./portfolio-handoff-work-panel.md) in full before editing anything. The site sells custom portfolio websites to photographers, videographers, and artists — treat Work as a **Selected work** section containing two concept/spec sites plus a style gallery strip, not a placeholder. Keep `data-theme="dark"` and the `portfolioPanelShell` pattern. All new CSS classes must be namespaced `pf-work-*`; if editing `css/styles.css`, wrap additions in `/* === pf-work === */ … /* === end pf-work === */`. Do not touch `ServicesSection`, About, Contact, the globe intro, or the NavCards chrome. No prices. Propose 2–3 `CARDS.sub` candidates for `id: 'work'` in your revision log and let the user pick.
