# ATLAS — landing page (v0.1)

A scroll-driven cinematic landing page in three acts:

1. **The Burden** — Atlas kneels under the sphere.
2. **Until** — the sphere swells, pressure builds, screen trembles.
3. **Beyond** — the sphere cracks, golden light bursts through the fissures, and a navigation popup emerges as four points of light.

Built with plain HTML / CSS / vanilla JS + GSAP (loaded from CDN). No build step. Designed to be ported into Next.js / Astro / Remix / Vite / whatever once the visual language is locked.

---

## Run it

```bash
python3 server.py            # http://localhost:8000
python3 server.py 3000       # custom port
```

No dependencies — just Python 3.

### Node alternative (if you prefer)

```bash
npx serve public -p 8000
# or
npx http-server public -p 8000 -c-1
```

---

## Structure

```
atlas-site/
├── server.py                 # zero-dep Python dev server
├── README.md
└── public/                   # everything the browser sees — port this folder
    ├── index.html
    ├── styles.css
    ├── app.js
    └── images/
        ├── act-1.svg         # smaller sphere — the initial burden
        ├── act-2.svg         # massive sphere — the breaking point
        └── act-3.svg         # cracked sphere — the fracture (four impact points)
```

---

## How the animation works

- `.epic` is **400vh** tall; `.epic__sticky` pins for its entire height.
- A single GSAP timeline `tl` runs from `0 → 1`, scrubbed by scroll via `ScrollTrigger`.
- Timeline milestones (see `app.js`):
  - `0.00–0.40` act I → II cross-fade
  - `0.40–0.60` pressure dwell on act II (scale + micro-jitter + vignette)
  - `0.60–0.75` the crack: flash + golden burst reveal + act III enters
  - `0.82–1.00` popup frame scales in, nav nodes stagger in
- The **golden burst** under act III is a CSS radial gradient behind the SVG. `mix-blend-mode: multiply` on the image lets the white cracks in the SVG pass the gold through, so the cracks literally *become* light.
- The chapter indicator in the bottom chrome and the progress bar are both driven by `onUpdate` in the timeline.

### Knobs you'll likely want to tune

| What | Where |
|---|---|
| Chapter copy | `public/index.html` — `.copy__line` blocks |
| Brand + tagline in chrome | `public/index.html` — `.chrome__mark`, `.chrome__meta` |
| Nav items | `public/index.html` — `.popup__nav` (4× `.node`) |
| Colors (paper, ink, gold, crimson) | `public/styles.css` — `:root` variables |
| Fonts | `public/index.html` `<link>` + `:root --serif/--mono` |
| Act durations / timing | `public/app.js` — timeline positions |
| Pin length (how long the cinematic holds) | `.epic { height: 400vh }` in `styles.css` |

---

## Porting to a framework

Everything interesting is static. The fastest paths:

- **Next.js / Astro / Remix**: drop `public/images/` into the framework's `public/` dir. Move markup into a page component. Load GSAP via `<Script>` or an `import` (`npm i gsap`). Put `app.js` logic in a client component that runs on mount.
- **Vite + React / Vue / Svelte**: `npm create vite@latest`, copy `images/` to `public/`, adapt the markup to components, `npm i gsap` and import `ScrollTrigger` directly.

The CSS is framework-agnostic — it'll work as a plain stylesheet or a CSS module unchanged.

---

## Known open questions (flag in chat and I'll change)

- Scroll-jack vs auto-play: currently scroll-driven. If you want it to *auto-play* on load without scroll, say the word — it's a 10-line change in `app.js`.
- Narrative order: I chose small-sphere → big-sphere → fracture (ascending weight). Swap if you want a different arc.
- Nav copy (Manifesto / Product / Studio / Signal) is placeholder — replace with your actual sections.
- No sound yet. A single low cello note on the crack + a soft shimmer on the popup reveal would destroy (in a good way).
