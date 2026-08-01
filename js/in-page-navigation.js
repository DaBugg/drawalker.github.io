const scrollRequestKey = "networks-nodes-scroll-target";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scrollToSection = (targetId) => {
  const target = document.getElementById(targetId);
  if (!target) return false;

  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
  return true;
};

document.querySelectorAll("[data-scroll-target]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.dataset.scrollTarget;
    if (!targetId) return;

    if (scrollToSection(targetId)) {
      event.preventDefault();
      link.closest("details")?.removeAttribute("open");
      return;
    }

    sessionStorage.setItem(scrollRequestKey, targetId);
  });
});

const requestedTarget = sessionStorage.getItem(scrollRequestKey);
if (requestedTarget) {
  sessionStorage.removeItem(scrollRequestKey);
  window.requestAnimationFrame(() => scrollToSection(requestedTarget));
}
