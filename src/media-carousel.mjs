export const MEDIA_ITEMS = Object.freeze([
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
    href: "/templates/",
    poster: "/templates/forgeworks-industrial/preview.svg",
    posterHeight: 750,
    label: "Website concepts",
    caption: "Explore a growing collection of interactive concept studies, in-progress builds, and selected project work.",
  },
]);

const OFFSCREEN_UNLOAD_DELAY = 20_000;
const PLAYBACK_LOAD_TIMEOUT = 15_000;
let muxPlayerRegistration;

export function ensureMuxPlayer(options = {}) {
  const customElementsImpl = options.customElementsImpl || globalThis.customElements;
  const importMuxPlayer = options.importMuxPlayer || (() => import("@mux/mux-player"));
  if (customElementsImpl?.get?.("mux-player")) return Promise.resolve();
  if (!muxPlayerRegistration) {
    muxPlayerRegistration = Promise.resolve(importMuxPlayer())
      .then(() => customElementsImpl?.whenDefined?.("mux-player"))
      .catch((error) => {
        muxPlayerRegistration = null;
        throw error;
      });
  }
  return muxPlayerRegistration;
}

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

export function initializeMediaCarousel(options = {}) {
  const root = options.root || document;
  const documentImpl = options.documentImpl || document;
  const windowImpl = options.windowImpl || window;
  const navigatorImpl = options.navigatorImpl || navigator;
  const items = options.items || MEDIA_ITEMS;
  const ensurePlayer = options.ensurePlayer || ensureMuxPlayer;
  const setTimer = options.setTimeoutImpl || windowImpl.setTimeout.bind(windowImpl);
  const clearTimer = options.clearTimeoutImpl || windowImpl.clearTimeout.bind(windowImpl);
  const IntersectionObserverImpl = options.IntersectionObserverImpl ?? windowImpl.IntersectionObserver;
  const carousel = root.querySelector("[data-video-carousel]");
  if (!carousel) return null;

  const stage = carousel.querySelector(".video-stage");
  const frame = carousel.querySelector("[data-video-frame]");
  const poster = carousel.querySelector("[data-video-poster]");
  const conceptLink = carousel.querySelector("[data-video-concept]");
  const status = carousel.querySelector("[data-video-status]");
  const playbackToggle = carousel.querySelector("[data-video-playback-toggle]");
  const count = carousel.querySelector("[data-video-count]");
  const indexLabel = carousel.querySelector("[data-video-index]");
  const title = carousel.querySelector("[data-video-label]");
  const caption = carousel.querySelector("[data-video-caption]");
  const selectors = [...carousel.querySelectorAll("[data-video-select]")];
  const previous = carousel.querySelector("[data-video-previous]");
  const next = carousel.querySelector("[data-video-next]");
  if (!stage || !frame || !poster || !conceptLink || !status || !playbackToggle || !count || !indexLabel || !title || !caption || !previous || !next) {
    return null;
  }

  const reduceMotion = windowImpl.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  const saveData = navigatorImpl.connection?.saveData === true;
  const preferenceRequiresManualPlayback = reduceMotion || saveData;
  let activeIndex = 0;
  let completedPlays = 0;
  let hasRendered = false;
  let isInViewport = !IntersectionObserverImpl;
  let isPageReady = documentImpl.readyState === "complete";
  let userPaused = preferenceRequiresManualPlayback;
  let loadFailed = false;
  let requestGeneration = 0;
  let loadTimer = null;
  let offscreenTimer = null;

  const clearLoadTimer = () => {
    clearTimer(loadTimer);
    loadTimer = null;
  };

  const clearOffscreenTimer = () => {
    clearTimer(offscreenTimer);
    offscreenTimer = null;
  };

  const clearMediaStatus = () => {
    status.hidden = true;
    status.textContent = "";
  };

  const activeItem = () => items[activeIndex];

  const updatePlaybackToggle = () => {
    const isConcept = Boolean(activeItem()?.href);
    playbackToggle.hidden = isConcept;
    if (isConcept) return;
    const shouldOfferPlay = userPaused || loadFailed || !frame.dataset.activePlaybackId;
    playbackToggle.textContent = loadFailed ? "Retry video" : shouldOfferPlay ? "Play video" : "Pause video";
    playbackToggle.setAttribute("aria-pressed", String(!shouldOfferPlay));
    playbackToggle.setAttribute(
      "aria-label",
      `${loadFailed ? "Retry" : shouldOfferPlay ? "Play" : "Pause"} ${activeItem().label} video`,
    );
  };

  const unloadMedia = ({ preserveStatus = false } = {}) => {
    requestGeneration += 1;
    clearLoadTimer();
    clearOffscreenTimer();
    frame.pause?.();
    frame.removeAttribute("playback-id");
    frame.removeAttribute("autoplay");
    frame.setAttribute("preload", "none");
    delete frame.dataset.activePlaybackId;
    frame.hidden = true;
    poster.hidden = false;
    stage.classList.remove("is-playing");
    if (!preserveStatus) clearMediaStatus();
    updatePlaybackToggle();
  };

  const pauseMedia = ({ scheduleUnload = false } = {}) => {
    frame.pause?.();
    if (!scheduleUnload || !frame.dataset.activePlaybackId) return;
    clearOffscreenTimer();
    offscreenTimer = setTimer(() => {
      if (isInViewport || !frame.dataset.activePlaybackId) return;
      unloadMedia();
    }, OFFSCREEN_UNLOAD_DELAY);
  };

  const handlePlaybackFailure = (message) => {
    loadFailed = true;
    clearLoadTimer();
    frame.pause?.();
    frame.removeAttribute("playback-id");
    frame.removeAttribute("autoplay");
    frame.setAttribute("preload", "none");
    delete frame.dataset.activePlaybackId;
    frame.hidden = true;
    poster.hidden = false;
    stage.classList.remove("is-playing");
    status.textContent = message;
    status.hidden = false;
    updatePlaybackToggle();
  };

  const activateMedia = async ({ force = false } = {}) => {
    const item = activeItem();
    if (!item || item.href || !isInViewport || documentImpl.hidden) return false;
    if ((!isPageReady || userPaused) && !force) return false;
    clearOffscreenTimer();

    if (frame.dataset.activePlaybackId === item.playbackId) {
      frame.hidden = false;
      const playback = frame.play?.();
      if (playback?.catch) playback.catch(() => {
        userPaused = true;
        updatePlaybackToggle();
      });
      return true;
    }

    const generation = ++requestGeneration;
    loadFailed = false;
    status.textContent = `Loading ${item.label} video…`;
    status.hidden = false;
    updatePlaybackToggle();

    try {
      await ensurePlayer();
      if (generation !== requestGeneration || activeItem() !== item || !isInViewport || documentImpl.hidden || (userPaused && !force)) {
        return false;
      }
      frame.hidden = false;
      frame.dataset.activePlaybackId = item.playbackId;
      frame.setAttribute("playback-id", item.playbackId);
      frame.setAttribute("muted", "");
      frame.setAttribute("playsinline", "");
      frame.setAttribute("preload", "metadata");
      frame.setAttribute("autoplay", "muted");
      clearLoadTimer();
      loadTimer = setTimer(() => {
        if (frame.dataset.activePlaybackId !== item.playbackId) return;
        handlePlaybackFailure("The video took too long to load. The poster remains available; retry when ready.");
      }, PLAYBACK_LOAD_TIMEOUT);
      const playback = frame.play?.();
      if (playback?.catch) {
        playback.catch(() => {
          if (generation !== requestGeneration) return;
          userPaused = true;
          status.textContent = "The video is ready. Press Play to start it.";
          status.hidden = false;
          updatePlaybackToggle();
        });
      }
      updatePlaybackToggle();
      return true;
    } catch {
      if (generation !== requestGeneration) return false;
      handlePlaybackFailure("The video player could not load. The poster remains available; retry when ready.");
      return false;
    }
  };

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

  const render = () => {
    const item = activeItem();
    const isConcept = Boolean(item.href);
    poster.src = item.poster;
    if (isConcept) poster.removeAttribute("srcset");
    else poster.srcset = responsivePosterSources(item.poster);
    poster.width = 1200;
    poster.height = item.posterHeight;
    conceptLink.hidden = !isConcept;
    conceptLink.href = item.href || "/templates/";
    count.textContent = `${formatIndex(activeIndex)} / ${String(items.length).padStart(2, "0")}`;
    indexLabel.textContent = formatIndex(activeIndex);
    title.textContent = item.label;
    caption.textContent = item.caption;
    animateVideoCopy();

    selectors.forEach((button, index) => {
      const selected = index === activeIndex;
      button.classList.toggle("is-active", selected);
      if (selected) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });

    if (frame.dataset.activePlaybackId && (isConcept || frame.dataset.activePlaybackId !== item.playbackId)) {
      unloadMedia();
    }
    poster.hidden = false;
    stage.classList.toggle("is-concept", isConcept);
    if (isConcept) frame.hidden = true;
    else void activateMedia();
    updatePlaybackToggle();
    hasRendered = true;
  };

  const selectVideo = (index) => {
    unloadMedia();
    activeIndex = (index + items.length) % items.length;
    completedPlays = 0;
    loadFailed = false;
    render();
  };

  selectors.forEach((button) => {
    button.addEventListener("click", () => selectVideo(Number(button.dataset.videoSelect)));
  });
  previous.addEventListener("click", () => selectVideo(activeIndex - 1));
  next.addEventListener("click", () => selectVideo(activeIndex + 1));

  playbackToggle.addEventListener("click", () => {
    if (userPaused || loadFailed || !frame.dataset.activePlaybackId) {
      userPaused = false;
      loadFailed = false;
      clearMediaStatus();
      updatePlaybackToggle();
      void activateMedia({ force: true });
      return;
    }
    userPaused = true;
    pauseMedia();
    clearMediaStatus();
    updatePlaybackToggle();
  });

  documentImpl.addEventListener("visibilitychange", () => {
    if (documentImpl.hidden) pauseMedia();
    else void activateMedia();
  });

  frame.addEventListener("playing", () => {
    if (!frame.dataset.activePlaybackId) return;
    clearLoadTimer();
    clearMediaStatus();
    loadFailed = false;
    stage.classList.add("is-playing");
    poster.hidden = true;
    updatePlaybackToggle();
  });

  frame.addEventListener("ended", () => {
    if (!frame.dataset.activePlaybackId || activeItem().href || userPaused) return;
    completedPlays += 1;
    if (completedPlays < 2) {
      frame.currentTime = 0;
      frame.play?.()?.catch?.(() => {});
      return;
    }
    selectVideo(activeIndex + 1);
  });

  if (IntersectionObserverImpl) {
    const observer = new IntersectionObserverImpl(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (!isInViewport) {
          pauseMedia({ scheduleUnload: true });
          return;
        }
        clearOffscreenTimer();
        void activateMedia();
      },
      { rootMargin: "150px 0px", threshold: 0.05 },
    );
    observer.observe(carousel);
  }

  const markPageReady = () => {
    isPageReady = true;
    void activateMedia();
  };
  if (!isPageReady) windowImpl.addEventListener("load", markPageReady, { once: true });

  render();
  if (isPageReady) void activateMedia();

  return { activateMedia, selectVideo, unloadMedia };
}
