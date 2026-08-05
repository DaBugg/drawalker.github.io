const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const moduleUrl = pathToFileURL(path.resolve(__dirname, '../src/analytics.mjs')).href;

test('project-review analytics emits only the fixed non-PII payload contract', async () => {
  const {
    EVENT_NAMES,
    UMAMI_WEBSITE_ID,
    createProjectReviewAnalytics,
  } = await import(moduleUrl);
  const payloads = [];
  const analytics = createProjectReviewAnalytics({
    trackImpl: (payload) => payloads.push(payload),
  });

  assert.equal(analytics.ctaClick('hero'), true);
  assert.equal(analytics.formStart(), true);
  assert.equal(analytics.failure('validation'), true);
  assert.equal(analytics.failure('security'), true);
  assert.equal(analytics.failure('network'), true);
  assert.equal(analytics.failure('api'), true);
  assert.equal(analytics.failure('delivery'), true);
  assert.equal(analytics.success(), true);

  assert.deepEqual(payloads, [
    {
      website: UMAMI_WEBSITE_ID,
      url: '/',
      name: EVENT_NAMES.ctaClick,
      data: { placement: 'hero' },
    },
    { website: UMAMI_WEBSITE_ID, url: '/', name: EVENT_NAMES.formStart },
    ...['validation', 'security', 'network', 'api', 'delivery'].map((stage) => ({
      website: UMAMI_WEBSITE_ID,
      url: '/',
      name: EVENT_NAMES.failure,
      data: { stage },
    })),
    { website: UMAMI_WEBSITE_ID, url: '/', name: EVENT_NAMES.success },
  ]);

  const serialized = JSON.stringify(payloads);
  for (const forbidden of [
    'person@example.test',
    'Synthetic project description',
    'turnstile-token',
    'request-id',
    'referrer',
    'title',
    'language',
    'screen',
  ]) {
    assert.doesNotMatch(serialized, new RegExp(forbidden, 'iu'));
  }
});

test('analytics rejects arbitrary placements and failure stages', async () => {
  const { createProjectReviewAnalytics } = await import(moduleUrl);
  const payloads = [];
  const analytics = createProjectReviewAnalytics({
    trackImpl: (payload) => payloads.push(payload),
  });

  assert.equal(analytics.ctaClick('email=person@example.test'), false);
  assert.equal(analytics.failure('Error: token turnstile-token'), false);
  assert.deepEqual(payloads, []);
});

test('blocked, throwing, and rejecting analytics never escape to callers', async () => {
  const { createProjectReviewAnalytics } = await import(moduleUrl);

  const blocked = createProjectReviewAnalytics({ trackImpl: () => false });
  assert.equal(blocked.success(), false);

  const throwing = createProjectReviewAnalytics({
    trackImpl: () => {
      throw new Error('analytics unavailable');
    },
  });
  assert.equal(throwing.failure('network'), false);

  const rejecting = createProjectReviewAnalytics({
    trackImpl: () => Promise.reject(new Error('analytics rejected')),
  });
  assert.equal(rejecting.success(), true);
  await new Promise((resolve) => setImmediate(resolve));

  const pending = createProjectReviewAnalytics({
    trackImpl: () => new Promise(() => {}),
  });
  assert.equal(pending.formStart(), true);
});

test('hero CTA binding is idempotent and records only its first activation', async () => {
  const { initializeProjectReviewCtaTracking } = await import(moduleUrl);
  const listeners = [];
  const cta = {
    addEventListener(type, handler, options) {
      listeners.push({ handler, options, type });
    },
    getAttribute(name) {
      return name === 'data-project-review-cta' ? 'hero' : null;
    },
  };
  const root = { querySelectorAll: () => [cta] };
  const placements = [];
  const analytics = { ctaClick: (placement) => placements.push(placement) };

  initializeProjectReviewCtaTracking({ root, analytics });
  initializeProjectReviewCtaTracking({ root, analytics });

  assert.equal(listeners.length, 1);
  assert.equal(listeners[0].type, 'click');
  assert.deepEqual(listeners[0].options, { capture: true });
  listeners[0].handler();
  listeners[0].handler();
  assert.deepEqual(placements, ['hero']);
});

test('CTA analytics failures never interrupt normal activation', async () => {
  const { initializeProjectReviewCtaTracking } = await import(moduleUrl);
  let listener;
  const cta = {
    addEventListener(_type, handler) {
      listener = handler;
    },
    getAttribute: () => 'hero',
  };

  initializeProjectReviewCtaTracking({
    root: { querySelectorAll: () => [cta] },
    analytics: {
      ctaClick() {
        throw new Error('synthetic analytics failure');
      },
    },
  });

  assert.doesNotThrow(() => listener());
});

test('the default Umami path queues a fixed event and flushes it once after late load', async () => {
  const hadDocument = Object.prototype.hasOwnProperty.call(globalThis, 'document');
  const originalDocument = globalThis.document;
  const hadUmami = Object.prototype.hasOwnProperty.call(globalThis, 'umami');
  const originalUmami = globalThis.umami;
  let loadListener;
  const payloads = [];

  try {
    globalThis.document = {
      querySelector() {
        return {
          addEventListener(type, listener, options) {
            assert.equal(type, 'load');
            assert.deepEqual(options, { once: true });
            loadListener = listener;
          },
        };
      },
    };
    delete globalThis.umami;
    const freshModule = await import(`${moduleUrl}?late-umami=${Date.now()}`);
    const analytics = freshModule.createProjectReviewAnalytics();

    assert.equal(analytics.success(), false);
    assert.equal(typeof loadListener, 'function');
    globalThis.umami = { track: (payload) => payloads.push(payload) };
    loadListener();
    loadListener();

    assert.deepEqual(payloads, [{
      website: freshModule.UMAMI_WEBSITE_ID,
      url: '/',
      name: freshModule.EVENT_NAMES.success,
    }]);
  } finally {
    if (hadDocument) globalThis.document = originalDocument;
    else delete globalThis.document;
    if (hadUmami) globalThis.umami = originalUmami;
    else delete globalThis.umami;
  }
});
