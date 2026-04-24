# Networks & Nodes Website Media Update — Agent Hand-Off

## Project

Networks & Nodes portfolio website

## Goal

Update the Services and Work media system so the site uses a consistent card media pattern for images, Mux thumbnails, and click-to-play Mux videos.

The Work section should remain focused on real case studies. The Services section should use selected Mux videos only where they accurately demonstrate the service being sold.

---

# 1. Current State

The current site is a React-in-HTML implementation inside `index.html` using React 18 and Babel in the browser.

The relevant components are:

* `WorkSection`
* `ServicesSection`
* `WORK_PRODUCT_CARDS`
* `SERVICES_WEB`
* `SERVICES_INFRA`
* `renderCard`

Current issue:

* Work cards already use real case-study image paths such as:

  * `images/case-tsandl.webp`
  * `images/case-codelink.webp`
  * `images/case-redeemedhands.webp`
* Services cards are still placeholders because each service object uses:

  * `mediaSrc: null`
  * `mediaType: 'image'`
* The current `renderCard` logic only supports local image/video URLs and placeholder rendering.
* The site needs a reusable `CardMedia` component that supports:

  * static images
  * Mux video thumbnails
  * click-to-play Mux iframe embeds
  * optional Mux animated GIF previews

---

# 2. Content Decision: What To Do With The Existing Mux Videos

## Use these now

### Service: Portfolio Sites

Use Mux Section 1.

Playback ID:

```txt
bMQF1EKQLcPVHg35lmtN02KueliX4m9PmAGE4NCAk2uM
```

Reason:
This video best matches a visual portfolio/studio-style website. It fits the Portfolio Sites service well enough to use now.

### Service: Small-Business Web Presence

Use Mux Section 5.

Playback ID:

```txt
00w302YUzDdVCVmb3RYncHB201Esego5J4Om1YlANIcseo
```

Reason:
This video best matches a conversion-oriented launch page or small-business site. It fits the Small-Business Web Presence service.

---

## Do not use these right now

### Section 2

Playback ID:

```txt
FghhBbV00fPiIiubZGEC00vCec02LmQdg00fZy9NVX00MnA8
```

Decision:
Do not use in the current Services cards unless a later “Templates / Starting Points” section is added.

### Section 3

Playback ID:

```txt
8jivLSnoyaDu01mP02iAX1elHaO026zrQ0200pvjGoIeN4mU
```

Decision:
Do not use in the current Services cards. It reads more like a case-study/template layout than a service outcome.

### Section 4

Playback ID:

```txt
EbDl00U8531qaMnSoynVZI01V02ydAyIqeHzGKVlqn1s4U
```

Decision:
Optional, but hold for now. It could support brand/gallery-style portfolio work, but Section 1 is the cleaner match for Portfolio Sites.

---

# 3. Should The Videos Be Redesigned?

## Direct answer

Use Section 1 and Section 5 now. Redesign or replace the rest.

## Longer-term direction

The current Mux videos are acceptable as service previews, but they still feel like template demos. They should eventually be redesigned to feel more custom to Networks & Nodes.

The redesigned media should follow this rule:

* Services media should show what the service produces.
* Work media should show what was actually built.
* Infrastructure media should not pretend to be a website mockup if the work is really systems, networking, automation, or architecture.

## Recommended future redesigns

### Portfolio Sites

Create a 10–15 second scroll capture of a refined artist/photographer portfolio demo.

Visual style:

* quiet motion
* large image-led layout
* minimal type
* high-end editorial feeling
* dark/gold Networks & Nodes visual tone

### Small-Business Web Presence

Create a 10–15 second scroll capture of a service-business landing page.

Visual style:

* hero section
* services cards
* testimonials/trust section
* contact CTA
* mobile-friendly preview

### SEO & Content Strategy

Do not use a template website video.

Use one of these instead:

* analytics dashboard graphic
* keyword/content map graphic
* search visibility growth chart
* typography card using an outcome quote

Suggested asset path:

```txt
images/service-seo-dashboard.webp
```

### Network Architecture & Secure Systems Design

Use a system/network diagram.

Suggested asset path:

```txt
images/service-network-topology.svg
```

### Custom Automation & Workflow Tooling

Use a workflow diagram or short screen capture of automation running.

Suggested asset path:

```txt
images/service-automation-flow.svg
```

### AI & Infrastructure Consulting

Use a before/after systems map or AI workflow architecture graphic.

Suggested asset path:

```txt
images/service-ai-infra-map.svg
```

---

# 4. Implementation Plan

## Step 1 — Add a reusable `CardMedia` component

Place this component above `ServicesSection` in `index.html`.

Important correction:
Do not use `if (!media || !media.src)` as the only guard. Mux media objects use `playbackId`, not `src`. The guard must allow either `media.src` or `media.playbackId`.

```jsx
function CardMedia({ media, placeholder = 'Image or video' }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const hasMedia = media && (media.src || media.playbackId);

  if (!hasMedia) {
    return <div className="pf-service-card__media-placeholder">{placeholder}</div>;
  }

  if (media.type === 'image') {
    return (
      <img
        src={media.src}
        alt={media.alt || ''}
        loading="lazy"
      />
    );
  }

  if (media.type === 'mux-gif') {
    return (
      <img
        src={`https://image.mux.com/${media.playbackId}/animated.gif?width=640&fps=8`}
        alt={media.alt || ''}
        loading="lazy"
      />
    );
  }

  if (media.type === 'mux-video') {
    if (!isPlaying) {
      return (
        <button
          type="button"
          className="pf-service-card__media-playtrigger"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play ${media.alt || 'video preview'}`}
        >
          <img
            src={`https://image.mux.com/${media.playbackId}/thumbnail.webp?time=2&width=1280&height=720&fit_mode=smartcrop`}
            alt={media.alt || ''}
            loading="lazy"
          />
          <span className="pf-service-card__play-icon" aria-hidden="true">
            <span />
          </span>
        </button>
      );
    }

    return (
      <iframe
        src={`https://player.mux.com/${media.playbackId}?autoplay=true`}
        title={media.alt || 'Video preview'}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
      />
    );
  }

  return <div className="pf-service-card__media-placeholder">{placeholder}</div>;
}
```

---

## Step 2 — Add CSS for the clickable thumbnail state

Add this CSS near the existing `.pf-service-card__media` styles.

```css
.pf-service-card__media-playtrigger {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  display: block;
  overflow: hidden;
}

.pf-service-card__media-playtrigger img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.28s ease, filter 0.28s ease;
}

.pf-service-card__media-playtrigger:hover img {
  transform: scale(1.035);
  filter: brightness(0.82);
}

.pf-service-card__media-playtrigger:focus-visible {
  outline: 2px solid rgba(201, 174, 122, 0.75);
  outline-offset: -3px;
}

.pf-service-card__play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  background: rgba(11, 18, 32, 0.82);
  border: 1px solid rgba(201, 174, 122, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

.pf-service-card__play-icon span {
  width: 0;
  height: 0;
  margin-left: 0.2rem;
  border-top: 0.52rem solid transparent;
  border-bottom: 0.52rem solid transparent;
  border-left: 0.85rem solid #c9ae7a;
}
```

---

## Step 3 — Replace the media render logic inside `renderCard`

Find the current media block inside `renderCard`:

```jsx
<div className="pf-service-card__media">
  {s.mediaSrc && s.mediaType === 'video' ? (
    <video src={s.mediaSrc} controls playsInline preload="metadata" />
  ) : s.mediaSrc ? (
    <img src={s.mediaSrc} alt="" loading="lazy" />
  ) : (
    <div className="pf-service-card__media-placeholder">Image or video</div>
  )}
</div>
```

Replace it with:

```jsx
<div className="pf-service-card__media">
  <CardMedia media={s.media} />
</div>
```

---

# 5. Update Services Data

Replace `mediaSrc` and `mediaType` inside the service objects with a new `media` object.

## `SERVICES_WEB`

Use this structure:

```jsx
const SERVICES_WEB = [
  {
    title: 'Portfolio Sites',
    headline: 'Launching a new body of work, or finally retiring the portfolio you\'ve been apologizing for.',
    body: 'A portfolio site should get out of the way of the work. That means fast loading even on images-heavy pages, type that reads well next to photographs or artworks, inquiry flows that feel respectful rather than pushy, and mobile layouts where the work still leads. I build from scratch or redesign an existing site, and I handle hosting, deployment, and SEO fundamentals so the site keeps working after launch without constant attention.',
    deliverables: 'A fully designed, built, and deployed portfolio site with the pages you actually need. Performance optimization, mobile-first responsive layout, basic SEO and Open Graph setup, and a simple CMS or file-based content structure you can update without calling me every time.',
    engagement: 'Typically four to eight weeks from first conversation to launch.',
    investment: 'Projects typically begin at $3,500.',
    media: {
      type: 'mux-video',
      playbackId: 'bMQF1EKQLcPVHg35lmtN02KueliX4m9PmAGE4NCAk2uM',
      alt: 'Portfolio website preview',
    },
  },
  {
    title: 'Small-Business Web Presence',
    headline: 'Replacing a website that\'s been costing you leads instead of earning them.',
    body: 'Most small-business sites are either inherited and never updated or built from templates that aged badly. A rebuild or refresh done well should lift inbound inquiries, rank better for the searches your customers actually use, and give you a site you are happy to share.',
    deliverables: 'A rebuilt or refreshed site with clear service descriptions, working contact flows, trust signals, analytics setup, and SEO fundamentals tuned to your local market or niche. Includes deployment guidance and handoff documentation.',
    engagement: 'Typically three to six weeks for a refresh, five to ten for a full rebuild.',
    investment: 'Refreshes typically begin at $2,800. Full rebuilds typically begin at $5,500.',
    media: {
      type: 'mux-video',
      playbackId: '00w302YUzDdVCVmb3RYncHB201Esego5J4Om1YlANIcseo',
      alt: 'Small business website preview',
    },
  },
  {
    title: 'SEO & Content Strategy',
    headline: 'Getting found by the right people, without promises of magic rankings.',
    body: 'Technical SEO is the foundation, but it only works if the content answers questions your audience is searching for. I handle both sides: audit, implementation of technical fixes, and practical content strategy.',
    deliverables: 'A written audit identifying technical, structural, and content issues; implementation of technical fixes; and a keyword/content strategy document for your team or me to execute against.',
    engagement: 'Audits typically take two to three weeks. Implementation adds another three to six weeks.',
    investment: 'Audits typically begin at $1,800. Ongoing engagements are typically $1,500-$3,500 per month.',
    media: {
      type: 'image',
      src: 'images/service-seo-dashboard.webp',
      alt: 'SEO dashboard and content strategy preview',
    },
  },
];
```

---

## `SERVICES_INFRA`

Use this structure:

```jsx
const SERVICES_INFRA = [
  {
    title: 'Network Architecture & Secure Systems Design',
    headline: 'Designing a network that\'s secure, segmented, and documented well enough that the next engineer can take it over.',
    body: 'For teams that have outgrown consumer-grade networking or need to handle sensitive data without cutting corners, this engagement yields a fit-for-purpose design, documentation that survives handoff, and deployment using hardened baselines rather than vendor defaults.',
    deliverables: 'Network design documentation, router/switch/firewall configuration, site-to-site VPN setup where needed, monitoring and logging setup, and usable handoff documentation.',
    engagement: 'Single-site work is often two to four weeks; multi-site deployments can run six to twelve weeks.',
    investment: 'Starts at $4,500 for single-site engagements. Multi-site scopes are estimated individually.',
    media: {
      type: 'image',
      src: 'images/service-network-topology.svg',
      alt: 'Secure network architecture diagram',
    },
  },
  {
    title: 'Custom Automation & Workflow Tooling',
    headline: 'Building the quiet scripts that save your team ten hours a week.',
    body: 'Most operational pain in growing businesses is repetitive manual work. Custom automations, integrations, and workflow tooling create measurable leverage by removing bottlenecks across systems your team already uses.',
    deliverables: 'Scoped automation or integration delivered as deployable code, plus documentation, runbook support, and monitoring hooks.',
    engagement: 'Small automations usually ship in one to two weeks; larger integrations run two to six weeks.',
    investment: 'Small automations typically begin at $1,200. Larger tools scale with scope.',
    media: {
      type: 'image',
      src: 'images/service-automation-flow.svg',
      alt: 'Automation workflow diagram',
    },
  },
  {
    title: 'AI & Infrastructure Consulting',
    headline: 'Figuring out what AI should and should not do in your existing operations, and integrating it responsibly when it should.',
    body: 'Useful AI integration is not hype. It is clear evaluation of what helps now, what should wait, and how to implement without creating dependencies your team cannot inspect or maintain.',
    deliverables: 'A written readiness assessment, proof-of-concept implementation for approved integrations, and team-facing documentation/training.',
    engagement: 'Readiness assessments typically run two to three weeks. Implementation adds three to eight weeks.',
    investment: 'Assessments typically begin at $2,500. Implementation scales by scope.',
    media: {
      type: 'image',
      src: 'images/service-ai-infra-map.svg',
      alt: 'AI infrastructure consulting diagram',
    },
  },
];
```

---

# 6. Work Section Guidance

Do not put the five template Mux videos in `WORK_PRODUCT_CARDS`.

The Work section is now positioned as real case studies. Keep it that way.

Current Work cards should continue using real project media:

```txt
images/case-tsandl.webp
images/case-codelink.webp
images/case-redeemedhands.webp
```

Optional future improvement:
Convert Work media to use the same `CardMedia` component, but only if real case-study videos are added later.

Example future Work media shape:

```jsx
media: {
  type: 'image',
  src: 'images/case-tsandl.webp',
  alt: 'Transportation Solutions & Lighting case study preview',
}
```

Then render it with:

```jsx
<CardMedia media={card.media} placeholder="Case study media" />
```

Do not use unrelated template footage for TSANDL, CodeLink, or Redeemed Hands.

---

# 7. Asset Checklist

Create or confirm these files exist:

```txt
images/service-seo-dashboard.webp
images/service-network-topology.svg
images/service-automation-flow.svg
images/service-ai-infra-map.svg
```

If these assets do not exist yet, keep the placeholder visible or create quick temporary typography/diagram cards.

Suggested temporary placeholders:

* SEO: dark dashboard mockup with “Search visibility / Content map / Technical fixes”
* Network Architecture: simple topology with router, switch, firewall, cloud, and client nodes
* Automation: flow from logs → parser → trigger → ZOHO FSM/service order
* AI Consulting: workflow map from messy operations → assessment → proof of concept → documented system

---

# 8. Acceptance Criteria

The implementation is complete when:

1. Services cards no longer show “Image or video” for Portfolio Sites and Small-Business Web Presence.
2. Portfolio Sites uses Mux playback ID:
   `bMQF1EKQLcPVHg35lmtN02KueliX4m9PmAGE4NCAk2uM`
3. Small-Business Web Presence uses Mux playback ID:
   `00w302YUzDdVCVmb3RYncHB201Esego5J4Om1YlANIcseo`
4. Mux videos render as thumbnails first, not full iframes on page load.
5. Clicking a thumbnail swaps it into the Mux iframe player and autoplays.
6. The play overlay is visible and keyboard-focusable.
7. SEO, Network Architecture, Automation, and AI Consulting use static images or placeholders until final assets exist.
8. Work section still uses real case-study media, not the service/template Mux videos.
9. Desktop horizontal service rails still work.
10. Mobile stacked service cards still work.
11. No console errors are introduced.
12. Page performance does not load multiple Mux iframes before user interaction.

---

# 9. QA Notes

Test these viewport sizes:

* 390px wide mobile
* 768px tablet
* 1440px desktop

Test these interactions:

* Navigate from hero to section grid
* Open Services
* Scroll both service rails
* Click Mux thumbnail
* Confirm video loads only after click
* Navigate away and back
* Confirm placeholders/static images do not break layout
* Keyboard tab to the play button
* Use Enter/Space to activate the video if browser behavior supports it

---

# 10. Final Direction

Use two existing Mux videos now:

* Section 1 for Portfolio Sites
* Section 5 for Small-Business Web Presence

Do not force the remaining three videos into the Services section. They are not bad, but they do not map cleanly to the current service strategy.

Redesign the remaining service visuals as diagrams or actual product/workflow assets. That will make the site feel more mature, more technical, and more credible than using six generic website previews.
