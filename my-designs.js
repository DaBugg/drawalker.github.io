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
  