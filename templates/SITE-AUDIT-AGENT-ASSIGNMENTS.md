# Website audit and future agent assignments

Audit date: August 5, 2026

This is a read-only design audit. No website implementation was changed during this pass.

## Naming notes

- “FTaxis” appears to mean `fleetaxis-logistics`.
- “Harbor9 development” appears to mean `harborline-development`.
- “RapidRoute” appears to mean `rapidroot-home-services`.
- The EWD demo appears to be `advertising Agency Demo` / LGPR, but there is no literal EWD label in that project.

## Website needs more — dedicated update agent

### 1. Forgeworks Industrial — highest priority

Current strength: a credible technical procurement concept with process selection, material data, traceability, lifecycle, assemblies, and RFQ content.

Why it still needs work: the hero assembly and nearly all manufacturing media are obvious CSS placeholders. The numbered technical sections become repetitive and the overall sequence still exposes the shared landing-page template.

Agent assignment:

- Rebuild the experience around a sticky box or industrial shipping-crate reveal.
- As the user scrolls, open the box/crate and reveal the drawing, raw material, manufactured part, inspection record, and packing label as the chapters of the site.
- Preserve the useful process selector and RFQ flow.
- Replace placeholder blocks with a coherent set of machining, welding, inspection, finished-part, and shipping imagery.
- Provide a static open-box composition on mobile and for reduced motion; do not scroll-lock the page.

Recommended subagent split: asset storyboard and image sourcing/generation; scroll interaction; content pacing and copy.

### 2. FleetAxis Logistics — high priority

Current strength: the route builder, shipment control-tower idea, operations language, and event-based status interface are specific to logistics.

Why it still needs work: the 50/50 hero, simulated map, striped project-cargo block, and later content grids still read like the shared template family. Much of the “media” is labeled placeholder UI.

Agent assignment:

- Use this Mux background in the hero: `https://player.mux.com/5eRgYdkd601spaKT1DOox5NZ00XZ8vuRexBlqwpGY5514`.
- Place a compact high-contrast freight quote card over the video.
- Use muted, looping, inline playback with poster and reduced-motion fallbacks.
- Move the route/status interface into a later control-tower chapter or reveal it after quote input.
- Add one strong project-cargo/jobsite image and, if useful, a port/loading/handoff still.
- Tighten repeated slogan-style copy and reduce the number of equally weighted sections.

Recommended subagent split: Mux/poster/media treatment; layout and interaction refinement.

### 3. RapidRoot Home Services — high priority

Current strength: an issue-first booking widget, ZIP check, clear visit expectations, and sticky mobile Call/Schedule actions.

Why it still needs work: it has no real photography. The hero and service content are dominated by generic cards and striped placeholders, so the friendly brand does not yet feel trustworthy or local.

Agent assignment:

- Make ease and simplicity the governing idea: choose the problem, enter ZIP, request a time.
- Keep one primary Book service action and Call as the urgent secondary option.
- Source 5–7 coherent South Florida residential-service photos: technician arrival, homeowner consultation, plumbing, cooling, electrical, and optionally a clean vehicle/team or floor-protection shot.
- Replace both placeholder visual areas and make the services more image-led.
- Reduce artificial availability/review/card density while retaining pricing-before-work reassurance and mobile conversion actions.

Recommended subagent split: image finding/licensing and placement; conversion-focused simplification.

### 4. Construction / Structure House

Current strength: polished and content-complete, with a local time-lapse hero, portfolio imagery, project types, process, testimonials, FAQ, and inquiry form.

Why it still needs work: it shares the same Manrope type, floating pill navigation, full-screen video hero, rounded cards, word reveal, and motion language as Travel. The two sites feel like siblings with different content.

Agent assignment:

- Move toward a construction-documentation, blueprint, schedule, or project-log experience.
- Use phase/milestone transitions and a photographic construction sequence rather than the generic video-and-cards flow.
- Curate more locally credible project media instead of relying on a generic remote stock portfolio.
- Preserve the strong content, but rebuild the visual grammar and pacing.

### 5. Travel / Off Map Club

Current strength: rich content and functionality, including a hero video, trip cards, filters, trip finder, ticker, testimonial, FAQ, and responsive menu.

Why it still needs work: its navigation, type, motion, card language, and section pacing are extremely close to Construction.

Agent assignment:

- Reframe the site as a trip journal, passport, field guide, or map-based browsing experience.
- Add itinerary/route interaction and use candid group-travel imagery.
- Replace the builder-style pill navigation and rounded-card system with a distinct editorial collage and typography system.
- Preserve trip filtering and finder functionality.

### 6. Drone Demo / AERON

Current strength: strong local drone media, a Mux hero, and an appropriate dark/orange defense-technology direction.

Why it still needs work: the project has no canonical `index.html`, two competing HTML versions, mostly dead `#` links, unused media, and little content beyond the hero, one platform card, metrics, and capability tiles.

Agent assignment:

- Select and create one canonical entry point.
- Use the strongest existing local drone imagery and video.
- Build platform/specification/payload comparison, mission modules, technical diagrams, proof/trust, and a deployment/contact path.
- Replace dead links and establish a distinctive tactical/technical interaction system.

Recommended subagent split: asset/media inventory; diagrams/spec presentation; page architecture and implementation.

## Website needs more — bounded specialist pass

### Harborline Development

The editorial direction, typography, palette, investor positioning, and portfolio pacing are already strong. Assign a media-and-project-story agent, not a full redesign agent.

- Replace the hero, three development, map, and report placeholders with one coherent South Florida architectural image family.
- Make the project/map selector update imagery, stage, strategy, and location—not just two lines of text.
- Tighten broad investment slogans with project-, entitlement-, neighborhood-, and execution-specific language.
- Consider a sticky editorial project index or one flagship project narrative.

### Apexline Commercial

The lifecycle interaction and hard-edged commercial-construction identity are distinctive enough to preserve. Assign a media-only production agent if the goal is a finished public demo.

- Replace the striped hero and lifecycle/project placeholders with authentic commercial MEP imagery.
- Provide consistent media for preconstruction, BIM, prefab, field installation, commissioning, closeout, mechanical room, riser, and rack examples.
- Preserve the six-stage lifecycle, typography, palette, and bid flow.

### Lead Gen Demo / Gatekeeper

The funnel/scoring concept, canvas animation, qualification flow, and booking experience are genuinely unique. It does not need a redesign agent, but it needs a completion/QA agent.

- Replace the VSL and founder-photo placeholders.
- Remove the literal post-booking VSL placeholder.
- Fix subpage links that point to nonexistent `gatekeeper.html` instead of `index.html`.
- Decide whether the simulated schedule/form flow should be connected to a real service.
- Replace generic social links.

### Template Gallery

This is a library/index rather than a client template. Its design is complete; assign only a small integration maintenance pass.

- Remove or restore the broken Palm Coast Clinic entry because the linked project folder is missing.
- Make the featured slide change its preview art/class along with its text and link.
- Update gallery status/preview data after the website redesign agents finish.

## Hold — do not assign yet

### Meridian Advisory

Wait for the promised Meridian prompt. The current editorial consulting direction is already relatively differentiated, but the hero workshop visual and advisor portraits are placeholders. Preserve these notes and scope the site only after the new prompt arrives.

## Website complete — no redesign agent

- `coffee-shop` — bespoke coffee imagery, editorial typography, and commerce/visit framing.
- `SL-Web-Demo` — established commercial-plumbing identity with real visual context.
- `advertising Agency Demo` / LGPR — image-rich editorial PR site; likely the completed EWD demo.
- `stretch-consierge/stretch-concierge-site` — distinctive mobility-care positioning and illustration system.
- `finance` — unique sticky/story-led underwater credit experience.
- `sitepilot-operations` — product-first SaaS interface, role switcher, workflow demonstration, and coherent command-center identity. Avoid generic stock photography.

## Recommended assignment order

1. Forgeworks Industrial
2. FleetAxis Logistics
3. RapidRoot Home Services
4. Construction
5. Travel
6. Drone Demo
7. Harborline Development media/project story
8. Apexline Commercial media production
9. Lead Gen Demo completion/QA
10. Template Gallery integration cleanup after the redesigns land

Meridian remains outside the queue until its prompt is supplied.
