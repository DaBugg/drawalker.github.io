import "../js/form-security.js";
import "../js/in-page-navigation.js";
import {
  createProjectReviewAnalytics,
  initializeProjectReviewCtaTracking,
} from "./analytics.mjs";
import { initializeContactForm } from "./contact-form.mjs";
import { initializeMediaCarousel } from "./media-carousel.mjs";
import { initializeSwitchboardEmbed } from "./switchboard-embed.mjs";

function splitRevealText(element) {
  if (element.dataset.revealPrepared === "true") return;

  const label = element.textContent.trim().replace(/\s+/g, " ");
  const words = label.split(" ");
  element.textContent = "";
  element.setAttribute("aria-label", label);
  element.dataset.revealPrepared = "true";

  words.forEach((word, index) => {
    const mask = document.createElement("span");
    const text = document.createElement("span");
    mask.className = "reveal-word";
    text.className = "reveal-word-inner";
    text.textContent = word;
    text.setAttribute("aria-hidden", "true");
    text.style.setProperty("--word-index", String(index));
    mask.append(text);
    element.append(mask);

    if (index < words.length - 1) element.append(document.createTextNode(" "));
  });
}

function initializeScrollReveals() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const textTargets = document.querySelectorAll(
    ".capability-heading h2, .work-heading h2, .process-heading h2, .contact h2",
  );

  textTargets.forEach((element) => {
    element.dataset.reveal = "words";
    splitRevealText(element);
  });

  const revealGroups = [
    [".capability-heading > p, .work-heading > p, .process-heading > p", 0],
    [".project", 0],
    [".process-rail li", 75],
    [".about-label, .about blockquote, .about-copy", 90],
    [".contact-intro, .contact-form-shell", 110],
  ];

  revealGroups.forEach(([selector, stagger]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.reveal = "rise";
      element.style.setProperty("--reveal-delay", `${index * stagger}ms`);
    });
  });

  const targets = [...document.querySelectorAll("[data-reveal]")];
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("is-in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in-view");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.12 },
  );

  targets.forEach((element) => observer.observe(element));
  // Only enable the hidden pre-reveal state after every target is observed.
  // If the observer stops delivering callbacks, the watchdog restores all
  // content instead of leaving essential copy invisible.
  document.documentElement.classList.add("motion-ready");
  window.setTimeout(() => {
    targets.forEach((element) => element.classList.add("is-in-view"));
  }, 2500);
}

function initializeScrollProgress() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);

  let ticking = false;
  const update = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const amount = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
    progress.style.transform = `scaleX(${amount})`;
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}

function initializeMobileMenu() {
  const menu = document.querySelector(".mobile-menu");
  if (!menu) return;

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.removeAttribute("open");
    });
  });
}

function initializeHomepageFeature(label, initializer) {
  try {
    return initializer();
  } catch (error) {
    console.error(`[homepage] ${label} initialization failed`, error);
    return null;
  }
}

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

initializeHomepageFeature("media carousel", () => initializeMediaCarousel());
initializeHomepageFeature("switchboard embed", () => initializeSwitchboardEmbed());
initializeHomepageFeature("mobile menu", () => initializeMobileMenu());
const projectReviewAnalytics = initializeHomepageFeature(
  "project-review analytics",
  () => createProjectReviewAnalytics(),
);
initializeHomepageFeature(
  "project-review CTA tracking",
  () => initializeProjectReviewCtaTracking({ analytics: projectReviewAnalytics || undefined }),
);
initializeHomepageFeature(
  "contact form",
  () => initializeContactForm({ analytics: projectReviewAnalytics || undefined }),
);
initializeHomepageFeature("scroll reveals", () => initializeScrollReveals());
initializeHomepageFeature("scroll progress", () => initializeScrollProgress());
