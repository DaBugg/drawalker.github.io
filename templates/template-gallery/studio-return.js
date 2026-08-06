(() => {
  const style = document.createElement("style");
  style.dataset.networksNodesReturnStyles = "";
  style.textContent = `
    .nn-studio-return {
      position: fixed;
      left: max(1rem, env(safe-area-inset-left));
      bottom: max(1rem, env(safe-area-inset-bottom));
      z-index: 2147483000;
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      max-width: calc(100vw - 2rem);
      padding: 0.7rem 0.95rem;
      border: 1px solid rgba(255, 255, 255, 0.34);
      border-radius: 999px;
      background: rgba(12, 15, 17, 0.92);
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
      color: #fff;
      font: 600 0.72rem/1.2 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.04em;
      text-decoration: none;
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
    }
    .nn-studio-return:hover { background: #f05a2a; border-color: #f05a2a; color: #111; }
    .nn-studio-return:focus-visible { outline: 3px solid #f05a2a; outline-offset: 4px; }
    @media (max-width: 560px) {
      .nn-studio-return {
        left: max(0.75rem, env(safe-area-inset-left));
        bottom: max(0.75rem, env(safe-area-inset-bottom));
        max-width: calc(100vw - 1.5rem);
        font-size: 0.68rem;
      }
    }
    @media (prefers-reduced-motion: reduce) { .nn-studio-return { transition: none !important; } }
  `;
  document.head.append(style);
})();
