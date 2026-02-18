// script.js — Main page (AI & Infrastructure Advisor)

function bootApp() {
  setCurrentYear();
  initParticles();
  initSubscribeModal();
  initMobileNav();
  initFaqCarousel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}


// =====================================
// 1) Footer year + Dark-Light Toggle
// =====================================
function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

(function () {
  const root = document.documentElement;
  const STORAGE_KEY = "theme";

  const stored = localStorage.getItem(STORAGE_KEY);
  const initial =
    stored === "light" || stored === "dark"
      ? stored
      : "dark";

  root.setAttribute("data-theme", initial);

  const toggleBtn = document.querySelector("[data-theme-toggle]");
  if (!toggleBtn) return;

  const iconEl = toggleBtn.querySelector(".theme-toggle__icon");
  const labelEl = toggleBtn.querySelector(".theme-toggle__label");

  function syncToggleUI(theme) {
    if (!iconEl || !labelEl) return;
    if (theme === "light") {
      iconEl.textContent = "\u2600\uFE0F";
      labelEl.textContent = "Light mode";
    } else {
      iconEl.textContent = "\uD83C\uDF19";
      labelEl.textContent = "Dark mode";
    }
  }

  syncToggleUI(initial);

  toggleBtn.addEventListener("click", () => {
    const current =
      root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
    syncToggleUI(next);
  });
})();


// =====================================
// 2) Full-page particles
// =====================================
function initParticles() {
  const containerEl = document.getElementById('pageParticles');
  if (!containerEl) return;

  // Skip particles on mobile for performance
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  if (mobileQuery.matches) return;

  const PARTICLE_COUNT = window.innerWidth < 1024 ? 80 : 150;
  let resizeTimer = null;

  function spawnParticles() {
    containerEl.innerHTML = '';

    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'cf-particle';

      const size = 1 + Math.random() * 3;
      const startLeft = Math.random() * W;
      const startTop = Math.random() * H;

      // Gentle drift in all directions
      const dx = (Math.random() - 0.5) * W * 0.6;
      const dy = -(H * 0.5) - Math.random() * H * 0.5;

      const duration = 20 + Math.random() * 25;
      const delay = Math.random() * duration;

      Object.assign(p.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${startLeft}px`,
        top: `${startTop}px`,
        backgroundColor: `rgba(255, 255, 255, ${0.15 + Math.random() * 0.35})`,
        animation: `cf-float ${duration}s linear ${delay}s infinite`,
        willChange: 'transform, opacity'
      });

      p.style.setProperty('--cf-move-x', `${dx}px`);
      p.style.setProperty('--cf-move-y', `${dy}px`);

      containerEl.appendChild(p);
    }
  }

  spawnParticles();

  // Debounced resize
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(spawnParticles, 300);
  });
}


// =====================================
// 3) Subscription Modal (scroll-triggered)
// =====================================
function initSubscribeModal() {
  const modal = document.getElementById('subscribe-modal');
  if (!modal) return;

  const MODAL_STORAGE_KEY = 'subscribe_modal_dismissed';

  // Don't show if already dismissed
  if (localStorage.getItem(MODAL_STORAGE_KEY)) return;

  let hasTriggered = false;

  function onScroll() {
    if (hasTriggered) return;

    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (scrollPercent >= 0.4) {
      hasTriggered = true;
      showModal();
      window.removeEventListener('scroll', onScroll);
    }
  }

  function showModal() {
    modal.classList.add('subscribe-modal--visible');
    modal.setAttribute('aria-hidden', 'false');
  }

  function hideModal() {
    modal.classList.remove('subscribe-modal--visible');
    modal.setAttribute('aria-hidden', 'true');
    localStorage.setItem(MODAL_STORAGE_KEY, '1');
  }

  // Close buttons (backdrop + X button)
  modal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', hideModal);
  });

  // Handle subscribe form
  const form = document.getElementById('subscribe-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // For now, just dismiss. Hook up to a mailing list API later.
      hideModal();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}


// =====================================
// 4) Mobile nav toggle
// =====================================
function initMobileNav() {
  const btn = document.getElementById('nav-hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !open);
    links.classList.toggle('nav-links--open', !open);
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      links.classList.remove('nav-links--open');
    });
  });
}


// =====================================
// 5) FAQ Carousel
// =====================================
function initFaqCarousel() {
  const track = document.getElementById('faq-track');
  const prevBtn = document.getElementById('faq-prev');
  const nextBtn = document.getElementById('faq-next');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.faq-card');
  if (!cards.length) return;

  let currentIndex = 0;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function updateCarousel() {
    const card = cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    const cardWidth = card.offsetWidth + gap;
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= getMaxIndex();
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchDeltaX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) > 50) {
      if (touchDeltaX < 0 && currentIndex < getMaxIndex()) {
        currentIndex++;
      } else if (touchDeltaX > 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateCarousel();
    }
  });

  // Reset on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      updateCarousel();
    }, 150);
  });

  updateCarousel();
}


// =====================================
// 6) Smooth scroll for anchor links
// =====================================
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);
  const target = document.getElementById(targetId);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
