(() => {
  const existingReturn = document.querySelector("a.nn-studio-return");
  if (!existingReturn) return;

  const returnNav = document.createElement("nav");
  returnNav.className = "nn-template-return";
  returnNav.setAttribute("aria-label", "Return navigation");

  existingReturn.className = "nn-template-return__link nn-template-return__link--home";
  existingReturn.href = "https://www.networksandnodes.org/";
  existingReturn.textContent = "Networks & Nodes home";
  existingReturn.setAttribute("aria-label", "Go to the Networks & Nodes home page");

  const galleryReturn = document.createElement("a");
  galleryReturn.className = "nn-template-return__link nn-template-return__link--gallery";
  galleryReturn.href = "https://www.networksandnodes.org/templates/";
  galleryReturn.textContent = "← Back to template gallery";
  galleryReturn.setAttribute("aria-label", "Back to the Networks & Nodes template gallery");

  existingReturn.replaceWith(returnNav);
  returnNav.append(existingReturn, galleryReturn);

  const style = document.createElement("style");
  style.dataset.networksNodesReturnStyles = "";
  style.textContent = `
    .nn-template-return {
      position: fixed;
      left: max(1rem, env(safe-area-inset-left));
      bottom: max(1rem, env(safe-area-inset-bottom));
      z-index: 2147483000;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      max-width: calc(100vw - 2rem);
      padding: 0.45rem;
      border: 1px solid rgba(255, 255, 255, 0.34);
      border-radius: 1rem;
      background: rgba(12, 15, 17, 0.92);
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
      -webkit-backdrop-filter: blur(12px);
      backdrop-filter: blur(12px);
    }
    .nn-template-return__link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 0.7rem 0.9rem;
      border: 1px solid transparent;
      border-radius: 0.72rem;
      font: 600 0.72rem/1.2 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      letter-spacing: 0.04em;
      text-decoration: none;
      white-space: nowrap;
    }
    .nn-template-return__link--home {
      border-color: rgba(255, 255, 255, 0.18);
      color: rgba(255, 255, 255, 0.82);
    }
    .nn-template-return__link--gallery {
      background: #f05a2a;
      color: #111;
    }
    .nn-template-return__link--home:hover {
      border-color: rgba(255, 255, 255, 0.48);
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .nn-template-return__link--gallery:hover {
      background: #ff7547;
      color: #111;
    }
    .nn-template-return__link:focus-visible {
      outline: 3px solid #f05a2a;
      outline-offset: 3px;
    }
    @media (max-width: 560px) {
      .nn-template-return {
        left: max(0.75rem, env(safe-area-inset-left));
        bottom: max(0.75rem, env(safe-area-inset-bottom));
        max-width: calc(100vw - 1.5rem);
      }
      .nn-template-return__link {
        flex: 1 1 auto;
        font-size: 0.68rem;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .nn-template-return,
      .nn-template-return__link { transition: none !important; }
    }
  `;
  document.head.append(style);
})();
