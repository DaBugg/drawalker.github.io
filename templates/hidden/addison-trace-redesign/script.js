const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
  navLinks?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.textContent = isOpen ? 'Menu' : 'Close menu';
  navLinks?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const sections = document.querySelectorAll('[data-section]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    sectionLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  },
  { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.2, 0.5] }
);

sections.forEach((section) => sectionObserver.observe(section));

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
