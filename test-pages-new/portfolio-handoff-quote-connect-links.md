# Handoff: About quote area — Connect + footer links

**Single-agent scope:** The **bottom of the quote / book section** inside `AboutSection` in [`Portfolio.html`](./Portfolio.html): the **Connect** block (`h2.accent`, `ul.link-cards`) and **footer-style** secondary links, using the **same URLs and markup patterns** as [`../../index.html`](../../index.html) (`#links` GitHub / LinkedIn / Email, plus footer `my-designs.html`, `about-me.html`). Includes the **animation hook** classes on the embed (e.g. `portfolio-link-rail--pulse`).

**Code anchor:** Search `Portfolio.html` for `portfolio-quote-connect-wrap` or `section id="quote"`.

---

## In scope

| Area | Responsibility |
| ---- | ---------------- |
| **Connect cards** | Same three cards as main site: GitHub, LinkedIn, `mailto:`—emoji spans, `strong`, `p` descriptions unchanged unless copy deck updates. |
| **Secondary links** | `footer__links`-style row: CSS Showcase → `../../my-designs.html`, About Me → `../../about-me.html` (paths relative to `test-pages-new/Portfolio.html`). |
| **Styling** | Reuse `link-cards`, `card`, `footer__links`, `small muted` from site CSS; adjust spacing only inside `portfolio-quote-connect-wrap` if needed. |
| **Motion hooks** | Keep `portfolio-link-rail--pulse` (or agreed successor) so motion can be tuned in CSS without markup churn. Keyframes live in `Portfolio.html` `<style>` unless moved to `styles.css` in a coordinated change. |

---

## Out of scope

- **Bio**, Spotify card, Dalí quote, book card content (other About handoff).
- **Services** grid, **Contact** panel.
- Changing social URLs without syncing `index.html`.

---

## Deliverables checklist

- [x] Link hrefs match `index.html` `#links` and site footer (or revision log documents intentional divergence).
- [x] Layout works at narrow widths (`link-cards` stacks per site CSS).
- [x] Animation classes remain documented here if renamed.
- [x] No duplicate `id` attributes introduced on the page.

---

## Motion hooks (CSS tuning without markup churn)

| Class | Element | Purpose |
| ----- | ------- | ------- |
| `portfolio-link-rail--pulse` | `ul.link-cards` and `div.footer__links` | Enables breathe animation on card links and footer secondary links. |
| `@keyframes portfolio-link-rail-breathe` | — | Subtle box-shadow pulse on those anchors (defined in `Portfolio.html` `<style>`). |

---

## Revision log

| Date | Author | What changed |
| ---- | ------ | ------------ |
| 2026-04-22 | Agent | Added `portfolio-quote-connect-wrap` with index-parity Connect `ul` + `footer__links` row; `portfolio-link-rail--pulse` + `portfolio-link-rail-breathe` / footer anchor border animation in embed `<style>`. |
| 2026-04-22 | Agent | Verified href parity with `index.html`; confirmed unique `id`s; added `margin-top` + `flex-wrap` on `.portfolio-quote-connect-wrap .footer__links` for narrow layouts; documented motion hooks above. |

---

## Paste into a new chat (Quote / Connect agent)

You own the **Connect + footer link rail** at the bottom of **`AboutSection`**’s `#quote` area in `test-pages-bad/test-pages-new/Portfolio.html`. Read [`portfolio-handoff-quote-connect-links.md`](./portfolio-handoff-quote-connect-links.md). Preserve parity with `index.html` social URLs; tune animation in the embed `<style>` or migrate keyframes to `css/styles.css` with one PR. Do not edit Spotify `id`s unless coordinating `spotify-embed.js`.
