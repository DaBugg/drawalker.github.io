const path = require("node:path");
const { pathToFileURL } = require("node:url");
const test = require("node:test");
const assert = require("node:assert/strict");

const moduleUrl = pathToFileURL(
  path.resolve(__dirname, "../src/switchboard-embed.mjs"),
).href;

function createHarness() {
  const frameListeners = new Map();
  const windowListeners = new Map();
  const buttonListeners = new Map();
  const shellAttributes = new Map();
  const timers = new Map();
  let frameSource;
  let sourceAssignments = 0;
  let focusOptions;
  let nextTimer = 1;

  const frame = {
    dataset: { src: "/switchboard.html" },
    style: {},
    hidden: true,
    contentWindow: {},
    contentDocument: {
      body: { scrollHeight: 1480 },
      documentElement: { scrollHeight: 1525 },
      querySelector(selector) {
        return selector === "#capability-network" ? {} : null;
      },
    },
    addEventListener(type, handler) {
      frameListeners.set(type, handler);
    },
    focus(options) {
      focusOptions = options;
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
  const placeholder = { hidden: false };
  const status = { hidden: true, textContent: "" };
  const loadButton = {
    disabled: false,
    textContent: "Load interactive explorer",
    addEventListener(type, handler) {
      buttonListeners.set(type, handler);
    },
  };
  const elements = new Map([
    ["[data-switchboard-frame]", frame],
    ["[data-switchboard-shell]", shell],
    ["[data-switchboard-placeholder]", placeholder],
    ["[data-switchboard-load]", loadButton],
    ["[data-switchboard-status]", status],
  ]);
  const root = {
    activeElement: loadButton,
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
    buttonListeners,
    frame,
    frameListeners,
    get focusOptions() {
      return focusOptions;
    },
    get sourceAssignments() {
      return sourceAssignments;
    },
    loadButton,
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

test("switchboard document attaches once only after the explicit load action", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);
  const harness = createHarness();
  const controller = initializeSwitchboardEmbed({
    root: harness.root,
    windowImpl: harness.windowImpl,
  });

  assert.ok(controller);
  assert.equal(harness.frame.src, undefined);
  assert.equal(harness.sourceAssignments, 0);
  assert.equal(harness.placeholder.hidden, false);

  harness.buttonListeners.get("click")();
  assert.equal(harness.frame.src, "/switchboard.html");
  assert.equal(harness.sourceAssignments, 1);
  assert.equal(harness.shellAttributes.get("aria-busy"), "true");
  assert.equal(harness.loadButton.disabled, true);
  assert.equal(harness.loadButton.textContent, "Loading interactive explorer…");
  assert.equal(harness.status.hidden, false);
  assert.equal(harness.status.textContent, "Loading the interactive explorer.");

  controller.requestExplorer();
  assert.equal(harness.sourceAssignments, 1, "repeat requests must not reattach the iframe");

  harness.frameListeners.get("load")();
  assert.equal(harness.shellAttributes.get("aria-busy"), "false");
  assert.equal(harness.placeholder.hidden, true);
  assert.equal(harness.frame.hidden, false);
  assert.equal(harness.frame.style.height, "1525px");
  assert.deepEqual(harness.focusOptions, { preventScroll: true });
});

test("switchboard height messages require the expected origin and frame", async () => {
  const { initializeSwitchboardEmbed, MAXIMUM_HEIGHT, MINIMUM_HEIGHT } = await import(moduleUrl);
  const harness = createHarness();
  initializeSwitchboardEmbed({ root: harness.root, windowImpl: harness.windowImpl });
  harness.buttonListeners.get("click")();
  harness.frameListeners.get("load")();
  const handleMessage = harness.windowListeners.get("message");
  const initialHeight = harness.frame.style.height;

  handleMessage({
    origin: "https://attacker.example",
    source: harness.frame.contentWindow,
    data: { type: "networks-nodes-switchboard-height", height: 2200 },
  });
  assert.equal(harness.frame.style.height, initialHeight);

  handleMessage({
    origin: harness.windowImpl.location.origin,
    source: {},
    data: { type: "networks-nodes-switchboard-height", height: 2200 },
  });
  assert.equal(harness.frame.style.height, initialHeight);

  handleMessage({
    origin: harness.windowImpl.location.origin,
    source: harness.frame.contentWindow,
    data: { type: "unrelated-message", height: 2200 },
  });
  assert.equal(harness.frame.style.height, initialHeight);

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

test("switchboard failures restore the fallback and permit one clean retry", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);
  const harness = createHarness();
  initializeSwitchboardEmbed({ root: harness.root, windowImpl: harness.windowImpl });

  harness.buttonListeners.get("click")();
  harness.frameListeners.get("error")();
  assert.equal(harness.frame.src, undefined);
  assert.equal(harness.frame.hidden, true);
  assert.equal(harness.placeholder.hidden, false);
  assert.equal(harness.shellAttributes.get("aria-busy"), "false");
  assert.equal(harness.loadButton.disabled, false);
  assert.equal(harness.loadButton.textContent, "Try interactive explorer again");
  assert.match(harness.status.textContent, /could not be loaded/);

  harness.buttonListeners.get("click")();
  assert.equal(harness.frame.src, "/switchboard.html");
  assert.equal(harness.sourceAssignments, 2);
});

test("switchboard timeout and unexpected documents fail back safely", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);
  const timeoutHarness = createHarness();
  initializeSwitchboardEmbed({ root: timeoutHarness.root, windowImpl: timeoutHarness.windowImpl });
  timeoutHarness.buttonListeners.get("click")();
  timeoutHarness.runTimers();
  assert.equal(timeoutHarness.frame.src, undefined);
  assert.equal(timeoutHarness.loadButton.disabled, false);
  assert.match(timeoutHarness.status.textContent, /too long to load/);

  const markerHarness = createHarness();
  markerHarness.frame.contentDocument.querySelector = () => null;
  initializeSwitchboardEmbed({ root: markerHarness.root, windowImpl: markerHarness.windowImpl });
  markerHarness.buttonListeners.get("click")();
  markerHarness.frameListeners.get("load")();
  assert.equal(markerHarness.frame.src, undefined);
  assert.equal(markerHarness.placeholder.hidden, false);
  assert.match(markerHarness.status.textContent, /could not be loaded/);
});

test("switchboard load does not steal focus after the user moves elsewhere", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);
  const harness = createHarness();
  initializeSwitchboardEmbed({ root: harness.root, windowImpl: harness.windowImpl });
  harness.buttonListeners.get("click")();
  harness.root.activeElement = {};
  harness.frameListeners.get("load")();

  assert.equal(harness.frame.hidden, false);
  assert.equal(harness.focusOptions, undefined);
});

test("switchboard initialization exits safely when required markup is absent", async () => {
  const { initializeSwitchboardEmbed } = await import(moduleUrl);
  const root = { querySelector: () => null };
  const windowImpl = { addEventListener: () => assert.fail("no listener should be registered") };

  assert.equal(initializeSwitchboardEmbed({ root, windowImpl }), null);
});
