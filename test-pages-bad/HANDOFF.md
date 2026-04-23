# ATLAS — Handoff

**Repository note:** In this monorepo the project lives under [`test-pages/`](./) (not `atlas-site/`). Optional design exports sit in [`test-pages/assets/`](./assets/); they are not part of the deployed static site.

A scroll-driven cinematic landing page in three acts. Built as plain HTML/CSS/JS so it can be dropped into any framework later. This document is everything a new developer needs to pick it up.

**Status at handoff:** v0.1. First act verified rendering in a browser. Acts II/III and popup coded but not yet visually confirmed end-to-end. Pin fix applied but unverified — see "State of the build" below.

---

## Concept

Three images tell a visual story: Atlas kneels under a sphere (act I), the sphere swells and crushes him (act II), the sphere cracks open with light bursting through four points (act III). The page pins to the viewport while the user scrolls, and a single GSAP timeline scrubs through the three acts in sync with scroll position. When the sphere fractures, a popup navigation emerges — the four cracks become four links.

The "gasp" moment is that scroll doesn't scroll the page; it morphs the image. This is the core concept and the reason the build exists.

---

## Folder structure

```
atlas-site/   (in this repo: test-pages/)
├── server.py                    ← zero-dep Python dev server, disposable
├── README.md                    ← run + port-to-framework notes
├── HANDOFF.md                   ← this file
├── index.html                   ← page structure: chrome, 3 stages, copy, popup
├── styles.css                   ← all visual styling, no build step
├── app.js                       ← GSAP timeline — the whole animation lives here
├── vendor/
│   ├── gsap.min.js              ← GSAP core, bundled locally, no CDN
│   └── ScrollTrigger.min.js     ← GSAP ScrollTrigger plugin, bundled locally
├── images/
│   ├── act-1.svg                ← smaller sphere (initial burden)
│   ├── act-2.svg                ← massive sphere (breaking point)
│   └── act-3.svg                ← cracked sphere, four light-points (fracture)
└── assets/                      ← optional design refs only (not served)
```

`server.py` is a local preview tool only. The **deployable webpage** is `index.html`, `styles.css`, `app.js`, `vendor/`, and `images/` (everything except `server.py`, docs, and `assets/`). To port to Next.js, Astro, Remix, or Vite, copy those files in and re-wire the three `<script>` tags.

---

## Run it locally

```bash
python3 server.py            # http://localhost:8000
python3 server.py 3000       # custom port
```

No dependencies. If the person prefers Node: `npx serve . -p 8000` (from this folder).

---

## Runtime flow

The browser loads `index.html`, which pulls Google Fonts and `styles.css`, then three `<script>` tags in order: `vendor/gsap.min.js`, `vendor/ScrollTrigger.min.js`, `app.js`.

`app.js` is wrapped in an IIFE. It grabs element references, sets initial visibility via `gsap.set()`, then builds **one** master `gsap.timeline()` whose `ScrollTrigger` config pins `.epic__sticky` and scrubs the timeline over `+=300%` of scroll distance. Every animation is a `tl.to(...)` or `tl.fromTo(...)` appended to that master timeline at a labeled time position.

Skip, Rewind, and the `Escape` key all use native `window.scrollTo({ behavior: 'smooth' })`. No `ScrollToPlugin` dependency.

---

## Animation timeline (all in `app.js`)

The timeline runs from `0.00` to `1.00` over `300vh` of scroll distance.

| Time       | What happens                                                         |
|------------|----------------------------------------------------------------------|
| 0.00–0.28  | Act I holds. Figure scales slowly to 1.08. Vignette builds.          |
| 0.28–0.34  | Copy I rises and fades out. Act II fades in and zooms from 1.12→1.0. |
| 0.34–0.60  | Dwell on act II with micro-jitter and scale — pressure building.     |
| 0.60–0.70  | The crack: white flash, act II out, act III in, golden burst reveal. |
| 0.70–0.82  | Beat of calm on act III. Burst breathes subtly.                      |
| 0.82–1.00  | Popup frame scales in. Four nav nodes stagger in.                    |

The `ScrollTrigger.onUpdate` callback drives two live chrome pieces:

1. Bottom progress bar: `transform: scaleX(progress)`
2. Chapter indicator (Roman numeral + label) flips between I/II/III at the 0.33 / 0.66 thresholds.

It also toggles `pointer-events` on the popup so clicks only register once it's past 82%.

---

## Design decisions worth preserving

**Aesthetic is editorial / mythological book**, not tech-startup. Warm linen paper `#F2ECDE`, deep ink `#0B0A08`, gold palette for the breakthrough moment. Fraunces italic serif for drama, JetBrains Mono for the metadata chrome. If someone pushes to make this more "product-y" with Inter and purple gradients, the concept is dead.

**`mix-blend-mode: multiply` on the SVG images is load-bearing.** It lets the silhouettes sit on warm paper without white rectangular bleed. More importantly, on act III, multiplying the SVG's white cracks against the golden radial burst behind them turns those cracks *gold* — they literally become light bursting through. Change the blend mode and the breakthrough visual collapses. It is not decorative.

**The SVGs were processed before shipping.** The originals had large background rectangles baked in — paths filled `#FFFFFF` / `#F2F3F2` covering the full viewBox. Those were stripped programmatically so the silhouettes sit directly on paper. If anyone re-exports from Illustrator or Figma, they need to either export without a background or re-run the cleanup, or rectangular bleed returns and multiply alone won't save it.

**Scroll-jacked, not auto-play.** If someone wants auto-play on load, the change is ~10 lines in `app.js`: delete the `scrollTrigger` config block and call `tl.play()` on load. But you lose "scroll doesn't scroll, it morphs," which is the whole concept. Discuss before changing.

**GSAP is local-vendored**, not CDN. Swap back to CDN if preferred, but local means offline dev works, no third-party runtime dependency, and no license to worry about (GSAP 3 is free for most uses; check [greensock.com/licensing](https://greensock.com/licensing) for commercial).

---

## Where to change what

| Thing                              | File + location                                                 |
|------------------------------------|-----------------------------------------------------------------|
| Taglines / chapter copy            | `index.html` — `.copy__line` blocks                              |
| Nav items (currently 4)            | `index.html` — `.popup__nav` → `.node` blocks                   |
| Brand mark + meta ribbon           | `index.html` — `.chrome__mark`, `.chrome__meta`                 |
| Popup title + subtitle             | `index.html` — `.popup__head`                                   |
| Paper/ink/gold/crimson colors      | `styles.css` — `:root` block at top                             |
| Fonts                              | `index.html` `<link>` + `:root --serif / --mono` in CSS         |
| Animation timing (act durations)   | `app.js` — time labels on each `tl.to(...)`                     |
| How long the cinematic holds       | `app.js` — `end: "+=300%"` in ScrollTrigger config              |
| Chapter threshold breakpoints      | `app.js` — the `chapters` array                                 |

---

## State of the build — honest

**Verified in a browser:** asset serving, paper background, Act I composition (typography, chrome, silhouette-on-linen). Screenshot exists.

**Not verified in a browser:** the scroll scrub through acts II / III / popup. The sandbox the initial build was done in blocked the CDN where GSAP was originally loaded from — the discovery of this late in the process is why GSAP got bundled locally. By the time local vendor was wired in, visual verification couldn't be completed from that environment.

The ScrollTrigger config shipped (`pin: '.epic__sticky'`, `end: "+=300%"`, default `pinSpacing`) is the canonical GSAP scrub-with-pin pattern. High confidence it'll run. Eyes-on-browser is on the next person.

**If acts II/III don't scrub on first run, first thing to check:** DevTools console for errors. Second thing: that `app.js` is loading *after* the two vendor files (script tag order in `index.html`). Third thing: `ScrollTrigger.refresh()` after fonts load — already in the code, but verify it runs.

---

## What's placeholder and must be replaced before launch

All copy was written to demonstrate tone, not to ship. Replace:

- Taglines: "We were born to carry" / "What bends must break" / "And from breaking — begin."
- Chapter names: "The Burden" / "Until" / "Beyond"
- Nav items: "Manifesto" / "Product" / "Studio" / "Signal" with their blurbs
- Meta ribbon: "Mythos / №001 · MMXXVI"
- Popup title: "Enter the fracture."
- Alt text on the three `<img>` tags — these were written blind

None of this copy knows what Atlas actually is as a product or brand.

---

## Open questions for product/design

The following came up during the build and were not resolved:

1. **Scroll-jack or auto-play?** Currently scroll-jacked. Auto-play is a ~10-line change.
2. **Narrative order** — currently ascending weight (small sphere → big sphere → fracture). Flip possible if the intended arc is different.
3. **What is Atlas?** Product? Studio? Agency? Personal brand? Without this, copy is mythology-flavored filler.
4. **Nav IA** — is 4 the right number? What are the real sections?
5. **Sound** — a low cello note on the crack plus a soft shimmer on popup reveal would destroy, in a good way. Budget for audio?
6. **Brand voice** — terse/mythological (current) or something lighter?
7. **Mobile behavior** — responsive CSS exists but not tested on device. Scroll-jacking on touch devices often fights the user; may need `ScrollTrigger.normalizeScroll(true)` or a different approach on narrow viewports.
8. **Performance** — act-3.svg is ~500KB (many paths). Consider simplifying or converting to WebP/AVIF with alpha if perf becomes an issue.
9. **Accessibility** — `prefers-reduced-motion` is honored (scrub disabled). But screen-reader journey through the three acts hasn't been audited; the popup dialog needs focus-trap wiring if kept as-is.

---

## Quick sanity checklist for the next dev

- [ ] Unzip, `python3 server.py`, open `http://localhost:8000`
- [ ] Scroll slowly from top to bottom — confirm figure morphs through three acts
- [ ] Confirm popup appears near the end with four nav links
- [ ] Click "skip to nav" — should smooth-scroll to popup
- [ ] Click "rewind the weight" inside popup — should smooth-scroll to top
- [ ] Check DevTools console — should have zero errors
- [ ] Test on actual mobile device — scroll-jack behavior is the biggest unknown here
- [ ] Replace placeholder copy with real brand copy
- [ ] Port `index.html` / `styles.css` / `app.js` / `vendor/` / `images/` into production framework

---

Author notes: if the animation feels too slow or too fast once you see it live, the single best knob is `end: "+=300%"` in `app.js`. Bump to `+=400%` for slower/more luxurious, drop to `+=200%` for snappier. Don't change individual tween durations until the overall tempo feels right.
