import "../js/form-security.js";
import "../js/in-page-navigation.js";
import {
  createProjectReviewAnalytics,
  initializeProjectReviewCtaTracking,
} from "./analytics.mjs";
import { initializeContactForm } from "./contact-form.mjs";
import { initializeSwitchboardEmbed } from "./switchboard-embed.mjs";

const videos = [
  {
    playbackId: "Rgqqh00rKkzeGpQYUe00QDb7Tqtnfnhd6B016z44NacQzc",
    poster: "https://image.mux.com/Rgqqh00rKkzeGpQYUe00QDb7Tqtnfnhd6B016z44NacQzc/thumbnail.webp?width=1200&time=0",
    posterHeight: 900,
    label: "Immersive experiences",
    caption: "Movie-quality websites that draw customers in and make every interaction feel memorable.",
  },
  {
    playbackId: "3hfzhGk1IQHb2kZwv01YlNYA6olGBfF70000SqZXQ702ozo",
    poster: "https://image.mux.com/3hfzhGk1IQHb2kZwv01YlNYA6olGBfF70000SqZXQ702ozo/thumbnail.webp?width=1200&time=0",
    posterHeight: 663,
    label: "U.S. market readiness",
    caption: "Rebranding and translating international websites for modern U.S. audiences.",
  },
  {
    playbackId: "bmUEq0015EGNUVijLFRpphb007VWlqrbFp8rS9iJGJPGM",
    poster: "https://image.mux.com/bmUEq0015EGNUVijLFRpphb007VWlqrbFp8rS9iJGJPGM/thumbnail.webp?width=1200&time=0",
    posterHeight: 883,
    label: "Brand systems",
    caption: "Clear digital experiences that make complex services easier to understand.",
  },
  {
    playbackId: "bMQF1EKQLcPVHg35lmtN02KueliX4m9PmAGE4NCAk2uM",
    poster: "https://image.mux.com/bMQF1EKQLcPVHg35lmtN02KueliX4m9PmAGE4NCAk2uM/thumbnail.webp?width=1200&time=0",
    posterHeight: 894,
    label: "Measured outcomes",
    caption: "Reporting that helps teams see what is working and decide what comes next.",
  },
];

const formatIndex = (index) => String(index + 1).padStart(2, "0");
const responsivePosterSources = (source) => {
  const url = new URL(source);
  return [640, 960, 1200]
    .map((width) => {
      url.searchParams.set("width", String(width));
      return `${url.toString()} ${width}w`;
    })
    .join(", ");
};

function initializeCarousel() {
  const carousel = document.querySelector("[data-video-carousel]");
  if (!carousel) return;

  const stage = carousel.querySelector(".video-stage");
  const frame = carousel.querySelector("[data-video-frame]");
  const poster = carousel.querySelector("[data-video-poster]");
  const start = carousel.querySelector("[data-video-start]");
  const startLabel = start.querySelector("b");
  const status = carousel.querySelector("[data-video-status]");
  const count = carousel.querySelector("[data-video-count]");
  const indexLabel = carousel.querySelector("[data-video-index]");
  const title = carousel.querySelector("[data-video-label]");
  const caption = carousel.querySelector("[data-video-caption]");
  const selectors = [...carousel.querySelectorAll("[data-video-select]")];
  const previous = carousel.querySelector("[data-video-previous]");
  const next = carousel.querySelector("[data-video-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection?.saveData === true;
  const manualPlayback = reduceMotion || saveData;

  let activeIndex = 0;
  let isInViewport = false;
  let mediaReady = false;
  let hasRendered = false;
  let loadTimer = null;

  const animateVideoCopy = () => {
    if (reduceMotion || !hasRendered || typeof title.animate !== "function") return;
    [count, indexLabel, title, caption].forEach((element, index) => {
      element.animate(
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 520,
          delay: index * 42,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      );
    });
  };

  const playerSrc = (video) => {
    const url = new URL(`https://player.mux.com/${video.playbackId}`);
    url.searchParams.set("muted", "true");
    url.searchParams.set("controls", "true");
    url.searchParams.set("loop", "false");
    url.searchParams.set("preload", "none");
    if (!manualPlayback) url.searchParams.set("autoplay", "muted");
    return url.toString();
  };

  const clearMediaStatus = () => {
    status.hidden = true;
    status.textContent = "";
  };

  const deactivateMedia = ({ preserveStatus = false } = {}) => {
    window.clearTimeout(loadTimer);
    loadTimer = null;
    if (frame.dataset.activeSrc) frame.src = "about:blank";
    delete frame.dataset.activeSrc;
    frame.hidden = true;
    poster.hidden = false;
    start.hidden = mediaReady;
    stage.classList.remove("is-playing");
    if (!preserveStatus) clearMediaStatus();
  };

  const activateMedia = () => {
    if (!mediaReady || !isInViewport || document.hidden) return;
    const src = playerSrc(videos[activeIndex]);
    const activeVideo = videos[activeIndex];
    if (frame.dataset.activeSrc === src) return;
    stage.classList.remove("is-playing");
    poster.hidden = false;
    start.hidden = true;
    frame.hidden = false;
    frame.dataset.activeSrc = src;
    frame.title = `${activeVideo.label} video`;
    frame.src = src;
    status.textContent = `Loading ${activeVideo.label} video…`;
    status.hidden = false;
    window.clearTimeout(loadTimer);
    loadTimer = window.setTimeout(() => {
      if (frame.dataset.activeSrc !== src) return;
      mediaReady = false;
      deactivateMedia({ preserveStatus: true });
      start.hidden = false;
      startLabel.textContent = "Try video again";
      status.textContent = "The video player did not load. The poster and description remain available.";
      status.hidden = false;
    }, 10000);
  };

  const render = () => {
    const activeVideo = videos[activeIndex];
    frame.title = `${activeVideo.label} video`;
    poster.src = activeVideo.poster;
    poster.srcset = responsivePosterSources(activeVideo.poster);
    poster.width = 1200;
    poster.height = activeVideo.posterHeight;
    start.setAttribute("aria-label", `Play ${activeVideo.label} video`);
    startLabel.textContent = "Play video";
    count.textContent = `${formatIndex(activeIndex)} / ${String(videos.length).padStart(2, "0")}`;
    indexLabel.textContent = formatIndex(activeIndex);
    title.textContent = activeVideo.label;
    caption.textContent = activeVideo.caption;
    animateVideoCopy();

    selectors.forEach((button, index) => {
      const selected = index === activeIndex;
      button.classList.toggle("is-active", selected);
      if (selected) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    if (frame.dataset.activeSrc && frame.dataset.activeSrc !== playerSrc(activeVideo)) {
      deactivateMedia();
    }
    activateMedia();
    hasRendered = true;
  };

  const selectVideo = (index) => {
    mediaReady = false;
    deactivateMedia();
    activeIndex = index;
    render();
  };

  selectors.forEach((button) => {
    button.addEventListener("click", () => selectVideo(Number(button.dataset.videoSelect)));
  });

  previous.addEventListener("click", () => {
    selectVideo((activeIndex - 1 + videos.length) % videos.length);
  });

  next.addEventListener("click", () => {
    selectVideo((activeIndex + 1) % videos.length);
  });

  start.addEventListener("click", () => {
    mediaReady = true;
    isInViewport = true;
    activateMedia();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      deactivateMedia();
    } else {
      activateMedia();
    }
  });

  frame.addEventListener("load", () => {
    if (!frame.dataset.activeSrc) return;
    try {
      if (frame.contentWindow.location.href === "about:blank") return;
    } catch {
      // A loaded Mux document is cross-origin, which is the expected success path.
    }
    window.clearTimeout(loadTimer);
    loadTimer = null;
    clearMediaStatus();
    stage.classList.add("is-playing");
    poster.hidden = true;
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (!isInViewport) {
          deactivateMedia();
          return;
        }
        activateMedia();
      },
      { rootMargin: "100px 0px", threshold: 0.05 },
    );
    observer.observe(carousel);
  } else {
    isInViewport = true;
  }

  render();
}

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

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

initializeCarousel();
initializeSwitchboardEmbed();
initializeMobileMenu();
const projectReviewAnalytics = createProjectReviewAnalytics();
initializeProjectReviewCtaTracking({ analytics: projectReviewAnalytics });
initializeContactForm({ analytics: projectReviewAnalytics });
initializeScrollReveals();
initializeScrollProgress();
