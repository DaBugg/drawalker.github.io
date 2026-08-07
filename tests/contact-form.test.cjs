const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const moduleUrl = pathToFileURL(path.resolve(__dirname, '../src/contact-form.mjs')).href;
const analyticsModuleUrl = pathToFileURL(path.resolve(__dirname, '../src/analytics.mjs')).href;

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
  const failures = [];
  initializeContactForm({
    root: dom.root,
    fetchImpl: async () => {
      fetchCalls += 1;
    },
    turnstileApi: null,
    IntersectionObserverImpl: null,
    serializeForm: () => ({}),
    analytics: { failure: (stage) => failures.push(stage) },
  });

  const event = submitEvent();
  await dom.listeners.submit(event);

  assert.equal(event.defaultPrevented, true);
  assert.equal(fetchCalls, 0);
  assert.equal(dom.invalidControl.focusCount, 1);
  assert.equal(dom.form.reportValidityCount, 1);
  assert.equal(dom.status.textContent, 'Please complete the required fields before sending.');
  assert.deepEqual(failures, ['validation']);
});

test('native invalid-event bursts record one validation failure per user attempt', async () => {
  const { initializeContactForm } = await import(moduleUrl);
  const dom = createFakeDom({ valid: false });
  const failures = [];
  initializeContactForm({
    root: dom.root,
    fetchImpl: async () => ({ ok: true, json: async () => ({ ok: true }) }),
    turnstileApi: null,
    IntersectionObserverImpl: null,
    serializeForm: () => ({}),
    analytics: { failure: (stage) => failures.push(stage) },
  });

  dom.listeners.invalid();
  dom.listeners.invalid();
  assert.deepEqual(failures, ['validation']);
  await Promise.resolve();
  dom.listeners.invalid();
  assert.deepEqual(failures, ['validation', 'validation']);
});

test('form start fires once for approved fields and ignores the honeypot', async () => {
  const { initializeContactForm } = await import(moduleUrl);
  const dom = createFakeDom();
  let formStarts = 0;
  initializeContactForm({
    root: dom.root,
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) }),
    turnstileApi: null,
    IntersectionObserverImpl: null,
    serializeForm: () => ({}),
    analytics: { formStart: () => { formStarts += 1; } },
  });

  dom.listeners.input({ target: { name: 'website' } });
  assert.equal(formStarts, 0);
  dom.listeners.change({ target: { name: 'service' } });
  dom.listeners.input({ target: { name: 'project' } });
  assert.equal(formStarts, 1);
});

test('the in-flight guard is set before Turnstile work and suppresses rapid duplicate submits', async () => {
  const { initializeContactForm } = await import(moduleUrl);
  const dom = createFakeDom();
  const turnstilePending = deferred();
  let fetchCalls = 0;
  let successEvents = 0;
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
    analytics: { success: () => { successEvents += 1; } },
  });

  const first = dom.listeners.submit(submitEvent());
  const second = dom.listeners.submit(submitEvent());
  assert.equal(dom.attributes['aria-busy'], 'true');
  assert.equal(dom.button.disabled, true);
  assert.equal(dom.buttonLabel.textContent, 'Sending…');

  turnstilePending.resolve('widget-1');
  await Promise.all([first, second]);
  await dom.listeners.submit(submitEvent());

  assert.equal(fetchCalls, 1);
  assert.equal(successEvents, 1);
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

  for (const [response, expectedStage] of [
    [{ ok: false, status: 400, json: async () => ({ ok: false, error: 'Please check the form fields.' }) }, 'validation'],
    [{ ok: true, status: 200, json: async () => ({ ok: false }) }, 'api'],
  ]) {
    const dom = createFakeDom();
    let resetCalls = 0;
    const failures = [];
    initializeContactForm({
      root: dom.root,
      fetchImpl: async () => response,
      turnstileApi: {
        render: async () => 'widget-1',
        reset: () => { resetCalls += 1; },
      },
      IntersectionObserverImpl: null,
      serializeForm: () => ({ name: 'Synthetic Test' }),
      analytics: { failure: (stage) => failures.push(stage) },
    });

    await dom.listeners.submit(submitEvent());

    assert.equal(dom.form.hidden, false);
    assert.equal(dom.form.resetCount, 0);
    assert.equal(dom.success.hidden, true);
    assert.equal(resetCalls, 1);
    assert.ok(dom.status.textContent);
    assert.equal(dom.button.disabled, false);
    assert.deepEqual(failures, [expectedStage]);
  }
});

test('response failures use only allowlisted server or fallback stages', async () => {
  const { initializeContactForm } = await import(moduleUrl);

  for (const [statusCode, failureStage, expectedStage] of [
    [400, 'request', 'api'],
    [405, 'request', 'api'],
    [403, undefined, 'security'],
    [429, undefined, 'security'],
    [502, undefined, 'delivery'],
    [503, 'security', 'security'],
    [503, 'delivery', 'delivery'],
    [503, 'email=person@example.test', 'api'],
  ]) {
    const dom = createFakeDom();
    const failures = [];
    initializeContactForm({
      root: dom.root,
      fetchImpl: async () => ({
        ok: false,
        status: statusCode,
        json: async () => ({ ok: false, error: 'Please try again.', failureStage }),
      }),
      turnstileApi: null,
      IntersectionObserverImpl: null,
      serializeForm: () => ({ name: 'Synthetic Test' }),
      analytics: { failure: (stage) => failures.push(stage) },
    });

    await dom.listeners.submit(submitEvent());
    assert.deepEqual(failures, [expectedStage]);
  }
});

test('form failures reach the real analytics adapter exactly once with fixed categories', async () => {
  const { initializeContactForm } = await import(moduleUrl);
  const {
    EVENT_NAMES,
    UMAMI_WEBSITE_ID,
    createProjectReviewAnalytics,
  } = await import(analyticsModuleUrl);

  for (const [label, fetchImpl, expectedStage] of [
    [
      'request contract',
      async () => ({
        ok: false,
        status: 400,
        json: async () => ({ ok: false, failureStage: 'request' }),
      }),
      'api',
    ],
    [
      'validation',
      async () => ({
        ok: false,
        status: 400,
        json: async () => ({ ok: false, failureStage: 'validation' }),
      }),
      'validation',
    ],
    [
      'security',
      async () => ({
        ok: false,
        status: 403,
        json: async () => ({ ok: false, failureStage: 'security' }),
      }),
      'security',
    ],
    [
      'delivery',
      async () => ({
        ok: false,
        status: 502,
        json: async () => ({ ok: false, failureStage: 'delivery' }),
      }),
      'delivery',
    ],
    [
      'malformed success response',
      async () => ({ ok: true, status: 200, json: async () => ({ ok: false }) }),
      'api',
    ],
    [
      'unexpected server response',
      async () => ({ ok: false, status: 500, json: async () => ({ ok: false }) }),
      'api',
    ],
    [
      'network',
      async () => { throw new Error('synthetic network failure'); },
      'network',
    ],
  ]) {
    const dom = createFakeDom();
    const payloads = [];
    const analytics = createProjectReviewAnalytics({
      trackImpl: (payload) => payloads.push(payload),
    });
    initializeContactForm({
      root: dom.root,
      fetchImpl,
      turnstileApi: null,
      IntersectionObserverImpl: null,
      serializeForm: () => ({ name: 'Synthetic Test' }),
      analytics,
    });

    await dom.listeners.submit(submitEvent());
    assert.deepEqual(payloads, [{
      website: UMAMI_WEBSITE_ID,
      url: '/',
      name: EVENT_NAMES.failure,
      data: { stage: expectedStage },
    }], label);
  }
});

test('network failures use the designed generic message instead of exposing browser errors', async () => {
  const { GENERIC_SUBMISSION_ERROR, initializeContactForm } = await import(moduleUrl);
  const dom = createFakeDom();
  const failures = [];
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
    analytics: { failure: (stage) => failures.push(stage) },
  });

  await dom.listeners.submit(submitEvent());

  assert.equal(dom.status.textContent, GENERIC_SUBMISSION_ERROR);
  assert.doesNotMatch(dom.status.textContent, /internal-provider|Failed to fetch/u);
  assert.deepEqual(failures, ['network']);
});

test('analytics failures never interrupt or delay a confirmed form success', async () => {
  const { initializeContactForm } = await import(moduleUrl);

  for (const success of [
    () => { throw new Error('analytics blocked'); },
    () => Promise.reject(new Error('analytics rejected')),
    () => new Promise(() => {}),
  ]) {
    const dom = createFakeDom();
    initializeContactForm({
      root: dom.root,
      fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) }),
      turnstileApi: null,
      IntersectionObserverImpl: null,
      serializeForm: () => ({ name: 'Synthetic Test' }),
      analytics: { success },
    });

    await dom.listeners.submit(submitEvent());
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(dom.form.hidden, true);
    assert.equal(dom.form.resetCount, 1);
    assert.equal(dom.success.hidden, false);
    assert.equal(dom.success.focusCount, 1);
  }
});

test('form analytics receives no serialized personal or security fields', async () => {
  const { initializeContactForm } = await import(moduleUrl);
  const dom = createFakeDom();
  const events = [];
  const sentinels = {
    name: 'PERSON_NAME_SENTINEL',
    email: 'person-sentinel@example.test',
    role: 'COMPANY_SENTINEL',
    project: 'PROJECT_TEXT_SENTINEL',
    service: 'SERVICE_SENTINEL',
    'cf-turnstile-response': 'TURNSTILE_TOKEN_SENTINEL',
  };
  initializeContactForm({
    root: dom.root,
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) }),
    turnstileApi: null,
    IntersectionObserverImpl: null,
    serializeForm: () => sentinels,
    analytics: {
      formStart: (...args) => events.push(['formStart', ...args]),
      success: (...args) => events.push(['success', ...args]),
    },
  });

  dom.listeners.input({ target: { name: 'name' } });
  await dom.listeners.submit(submitEvent());

  assert.deepEqual(events, [['formStart'], ['success']]);
  const serializedEvents = JSON.stringify(events);
  for (const sentinel of Object.values(sentinels)) {
    assert.doesNotMatch(serializedEvents, new RegExp(sentinel, 'u'));
  }
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
