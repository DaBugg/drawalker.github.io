(() => {
  const menuButton = document.querySelector('[data-menu]');
  const navigation = document.querySelector('.site-header nav');
  const bookingForm = document.querySelector('[data-booking]');

  menuButton?.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  if (!bookingForm) return;

  const zipInput = bookingForm.querySelector('[name="zip"]');
  const dateInput = bookingForm.querySelector('[name="date"]');
  const timeInput = bookingForm.querySelector('[name="time"]');
  const zipError = bookingForm.querySelector('[data-error="zip"]');
  const serviceError = bookingForm.querySelector('[data-error="service"]');
  const timeError = bookingForm.querySelector('[data-error="time"]');
  const status = bookingForm.querySelector('.booking-status');

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');
  dateInput.min = localToday;

  const checkZip = () => {
    const zip = zipInput.value.trim();
    if (!/^\d{5}$/.test(zip)) {
      zipError.textContent = 'Enter a 5-digit ZIP.';
      return false;
    }
    if (!/^334\d{2}$/.test(zip)) {
      zipError.textContent = 'This concept currently recognizes Palm Beach County 334xx ZIPs.';
      return false;
    }
    zipError.textContent = 'This ZIP is in the concept service area. Final coverage is confirmed by the team.';
    return true;
  };

  bookingForm.querySelector('[data-zip]')?.addEventListener('click', checkZip);
  zipInput.addEventListener('input', () => {
    zipInput.value = zipInput.value.replace(/\D/g, '').slice(0, 5);
    zipError.textContent = '';
  });

  document.querySelectorAll('[data-select-service]').forEach((button) => {
    button.addEventListener('click', () => {
      const radio = bookingForm.querySelector(`[name="service"][value="${button.dataset.selectService}"]`);
      if (radio) {
        radio.checked = true;
        serviceError.textContent = '';
        document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => radio.focus(), 450);
      }
    });
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const service = bookingForm.querySelector('[name="service"]:checked');
    let valid = true;

    if (!service) {
      serviceError.textContent = 'Choose the closest service, or select “Not sure.”';
      valid = false;
    } else {
      serviceError.textContent = '';
    }

    if (!checkZip()) valid = false;

    if (!dateInput.value || dateInput.value < localToday || !timeInput.value) {
      timeError.textContent = 'Choose a preferred day and time window.';
      valid = false;
    } else {
      timeError.textContent = '';
    }

    if (!valid) {
      status.textContent = '';
      bookingForm.querySelector('.field-error:not(:empty)')?.closest('.booking-step')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const requestedDay = new Date(`${dateInput.value}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    status.textContent = `${service.value} requested for ${requestedDay}, ${timeInput.value.toLowerCase()}, in ${zipInput.value}. This demo is ready to connect to an appointment system.`;
  });
})();
