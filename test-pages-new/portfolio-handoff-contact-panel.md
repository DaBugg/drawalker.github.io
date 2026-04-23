# Handoff: Contact panel — inquiry strip + full form link

**Single-agent scope:** The **Contact** nav tile (`active === 'contact'`) in [`Portfolio.html`](./Portfolio.html): the React `ContactSection` (eyebrow, `h1`, checklist for what to send, primary CTA to the marketing contact form, optional muted helper line).

**Code anchor:** Search `Portfolio.html` for `function ContactSection`.

---

## In scope

| Area | Responsibility |
| ---- | ---------------- |
| **Copy** | Headline, lead, bullet list, helper paragraph—aligned with “sites for visual creatives” positioning unless stakeholder replaces. |
| **Primary CTA** | Default: link to [`../../index.html#contact`](../../index.html#contact) (full form). Alternative: `mailto:` only if product asks; document in revision log. |
| **Layout** | Match other panels: `data-theme="dark"`, `section` / `container` / `about-page` patterns, [`../../css/styles.css`](../../css/styles.css). |
| **`CARDS` row** | You may propose **`label` / `sub`** for `id: 'contact'` only. |

---

## Out of scope

- **About** (including quote-area Connect links), **Services** Solutions grid.
- Main `index.html` form behavior, API, or spam handling.
- Nav shell except `contact` `CARDS` strings.

---

## Deliverables checklist

- [x] Copy reflects what you actually want clients to send (links, timeline, budget).
- [x] CTA opens the correct destination; `rel` / `target` set appropriately for external full-page form.
- [x] Helper text does not reference removed nav tiles (e.g. old “Work” tile) unless restored.
- [x] Quick browser check on Contact tab.

---

## Revision log

| Date | Author | What changed |
| ---- | ------ | ------------ |
| 2026-04-22 | — | Panel existed from prior build; nav reduced to three tiles—verify muted helper line still matches product. |
| 2026-04-22 | Agent | **ContactSection:** lead copy aligned to image-led creative sites; checklist kept (links, timeline, budget). CTA `../../index.html#contact` with `target="_blank"` `rel="noopener noreferrer"`, `btn btn--large`, visually hidden “new tab” hint. Helper mentions **About** / **Services** / **← Sections** or grid only—no Work tile. **`contact` `CARDS` `sub`:** `Full form on the marketing site`. |

---

## Paste into a new chat (Contact agent)

You own **`ContactSection`** in `test-pages-bad/test-pages-new/Portfolio.html`. Read [`portfolio-handoff-contact-panel.md`](./portfolio-handoff-contact-panel.md). Keep tone consistent with About’s creative-web positioning; primary action should stay obvious. If you change the helper line, keep it aligned with current `CARDS` (`about`, `work`, `services`, `contact`).
