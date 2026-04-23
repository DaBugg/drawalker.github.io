# Handoff: About panel — rewrite & reformat

**Single-agent scope:** The **About** experience inside [`Portfolio.html`](./Portfolio.html) only—the React `AboutSection` block (bio, optional bridge, Spotify card shell, quote + book, plus the **Connect** rail at the bottom of `#quote`—see [`portfolio-handoff-quote-connect-links.md`](./portfolio-handoff-quote-connect-links.md) if that rail is split to another agent). You **rewrite** and **reformat** this panel so it reads cleanly for the current product direction; you do **not** own **Work**, **Services** long-card panel, or **Contact** (see [`portfolio-handoff-work-panel.md`](./portfolio-handoff-work-panel.md), [`portfolio-handoff-services-solutions-panel.md`](./portfolio-handoff-services-solutions-panel.md), [`portfolio-handoff-contact-panel.md`](./portfolio-handoff-contact-panel.md)).

**Code anchor:** Search `Portfolio.html` for `function AboutSection`.

---

## In scope

| Area | Rewrite (copy) | Reformat (structure / UI) |
| ---- | ---------------- | ------------------------- |
| **Bio** | Eyebrow (“About”), `h1`, `lead`, body paragraphs, “Get in touch” sentence | Heading hierarchy, `className` / utility classes from [`../../css/styles.css`](../../css/styles.css), paragraph breaks, emphasis |
| **Bridge** *(optional)* | New short paragraph after bio: connect technical/advisory credibility with **sites for artists & photographers** (or your chosen pivot) | Placement (recommended: after last bio `p`, before Spotify `section`), styling consistent with bio |
| **Spotify block** | Badge title, button labels, form field labels / placeholders if you change tone | Layout within `article.card.spotify`, spacing, accessibility (`aria-*`), **do not** break `id`s required by [`spotify-embed.js`](./spotify-embed.js) (`spotify-card`, `spotify-cover`, `spotify-track`, etc.) unless you coordinate a script update |
| **Quote + book** | Quote text, attribution, book title, Amazon link text | `section` / `container` / `quote-book` layout tweaks |
| **Connect rail** *(optional split)* | GitHub / LinkedIn / Email + footer shortcuts | Same as main `index.html` `#links`; animation hooks per [`portfolio-handoff-quote-connect-links.md`](./portfolio-handoff-quote-connect-links.md) |

**`CARDS` nav:** You may propose **only** the `about` row’s **`label`** and **`sub`** (grid + tab text for the first tile). Final strings should be pasted into `Portfolio.html`’s `CARDS` array or handed to the other agent if they own a single PR—**do not** change `work` / `services` / `contact` rows; those belong to the other handoffs.

---

## Out of scope

- **Work**, **Services**, and **Contact** panels and their `CARDS` rows (`work`, `services`, `contact`).
- **Deferred** three-tier packages panel (not in current nav).
- Scroll/zoom intro, globe/crack art, `FluidParticles`, `NavCards` header chrome (except `about` `label`/`sub` as above).
- **Spotify API behavior** in `spotify-embed.js` (polling, endpoints)—unless you explicitly scope a follow-up task.

---

## Audience & voice (About-specific)

Align the About **story** with who the rest of the portfolio is for (e.g. **visual creatives** evaluating you for web work), without erasing honest career history unless the stakeholder wants a full rewrite.

- Warm, direct, credible; avoid sounding like two different people stapled together after a bridge paragraph.
- Same guardrails as elsewhere: no fake testimonials; no SEO guarantees in passing.

---

## Deliverables checklist

- [x] Final bio copy (or explicit “no copy change—format only” note from stakeholder).
- [x] Bridge: **in** / **out** / **draft text** decision recorded in revision log.
- [x] Spotify + quote/book: list any copy or layout change; confirm **ids** still match `spotify-embed.js` if the card markup moves.
- [x] **`about` `CARDS` `label` / `sub`:** final strings if changing.
- [ ] If you edit `Portfolio.html` directly: run through in browser (About tab, Spotify toggle, “Get in touch” → contact route).

---

## Revision log

| Date | Author | What changed |
| ---- | ------ | -------------- |
| 2026-04-22 | Agent | About panel copy rewritten for **visual creatives** (artists/photographers/studios); removed `<br />` breaks in favor of `p + p` rhythm from `styles.css`. **Bridge (earlier pass):** technical reliability → image-led sites woven into third body paragraph. Spotify badge text (“What’s playing right now”). Quote/book headings + Amazon CTA reworded; Dalí quote kept. **`about` `CARDS` `sub`:** `Partner for image-led sites`. Spotify element **ids** unchanged. |
| 2026-04-22 | —      | **Nav bridge:** paragraph after “Get in touch” (before Spotify) signposts **Services** / **Work** / **Contact** (four-tile nav). |
| 2026-04-22 | Agent | **Connect rail** added under `#quote` (index-parity links + `portfolio-link-rail--pulse`). |

---

## Draft workspace (optional)

### Bridge paragraph — v1 (superseded when Work tile removed)

When you want examples and how engagements are structured, use **Work** and **Services** in the bar above—**Contact** is there when you are ready to send a few links to your work.

### Bridge paragraph — v2

When you want the same **Solutions** lineup as the main site, open **Services** in the bar above—**Contact** is there when you are ready to send a few links to your work or ask about timelines.

### Bridge paragraph — v3 (current)

For how engagements tend to look, open **Services** in the bar above—**Work** will hold case studies when they are ready, and **Contact** is there when you want to send links or ask about timelines.

*(Shipped as its own `<p>` after the Get-in-touch paragraph, before the Spotify `section`.)*

### Bio notes / stakeholder constraints

- Audience: sites for people who work in **images** (artists, photographers, studios).
- No SEO guarantees; no invented testimonials (unchanged).



---

## Paste into a new chat (About agent only)

You own **rewrite + reformat of the About panel** in `test-pages-bad/test-pages-new/Portfolio.html` (`AboutSection`: bio, optional bridge before Spotify, Spotify card **copy/shell layout**, quote + book, and the quote-area **Connect** rail if in scope). Read [`portfolio-handoff-about-section.md`](./portfolio-handoff-about-section.md) and, for the link rail, [`portfolio-handoff-quote-connect-links.md`](./portfolio-handoff-quote-connect-links.md). Do **not** build **Work**, **Services** long-card panel, or **Contact** panel. Preserve Spotify **element ids** required by `spotify-embed.js` unless you also update that script. You may update only the **`about`** row’s `CARDS` `label`/`sub`. Log substantive edits in the revision table.
