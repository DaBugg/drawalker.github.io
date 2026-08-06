# Templates Page Agent Schema

## Purpose

Use this specification when an agent edits the Networks & Nodes website concept library.

- Production source: `/Users/dw/Documents/GitHub/drawalker.github.io`
- Gallery source: `templates/index.html`
- Public gallery URL: `https://www.networksandnodes.org/templates/`
- SEO launch guide: `templates/SEO-IMPROVEMENT-PLAN.md`

The gallery is an indexable Networks & Nodes portfolio collection. The individual websites are fictional demonstrations and must remain excluded from search until the Phase 5 verification and launch gate is complete.

## Canonical concept schema

Keep one canonical concept collection. Derive the featured rotation and complete library from it rather than maintaining conflicting arrays.

```js
const concepts = [
  {
    id: "aeron",
    title: "AERON",
    href: "/templates/drone-demo/",
    categories: ["technical"],
    libraryRank: 1,
    featuredRank: 1,
    featured: {
      eyebrow: "01 / AUTONOMOUS AERIAL SYSTEMS",
      description:
        "A cinematic technical product experience built around mission modules, telemetry, deployment readiness, and field proof.",
      goal: "Request a technical brief",
      heroType: "Mission telemetry + cinematic media",
      status: "Technical product site",
      previewKey: "aeron-feature"
    }
  }
];
```

Rules:

- `id` is stable and unique.
- `href` preserves the existing route exactly.
- `categories` preserves the current filters.
- `libraryRank` controls grid and list order.
- `featuredRank` is `1` through `5` for featured entries and `null` otherwise.
- `featured` is required only for featured entries.
- Filtering preserves relative `libraryRank` order.
- Do not duplicate titles, URLs, or ranks in separate hard-coded collections.

## Required order

| Rank | ID | Display name | Featured |
|---:|---|---|---:|
| 1 | `aeron` | AERON | 1 |
| 2 | `northstar-credit` | Northstar Credit | 2 |
| 3 | `forgeworks` | Forgeworks Industrial | 3 |
| 4 | `lgpr` | LGPR | 4 |
| 5 | `off-map-club` | Off Map Club | 5 |
| 6 | `structure-house` | Structure House | — |
| 7 | `fleetaxis` | FleetAxis | — |
| 8 | `sitepilot` | SitePilot | — |
| 9 | `rapidroot` | RapidRoot | — |
| 10 | `sl-plumbing` | S&L Plumbing | — |
| 11 | `gatekeeper` | Gatekeeper | — |
| 12 | `harborline` | Harborline | — |
| 13 | `apexline` | Apexline | — |
| 14 | `daily-pour` | The Daily Pour | — |
| 15 | `coastal-stretch` | Coastal Stretch | — |
| 16 | `meridian` | Meridian | — |

## Navigation contract

Every link from the gallery to a concept opens the concept in a new tab:

```html
<a href="/templates/drone-demo/" target="_blank" rel="noopener noreferrer">
  Open concept
</a>
```

This applies to featured links, complete-library cards, images, titles, and concept CTAs. Filters, gallery navigation, legal links, and the project-review CTA remain in the current tab.

Every HTML page inside every concept must include exactly one visible, keyboard-accessible return element:

```html
<a href="https://www.networksandnodes.org/">
  ← Website demonstration by Networks & Nodes
</a>
```

The return element must:

- navigate the current concept tab;
- remain usable on desktop and mobile;
- have a visible focus state;
- avoid covering navigation, forms, and important content;
- not be duplicated when an equivalent element already exists.

## Gallery SEO contract

Use one indexable, self-canonical gallery page:

```html
<title>Website Design Concepts by Industry | Networks & Nodes</title>
<meta name="description" content="Explore website design concepts for technical, service, professional, software, and consumer businesses, built around real buying journeys and conversion goals.">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="https://www.networksandnodes.org/templates/">
```

The gallery must:

- appear in `sitemap.xml`;
- be linked from the main site navigation and footer;
- include Open Graph and Twitter card metadata;
- contain a `CollectionPage`, ordered 16-item `ItemList`, and `BreadcrumbList` JSON-LD graph;
- describe entries as website concepts, not operating businesses or verified outcomes.

Approved visible positioning:

- Label: `WEBSITE DESIGN CONCEPT LIBRARY / 2026`
- H1: `Website concepts designed around how different customers buy.`
- Featured label: `01 / FEATURED WEBSITE CONCEPTS`
- Library label: `02 / COMPLETE WEBSITE CONCEPT LIBRARY`
- Library H2: `Browse website concepts by industry and buying context.`
- Customization label: `03 / CUSTOM WEBSITE DESIGN AND IMPLEMENTATION`

Use industry language naturally in the introductory paragraph. Do not keyword-stuff headings, card descriptions, or alternative text.

## Concept-page SEO contract

Every concept page, including secondary pages, must use:

```html
<meta name="robots" content="noindex, nofollow, max-image-preview:large">
```

Individual concepts must not appear in `sitemap.xml`. Do not publish fictional `Organization`, `LocalBusiness`, `Product`, `Service`, `Review`, `AggregateRating`, pricing, availability, FAQ, or service-area structured data.

Titles and descriptions should identify the page accurately as a website design concept and name Networks & Nodes where natural. Do not present fictional companies, locations, people, projects, ratings, metrics, testimonials, credentials, or product capabilities as verified facts. Label illustrative proof and demonstrations visibly.

Do not make an individual concept indexable until the identity, services, locations, people, claims, media, policies, and conversion systems have been replaced, verified, reviewed, and approved under `SEO-IMPROVEMENT-PLAN.md`.

## Preserve behavior

Do not break:

- category filters;
- grid/list toggle;
- visible result count and accessible status message;
- five-entry featured previous/next controls and wrapping;
- existing concept routes;
- responsive behavior, keyboard navigation, visible focus states, and reduced-motion handling.

## Verification checklist

Before handoff:

1. Confirm all 16 concepts appear exactly once in the required order.
2. Confirm all featured metadata and links stay synchronized.
3. Confirm every gallery-to-concept link has `target="_blank"` and `rel="noopener noreferrer"`.
4. Confirm every concept HTML page has exactly one current-tab return element.
5. Confirm the gallery is the only template URL in the sitemap.
6. Confirm every concept page has `noindex, nofollow` and no fictional structured data.
7. Validate JSON-LD, internal links, local assets, keyboard behavior, responsive layouts, and the production build.
8. Run `npm test` and resolve failures that belong to the current change; do not overwrite unrelated concurrent work.
