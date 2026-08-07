const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");

const moduleUrl = pathToFileURL(
  path.resolve(__dirname, "../src/media-carousel.mjs"),
).href;

function createElement({ dataset = {}, hidden = false } = {}) {
  const attributes = new Map();
  const listeners = new Map();
  const classes = new Set();

  return {
    dataset: { ...dataset },
    hidden,
    textContent: "",
    style: { setProperty() {} },
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      contains: (name) => classes.has(name),
      toggle(name, force) {
        if (force === true) classes.add(name);
        else if (force === false) classes.delete(name);
        else if (classes.has(name)) classes.delete(name);
        else classes.add(name);
      },
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    emit(type) {
      assert.ok(listeners.has(type), `${type} listener must be registered`);
      return listeners.get(type)({ currentTarget: this });
    },
    hasListener(type) {
      return listeners.has(type);
    },
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
    getAttribute(name) {
      return attributes.get(name);
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
    animate() {},
  };
}

function createHarness({ reduceMotion = false } = {}) {
  const stage = createElement();
  const frame = createElement({ hidden: true });
  const poster = createElement();
  const conceptLink = createElement({ hidden: true });
  const status = createElement({ hidden: true });
  const motionToggle = createElement({ hidden: true });
  const count = createElement();
  const indexLabel = createElement();
  const title = createElement();
  const caption = createElement();
  const previous = createElement();
  const next = createElement();
  const selectors = [0, 1, 2, 3].map((index) => createElement({
    dataset: { videoSelect: String(index) },
  }));
  let playCount = 0;
  let pauseCount = 0;

  frame.play = () => {
    playCount += 1;
    return Promise.resolve();
  };
  frame.pause = () => {
    pauseCount += 1;
  };

  const elements = new Map([
    [".video-stage", stage],
    ["[data-video-frame]", frame],
    ["[data-video-poster]", poster],
    ["[data-video-concept]", conceptLink],
    ["[data-video-status]", status],
    ["[data-video-motion-toggle]", motionToggle],
    ["[data-video-count]", count],
    ["[data-video-index]", indexLabel],
    ["[data-video-label]", title],
    ["[data-video-caption]", caption],
    ["[data-video-previous]", previous],
    ["[data-video-next]", next],
  ]);
  const carousel = {
    querySelector: (selector) => elements.get(selector) || null,
    querySelectorAll: (selector) => selector === "[data-video-select]" ? selectors : [],
  };
  const root = {
    querySelector: (selector) => selector === "[data-video-carousel]" ? carousel : null,
  };
  const documentImpl = {
    hidden: false,
    readyState: "complete",
    addEventListener() {},
  };
  const windowImpl = {
    addEventListener() {},
    clearTimeout() {},
    matchMedia: () => ({ matches: reduceMotion }),
    setTimeout: () => 1,
  };

  return {
    caption,
    count,
    documentImpl,
    frame,
    get pauseCount() {
      return pauseCount;
    },
    get playCount() {
      return playCount;
    },
    motionToggle,
    next,
    previous,
    root,
    selectors,
    stage,
    windowImpl,
  };
}

const flushAsyncPlayback = () => new Promise((resolve) => setImmediate(resolve));

test("hero carousel autoloads and wires navigation without a Play or load action", async () => {
  const { initializeMediaCarousel, MEDIA_ITEMS } = await import(moduleUrl);
  const harness = createHarness();

  const controller = initializeMediaCarousel({
    root: harness.root,
    documentImpl: harness.documentImpl,
    windowImpl: harness.windowImpl,
    IntersectionObserverImpl: false,
    ensurePlayer: () => Promise.resolve(),
  });

  assert.ok(controller, "carousel must initialize with the motion-toggle markup");
  assert.equal(harness.motionToggle.hidden, true, "no Play/load control should be shown");
  assert.equal(harness.previous.hasListener("click"), true);
  assert.equal(harness.next.hasListener("click"), true);
  assert.equal(harness.motionToggle.hasListener("click"), true);
  assert.ok(harness.selectors.every((selector) => selector.hasListener("click")));

  await flushAsyncPlayback();
  assert.equal(harness.frame.dataset.activePlaybackId, MEDIA_ITEMS[0].playbackId);
  assert.ok(harness.playCount >= 1, "the first video must start without a user click");

  harness.frame.emit("playing");
  assert.equal(harness.motionToggle.hidden, false);
  assert.equal(harness.motionToggle.textContent, "Pause video");

  harness.next.emit("click");
  await flushAsyncPlayback();
  assert.equal(harness.frame.dataset.activePlaybackId, MEDIA_ITEMS[1].playbackId);

  harness.frame.emit("playing");
  harness.motionToggle.emit("click");
  assert.ok(harness.pauseCount >= 1);
  assert.equal(harness.motionToggle.textContent, "Resume video");

  const playsBeforeResume = harness.playCount;
  harness.motionToggle.emit("click");
  await flushAsyncPlayback();
  assert.ok(harness.playCount > playsBeforeResume);
  assert.equal(harness.motionToggle.textContent, "Pause video");
});

test("reduced-motion preference never becomes a video load gate", async () => {
  const { initializeMediaCarousel, MEDIA_ITEMS } = await import(moduleUrl);
  const harness = createHarness({ reduceMotion: true });

  initializeMediaCarousel({
    root: harness.root,
    documentImpl: harness.documentImpl,
    windowImpl: harness.windowImpl,
    IntersectionObserverImpl: false,
    ensurePlayer: () => Promise.resolve(),
  });

  await flushAsyncPlayback();
  assert.equal(harness.frame.dataset.activePlaybackId, MEDIA_ITEMS[0].playbackId);
  assert.ok(harness.playCount >= 1);
  assert.equal(harness.motionToggle.hidden, true, "the poster must not become a manual load prompt");
});
