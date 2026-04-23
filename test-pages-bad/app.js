/* ===========================================================
   ATLAS — landing page animation
   GSAP ScrollTrigger pins the epic section; scroll scrubs the
   timeline through three acts: burden, until, beyond.
   =========================================================== */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  // -------- Element refs ---------------------------------------------------
  const q = (sel, root) => (root || document).querySelector(sel);
  const qa = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const epic        = q('[data-epic]');
  const stages      = qa('.stage');
  const copyLines   = qa('.copy__line');
  const burst       = q('[data-burst]');
  const vignette    = q('[data-vignette]');
  const flash       = q('[data-flash]');
  const popup       = q('[data-popup]');
  const popupFrame  = q('.popup__frame');
  const nodes       = qa('.node');
  const progressBar = q('[data-progress]');
  const chapterNum  = q('[data-chapter-num]');
  const chapterLbl  = q('[data-chapter-label]');
  const skipBtn     = q('[data-skip]');
  const rewindBtn   = q('[data-rewind]');

  // Chapter metadata driven by timeline progress.
  const chapters = [
    { min: 0.00, max: 0.33, roman: 'I',   label: 'THE BURDEN' },
    { min: 0.33, max: 0.66, roman: 'II',  label: 'UNTIL'      },
    { min: 0.66, max: 1.00, roman: 'III', label: 'BEYOND'     }
  ];

  // Initial state — GSAP owns visibility from here on.
  gsap.set(stages,    { opacity: 0 });
  gsap.set(stages[0], { opacity: 1, scale: 1 });
  gsap.set(copyLines, { opacity: 0, y: 20 });
  gsap.set(copyLines[0], { opacity: 1, y: 0 });
  gsap.set(burst,     { opacity: 0, scale: 0.6 });
  gsap.set(vignette,  { opacity: 0 });
  gsap.set(flash,     { opacity: 0 });
  gsap.set(popup,     { opacity: 0, pointerEvents: 'none' });
  gsap.set(popupFrame,{ y: 30, scale: 0.96, opacity: 0 });
  gsap.set(nodes,     { opacity: 0, y: 18 });

  // -------- The master timeline -------------------------------------------
  // Total timeline runs 0 → 1 over the pinned scroll distance.
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: epic,
      start: 'top top',
      end: '+=300%',          // scrub over 3x viewport height of scroll
      scrub: 0.8,
      pin: '.epic__sticky',
      anticipatePin: 1,
      onUpdate: (self) => {
        // Progress bar
        if (progressBar) progressBar.style.transform = `scaleX(${self.progress})`;

        // Chapter indicator
        const ch = chapters.find(c => self.progress >= c.min && self.progress < c.max) || chapters[chapters.length - 1];
        if (chapterNum && chapterNum.textContent !== ch.roman) {
          chapterNum.textContent = ch.roman;
          chapterLbl.textContent = ch.label;
        }

        // Popup pointer-events on/off, triggered once past the fracture
        if (self.progress >= 0.82) {
          popup.classList.add('is-open');
          popup.style.pointerEvents = 'auto';
        } else {
          popup.classList.remove('is-open');
          popup.style.pointerEvents = 'none';
        }
      }
    }
  });

  // --- Act I → Act II ------------------------------------------------------
  // 0.00 → 0.40 of timeline
  tl.to(stages[0], { scale: 1.08, duration: 0.30 }, 0.00)   // slow crush-in on act 1
    .to(vignette,  { opacity: 0.55, duration: 0.40 }, 0.00)
    .to(copyLines[0], { opacity: 0, y: -20, duration: 0.12 }, 0.28)
    .to(stages[0], { opacity: 0, duration: 0.10 }, 0.30)
    .fromTo(stages[1], { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.12 }, 0.30)
    .fromTo(copyLines[1], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.12 }, 0.34);

  // --- Dwell on Act II with building pressure ------------------------------
  // 0.40 → 0.60
  tl.to(stages[1], {
      scale: 1.08,
      x: () => gsap.utils.random(-4, 4),
      y: () => gsap.utils.random(-3, 3),
      duration: 0.20,
      ease: 'power1.inOut'
    }, 0.40)
    .to(vignette, { opacity: 0.8, duration: 0.20 }, 0.40);

  // --- The crack: Act II → Act III ----------------------------------------
  // 0.60 → 0.75 — screen flashes, burst bursts, act III enters
  tl.to(copyLines[1], { opacity: 0, y: -20, duration: 0.05 }, 0.60)
    .to(flash, { opacity: 0.95, duration: 0.04 }, 0.62)
    .to(stages[1], { opacity: 0, scale: 1.25, duration: 0.06 }, 0.62)
    .fromTo(stages[2],
      { opacity: 0, scale: 1.15 },
      { opacity: 1, scale: 1, duration: 0.12 },
      0.64
    )
    .fromTo(burst,
      { opacity: 0, scale: 0.55 },
      { opacity: 1, scale: 1, duration: 0.18, ease: 'power3.out' },
      0.62
    )
    .to(flash, { opacity: 0, duration: 0.10 }, 0.68)
    .to(vignette, { opacity: 0, duration: 0.14 }, 0.64)
    .fromTo(copyLines[2], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.10 }, 0.70);

  // --- Linger on Act III ---------------------------------------------------
  // 0.75 → 0.82 — a beat of calm before the nav arrives
  tl.to(burst, { scale: 1.04, duration: 0.10, ease: 'sine.inOut' }, 0.75);

  // --- Popup appears -------------------------------------------------------
  // 0.82 → 1.00
  tl.to(popup, { opacity: 1, duration: 0.12 }, 0.82)
    .to(popupFrame, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.20, ease: 'expo.out'
    }, 0.82)
    .to(nodes, {
      opacity: 1, y: 0,
      duration: 0.18,
      stagger: { each: 0.04, from: 'start' },
      ease: 'power2.out'
    }, 0.86);

  // -------- Skip button: jump to the nav state ---------------------------
  // Native smooth-scroll (no ScrollToPlugin dependency).
  const nativeScrollTo = (y) => {
    window.scrollTo({ top: y, behavior: 'smooth' });
  };
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      const st = tl.scrollTrigger;
      if (st) nativeScrollTo(st.end - 20);
    });
  }
  if (rewindBtn) {
    rewindBtn.addEventListener('click', () => {
      const st = tl.scrollTrigger;
      if (st) nativeScrollTo(st.start + 10);
    });
  }

  // ESC rewinds
  window.addEventListener('keydown', (e) => {
    const st = tl.scrollTrigger;
    if (!st) return;
    if (e.key === 'Escape') nativeScrollTo(st.start + 10);
  });

  // -------- Reduced-motion: drop the scrub, let it snap -------------------
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tl.scrollTrigger.scrub = false;
  }

  // Final safety refresh after fonts and images load
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
