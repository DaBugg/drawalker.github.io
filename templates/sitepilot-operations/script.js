(() => {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open);
  }

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.6, rootMargin: '0px 0px -18% 0px' });

  document.querySelectorAll('.reveal-word').forEach((word) => wordObserver.observe(word));

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  const form = document.querySelector('[data-lead-form]');
  if (!form) return;

  const status = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('button[type="submit"]');

  function showError(field, message) {
    const error = form.querySelector(`[data-error-for="${field.name}"]`);
    if (error) error.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateField(field) {
    const value = field.value.trim();
    let message = '';
    if (field.required && !value) message = 'This field is required.';
    if (!message && field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) message = 'Enter a valid email address.';
    showError(field, message);
    return !message;
  }

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = [...form.querySelectorAll('input, select, textarea')].filter((field) => field.type !== 'hidden');
    const valid = fields.every(validateField);
    status.className = 'form-status';

    if (!valid) {
      status.textContent = 'Review the highlighted fields and try again.';
      status.classList.add('error');
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending request';
    status.textContent = 'Preparing your request.';

    await new Promise((resolve) => setTimeout(resolve, 700));

    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = submitButton.dataset.defaultLabel;
    status.textContent = 'Request received. This demo is ready to connect to a production form service.';
    status.classList.add('success');
  });
})();
