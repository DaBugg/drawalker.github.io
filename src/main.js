import "../js/form-security.js";

const videos = [
  {
    src: "https://player.mux.com/Rgqqh00rKkzeGpQYUe00QDb7Tqtnfnhd6B016z44NacQzc?autoplay=muted&muted=true&loop=true&controls=false&preload=auto",
    poster: "https://image.mux.com/Rgqqh00rKkzeGpQYUe00QDb7Tqtnfnhd6B016z44NacQzc/thumbnail.webp?width=1200&time=0",
    label: "Immersive experiences",
    caption: "Movie-quality websites that draw customers in and make every interaction feel memorable.",
  },
  {
    src: "https://player.mux.com/3hfzhGk1IQHb2kZwv01YlNYA6olGBfF70000SqZXQ702ozo?autoplay=muted&muted=true&loop=true&controls=false&preload=auto",
    poster: "https://image.mux.com/3hfzhGk1IQHb2kZwv01YlNYA6olGBfF70000SqZXQ702ozo/thumbnail.webp?width=1200&time=0",
    label: "U.S. market readiness",
    caption: "Rebranding and translating international websites for modern U.S. audiences.",
  },
  {
    src: "https://player.mux.com/r7u3dBYrfwLMb00YwhKgil6t6ao3Vn00fJq2N12H58FM8?autoplay=muted&muted=true&loop=true&controls=false&preload=auto",
    poster: "https://image.mux.com/r7u3dBYrfwLMb00YwhKgil6t6ao3Vn00fJq2N12H58FM8/thumbnail.webp?width=1200&time=0",
    label: "Brand systems",
    caption: "Clear digital experiences that make complex services easier to understand.",
  },
  {
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
  let timer = null;

  const playerSrc = (video) => {
    if (!reduceMotion) return video.src;
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
    poster.hidden = false;
    stage.classList.remove("is-playing");
  };

  const activateMedia = () => {
    if (!mediaReady || !isInViewport || document.hidden) return;
    const src = playerSrc(videos[activeIndex]);
    if (frame.dataset.activeSrc === src) return;
    stage.classList.remove("is-playing");
    poster.hidden = false;
    frame.hidden = false;
    frame.dataset.activeSrc = src;
    frame.src = src;
  };

  const render = () => {
    const activeVideo = videos[activeIndex];
    frame.title = `${activeVideo.label} video`;
    poster.src = activeVideo.poster;
    count.textContent = `${formatIndex(activeIndex)} / ${String(videos.length).padStart(2, "0")}`;
    indexLabel.textContent = formatIndex(activeIndex);
    title.textContent = activeVideo.label;
    caption.textContent = activeVideo.caption;

    selectors.forEach((button, index) => {
      const selected = index === activeIndex;
      button.classList.toggle("is-active", selected);
      if (selected) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    if (frame.dataset.activeSrc !== playerSrc(activeVideo)) deactivateMedia();
    activateMedia();
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
