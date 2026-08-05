const GENERIC_SUBMISSION_ERROR = 'We could not send your message. Please try again.';
const SECURITY_EXPIRED_ERROR = 'The security check expired. Please complete it again.';
const SECURITY_WIDGET_ERROR = 'The security check could not load. Please refresh and try again.';
const SAFE_SERVER_MESSAGE = /^[^\u0000-\u001f\u007f]{1,240}$/u;

function publicError(message) {
  const error = new Error(message);
  error.isPublicFormError = true;
  return error;
}

function safeServerMessage(value) {
  return typeof value === 'string' && SAFE_SERVER_MESSAGE.test(value)
    ? value
    : GENERIC_SUBMISSION_ERROR;
}

export function initializeContactForm(options = {}) {
  const root = options.root || document;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const turnstileApi = Object.prototype.hasOwnProperty.call(options, 'turnstileApi')
    ? options.turnstileApi
    : globalThis.siteTurnstile;
  const IntersectionObserverImpl = Object.prototype.hasOwnProperty.call(
    options,
    'IntersectionObserverImpl',
  )
    ? options.IntersectionObserverImpl
    : globalThis.IntersectionObserver;
  const serializeForm = options.serializeForm || ((form) => (
    Object.fromEntries(new FormData(form))
  ));

  const form = root.querySelector('[data-contact-form]');
  const status = root.querySelector('[data-form-status]');
  const success = root.querySelector('[data-form-success]');
  const turnstileSlot = root.querySelector('[data-turnstile]');
  if (!form || !status || !success) return null;

  let turnstileWidget = null;
  let turnstilePromise = null;
  let isSubmitting = false;

  const initializeTurnstile = () => {
    if (!turnstileApi || !turnstileSlot) return Promise.resolve(null);
    if (turnstilePromise) return turnstilePromise;

    turnstilePromise = turnstileApi
      .render(turnstileSlot, {
        theme: 'light',
        callback: () => {
          if (
            status.textContent === SECURITY_EXPIRED_ERROR ||
            status.textContent === SECURITY_WIDGET_ERROR
          ) {
            status.textContent = '';
          }
        },
        onExpire: () => {
          status.textContent = SECURITY_EXPIRED_ERROR;
        },
        onError: () => {
          status.textContent = SECURITY_WIDGET_ERROR;
        },
      })
      .then((widget) => {
        turnstileWidget = widget;
        if (widget === null) turnstilePromise = null;
        return widget;
      })
      .catch(() => {
        turnstileWidget = null;
        turnstilePromise = null;
        return null;
      });
    return turnstilePromise;
  };

  form.addEventListener('focusin', initializeTurnstile, { once: true });
  form.addEventListener(
    'invalid',
    () => {
      status.textContent = 'Please complete the required fields before sending.';
    },
    true,
  );

  if (typeof IntersectionObserverImpl === 'function') {
    const observer = new IntersectionObserverImpl(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        initializeTurnstile();
        observer.disconnect();
      },
      { rootMargin: '500px 0px' },
    );
    observer.observe(form);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    status.textContent = '';

    if (!form.checkValidity()) {
      status.textContent = 'Please complete the required fields before sending.';
      form.querySelector(':invalid')?.focus();
      form.reportValidity();
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const buttonLabel = button?.querySelector('span');
    const originalText = buttonLabel?.textContent || '';

    isSubmitting = true;
    form.setAttribute('aria-busy', 'true');
    if (button) button.disabled = true;
    if (buttonLabel) buttonLabel.textContent = 'Sending…';

    try {
      await initializeTurnstile();

      let response;
      try {
        response = await fetchImpl(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serializeForm(form)),
        });
      } catch (_) {
        throw publicError(GENERIC_SUBMISSION_ERROR);
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) {
        throw publicError(safeServerMessage(result.error));
      }

      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      status.textContent = error?.isPublicFormError
        ? error.message
        : GENERIC_SUBMISSION_ERROR;
      if (turnstileWidget !== null && turnstileApi) {
        turnstileApi.reset(turnstileWidget);
      }
    } finally {
      isSubmitting = false;
      form.removeAttribute('aria-busy');
      if (button) button.disabled = false;
      if (buttonLabel) buttonLabel.textContent = originalText;
    }
  };

  form.addEventListener('submit', handleSubmit);

  return { handleSubmit, initializeTurnstile };
}

export {
  GENERIC_SUBMISSION_ERROR,
  SECURITY_EXPIRED_ERROR,
  SECURITY_WIDGET_ERROR,
};
