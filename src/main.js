import "../js/form-security.js";

const videos = [
  {
    src: "https://player.mux.com/r7u3dBYrfwLMb00YwhKgil6t6ao3Vn00fJq2N12H58FM8?autoplay=1&muted=1&loop=1&controls=0",
    label: "Brand systems",
    caption: "Clear digital experiences that make complex services easier to understand.",
  },
  {
    src: "https://player.mux.com/EbDl00U8531qaMnSoynVZI01V02ydAyIqeHzGKVlqn1s4U?autoplay=1&muted=1&loop=1&controls=0",
    label: "Connected operations",
    caption: "Customer-facing work and the operating systems behind it, designed together.",
  },
  {
    src: "https://player.mux.com/FghhBbV00fPiIiubZGEC00vCec02LmQdg00fZy9NVX00MnA8?autoplay=1&muted=1&loop=1&controls=0",
    label: "Useful automation",
    caption: "Practical automation that reduces handoffs without adding unnecessary complexity.",
  },
  {
    src: "https://player.mux.com/bMQF1EKQLcPVHg35lmtN02KueliX4m9PmAGE4NCAk2uM?autoplay=1&muted=1&loop=1&controls=0",
    label: "Measured outcomes",
    caption: "Reporting that helps teams see what is working and decide what comes next.",
  },
];

const formatIndex = (index) => String(index + 1).padStart(2, "0");

function initializeCarousel() {
  const carousel = document.querySelector("[data-video-carousel]");
  if (!carousel) return;

  const frame = carousel.querySelector("[data-video-frame]");
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
  let timer = null;

  const render = () => {
    const activeVideo = videos[activeIndex];
    frame.src = activeVideo.src;
    frame.title = `${activeVideo.label} video`;
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
    if (!autoRotate || isHovering) return;
    timer = window.setInterval(() => {
      activeIndex = (activeIndex + 1) % videos.length;
      render();
    }, 9000);
  };

  const selectVideo = (index) => {
    activeIndex = index;
    autoRotate = false;
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
    if (document.hidden) stopTimer();
    else startTimer();
  });

  updatePlaybackButton();
  startTimer();
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

async function initializeContactForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");
  const success = document.querySelector("[data-form-success]");
  const turnstileSlot = document.querySelector("[data-turnstile]");
  if (!form || !status || !success) return;

  let turnstileWidget = null;
  if (window.siteTurnstile && turnstileSlot) {
    try {
      turnstileWidget = await window.siteTurnstile.render(turnstileSlot, { theme: "light" });
    } catch {
      turnstileWidget = null;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

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
