(() => {
  const menuButton = document.querySelector('[data-menu]');
  const navigation = document.querySelector('[data-nav]');
  const menuIcon = menuButton?.querySelector('i');

  const setMenu = (open) => {
    if (!menuButton || !navigation) return;
    navigation.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuIcon?.classList.toggle('ph-list', !open);
    menuIcon?.classList.toggle('ph-x', open);
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      menuButton?.focus();
    }
  });

  const form = document.querySelector('[data-route]');
  if (!form) return;

  const origin = form.elements.namedItem('origin');
  const destination = form.elements.namedItem('destination');
  const equipment = form.elements.namedItem('equipment');
  const requiredControls = Array.from(form.querySelectorAll('[required]'));
  const status = form.querySelector('.route-status');
  const tower = document.querySelector('[data-control-tower]');
  const towerHeading = document.querySelector('#tower-title');
  const towerEmpty = document.querySelector('[data-tower-empty]');
  const towerLive = document.querySelector('[data-tower-live]');
  const consoleState = document.querySelector('[data-console-state]');

  const getError = (control) => form.querySelector(`[data-error="${control.name}"]`);

  const validate = (control) => {
    const invalid = !control.value.trim();
    const error = getError(control);
    if (error) error.textContent = invalid ? 'Required.' : '';
    if (invalid) {
      control.setAttribute('aria-invalid', 'true');
    } else {
      control.removeAttribute('aria-invalid');
    }
    return !invalid;
  };

  const shortLabel = (value) => value.trim().replace(/\s+/g, ' ').slice(0, 42).toUpperCase();

  const updateTower = () => {
    const mapOrigin = document.querySelector('[data-map-origin]');
    const mapDestination = document.querySelector('[data-map-destination]');
    const mapEquipment = document.querySelector('[data-map-equipment]');
    if (mapOrigin) mapOrigin.textContent = shortLabel(origin.value);
    if (mapDestination) mapDestination.textContent = shortLabel(destination.value);
    if (mapEquipment) mapEquipment.textContent = shortLabel(equipment.value);
  };

  requiredControls.forEach((control) => {
    control.addEventListener('input', () => {
      if (control.getAttribute('aria-invalid') === 'true') validate(control);
      if (towerLive && !towerLive.hidden) updateTower();
    });
    control.addEventListener('change', () => {
      if (control.getAttribute('aria-invalid') === 'true') validate(control);
      if (towerLive && !towerLive.hidden) updateTower();
    });
  });

  document.querySelector('[data-swap]')?.addEventListener('click', () => {
    const previousOrigin = origin.value;
    origin.value = destination.value;
    destination.value = previousOrigin;
    if (origin.value) validate(origin);
    if (destination.value) validate(destination);
    if (towerLive && !towerLive.hidden) updateTower();
    origin.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const validity = requiredControls.map(validate);
    const firstInvalid = requiredControls.find((control, index) => !validity[index]);

    if (firstInvalid) {
      if (status) status.textContent = 'Complete each required field to load the lane.';
      firstInvalid.focus();
      return;
    }

    updateTower();
    if (towerEmpty) towerEmpty.hidden = true;
    if (towerLive) towerLive.hidden = false;
    if (consoleState) consoleState.textContent = 'LANE BRIEF / READY FOR REVIEW';
    tower?.classList.add('is-live');
    if (status) status.textContent = 'Lane brief ready. The planning timeline is open below.';

    towerHeading?.focus({ preventScroll: true });
    tower?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  });
})();
