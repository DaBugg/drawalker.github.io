const EVENT_NAMES = Object.freeze({
  ctaClick: 'project_review_cta_click',
  formStart: 'project_review_form_start',
  success: 'project_review_success',
  failure: 'project_review_failure',
});

const UMAMI_WEBSITE_ID = '88f9c391-5682-4761-a742-358c411cf28a';
const CTA_PLACEMENTS = new Set(['hero']);
const FAILURE_STAGES = new Set([
  'validation',
  'security',
  'network',
  'api',
  'delivery',
]);
const boundCtas = new WeakSet();
const pendingPayloads = [];
const MAX_PENDING_EVENTS = 8;
let trackerLoadListenerBound = false;

function settleWithoutBlocking(result) {
  if (result && typeof result.catch === 'function') result.catch(() => {});
}

function sendPayload(payload) {
  const track = globalThis.umami?.track;
  if (typeof track !== 'function') return false;

  const result = track.call(globalThis.umami, payload);
  settleWithoutBlocking(result);
  return true;
}

function flushPendingPayloads() {
  while (pendingPayloads.length > 0) {
    const payload = pendingPayloads[0];
    try {
      if (!sendPayload(payload)) return;
      pendingPayloads.shift();
    } catch (_) {
      return;
    }
  }
}

function bindTrackerLoadListener() {
  if (trackerLoadListenerBound || !globalThis.document) return;
  const tracker = globalThis.document.querySelector(
    `script[data-website-id="${UMAMI_WEBSITE_ID}"]`,
  );
  if (!tracker) return;

  trackerLoadListenerBound = true;
  tracker.addEventListener('load', flushPendingPayloads, { once: true });
}

function defaultTrack(payload) {
  try {
    flushPendingPayloads();
    if (sendPayload(payload)) return true;
  } catch (_) {
    // Keep only the fixed, bounded payload for one late-load retry.
  }

  if (pendingPayloads.length < MAX_PENDING_EVENTS) pendingPayloads.push(payload);
  bindTrackerLoadListener();
  return false;
}

function eventPayload(eventName, properties) {
  const payload = {
    website: UMAMI_WEBSITE_ID,
    url: '/',
    name: eventName,
  };
  if (properties !== undefined) payload.data = properties;
  return payload;
}

export function createProjectReviewAnalytics(options = {}) {
  const trackImpl = options.trackImpl || defaultTrack;

  const emit = (eventName, properties) => {
    try {
      const result = trackImpl(eventPayload(eventName, properties));
      settleWithoutBlocking(result);
      return result !== false;
    } catch (_) {
      return false;
    }
  };

  return Object.freeze({
    ctaClick(placement) {
      if (!CTA_PLACEMENTS.has(placement)) return false;
      return emit(EVENT_NAMES.ctaClick, { placement });
    },
    formStart() {
      return emit(EVENT_NAMES.formStart);
    },
    success() {
      return emit(EVENT_NAMES.success);
    },
    failure(stage) {
      if (!FAILURE_STAGES.has(stage)) return false;
      return emit(EVENT_NAMES.failure, { stage });
    },
  });
}

export function initializeProjectReviewCtaTracking(options = {}) {
  const root = options.root || document;
  const analytics = options.analytics || createProjectReviewAnalytics();
  const ctas = root.querySelectorAll('[data-project-review-cta]');

  ctas.forEach((cta) => {
    if (boundCtas.has(cta)) return;
    boundCtas.add(cta);
    let hasTracked = false;

    cta.addEventListener('click', () => {
      if (hasTracked) return;
      hasTracked = true;
      try {
        const result = analytics.ctaClick(cta.getAttribute('data-project-review-cta'));
        settleWithoutBlocking(result);
      } catch (_) {
        // Tracking must never interrupt the CTA's normal navigation.
      }
    }, { capture: true });
  });

  return { count: ctas.length };
}

export {
  CTA_PLACEMENTS,
  EVENT_NAMES,
  FAILURE_STAGES,
  UMAMI_WEBSITE_ID,
};
