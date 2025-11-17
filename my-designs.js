document.addEventListener('DOMContentLoaded', () => {
    initCopyButtons();
    initParticlesDots();
    initSpotlightFollow();
  });
  
  /**
   * Copy Code: per-section "Copy" button
   * Copies the currently selected tab's <code> contents.
   */
  function initCopyButtons() {
    const sections = document.querySelectorAll('.design-section');
  
    sections.forEach(section => {
      const copyBtn = section.querySelector('.code-copy-btn');
      if (!copyBtn) return;
  
      copyBtn.addEventListener('click', async () => {
        // Find the checked radio in this section
        const activeInput = section.querySelector('.code-tabs__input:checked');
        if (!activeInput) return;
  
        // IDs are like "tabs-1-html" -> we want "html"
        const parts = activeInput.id.split('-');
        const tabKey = parts[parts.length - 1]; // 'html' | 'css' | 'js'
  
        const codeBlock = section.querySelector(
          `.code-panel[data-panel="${tabKey}"] code`
        );
        if (!codeBlock) return;
  
        const text = codeBlock.innerText;
        const originalLabel = copyBtn.textContent;
  
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
          }
  
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('code-copy-btn--success');
          setTimeout(() => {
            copyBtn.textContent = originalLabel;
            copyBtn.classList.remove('code-copy-btn--success');
          }, 1200);
        } catch (err) {
          console.error('Copy failed:', err);
        }
      });
    });
  }
  
  /**
   * Particles: add JS-driven glowing dots inside .demo-particles
   */
  function initParticlesDots() {
    const container = document.querySelector('.demo-particles');
    if (!container) return;
  
    const DOT_CLASS = 'demo-particles__dot';
    const DOT_COUNT = 40;
  
    // Remove any existing dots (if re-initialized)
    container.querySelectorAll('.' + DOT_CLASS).forEach(dot => dot.remove());
  
    for (let i = 0; i < DOT_COUNT; i++) {
      const dot = document.createElement('span');
      dot.className = DOT_CLASS;
  
      // Position as percentages so it scales with the container
      const x = Math.random() * 100;
      const y = Math.random() * 100;
  
      // Random drift offsets
      const dx = (Math.random() - 0.5) * 160; // ±80px
      const dy = -120 - Math.random() * 120;  // up and slightly out
  
      const duration = 14 + Math.random() * 10; // 14–24s
      const delay = Math.random() * duration;
  
      dot.style.left = x.toFixed(2) + '%';
      dot.style.top = y.toFixed(2) + '%';
      dot.style.animationDuration = duration.toFixed(2) + 's';
      dot.style.animationDelay = delay.toFixed(2) + 's';
      dot.style.setProperty('--dot-dx', dx.toFixed(1) + 'px');
      dot.style.setProperty('--dot-dy', dy.toFixed(1) + 'px');
  
      container.appendChild(dot);
    }
  }
  
  /**
   * Spotlight: make the glow follow the cursor on each pricing card.
   */
  function initSpotlightFollow() {
    const row = document.querySelector('.demo-spotlight');
    if (!row) return;
  
    const cards = row.querySelectorAll('.demo-spotlight__card');
    if (!cards.length) return;
  
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width) * 100;
        const relY = ((e.clientY - rect.top) / rect.height) * 100;
  
        card.style.setProperty('--spot-x', `${relX.toFixed(1)}%`);
        card.style.setProperty('--spot-y', `${relY.toFixed(1)}%`);
      });
  
      card.addEventListener('mouseleave', () => {
        card.style.removeProperty('--spot-x');
        card.style.removeProperty('--spot-y');
      });
    });
  }
  

  // =====================================
// 5) Particles for Skills + Links + Projects section
// =====================================
//
// - Targets the combined wrapper: #skills-links-projects
// - Uses the overlay container:   #skillsParticlesContainer
// - Uses .cf-particle + @keyframes cf-float from CSS
//
function initSkillsLinksProjectsParticles() {
  const sectionEl = document.getElementById('skills-links-projects');
  const containerEl = document.getElementById('skillsParticlesContainer');

  // If the section or container doesn't exist, bail quietly
  if (!sectionEl || !containerEl) return;

  const PARTICLE_COUNT = 200; // tweak for more/less density

  function spawnParticles() {
    // Clear any existing particles (e.g. after a resize)
    containerEl.innerHTML = '';

    const W = sectionEl.offsetWidth || sectionEl.clientWidth || window.innerWidth;
    const H = sectionEl.offsetHeight || sectionEl.clientHeight || window.innerHeight;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'cf-particle';

      const size = 1 + Math.random() * 3;
      const startLeft = Math.random() * W;
      const startTop = Math.random() * H;

      // How far each particle drifts over the animation
      const dx = (Math.random() - 0.5) * W;   // drift left/right
      const dy = -H - Math.random() * 200;    // drift upward and off-screen

      const duration = 18 + Math.random() * 18; // 18–36s
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

      // Feed offsets into the keyframes via CSS variables
      p.style.setProperty('--cf-move-x', `${dx}px`);
      p.style.setProperty('--cf-move-y', `${dy}px`);

      containerEl.appendChild(p);
    }
  }

  // Initial draw
  spawnParticles();

  // Rebuild particles on resize so they match new dimensions
  window.addEventListener('resize', spawnParticles);
}

document.addEventListener('DOMContentLoaded', () => {
  const demo = document.querySelector('.demo-particles');
  const modeButtons = document.querySelectorAll('.particles-mode-btn');

  if (!demo || !modeButtons.length) return;

  // Find the CSS code panel for THIS demo
  const cssCodeBlock = demo
    .closest('.design-section')
    ?.querySelector('.code-panel[data-panel="css"] code');

  // Mono CSS snippet (what shows when "Mono" is active)
  const cssMonoCode = `/* Mono particles field */

.particles-section {
  position: relative;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #020617 0, #000 65%);
  overflow: hidden;
}

.particles-field {
  position: relative;
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16 / 9;
  border-radius: 1.2rem;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: radial-gradient(circle at top, #020617 0, #000 70%);
}

/* Shared layer styles */
.particles-layer {
  position: absolute;
  inset: -10%;
  background-repeat: repeat;
  mix-blend-mode: screen;
  opacity: 0.7;
}

/* Fine grain */
.particles-layer--1 {
  background-image:
    radial-gradient(circle, rgba(148, 163, 184, 0.6) 1px, transparent 55%);
  background-size: 40px 40px;
  animation: particles-drift-1 42s linear infinite;
}

/* Medium blobs */
.particles-layer--2 {
  background-image:
    radial-gradient(circle, rgba(56, 189, 248, 0.55) 2px, transparent 60%);
  background-size: 80px 80px;
  animation: particles-drift-2 55s linear infinite;
}

/* Larger soft lights */
.particles-layer--3 {
  background-image:
    radial-gradient(circle, rgba(34, 197, 94, 0.35) 8px, transparent 70%);
  background-size: 180px 180px;
  animation: particles-drift-3 75s linear infinite;
}

@keyframes particles-drift-1 {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(60px, -80px, 0); }
}

@keyframes particles-drift-2 {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-90px, 60px, 0); }
}

@keyframes particles-drift-3 {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(40px, 90px, 0); }
}

/* JS-driven dots (mono look) */
.particles-dot {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(248, 250, 252, 0.9);
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.85);
  pointer-events: none;
  opacity: 0;
  animation: particles-float-dot 18s linear infinite;
}

@keyframes particles-float-dot {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translate3d(var(--dot-dx, 0px), var(--dot-dy, -120px), 0);
    opacity: 0;
  }
}`;

  // Confetti CSS snippet (what shows when "Confetti" is active)
  const cssConfettiCode = `/* Confetti particles field */

.particles-section {
  position: relative;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #020617 0, #000 65%);
  overflow: hidden;
}

.particles-field {
  position: relative;
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16 / 9;
  border-radius: 1.2rem;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: radial-gradient(circle at top, #020617 0, #000 70%);
}

/* Shared layer styles */
.particles-layer {
  position: absolute;
  inset: -10%;
  background-repeat: repeat;
  mix-blend-mode: screen;
  opacity: 0.7;
}

/* Fine grain */
.particles-layer--1 {
  background-image:
    radial-gradient(circle, rgba(148, 163, 184, 0.6) 1px, transparent 55%);
  background-size: 40px 40px;
  animation: particles-drift-1 42s linear infinite;
}

/* Medium blobs */
.particles-layer--2 {
  background-image:
    radial-gradient(circle, rgba(56, 189, 248, 0.55) 2px, transparent 60%);
  background-size: 80px 80px;
  animation: particles-drift-2 55s linear infinite;
}

/* Larger soft lights */
.particles-layer--3 {
  background-image:
    radial-gradient(circle, rgba(34, 197, 94, 0.35) 8px, transparent 70%);
  background-size: 180px 180px;
  animation: particles-drift-3 75s linear infinite;
}

@keyframes particles-drift-1 {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(60px, -80px, 0); }
}

@keyframes particles-drift-2 {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-90px, 60px, 0); }
}

@keyframes particles-drift-3 {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(40px, 90px, 0); }
}

/* Confetti-style dots */
.particles-dot {
  position: absolute;
  width: 7px;
  height: 18px;
  border-radius: 999px;
  opacity: 0.95;
  filter: none;
  background-color: #0ea5e9;
  box-shadow:
    0 0 3px rgba(15, 23, 42, 0.28),
    0 0 10px rgba(15, 23, 42, 0.16);
  pointer-events: none;
  animation: particles-float-dot 18s linear infinite;
}

/* Multicolor stripes */
.particles-dot:nth-child(5n + 1) { background-color: #0ea5e9; } /* cyan/blue */
.particles-dot:nth-child(5n + 2) { background-color: #22c55e; } /* green */
.particles-dot:nth-child(5n + 3) { background-color: #f97316; } /* orange */
.particles-dot:nth-child(5n + 4) { background-color: #a855f7; } /* purple */
.particles-dot:nth-child(5n + 5) { background-color: #e11d48; } /* pink */

/* Some dots instead of stripes */
.particles-dot:nth-child(7n) {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

@keyframes particles-float-dot {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translate3d(var(--dot-dx, 0px), var(--dot-dy, -120px), 0);
    opacity: 0;
  }
}`;

  // Set initial mode: mono
  demo.classList.add('demo-particles--mono');
  if (cssCodeBlock) {
    cssCodeBlock.textContent = cssMonoCode;
  }

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;

      // Toggle visual mode
      demo.classList.toggle('demo-particles--confetti', mode === 'confetti');
      demo.classList.toggle('demo-particles--mono', mode === 'mono');

      // Update active button state
      modeButtons.forEach(b => {
        b.classList.toggle('is-active', b === btn);
      });

      // Swap code snippet
      if (cssCodeBlock) {
        cssCodeBlock.textContent =
          mode === 'confetti' ? cssConfettiCode : cssMonoCode;
      }
    });
  });
});
