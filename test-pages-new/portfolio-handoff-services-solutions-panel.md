# Handoff: Services panel — main-site Solutions grid

**Single-agent scope:** The **Services** nav tile (`active === 'services'`) in [`Portfolio.html`](./Portfolio.html): the React `ServicesSection` that mirrors the main site’s **`#services` “Solutions”** block from [`../../index.html`](../../index.html) (five `article.card.service` items, same titles and body copy). You **do not** own the deferred three-tier “how we work together” packages panel (skipped for now).

**Code anchor:** Search `Portfolio.html` for `function ServicesSection`.

---

## In scope

| Area | Responsibility |
| ---- | ---------------- |
| **Copy** | Keep Solutions titles and descriptions aligned with `index.html` `#services` unless marketing approves a deliberate fork. |
| **Markup / classes** | Use the same structure as the main page: `container`, `h2.accent` “Solutions”, lead `p.muted.small`, `div.services-grid`, `article.card.service`, `service__icon-area`, `service__body`, `h3`, `p`, CTA row. |
| **CTAs** | `Learn more` controls are **not required** to navigate yet; ship as bordered, styled controls (e.g. `button.service__cta.portfolio-faux-cta`) so they can be wired to `#contact`, in-panel `contact`, or animation later. |
| **`CARDS` row** | You may propose **`label` / `sub`** for `id: 'services'` only (sync with stakeholder). |

---

## Out of scope

- **About**, **Contact** panels, quote-area **Connect** rail (see other handoffs).
- **Packages / tiers** (“How we work together” three-column content)—explicitly deferred.
- Scroll/zoom hero, `NavCards` chrome except the `services` `CARDS` strings if you own copy.

---

## Deliverables checklist

- [x] Solutions copy matches `index.html` (or revision log notes intentional diffs).
- [x] Grid and cards use shared [`../../css/styles.css`](../../css/styles.css) service styles; last odd card centers per `.services-grid` rules.
- [x] CTA elements remain keyboard-focusable only if product wants them interactive; otherwise `type="button"` + no misleading `href`.
- [x] Browser pass: Services tab, dark theme, mobile width if applicable.

---

## Faux CTA + motion (embed `Portfolio.html` `<style>`)

| Class / name | Purpose |
| -------------- | ------- |
| `button.service__cta.portfolio-faux-cta` | Same visual base as `.service__cta` from `styles.css`; `type="button"`, no `href` until wired to contact or in-panel nav. |
| `@keyframes portfolio-faux-cta-ring` | Gentle box-shadow pulse on faux CTAs inside `.portfolio-embed-root`. |

---

## Revision log

| Date | Author | What changed |
| ---- | ------ | ------------ |
| 2026-04-22 | Agent | Replaced tier `ServicesSection` with index-aligned **Solutions** grid; `button.service__cta.portfolio-faux-cta` + `portfolio-faux-cta-ring` animation in `Portfolio.html` `<style>`. Post-crack nav is **four** tiles; `services` `CARDS.sub`: “Solutions from the main site”. |
| 2026-04-22 | Agent | Confirmed Solutions grid in `Portfolio.html`: `container` + `h2.accent` + `p.muted.small` + `services-grid` / `article.card.service`, icons as UTF-16 pairs matching `index.html` numeric entities, faux CTAs + `focus-visible`. Contact blurb points to Services as same Solutions list as main site. |
| 2026-04-22 | Agent | Re-verified `index.html` `#services` copy vs `solutions` array; corrected handoff revision log (four nav tiles); documented faux CTA hooks above. |

---

## Paste into a new chat (Services agent)

You own **`ServicesSection`** in `test-pages-bad/test-pages-new/Portfolio.html`: the **Solutions** grid must stay in sync with `index.html` `#services`. Preserve `article.card.service` / `service__cta` styling from `css/styles.css`. CTAs are **faux controls** (`portfolio-faux-cta`) until wired. Read [`portfolio-handoff-services-solutions-panel.md`](./portfolio-handoff-services-solutions-panel.md). Do not build the skipped packages/tiers panel without a new task.
