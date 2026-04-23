# Handoff: Contact panel — 3-step inquiry journey

**Single-agent scope:** The **Contact** nav tile (`active === 'contact'`) in [`Portfolio.html`](./Portfolio.html): the React `ContactSection`. This handoff **replaces** the previous "placeholder inquiry strip + link to the marketing-site form" framing. The tech-buyer form (9-option engagement select including AI Assessment / Cloud Strategy / Infrastructure / Security; textarea placeholder "Describe your current infrastructure, AI goals, and any specific challenges"; newsletter checkbox promising "AI & infrastructure insights") is **removed**. In its place: a **three-step sequential step-panel journey** that qualifies the visitor (who they are + what they want) before collecting project details. The final step still posts to `/api/send-quote` over SMTP — the existing transport is preserved; only the field names change.

**Audience context:** This page now sells to **photographers, videographers, and artists** who want a modern, slick portfolio site but aren't technical enough to build one. Contact must speak to a visual creative — not a tech buyer. No infrastructure jargon, no AI-newsletter, no call-scheduling UI.

**Theme decision:** Keep `data-theme="light"` and the `Contact-background.svg` overlay (`.portfolio-panel-body--contact`). Contact is deliberately the only light section — a "landing moment" after three dark narrative sections. Cohesion with the rest of the page comes from typography and accent color, not background color.

**Form backend decision:** Keep `action="/api/send-quote"`, `method="post"` (SMTP-backed). Do **not** switch to mailto or a third-party service. The SMTP-side handler will need a separate update to accept the renamed fields (flagged in the revision log, out of scope for this agent).

**Journey-shape decision:** Three sequential step panels, each replacing the prior view inside `ContactSection` with a fade/slide transition. This is an explicit design choice — do **not** revert to a single long-form implementation.

**Code anchor:** Search `Portfolio.html` for `function ContactSection` (currently lines 927–1063).

---

## In scope

| Area | Responsibility |
| ---- | --------------- |
| **`ContactSection` React component** | Replace the existing two-column `contact-grid` layout with a three-step journey driven by local React state (`useState` for `step`, `role`, `service`). Keep `data-theme="light"` and the `portfolioPanelShell` pattern. |
| **Copy — Step 1** | Sub-heading `Who are you?`, one-line helper, 6 role tile labels + descriptors. |
| **Copy — Step 2** | Sub-heading `What service do you need?`, one-line helper, 7 service tile labels + descriptors. |
| **Copy — Step 3** | Sub-heading `A few last details`, one-line helper, summary chip, form fields, submit + email fallback line. |
| **Anchor header** | Eyebrow (`Contact`) + title (`Tell me about your next site` with a gold italic accent word) pinned across all three steps. |
| **Progress label** | `Step N of 3` at the top-left of each step. |
| **Back button** | On Steps 2 and 3; keyboard-accessible; returns to prior step with prior selection still highlighted. |
| **Tile grids** | `<button type="button">` tiles, auto-advance on click, `focus-visible` ring, selected state. |
| **Form fields** | `name`, `email`, `work_links`, `timeline`, `project`, `budget` with correct `name` attributes; hidden inputs `role` + `service` carry Step 1/2 selections. |
| **Summary chip on Step 3** | Read-only display of selected role + service with an `Edit` link that jumps back to the relevant step. |
| **Success state** | In-panel confirmation view on submit (no navigation away). |
| **`CARDS` row for `id: 'contact'`** | Update `label` (keep `'Contact'`) and propose 2–3 `sub` string options to replace `'Email to start'`. Suggested starters: `'Start a conversation'`, `'Three-step project inquiry'`, `'Tell me about your next site'`. |
| **Removals** | `phone`, `preferred_date`, `preferred_contact_method`, legacy 9-option `engagement_type` select, `newsletter` checkbox; the `Open full contact form` button linking to `../../index.html#contact` in a new tab. |

---

## Content brief (ship this copy unless the user edits)

### Anchor header (pinned across all three steps)

- **Eyebrow:** `Contact`
- **Title:** `Tell me about your *next site*` — render `next site` in Instrument Serif italic, color `#c9ae7a` (explicit hex, not `--accent`). Treat like About's `.pf-about__title-accent`.

### Flow

```
Step 1 — Who are you?            → Step 2 — What service do you need?     → Step 3 — A few last details (form + Send)
         6 role tiles                        7 service tiles                        remaining fields + hidden role/service
```

### Step 1 — "Who are you?"

- **Sub-heading:** `Who are you?`
- **Helper one-liner:** `Pick the one that fits best — it just helps me scope the right kind of reply.`
- **Tile grid:** 2 columns on ≥768px, 1 column below. 6 tiles — each a `<button type="button">` with a short label and one-line descriptor.

  1. **Photographer** — editorial, commercial, or fine-art.
  2. **Videographer** — shooter, editor, or reel-driven director.
  3. **Director / DP** — cinematographer-led site, reel and stills mixed.
  4. **Multi-disciplinary artist** — painter, sculptor, installation, mixed-media.
  5. **Studio or agency** — representing multiple creatives or a roster.
  6. **Other** — writer, musician, performer, or anyone else with work to show.

- Selected value stored as `role` (string: `photographer`, `videographer`, `director`, `artist`, `studio`, `other`).
- Clicking a tile auto-advances to Step 2 (no separate "Next" button).

### Step 2 — "What service do you need?"

- **Sub-heading:** `What service do you need?`
- **Helper one-liner:** `Portfolio websites are the main thing — but I also do the rest of the stack when it's useful.`
- **Tile grid:** same pattern as Step 1. 7 tiles.

  1. **Portfolio website — turnkey** — one engagement, designed, built, launched, handed off.
  2. **Portfolio website — ongoing partnership** — updates, hosting, deployment, seasonal refreshes.
  3. **Analytics & dashboards** — measure what actually matters; no surveillance clutter.
  4. **Automation & workflow** — the quiet scripts that save hours a week.
  5. **SEO strategy** — findable without gimmicks.
  6. **AI / infrastructure consulting** — for the non-portfolio work; I still do this.
  7. **Something else — let's talk** — catch-all for cases that don't fit above.

- Selected value stored as `service` (slug string: `portfolio-turnkey`, `portfolio-ongoing`, `analytics`, `automation`, `seo`, `ai-consulting`, `other`).
- Clicking a tile auto-advances to Step 3.

> **Why 7 options here when Services only shows 3 engagement panels?**
> The redesigned Services section focuses the *narrative* on portfolio websites for visual creatives (turnkey vs ongoing partnership). But the broader service menu — analytics, automation, SEO, AI / infrastructure consulting — still applies for non-portfolio inquiries. Contact intake must capture the full menu so those leads aren't dropped on the floor. Do **not** cut this list back to 3 to match Services.

### Step 3 — Project form

- **Sub-heading:** `A few last details`
- **Helper one-liner:** `Last step — enough to write you back with something useful, not a pitch.`
- **Summary chip** at the top of the form (small, muted surface): shows the selected role + service with an `Edit` link. Example:
  `Photographer · Portfolio — ongoing partnership  [Edit]`
  The `Edit` link jumps back to the appropriate step (click on the role chip jumps to Step 1; click on the service chip jumps to Step 2). Prior selections stay highlighted so the user can reselect with one click.
- **Form fields** (single column inside the light-theme surface):

  1. `name` — required text. Label: `Your name`.
  2. `email` — required email. Label: `Email`.
  3. `work_links` — required text. Label: `Links to your work`. Placeholder: `Website, Instagram, Vimeo, Drive folder — whatever is current.`
  4. `timeline` — optional select. Options: `Within a month`, `1–3 months`, `3–6 months`, `No fixed date`.
  5. `project` — required textarea. Label: `About the project`. Placeholder: `Your body of work, who the site is for, what it needs to do.`
  6. `budget` — optional text. Label: `Budget range (optional)`. Hint: `If you're comfortable sharing — helps me scope honestly.`

- **Hidden inputs** (carry Step 1/2 selections into the POST body):

  ```jsx
  <input type="hidden" name="role" value={role} />
  <input type="hidden" name="service" value={service} />
  ```

- **Submit button:** `Send`.
- **Below submit:** small muted line — `Or email me directly at david@networksandnodes.org` (retain mailto fallback).
- **Post-submit:** reuse the current form's success/failure handling. Keep `action="/api/send-quote"`, `method="post"`. On success, swap the form inside the panel for a confirmation view:
  - Heading: `Got it — I'll reply within a couple of business days.`
  - Sub-copy: one calm sentence thanking them and setting expectation.
  - No navigation away. No page reload.

### Navigation / controls (all steps)

- **Progress label** top-left: `Step 1 of 3`, `Step 2 of 3`, `Step 3 of 3`.
- **Auto-advance** on tile selection (Steps 1 & 2).
- **Back** button on Steps 2 and 3 (keyboard-accessible, `<button type="button">`). Returns to the prior step with the prior selection highlighted so it's one click to resume.
- **Anchor eyebrow + title** stay pinned; only the sub-heading + body region swap between steps.
- **Transitions:** fade + 8px translate, ~180ms. Gated behind `prefers-reduced-motion: no-preference`. Under `reduce`, swaps are instantaneous (no fade/slide).

### Removals (vs. current Contact section)

- `phone` field.
- `preferred_date` field.
- `preferred_contact_method` select.
- `engagement_type` legacy 9-option select (AI Assessment / Cloud Strategy / Web Dev / Analytics / Automation / Security / Operations / Implementation / Not sure).
- `newsletter` checkbox ("Keep me updated on AI & infrastructure insights").
- `Open full contact form` button opening `../../index.html#contact` in a new tab. The Portfolio page's journey *is* the inquiry form now.

### State management / React

- Use local `useState` inside `ContactSection`:

  ```jsx
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [service, setService] = useState('');
  ```

- No global store, no router integration. The three-step view is entirely internal to the panel.
- On mount, `step` defaults to `1` with empty `role` / `service`.
- On `onNavigate('contact')` entry from elsewhere, Contact opens on Step 1 with state reset (unless the optional enhancement below is implemented).

### Optional enhancement (flag, don't require)

When the visitor arrives from Services with a known engagement preference, the Services CTA *could* pass a hint (e.g. `onNavigate('contact', { service: 'portfolio-ongoing' })`) so Contact opens on Step 1 with Step 2 pre-selected — they'd still confirm their role on Step 1, then land on Step 3 with the service already chosen. This is a nice-to-have; ship the minimum-viable flow first (Step 1 → Step 2 → Step 3 from a clean state every time).

---

## CSS: preserve vs fair game

**Preserve — do not modify, override, or remove:**

- Dark-theme background system (`#0b1220`), the FluidParticles canvas, and the GSAP globe-crack intro on the page shell.
- The `NavCards` chrome (header tiles, back/sections controls).
- The **About** section's visual language (fonts, accents, spacing) and any `pf-about-*` class.
- The **Work** and **Services** sections' styling and any class prefixed `pf-work-*` or `pf-services-*` (owned by the Work and Services agents running in parallel).
- The light-theme override block at `Portfolio.html:85–101` (`.portfolio-embed-root[data-theme="light"]` scope).
- The `.portfolio-panel-body--contact` rule setting `background: url(Contact-background.svg) no-repeat center bottom` plus the white page background. **The SVG overlay stays.**
- Global layout tokens: `.container`, `.section`, `.card`, `.small`, `.muted`, `.accent`, `.lead`, `.title`, `.underline-accent`, and any selector already used by another section.
- Typography tokens on `:root` / `body`. Read them; do not redefine them globally.
- The `prefers-reduced-motion` block at `css/styles.css:178–185`.

**Fair game — you own these:**

- In-section typography: sizes, weights, leading, optical alignment, within Contact only.
- New section-namespaced class names prefixed `pf-contact-*`. Examples:
  `pf-contact-journey`, `pf-contact-step`, `pf-contact-step__progress`, `pf-contact-step__back`, `pf-contact-step__heading`, `pf-contact-step__helper`, `pf-contact-tiles`, `pf-contact-tile`, `pf-contact-tile--selected`, `pf-contact-summary-chip`, `pf-contact-summary-chip__edit`, `pf-contact-form`, `pf-contact-form__field`, `pf-contact-form__submit`, `pf-contact-success`.
- Internal grids, gaps, and spacing for the journey, tile grids, summary chip, and form.
- A `pf-contact-title-accent` class (or similar) that explicitly sets `color: #c9ae7a` and `font-style: italic` so the title accent word matches About's gold treatment instead of rendering green from `--accent: #16a34a` (the light-theme default).
- Step transition keyframes — fade + 8px translate, ~180ms — inside a `@media (prefers-reduced-motion: no-preference)` guard.
- New CSS placed either:
  - Inline inside the `Portfolio.html` `<style>` block (prefer for small additions), **or**
  - Appended to `css/styles.css`, wrapped in a `/* === pf-contact === */ … /* === end pf-contact === */` comment block for clean coexistence with the Work and Services agents' additions.

**Explicit note on legacy Contact CSS (`css/styles.css:1523–1668`):**

- `.contact-grid`, `.contact-intro`, `.contact-services`, `.consultation-form`, `.form-field*` definitions stay in `css/styles.css`. **Do not delete them** — unclear whether `about-me.html` / other pages reference them, and deletion is not in scope.
- The new Contact structure stops *referencing* them and uses `pf-contact-*` exclusively.

Do not introduce new fonts. Use the families already loaded in `Portfolio.html` (`Inter`, `Instrument Serif`, `DM Sans`, `JetBrains Mono`).

---

## Out of scope

- **Work** section and the `WorkSection` component. The Work agent owns that file region and its `CARDS` row.
- **Services** section and the `ServicesSection` component. The Services agent owns that file region and its `CARDS` row.
- **About** section, the Spotify card, the quote/book block, and the Connect rail.
- The GSAP globe-crack intro, the FluidParticles canvas, and the `NavCards` header chrome.
- Main marketing site (`index.html`, `about-me.html`, etc.) — no edits.
- The `/api/send-quote` backend handler. This frontend change renames form fields; the SMTP-side handler must be updated in a separate task (see revision log).
- Any router, global state, or navigation-prop changes beyond the internal step state. `onNavigate('contact')` keeps its current contract.
- Pricing of any kind — no prices appear in Contact.

---

## Coordination rules (parallel execution with Work and Services agents)

1. Edit only `ContactSection` in `Portfolio.html` and only the `id: 'contact'` row in the `CARDS` array.
2. Namespace every new CSS class to `pf-contact-*`. Do not use unprefixed names that could collide.
3. If appending to `css/styles.css`, wrap your additions in `/* === pf-contact === */` … `/* === end pf-contact === */`. Do not edit existing selectors.
4. Do not rename, remove, or reorder any class, variable, or selector used elsewhere on the page.
5. If you must touch a shared area (e.g. the `CARDS` array, the `<style>` block in `Portfolio.html`), edit only your lines and leave the rest byte-identical.
6. Do not touch the globe intro, FluidParticles, NavCards chrome, or the About / Work / Services visual systems.

---

## Deliverables checklist

- [ ] Three-step journey renders inside `ContactSection`: Step 1 (6 role tiles), Step 2 (7 service tiles), Step 3 (form). Anchor eyebrow + title pinned across all three.
- [ ] Progress label (`Step N of 3`) shown on each step.
- [ ] Tiles are keyboard-accessible (`<button type="button">`, `focus-visible` ring). Auto-advance on selection.
- [ ] Back button present on Steps 2 and 3; returns to prior step with prior selection highlighted.
- [ ] Step transitions fade/slide at ~180ms; collapse to instantaneous under `prefers-reduced-motion: reduce`.
- [ ] Step 3 summary chip shows role + service with an `Edit` link back to Steps 1 / 2.
- [ ] Form collects `name`, `email`, `work_links`, `timeline`, `project`, `budget` with correct `name` attributes; hidden inputs `role` and `service` carry Step 1 + 2 selections.
- [ ] Form posts to existing `action="/api/send-quote"` / `method="post"`.
- [ ] Success view replaces the form inside the panel on submit (no navigation away).
- [ ] Tech-buyer fields removed: `phone`, `preferred_date`, `preferred_contact_method`, legacy `engagement_type` 9-option select, `newsletter` checkbox.
- [ ] `Open full contact form` button linking to `../../index.html#contact` removed; email fallback retained.
- [ ] `data-theme="light"` and the `Contact-background.svg` overlay preserved.
- [ ] About type system adopted: Instrument Serif title, DM Sans body, gold `#c9ae7a` italic on the title accent word (explicit hex, not `--accent`).
- [ ] `CARDS.sub` for `id: 'contact'` updated from `'Email to start'`; 2–3 candidates proposed in the revision log so the user can pick.
- [ ] Responsive at 375 / 768 / 1280 — tile grid collapses to 1 column on narrow viewports; form stays single-column throughout.
- [ ] No console errors; GSAP intro + FluidParticles still run.
- [ ] Backend field-rename task flagged in the revision log so the user updates the `/api/send-quote` SMTP handler after the frontend ships.

---

## Revision log

| Date | Author | What changed |
| ---- | ------ | ------------ |
| 2026-04-22 | — | Panel existed from prior build; nav reduced to three tiles—verify muted helper line still matches product. |
| 2026-04-22 | Agent | **ContactSection:** lead copy aligned to image-led creative sites; checklist kept (links, timeline, budget). CTA `../../index.html#contact` with `target="_blank"` `rel="noopener noreferrer"`, `btn btn--large`, visually hidden "new tab" hint. Helper mentions **About** / **Services** / **← Sections** or grid only—no Work tile. **`contact` `CARDS` `sub`:** `Full form on the marketing site`. (Note: live code ships `'Email to start'`; mismatch to be resolved by this rewrite.) |
| 2026-04-23 | Planning | **Pivot to new audience (photographers / videographers / artists) + journey shape.** Handoff rewritten from single-form placeholder to a **three-step sequential step-panel journey**: Step 1 "Who are you?" (6 role tiles), Step 2 "What service do you need?" (7 service tiles — full menu including Analytics, Automation, SEO, AI consulting, not just the 3 Services-panel engagement options), Step 3 project form (`name`, `email`, `work_links`, `timeline`, `project`, `budget` + hidden `role` / `service`). Tech-buyer fields removed (`phone`, `preferred_date`, `preferred_contact_method`, legacy `engagement_type` select, `newsletter` checkbox). Marketing-site link-out CTA removed. `data-theme="light"` + `Contact-background.svg` preserved. About type system adopted; title accent explicit `#c9ae7a` to override `--accent: #16a34a`. `action="/api/send-quote"` / `method="post"` preserved. `CARDS.sub` to be replaced. **Backend flag:** the `/api/send-quote` SMTP handler needs a separate task to accept the new field names (`role`, `service`, `work_links`, `timeline`, `project`, `budget`) and drop the removed fields. Out of scope for this agent; user to schedule the handler update after frontend ships. |

---

## Paste into a new chat (Contact agent)

You own **`ContactSection`** in `test-pages-bad/test-pages-new/Portfolio.html`. Read [`portfolio-handoff-contact-panel.md`](./portfolio-handoff-contact-panel.md) in full before editing anything. The site sells custom portfolio websites to photographers, videographers, and artists — replace the existing single-form layout with **three sequential step panels**: Step 1 "Who are you?" (6 role tiles), Step 2 "What service do you need?" (7 service tiles — full menu, do not cut to 3), Step 3 project form with hidden `role` / `service` inputs carrying Step 1/2 selections. Use local `useState` for `step` / `role` / `service` — no router, no global state. Auto-advance on tile click; Back button on Steps 2 and 3; fade+translate transitions gated behind `prefers-reduced-motion: no-preference`. Keep `data-theme="light"` and the `Contact-background.svg` overlay. Anchor eyebrow (`Contact`) + title (`Tell me about your next site` with `next site` in Instrument Serif italic, explicit `#c9ae7a`) pinned across all three steps. Form posts to existing `action="/api/send-quote"` / `method="post"`; remove `phone`, `preferred_date`, `preferred_contact_method`, legacy `engagement_type` select, `newsletter` checkbox, and the `Open full contact form` button. On submit, swap the form for an in-panel "Got it — I'll reply within a couple of business days" confirmation. All new CSS classes must be namespaced `pf-contact-*`; if editing `css/styles.css`, wrap additions in `/* === pf-contact === */ … /* === end pf-contact === */`. Do not touch `WorkSection`, `ServicesSection`, About, the globe intro, or the NavCards chrome. Do not delete legacy `.contact-grid` / `.consultation-form` / `.form-field*` definitions in `css/styles.css` — just stop referencing them. No prices anywhere. Propose 2–3 `CARDS.sub` candidates for `id: 'contact'` in your revision log and let the user pick. Flag the `/api/send-quote` backend field-rename as a separate task in your revision log.
