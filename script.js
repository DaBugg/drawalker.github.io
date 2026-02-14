// script.js — Main page (AI & Infrastructure Advisor)

function bootApp() {
  setCurrentYear();
  initParticles();
  initSubscribeModal();
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
// 2) Particles for Services section
// =====================================
function initParticles() {
  const sectionEl = document.getElementById('services-section');
  const containerEl = document.getElementById('skillsParticlesContainer');

  if (!sectionEl || !containerEl) return;

  const PARTICLE_COUNT = 200;

  function spawnParticles() {
    containerEl.innerHTML = '';

    const W = sectionEl.offsetWidth || sectionEl.clientWidth || window.innerWidth;
    const H = sectionEl.offsetHeight || sectionEl.clientHeight || window.innerHeight;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'cf-particle';

      const size = 1 + Math.random() * 3;
      const startLeft = Math.random() * W;
      const startTop = Math.random() * H;

      const dx = (Math.random() - 0.5) * W;
      const dy = -H - Math.random() * 200;

      const duration = 18 + Math.random() * 18;
      const delay = Math.random() * duration;

      Object.assign(p.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${startLeft}px`,
        top: `${startTop}px`,
        backgroundColor: `rgba(255, 255, 255, ${0.2 + Math.random() * 0.5})`,
        animation: `cf-float ${duration}s linear ${delay}s infinite`,
        willChange: 'transform, opacity'
      });

      p.style.setProperty('--cf-move-x', `${dx}px`);
      p.style.setProperty('--cf-move-y', `${dy}px`);

      containerEl.appendChild(p);
    }
  }

  spawnParticles();
  window.addEventListener('resize', spawnParticles);
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
// 4) Smooth scroll for anchor links
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
