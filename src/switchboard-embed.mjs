const MINIMUM_HEIGHT = 900;
const MAXIMUM_HEIGHT = 3600;
const DEFAULT_LOAD_TIMEOUT = 15000;

export function initializeSwitchboardEmbed(options = {}) {
  const root = options.root || document;
  const windowImpl = options.windowImpl || window;
  const setTimer = options.setTimeoutImpl || windowImpl.setTimeout?.bind(windowImpl) || globalThis.setTimeout.bind(globalThis);
  const clearTimer = options.clearTimeoutImpl || windowImpl.clearTimeout?.bind(windowImpl) || globalThis.clearTimeout.bind(globalThis);
  const loadTimeout = options.loadTimeout || DEFAULT_LOAD_TIMEOUT;
  const frame = root.querySelector('[data-switchboard-frame]');
  const shell = root.querySelector('[data-switchboard-shell]');
  const placeholder = root.querySelector('[data-switchboard-placeholder]');
  const loadButton = root.querySelector('[data-switchboard-load]');
  const status = root.querySelector('[data-switchboard-status]');
  if (!frame || !shell || !placeholder || !loadButton || !status) return null;

  let hasRequested = false;
  let loadTimer = null;
  let shouldTransferFocus = false;

  const clearLoadTimer = () => {
    clearTimer(loadTimer);
    loadTimer = null;
  };

  const resetRequest = (message) => {
    clearLoadTimer();
    hasRequested = false;
    shouldTransferFocus = false;
    shell.setAttribute('aria-busy', 'false');
    frame.hidden = true;
    frame.removeAttribute('src');
    placeholder.hidden = false;
    loadButton.disabled = false;
    loadButton.textContent = 'Try interactive explorer again';
    status.textContent = message;
    status.hidden = false;
  };

  const applyHeight = (nextHeight) => {
    if (!Number.isFinite(nextHeight)) return;
    frame.style.height = `${Math.min(
      MAXIMUM_HEIGHT,
      Math.max(MINIMUM_HEIGHT, Math.ceil(nextHeight)),
    )}px`;
  };

  const requestExplorer = () => {
    if (hasRequested) return;
    const source = frame.dataset.src;
    if (!source) return;

    hasRequested = true;
    shouldTransferFocus = root.activeElement === loadButton;
    shell.setAttribute('aria-busy', 'true');
    loadButton.disabled = true;
    loadButton.textContent = 'Loading interactive explorer…';
    status.textContent = 'Loading the interactive explorer.';
    status.hidden = false;
    clearLoadTimer();
    loadTimer = setTimer(() => {
      resetRequest('The interactive explorer took too long to load. The service overview remains available.');
    }, loadTimeout);
    frame.src = source;
  };

  loadButton.addEventListener('click', requestExplorer);

  windowImpl.addEventListener('message', (event) => {
    if (!hasRequested || frame.hidden) return;
    if (event.origin !== windowImpl.location.origin) return;
    if (event.source !== frame.contentWindow) return;
    if (event.data?.type !== 'networks-nodes-switchboard-height') return;
    applyHeight(Number(event.data.height));
  });

  frame.addEventListener('load', () => {
    if (!hasRequested) return;
    const frameDocument = frame.contentDocument;
    if (!frameDocument?.querySelector('#capability-network')) {
      resetRequest('The interactive explorer could not be loaded. The service overview remains available.');
      return;
    }

    const transferFocus = shouldTransferFocus && root.activeElement === loadButton;
    clearLoadTimer();
    shell.setAttribute('aria-busy', 'false');
    placeholder.hidden = true;
    frame.hidden = false;

    applyHeight(
      Math.max(
        frameDocument.body.scrollHeight,
        frameDocument.documentElement.scrollHeight,
      ),
    );

    if (transferFocus) frame.focus({ preventScroll: true });
  });

  frame.addEventListener('error', () => {
    if (!hasRequested) return;
    resetRequest('The interactive explorer could not be loaded. The service overview remains available.');
  });

  return { requestExplorer };
}

export { DEFAULT_LOAD_TIMEOUT, MAXIMUM_HEIGHT, MINIMUM_HEIGHT };
