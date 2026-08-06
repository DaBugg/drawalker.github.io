(() => {
  const featured = [
    [
      "01 / COFFEE + HOSPITALITY",
      "The Daily Pour",
      "A warm neighborhood coffee experience combining seasonal drinks, menu discovery, online ordering, and a clear visit guide.",
      "Order ahead",
      "Editorial café story",
      "/templates/coffee-shop/",
      "daily-feature",
    ],
    [
      "02 / FREIGHT + LOGISTICS",
      "FleetAxis Logistics",
      "A freight experience that moves from a clear lane quote into shipment status, handoffs, and operational visibility.",
      "Build a freight quote",
      "Quote entry + control tower",
      "/templates/fleetaxis-logistics/",
      "fleet-feature",
    ],
    [
      "03 / SMALL-GROUP TRAVEL",
      "Off Map Club",
      "A cinematic travel experience organized around unexpected routes, candid trip stories, and a direct path to the right departure.",
      "Find a trip",
      "Route-led trip discovery",
      "/templates/travel/",
      "offmap-feature",
    ],
    [
      "04 / AUTONOMOUS AERIAL SYSTEMS",
      "AERON",
      "A technical product experience built around mission modules, telemetry, deployment readiness, and field proof.",
      "Request a technical brief",
      "Mission telemetry",
      "/templates/drone-demo/",
      "aeron-feature",
    ],
    [
      "05 / CREDIT + FINANCIAL GUIDANCE",
      "Northstar Credit",
      "An interactive financial experience that separates personal, business, and advisory needs into clear next steps.",
      "Book a credit review",
      "Interactive path selector",
      "/templates/finance/",
      "northstar-feature",
    ],
  ];

  let featuredIndex = 0;

  function renderFeatured() {
    const data = featured[featuredIndex];
    ["index", "title", "desc", "goal", "hero"].forEach((key, index) => {
      document.querySelector(`[data-feature-${key}]`).textContent = data[index];
    });
    document.querySelector("[data-feature-link]").href = data[5];
    document.querySelector(".featured-preview").className = `featured-preview ${data[6]}`;
  }

  document.querySelector("[data-feature=prev]").addEventListener("click", () => {
    featuredIndex = (featuredIndex + featured.length - 1) % featured.length;
    renderFeatured();
  });

  document.querySelector("[data-feature=next]").addEventListener("click", () => {
    featuredIndex = (featuredIndex + 1) % featured.length;
    renderFeatured();
  });

  const grid = document.querySelector("[data-grid]");
  const originalOrder = [
    "forgeworks",
    "apexline",
    "harborline",
    "meridian",
    "rapidroot",
    "fleetaxis",
    "daily-pour",
    "lgpr",
    "sitepilot",
    "sl-plumbing",
    "structure-house",
    "aeron",
    "northstar-credit",
    "gatekeeper",
    "coastal-stretch",
    "off-map-club",
  ];

  originalOrder.forEach((id) => {
    const card = grid.querySelector(`[data-concept-id="${id}"]`);
    if (card) grid.append(card);
  });

  const cards = [...document.querySelectorAll(".concept")];
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
})();
