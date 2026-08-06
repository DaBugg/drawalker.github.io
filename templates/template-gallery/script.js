(() => {
  // This collection is the single source of truth for gallery ranking and featured content.
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
        description: "A cinematic technical product experience built around mission modules, telemetry, deployment readiness, and field proof.",
        goal: "Request a technical brief",
        heroType: "Mission telemetry + cinematic media",
        status: "Technical product site",
        previewKey: "aeron-feature",
        imageSrc: "/templates/drone-demo/aeron-drone-hero.png",
        imageWidth: 780,
        imageHeight: 605,
      },
    },
    {
      id: "northstar-credit",
      title: "Northstar Credit",
      href: "/templates/finance/",
      categories: ["software", "consumer"],
      libraryRank: 2,
      featuredRank: 2,
      featured: {
        eyebrow: "02 / INTERACTIVE FINANCIAL EXPERIENCE",
        description: "A deep interactive financial experience with custom media, audience-specific paths, dashboards, and three-dimensional product presentation.",
        goal: "Book a credit review",
        heroType: "Interactive paths + 3D cards",
        status: "Financial platform concept",
        previewKey: "northstar-feature",
        imageSrc: "/templates/finance/assets/meadow-credit-recovery-clean.webp",
        imageWidth: 1738,
        imageHeight: 846,
      },
    },
    {
      id: "forgeworks",
      title: "Forgeworks Industrial",
      href: "/templates/forgeworks-industrial/",
      categories: ["technical"],
      libraryRank: 3,
      featuredRank: 3,
      featured: {
        eyebrow: "03 / INDUSTRIAL PROCUREMENT",
        description: "A conversion-focused industrial buying journey that connects technical storytelling, inspection proof, process selection, and a structured RFQ.",
        goal: "Submit an RFQ",
        heroType: "Scroll crate reveal",
        status: "Industrial buying journey",
        previewKey: "forge-feature",
        imageSrc: "/templates/forgeworks-industrial/preview.svg",
        imageWidth: 1200,
        imageHeight: 750,
      },
    },
    {
      id: "lgpr",
      title: "LGPR",
      href: "/templates/advertising%20Agency%20Demo/",
      categories: ["services", "professional"],
      libraryRank: 4,
      featuredRank: 4,
      featured: {
        eyebrow: "04 / PROFESSIONAL SERVICES PORTFOLIO",
        description: "An image-rich, senior-led agency portfolio built for hospitality, culinary, and lifestyle brands that need credible expertise and editorial range.",
        goal: "Start a conversation",
        heroType: "Image-rich editorial portfolio",
        status: "Professional services site",
        previewKey: "lgpr-feature",
        imageSrc: "/templates/advertising%20Agency%20Demo/images/hospitality.webp",
        imageWidth: 1902,
        imageHeight: 1268,
      },
    },
    {
      id: "off-map-club",
      title: "Off Map Club",
      href: "/templates/travel/",
      categories: ["services", "consumer"],
      libraryRank: 5,
      featuredRank: 5,
      featured: {
        eyebrow: "05 / CONSUMER TRAVEL EXPERIENCE",
        description: "A cinematic small-group travel experience shaped around unexpected routes, candid trip stories, and a clear path from inspiration to discovery.",
        goal: "Find a trip",
        heroType: "Cinematic route story",
        status: "Consumer lifestyle concept",
        previewKey: "off-map-feature",
        imageSrc: "/templates/travel/off-map-feature.png",
        imageWidth: 1276,
        imageHeight: 720,
      },
    },
    { id: "structure-house", title: "Structure House", href: "/templates/construction/", categories: ["technical", "services"], libraryRank: 6, featuredRank: null },
    { id: "fleetaxis", title: "FleetAxis", href: "/templates/fleetaxis-logistics/", categories: ["technical", "services"], libraryRank: 7, featuredRank: null },
    { id: "sitepilot", title: "SitePilot", href: "/templates/sitepilot-operations/", categories: ["software"], libraryRank: 8, featuredRank: null },
    { id: "rapidroot", title: "RapidRoot", href: "/templates/rapidroot-home-services/", categories: ["services", "consumer"], libraryRank: 9, featuredRank: null },
    { id: "sl-plumbing", title: "S&L Plumbing", href: "/templates/SL-Web-Demo/", categories: ["technical", "services"], libraryRank: 10, featuredRank: null },
    { id: "gatekeeper", title: "Gatekeeper", href: "/templates/lead-gen-demo/", categories: ["software", "professional"], libraryRank: 11, featuredRank: null },
    { id: "harborline", title: "Harborline", href: "/templates/harborline-development/", categories: ["professional"], libraryRank: 12, featuredRank: null },
    { id: "apexline", title: "Apexline", href: "/templates/apexline-commercial/", categories: ["technical", "services"], libraryRank: 13, featuredRank: null },
    { id: "daily-pour", title: "The Daily Pour", href: "/templates/coffee-shop/", categories: ["services", "consumer"], libraryRank: 14, featuredRank: null },
    { id: "coastal-stretch", title: "Coastal Stretch", href: "/templates/stretch-consierge/stretch-concierge-site/", categories: ["services", "consumer"], libraryRank: 15, featuredRank: null },
    { id: "meridian", title: "Meridian", href: "/templates/meridian-advisory/", categories: ["professional"], libraryRank: 16, featuredRank: null },
  ];

  const library = [...concepts].sort((a, b) => a.libraryRank - b.libraryRank);
  const featured = concepts
    .filter((concept) => concept.featuredRank !== null)
    .sort((a, b) => a.featuredRank - b.featuredRank);
  const grid = document.querySelector("[data-grid]");

  library.forEach((concept) => {
    const card = grid.querySelector(`[data-concept-id="${concept.id}"]`);
    if (!card) return;

    card.dataset.category = concept.categories.join(" ");
    const link = card.querySelector("a");
    link.href = concept.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    grid.append(card);
  });

  let featuredIndex = 0;

  function renderFeatured() {
    const concept = featured[featuredIndex];
    const data = concept.featured;
    const preview = document.querySelector("[data-feature-preview]");
    const image = document.querySelector("[data-feature-image]");
    const link = document.querySelector("[data-feature-link]");

    document.querySelector("[data-feature-index]").textContent = data.eyebrow;
    document.querySelector("[data-feature-title]").textContent = concept.title;
    document.querySelector("[data-feature-desc]").textContent = data.description;
    document.querySelector("[data-feature-goal]").textContent = data.goal;
    document.querySelector("[data-feature-hero]").textContent = data.heroType;
    document.querySelector("[data-feature-status]").textContent = data.status;

    preview.className = `featured-preview ${data.previewKey}`;
    image.src = data.imageSrc;
    image.width = data.imageWidth;
    image.height = data.imageHeight;
    image.alt = "";
    link.href = concept.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  document.querySelector("[data-feature=prev]").addEventListener("click", () => {
    featuredIndex = (featuredIndex + featured.length - 1) % featured.length;
    renderFeatured();
  });

  document.querySelector("[data-feature=next]").addEventListener("click", () => {
    featuredIndex = (featuredIndex + 1) % featured.length;
    renderFeatured();
  });

  const cards = library
    .map((concept) => grid.querySelector(`[data-concept-id="${concept.id}"]`))
    .filter(Boolean);
  const filters = [...document.querySelectorAll("[data-filter]")];
  const status = document.querySelector("[data-library-status]");

  document.querySelectorAll("[data-concept-count]").forEach((element) => {
    element.textContent = String(cards.length).padStart(2, "0");
  });

  filters.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    button.addEventListener("click", () => {
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      let visibleCount = 0;
      cards.forEach((card) => {
        const categories = card.dataset.category.split(" ");
        const visible = button.dataset.filter === "all" || categories.includes(button.dataset.filter);
        card.classList.toggle("hidden", !visible);
        if (visible) visibleCount += 1;
      });

      status.textContent = button.dataset.filter === "all"
        ? `Showing all ${cards.length} concepts`
        : `Showing ${visibleCount} ${button.textContent.trim().toLowerCase()} concepts`;
    });
  });

  status.textContent = `Showing all ${cards.length} concepts`;

  const view = document.querySelector("[data-view]");
  view.addEventListener("click", () => {
    const list = grid.classList.toggle("list");
    view.setAttribute("aria-pressed", String(list));
    view.textContent = list ? "Grid view" : "List view";
  });

  renderFeatured();
})();
