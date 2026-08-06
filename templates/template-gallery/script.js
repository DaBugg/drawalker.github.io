(() => {
  const featured = [
    [
      "01 / PRODUCT DEMONSTRATION",
      "SitePilot Operations",
      "Field operations software shown through a role-based dashboard, live workflow, and mobile field state.",
      "Book a product demo",
      "Interactive dashboard",
      "../sitepilot-operations/index.html",
      "sitepilot",
    ],
    [
      "02 / TECHNICAL PROCUREMENT",
      "Forgeworks Industrial",
      "A drawing-to-shipment crate reveal with machining media, process selection, inspection record, and RFQ packaging.",
      "Submit an RFQ",
      "Scroll crate reveal",
      "../forgeworks-industrial/index.html",
      "forge-feature",
    ],
    [
      "03 / FREIGHT + LOGISTICS",
      "FleetAxis Logistics",
      "A video-led quote entry that opens into event-based lane status, handoffs, and shipment control.",
      "Build a freight quote",
      "Video quote + control tower",
      "../fleetaxis-logistics/index.html",
      "fleet-feature",
    ],
    [
      "04 / HOME SERVICES",
      "RapidRoot Home Services",
      "A photo-led path from problem selection through ZIP and requested service time.",
      "Book service",
      "Three-step booking",
      "../rapidroot-home-services/index.html",
      "rapid-feature",
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
  const grid = document.querySelector("[data-grid]");
  view.addEventListener("click", () => {
    const list = grid.classList.toggle("list");
    view.setAttribute("aria-pressed", String(list));
    view.textContent = list ? "Grid view" : "List view";
  });
})();
