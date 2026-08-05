const GENERIC_SUBMISSION_ERROR = 'We could not send your message. Please try again.';
const SECURITY_EXPIRED_ERROR = 'The security check expired. Please complete it again.';
const SECURITY_WIDGET_ERROR = 'The security check could not load. Please refresh and try again.';
const SAFE_SERVER_MESSAGE = /^[^\u0000-\u001f\u007f]{1,240}$/u;
const FORM_START_FIELDS = new Set(['name', 'email', 'role', 'project', 'service']);
const SERVER_FAILURE_STAGES = new Map([
  ['request', 'api'],
  ['validation', 'validation'],
  ['security', 'security'],
  ['delivery', 'delivery'],
]);

function publicError(message, analyticsStage = 'api') {
  const error = new Error(message);
  error.isPublicFormError = true;
  error.analyticsStage = analyticsStage;
  return error;
}

function safeServerMessage(value) {
  return typeof value === 'string' && SAFE_SERVER_MESSAGE.test(value)
    ? value
    : GENERIC_SUBMISSION_ERROR;
}

function responseFailureStage(response, result = {}) {
  const serverStage = SERVER_FAILURE_STAGES.get(result?.failureStage);
  if (serverStage) return serverStage;
  if (response?.status === 400) return 'validation';
  if (response?.status === 403 || response?.status === 429) return 'security';
  if (response?.status === 502) return 'delivery';
  return 'api';
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
  const analytics = options.analytics || null;

  const form = root.querySelector('[data-contact-form]');
  const status = root.querySelector('[data-form-status]');
  const success = root.querySelector('[data-form-success]');
  const turnstileSlot = root.querySelector('[data-turnstile]');
  if (!form || !status || !success) return null;

  let turnstileWidget = null;
  let turnstilePromise = null;
  let isSubmitting = false;
  let hasStarted = false;
  let hasSucceeded = false;
  let validationFailurePending = false;

  const recordAnalytics = (method, ...args) => {
    try {
      if (typeof analytics?.[method] !== 'function') return;
      const result = analytics[method](...args);
      if (result && typeof result.catch === 'function') result.catch(() => {});
    } catch (_) {
      // Analytics must never interrupt form validation, submission, or recovery.
    }
  };

  const recordValidationFailure = () => {
    if (validationFailurePending) return;
    validationFailurePending = true;
    recordAnalytics('failure', 'validation');
    queueMicrotask(() => {
      validationFailurePending = false;
    });
  };

  const initializeTurnstile = () => {
    if (!turnstileApi || !turnstileSlot) return Promise.resolve(null);
    if (turnstilePromise) return turnstilePromise;

    turnstilePromise = turnstileApi
      .render(turnstileSlot, {
        theme: 'light',
        action: 'project_review',
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
  const handleFormStart = (event) => {
    if (hasStarted || !FORM_START_FIELDS.has(event?.target?.name)) return;
    hasStarted = true;
    recordAnalytics('formStart');
  };
  form.addEventListener('input', handleFormStart);
  form.addEventListener('change', handleFormStart);
  form.addEventListener(
    'invalid',
    () => {
      recordValidationFailure();
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
    if (isSubmitting || hasSucceeded) return;
    status.textContent = '';

    if (!form.checkValidity()) {
      recordValidationFailure();
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
        throw publicError(GENERIC_SUBMISSION_ERROR, 'network');
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) {
        throw publicError(
          safeServerMessage(result.error),
          responseFailureStage(response, result),
        );
      }

      hasSucceeded = true;
      recordAnalytics('success');
      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      if (!hasSucceeded) {
        recordAnalytics('failure', error?.analyticsStage || 'api');
      }
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
  responseFailureStage,
};
