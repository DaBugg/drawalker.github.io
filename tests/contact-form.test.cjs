const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const moduleUrl = pathToFileURL(path.resolve(__dirname, '../src/contact-form.mjs')).href;

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

function createFakeDom({ valid = true } = {}) {
  const listeners = {};
  const attributes = {};
  const buttonLabel = { textContent: 'Send review request' };
  const button = {
    disabled: false,
    querySelector(selector) {
      return selector === 'span' ? buttonLabel : null;
    },
  };
  const invalidControl = {
    focusCount: 0,
    focus() {
      this.focusCount += 1;
    },
  };
  const form = {
    action: '/api/send-quote',
    hidden: false,
    reportValidityCount: 0,
    resetCount: 0,
    addEventListener(type, handler) {
      listeners[type] = handler;
    },
    checkValidity() {
      return valid;
    },
    querySelector(selector) {
      if (selector === 'button[type="submit"]') return button;
      if (selector === ':invalid') return invalidControl;
      return null;
    },
    removeAttribute(name) {
      delete attributes[name];
    },
    reportValidity() {
      this.reportValidityCount += 1;
    },
    reset() {
      this.resetCount += 1;
    },
    setAttribute(name, value) {
      attributes[name] = value;
    },
  };
  const status = { textContent: '' };
  const success = {
    focusCount: 0,
    hidden: true,
    focus() {
      this.focusCount += 1;
    },
  };
  const turnstileSlot = {};
  const elements = {
    '[data-contact-form]': form,
    '[data-form-status]': status,
    '[data-form-success]': success,
    '[data-turnstile]': turnstileSlot,
  };
  const root = {
    querySelector(selector) {
      return elements[selector] || null;
    },
  };

  return {
    attributes,
    button,
    buttonLabel,
    form,
    invalidControl,
    listeners,
    root,
    status,
    success,
    turnstileSlot,
  };
}

function submitEvent() {
  return {
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
  };
}

test('invalid forms keep native validation, focus the first invalid field, and never fetch', async () => {
  const { initializeContactForm } = await import(moduleUrl);
  const dom = createFakeDom({ valid: false });
  let fetchCalls = 0;
  initializeContactForm({
    root: dom.root,
    fetchImpl: async () => {
      fetchCalls += 1;
    },
    turnstileApi: null,
    IntersectionObserverImpl: null,
    serializeForm: () => ({}),
  });

  const event = submitEvent();
  await dom.listeners.submit(event);

  assert.equal(event.defaultPrevented, true);
  assert.equal(fetchCalls, 0);
  assert.equal(dom.invalidControl.focusCount, 1);
  assert.equal(dom.form.reportValidityCount, 1);
  assert.equal(dom.status.textContent, 'Please complete the required fields before sending.');
});

test('the in-flight guard is set before Turnstile work and suppresses rapid duplicate submits', async () => {
  const { initializeContactForm } = await import(moduleUrl);
  const dom = createFakeDom();
  const turnstilePending = deferred();
  let fetchCalls = 0;
  const turnstileApi = {
    render: () => turnstilePending.promise,
    reset() {},
  };
  initializeContactForm({
    root: dom.root,
    fetchImpl: async () => {
      fetchCalls += 1;
      return { ok: true, json: async () => ({ ok: true }) };
    },
    turnstileApi,
    IntersectionObserverImpl: null,
    serializeForm: () => ({
      name: 'Synthetic Test',
      'cf-turnstile-response': 'test-token',
    }),
  });

  const first = dom.listeners.submit(submitEvent());
  const second = dom.listeners.submit(submitEvent());
  assert.equal(dom.attributes['aria-busy'], 'true');
  assert.equal(dom.button.disabled, true);
  assert.equal(dom.buttonLabel.textContent, 'Sending…');

  turnstilePending.resolve('widget-1');
  await Promise.all([first, second]);

  assert.equal(fetchCalls, 1);
  assert.equal(dom.form.resetCount, 1);
  assert.equal(dom.form.hidden, true);
  assert.equal(dom.success.hidden, false);
  assert.equal(dom.success.focusCount, 1);
  assert.equal(dom.button.disabled, false);
  assert.equal(dom.buttonLabel.textContent, 'Send review request');
  assert.equal('aria-busy' in dom.attributes, false);
});

test('non-2xx and explicit ok-false responses preserve the form and reset Turnstile', async () => {
  const { initializeContactForm } = await import(moduleUrl);

  for (const response of [
    { ok: false, json: async () => ({ ok: false, error: 'Please check the form fields.' }) },
    { ok: true, json: async () => ({ ok: false }) },
  ]) {
    const dom = createFakeDom();
    let resetCalls = 0;
    initializeContactForm({
      root: dom.root,
      fetchImpl: async () => response,
      turnstileApi: {
        render: async () => 'widget-1',
        reset: () => { resetCalls += 1; },
      },
      IntersectionObserverImpl: null,
      serializeForm: () => ({ name: 'Synthetic Test' }),
    });

    await dom.listeners.submit(submitEvent());

    assert.equal(dom.form.hidden, false);
    assert.equal(dom.form.resetCount, 0);
    assert.equal(dom.success.hidden, true);
    assert.equal(resetCalls, 1);
    assert.ok(dom.status.textContent);
    assert.equal(dom.button.disabled, false);
  }
});

test('network failures use the designed generic message instead of exposing browser errors', async () => {
  const { GENERIC_SUBMISSION_ERROR, initializeContactForm } = await import(moduleUrl);
  const dom = createFakeDom();
  initializeContactForm({
    root: dom.root,
    fetchImpl: async () => {
      throw new Error('Failed to fetch https://internal-provider.example.test');
    },
    turnstileApi: {
      render: async () => 'widget-1',
      reset() {},
    },
    IntersectionObserverImpl: null,
    serializeForm: () => ({ name: 'Synthetic Test' }),
  });

  await dom.listeners.submit(submitEvent());

  assert.equal(dom.status.textContent, GENERIC_SUBMISSION_ERROR);
  assert.doesNotMatch(dom.status.textContent, /internal-provider|Failed to fetch/u);
});

test('Turnstile expiration and widget errors are announced through the existing live region', async () => {
  const {
    SECURITY_EXPIRED_ERROR,
    SECURITY_WIDGET_ERROR,
    initializeContactForm,
  } = await import(moduleUrl);
  const dom = createFakeDom();
  let widgetOptions;
  initializeContactForm({
    root: dom.root,
    fetchImpl: async () => ({ ok: true, json: async () => ({ ok: true }) }),
    turnstileApi: {
      render: async (_slot, options) => {
        widgetOptions = options;
        return 'widget-1';
      },
      reset() {},
    },
    IntersectionObserverImpl: null,
    serializeForm: () => ({}),
  });

  await dom.listeners.focusin();
  assert.equal(widgetOptions.action, 'project_review');
  widgetOptions.onExpire();
  assert.equal(dom.status.textContent, SECURITY_EXPIRED_ERROR);
  widgetOptions.callback();
  assert.equal(dom.status.textContent, '');
  widgetOptions.onError();
  assert.equal(dom.status.textContent, SECURITY_WIDGET_ERROR);
});
