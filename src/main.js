import "../js/form-security.js";
import "../js/in-page-navigation.js";
import { assetUrl } from "./asset-url.js";

document.documentElement.classList.add("motion-ready");

const videos = [
  {
    type: "native",
    src: assetUrl("Immersive-designs.MP4"),
    poster: "https://image.mux.com/Rgqqh00rKkzeGpQYUe00QDb7Tqtnfnhd6B016z44NacQzc/thumbnail.webp?width=1200&time=0",
    label: "Immersive experiences",
    caption: "Movie-quality websites that draw customers in and make every interaction feel memorable.",
  },
  {
    type: "native",
    src: assetUrl("Language-translation.MOV"),
    poster: "https://image.mux.com/3hfzhGk1IQHb2kZwv01YlNYA6olGBfF70000SqZXQ702ozo/thumbnail.webp?width=1200&time=0",
    label: "U.S. market readiness",
    caption: "Rebranding and translating international websites for modern U.S. audiences.",
  },
  {
    type: "native",
    src: assetUrl("Realtor-redesign.mp4"),
    poster: "https://image.mux.com/bmUEq0015EGNUVijLFRpphb007VWlqrbFp8rS9iJGJPGM/thumbnail.webp?width=1200&time=0",
    label: "Brand systems",
    caption: "Clear digital experiences that make complex services easier to understand.",
  },
  {
    type: "mux",
    src: "https://player.mux.com/bMQF1EKQLcPVHg35lmtN02KueliX4m9PmAGE4NCAk2uM?autoplay=muted&muted=true&loop=true&controls=false&preload=auto",
    poster: "https://image.mux.com/bMQF1EKQLcPVHg35lmtN02KueliX4m9PmAGE4NCAk2uM/thumbnail.webp?width=1200&time=0",
    label: "Measured outcomes",
    caption: "Reporting that helps teams see what is working and decide what comes next.",
  },
];

const formatIndex = (index) => String(index + 1).padStart(2, "0");

function initializeCarousel() {
  const carousel = document.querySelector("[data-video-carousel]");
  if (!carousel) return;

  const stage = carousel.querySelector(".video-stage");
  const frame = carousel.querySelector("[data-video-frame]");
  const nativeVideo = carousel.querySelector("[data-video-native]");
  const poster = carousel.querySelector("[data-video-poster]");
  const count = carousel.querySelector("[data-video-count]");
  const indexLabel = carousel.querySelector("[data-video-index]");
  const title = carousel.querySelector("[data-video-label]");
  const caption = carousel.querySelector("[data-video-caption]");
  const playback = carousel.querySelector("[data-video-playback]");
  const selectors = [...carousel.querySelectorAll("[data-video-select]")];
  const previous = carousel.querySelector("[data-video-previous]");
  const next = carousel.querySelector("[data-video-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activeIndex = 0;
  let autoRotate = !reduceMotion;
  let isHovering = false;
  let isInViewport = false;
  let mediaReady = false;
  let hasRendered = false;
  let timer = null;

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
    if (video.type !== "mux" || !reduceMotion) return video.src;
    const url = new URL(video.src);
    url.searchParams.delete("autoplay");
    url.searchParams.set("loop", "false");
    url.searchParams.set("controls", "true");
    url.searchParams.set("preload", "metadata");
    return url.toString();
  };

  const deactivateMedia = () => {
    if (frame.dataset.activeSrc) frame.src = "about:blank";
    delete frame.dataset.activeSrc;
    frame.hidden = true;

    if (nativeVideo.dataset.activeSrc) {
      nativeVideo.pause();
      nativeVideo.removeAttribute("src");
      nativeVideo.load();
    }
    delete nativeVideo.dataset.activeSrc;
    nativeVideo.hidden = true;
    poster.hidden = false;
    stage.classList.remove("is-playing");
  };

  const activateMedia = () => {
    if (!mediaReady || !isInViewport || document.hidden) return;
    const src = playerSrc(videos[activeIndex]);
    const activeVideo = videos[activeIndex];
    const mediaElement = activeVideo.type === "native" ? nativeVideo : frame;
    if (mediaElement.dataset.activeSrc === src) return;
    stage.classList.remove("is-playing");
    poster.hidden = false;

    if (activeVideo.type === "native") {
      nativeVideo.hidden = false;
      nativeVideo.dataset.activeSrc = src;
      nativeVideo.title = `${activeVideo.label} video`;
      nativeVideo.poster = activeVideo.poster;
      nativeVideo.controls = reduceMotion;
      nativeVideo.loop = !reduceMotion;
      nativeVideo.preload = "metadata";
      nativeVideo.src = src;
      nativeVideo.load();
      if (!reduceMotion) nativeVideo.play().catch(() => {});
      return;
    }

    frame.hidden = false;
    frame.dataset.activeSrc = src;
    frame.src = src;
  };

  const render = () => {
    const activeVideo = videos[activeIndex];
    frame.title = `${activeVideo.label} video`;
    nativeVideo.title = `${activeVideo.label} video`;
    poster.src = activeVideo.poster;
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

    const mediaElement = activeVideo.type === "native" ? nativeVideo : frame;
    if (mediaElement.dataset.activeSrc !== playerSrc(activeVideo)) deactivateMedia();
    activateMedia();
    hasRendered = true;
  };

  const updatePlaybackButton = () => {
    playback.querySelector("span").textContent = autoRotate ? "Ⅱ" : "▶";
    playback.querySelector("b").textContent = autoRotate ? "Auto-rotate on" : "Auto-rotate off";
    playback.setAttribute(
      "aria-label",
      autoRotate ? "Pause automatic video rotation" : "Resume automatic video rotation",
    );
  };

  const stopTimer = () => {
    window.clearInterval(timer);
    timer = null;
  };

  const startTimer = () => {
    stopTimer();
    if (!autoRotate || isHovering || !mediaReady || !isInViewport || document.hidden) return;
    timer = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % videos.length;
      render();
    }, 9000);
  };

  const selectVideo = (index) => {
    activeIndex = index;
    autoRotate = false;
    mediaReady = true;
    render();
    updatePlaybackButton();
    startTimer();
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

  playback.addEventListener("click", () => {
    if (reduceMotion) return;
    autoRotate = !autoRotate;
    updatePlaybackButton();
    startTimer();
  });

  carousel.addEventListener("mouseenter", () => {
    isHovering = true;
    startTimer();
  });

  carousel.addEventListener("mouseleave", () => {
    isHovering = false;
    startTimer();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTimer();
      deactivateMedia();
    } else {
      activateMedia();
      startTimer();
    }
  });

  frame.addEventListener("load", () => {
    if (!frame.dataset.activeSrc) return;
    stage.classList.add("is-playing");
    poster.hidden = true;
  });

  nativeVideo.addEventListener("loadeddata", () => {
    if (!nativeVideo.dataset.activeSrc) return;
    stage.classList.add("is-playing");
    poster.hidden = true;
  });

  nativeVideo.addEventListener("error", () => {
    stage.classList.remove("is-playing");
    poster.hidden = false;
  });

  const beginMedia = () => {
    mediaReady = true;
    activateMedia();
    startTimer();
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (!isInViewport) {
          stopTimer();
          deactivateMedia();
          return;
        }
        if (mediaReady) {
          activateMedia();
          startTimer();
          return;
        }
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(beginMedia, { timeout: 1200 });
        } else {
          window.setTimeout(beginMedia, 250);
        }
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    );
    observer.observe(carousel);
  } else {
    isInViewport = true;
    window.setTimeout(beginMedia, 250);
  }

  playback.hidden = reduceMotion;
  updatePlaybackButton();
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

function initializeSwitchboard() {
  const frame = document.querySelector("[data-switchboard-frame]");
  if (!frame) return;

  const minimumHeight = 900;
  const maximumHeight = 3600;
  const applyHeight = (nextHeight) => {
    if (!Number.isFinite(nextHeight)) return;
    frame.style.height = `${Math.min(maximumHeight, Math.max(minimumHeight, Math.ceil(nextHeight)))}px`;
  };

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type !== "networks-nodes-switchboard-height") return;
    applyHeight(Number(event.data.height));
  });

  frame.addEventListener("load", () => {
    try {
      const frameDocument = frame.contentDocument;
      if (!frameDocument) return;
      applyHeight(
        Math.max(
          frameDocument.body.scrollHeight,
          frameDocument.documentElement.scrollHeight,
        ),
      );
    } catch {
      // The embedded page can still report its height with postMessage.
    }
  });
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

function initializeContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");
  const success = document.querySelector("[data-form-success]");
  const turnstileSlot = document.querySelector("[data-turnstile]");
  if (!form || !status || !success) return;

  let turnstileWidget = null;
  let turnstilePromise = null;

  const initializeTurnstile = () => {
    if (!window.siteTurnstile || !turnstileSlot) return Promise.resolve(null);
    if (turnstilePromise) return turnstilePromise;
    turnstilePromise = window.siteTurnstile
      .render(turnstileSlot, { theme: "light" })
      .then((widget) => {
        turnstileWidget = widget;
        return widget;
      })
      .catch(() => {
        turnstileWidget = null;
        return null;
      });
    return turnstilePromise;
  };

  form.addEventListener("focusin", initializeTurnstile, { once: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        initializeTurnstile();
        observer.disconnect();
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(form);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    await initializeTurnstile();

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.querySelector("span").textContent;
    button.disabled = true;
    button.querySelector("span").textContent = "Sending…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "We couldn’t send your message. Please try again.");
      }

      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      status.textContent =
        error instanceof Error ? error.message : "We couldn’t send your message. Please try again.";
      if (turnstileWidget !== null && window.siteTurnstile) {
        window.siteTurnstile.reset(turnstileWidget);
      }
    } finally {
      button.disabled = false;
      button.querySelector("span").textContent = originalText;
    }
  });
}

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

initializeCarousel();
initializeSwitchboard();
initializeMobileMenu();
initializeContactForm();
initializeScrollReveals();
initializeScrollProgress();
