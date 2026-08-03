const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const focusSection = (target) => {
  const hadTabindex = target.hasAttribute("tabindex");
  if (!hadTabindex) target.setAttribute("tabindex", "-1");

  target.focus({ preventScroll: true });

  if (!hadTabindex) {
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
  }
};

const scrollToSection = (target, updateFocus = true) => {
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });

  if (updateFocus) window.requestAnimationFrame(() => focusSection(target));
};

document.querySelectorAll("a[data-scroll-target]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const destination = new URL(link.href, window.location.href);
    const sameDocument =
      destination.origin === window.location.origin &&
      destination.pathname === window.location.pathname &&
      destination.search === window.location.search;
    const targetId = decodeURIComponent(destination.hash.slice(1));
    const target = sameDocument && targetId ? document.getElementById(targetId) : null;

    if (!target) return;

    event.preventDefault();
    window.history.pushState(null, "", `${destination.pathname}${destination.search}${destination.hash}`);
    link.closest("details")?.removeAttribute("open");
    scrollToSection(target);
  });
});
