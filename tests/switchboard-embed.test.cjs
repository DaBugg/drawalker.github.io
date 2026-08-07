const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");
const assert = require("node:assert/strict");

const moduleUrl = pathToFileURL(
  path.resolve(__dirname, "../src/switchboard-embed.mjs"),
).href;

function createHarness({ initialSource = "/switchboard.html" } = {}) {
  const frameListeners = new Map();
  const windowListeners = new Map();
  const shellAttributes = new Map();
  const timers = new Map();
  let frameSource = initialSource;
  let sourceAssignments = 0;
  let nextTimer = 1;

  const frame = {
    dataset: { src: "/switchboard.html" },
    style: {},
    hidden: false,
    contentWindow: {},
    contentDocument: null,
    addEventListener(type, handler) {
      frameListeners.set(type, handler);
    },
    getAttribute(name) {
      return name === "src" ? frameSource : null;
    },
    removeAttribute(name) {
      if (name === "src") frameSource = undefined;
    },
  };
  Object.defineProperty(frame, "src", {
    get() {
      return frameSource;
    },
    set(value) {
      frameSource = value;
      sourceAssignments += 1;
    },
  });

  const shell = {
    setAttribute(name, value) {
      shellAttributes.set(name, value);
    },
  };
  const placeholder = { hidden: true };
  const status = { hidden: true, textContent: "" };
  const elements = new Map([
    ["[data-switchboard-frame]", frame],
    ["[data-switchboard-shell]", shell],
    ["[data-switchboard-placeholder]", placeholder],
    ["[data-switchboard-status]", status],
  ]);
  const root = {
    querySelector(selector) {
      return elements.get(selector) || null;
    },
  };
  const windowImpl = {
    location: { origin: "https://www.networksandnodes.org" },
    addEventListener(type, handler) {
      windowListeners.set(type, handler);
    },
    setTimeout(handler) {
      const id = nextTimer;
      nextTimer += 1;
      timers.set(id, handler);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };

  return {
    frame,
    frameListeners,
    get sourceAssignments() {
      return sourceAssignments;
    },
    placeholder,
    root,
    runTimers() {
      const callbacks = [...timers.values()];
      timers.clear();
      callbacks.forEach((callback) => callback());
    },
    shellAttributes,
    status,
    windowImpl,
    windowListeners,
  };
}

test("switchboard begins exactly one automatic request from initial or deferred markup", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);

  const initial = createHarness();
  const initialController = initializeSwitchboardEmbed({
    root: initial.root,
    windowImpl: initial.windowImpl,
  });
  assert.ok(initialController);
  assert.equal(initial.frame.src, "/switchboard.html");
  assert.equal(initial.sourceAssignments, 0);
  assert.equal(initial.shellAttributes.get("aria-busy"), "true");
  assert.equal(initial.placeholder.hidden, true);
  assert.equal(initial.frame.hidden, false);
  initialController.requestExplorer();
  assert.equal(initial.sourceAssignments, 0);

  const deferred = createHarness({ initialSource: null });
  const deferredController = initializeSwitchboardEmbed({
    root: deferred.root,
    windowImpl: deferred.windowImpl,
  });
  assert.equal(deferred.frame.src, "/switchboard.html");
  assert.equal(deferred.sourceAssignments, 1);
  assert.equal(deferred.status.textContent, "Loading the interactive explorer.");
  deferredController.requestExplorer();
  assert.equal(deferred.sourceAssignments, 1);
});

test("load and trusted height messages complete the request and clamp dimensions", async () => {
  const { initializeSwitchboardEmbed, MAXIMUM_HEIGHT, MINIMUM_HEIGHT } = await import(moduleUrl);
  const harness = createHarness();
  initializeSwitchboardEmbed({ root: harness.root, windowImpl: harness.windowImpl });
  harness.frameListeners.get("load")();

  assert.equal(harness.shellAttributes.get("aria-busy"), "false");
  assert.equal(harness.placeholder.hidden, true);
  assert.equal(harness.frame.hidden, false);

  const handleMessage = harness.windowListeners.get("message");
  const initialHeight = harness.frame.style.height;
  for (const event of [
    {
      origin: "https://attacker.example",
      source: harness.frame.contentWindow,
      data: { type: "networks-nodes-switchboard-height", height: 2200 },
    },
    {
      origin: harness.windowImpl.location.origin,
      source: {},
      data: { type: "networks-nodes-switchboard-height", height: 2200 },
    },
    {
      origin: harness.windowImpl.location.origin,
      source: harness.frame.contentWindow,
      data: { type: "unrelated-message", height: 2200 },
    },
  ]) {
    handleMessage(event);
    assert.equal(harness.frame.style.height, initialHeight);
  }

  handleMessage({
    origin: harness.windowImpl.location.origin,
    source: harness.frame.contentWindow,
    data: { type: "networks-nodes-switchboard-height", height: 99999 },
  });
  assert.equal(harness.frame.style.height, `${MAXIMUM_HEIGHT}px`);

  handleMessage({
    origin: harness.windowImpl.location.origin,
    source: harness.frame.contentWindow,
    data: { type: "networks-nodes-switchboard-height", height: 40 },
  });
  assert.equal(harness.frame.style.height, `${MINIMUM_HEIGHT}px`);
});

test("switchboard errors reveal the fallback and permit a clean automatic retry", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);
  const harness = createHarness();
  const controller = initializeSwitchboardEmbed({
    root: harness.root,
    windowImpl: harness.windowImpl,
  });

  harness.frameListeners.get("error")();
  assert.equal(harness.frame.hidden, true);
  assert.equal(harness.placeholder.hidden, false);
  assert.equal(harness.shellAttributes.get("aria-busy"), "false");
  assert.match(harness.status.textContent, /could not be loaded/);

  controller.requestExplorer();
  assert.equal(harness.frame.src, "/switchboard.html");
  assert.equal(harness.sourceAssignments, 1);
  assert.equal(harness.shellAttributes.get("aria-busy"), "true");
});

test("switchboard timeout fails back safely", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);
  const harness = createHarness();
  initializeSwitchboardEmbed({ root: harness.root, windowImpl: harness.windowImpl });
  harness.runTimers();

  assert.equal(harness.frame.hidden, true);
  assert.equal(harness.placeholder.hidden, false);
  assert.equal(harness.shellAttributes.get("aria-busy"), "false");
  assert.match(harness.status.textContent, /too long to load/);
});

test("automatic switchboard loading never requests focus", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);
  const harness = createHarness();
  harness.frame.focus = () => assert.fail("automatic loading must not move focus");
  initializeSwitchboardEmbed({ root: harness.root, windowImpl: harness.windowImpl });
  harness.frameListeners.get("load")();
  assert.equal(harness.frame.hidden, false);
});

test("switchboard initialization exits safely when required markup is absent", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);
  const root = { querySelector: () => null };
  const windowImpl = { addEventListener: () => assert.fail("no listener should be registered") };

  assert.equal(initializeSwitchboardEmbed({ root, windowImpl }), null);
});
