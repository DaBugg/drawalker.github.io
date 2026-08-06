const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu-toggle');

if (nav && menu) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'Close' : 'Menu';
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.textContent = 'Menu';
      menu.focus();
    }
  });
}

const search = document.querySelector('#project-search');
const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('[data-project]')];
const noResults = document.querySelector('#no-results');
let activeFilter = 'all';

function filterProjects() {
  if (!projects.length) return;
  const query = (search?.value || '').trim().toLowerCase();
  let visible = 0;

  projects.forEach((project) => {
    const matchesText = project.textContent.toLowerCase().includes(query);
    const categories = project.dataset.category || '';
    const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
    const show = matchesText && matchesFilter;
    project.hidden = !show;
    if (show) visible += 1;
  });

  if (noResults) noResults.style.display = visible ? 'none' : 'block';
}

search?.addEventListener('input', filterProjects);
filters.forEach((filter) => filter.addEventListener('click', () => {
  activeFilter = filter.dataset.filter;
  filters.forEach((item) => {
    const active = item === filter;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  filterProjects();
}));

const projectCardDialog = document.querySelector('#project-card-dialog');
const projectCardClose = document.querySelector('#project-card-close');

document.querySelectorAll('[data-project-detail]').forEach((project) => {
  project.addEventListener('click', () => {
    if (!projectCardDialog) return;
    const image = document.querySelector('#project-card-image');
    image.src = project.dataset.image;
    image.alt = project.dataset.alt;
    document.querySelector('#project-card-title').textContent = project.dataset.title;
    document.querySelector('#project-card-meta').textContent = project.dataset.meta;
    document.querySelector('#project-card-description').textContent = project.dataset.description;
    document.querySelector('#project-card-photo-note').textContent = project.dataset.photoNote;
    document.querySelector('#project-card-source').href = project.dataset.source;
    projectCardDialog.showModal();
    projectCardClose.focus();
  });
});

projectCardClose?.addEventListener('click', () => projectCardDialog.close());
projectCardDialog?.addEventListener('click', (event) => {
  if (event.target === projectCardDialog) projectCardDialog.close();
});

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const success = document.querySelector('#form-success');
  if (success) success.style.display = 'block';
  contactForm.reset();
  success?.focus();
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const workItems = [...document.querySelectorAll('[data-work-item]')];
const workPanel = document.querySelector('#work-panel');

function selectWork(item) {
  if (!workPanel || !item) return;
  const image = document.querySelector('#work-image');
  workPanel.classList.add('is-changing');

  workItems.forEach((option) => {
    const active = option === item;
    option.classList.toggle('active', active);
    option.setAttribute('aria-selected', String(active));
    option.tabIndex = active ? 0 : -1;
  });

  window.setTimeout(() => {
    image.src = item.dataset.image;
    image.alt = item.dataset.alt;
    document.querySelector('#work-title').textContent = item.dataset.title;
    document.querySelector('#work-meta').textContent = item.dataset.meta;
    document.querySelector('#work-description').textContent = item.dataset.description;
    workPanel.classList.remove('is-changing');
  }, 140);
}

workItems.forEach((item, index) => {
  item.tabIndex = index === 0 ? 0 : -1;
  item.addEventListener('click', () => selectWork(item));
  item.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = workItems.length - 1;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % workItems.length;
    else next = (index - 1 + workItems.length) % workItems.length;
    workItems[next].focus();
    selectWork(workItems[next]);
  });
});

const revealTargets = document.querySelectorAll([
  'main .section-head',
  'main .split > *',
  'main .card',
  'main .sector',
  'main .featured-project',
  'main .service-row',
  'main .project-item',
  'main .timeline-row',
  'main .stat',
  'main .work-showcase',
  'main .cta-inner > *'
].join(','));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('has-js');
  revealTargets.forEach((target, index) => {
    target.classList.add('reveal');
    target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -45px' });

  revealTargets.forEach((target) => revealObserver.observe(target));
}
