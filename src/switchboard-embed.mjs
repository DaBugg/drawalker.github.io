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
  const status = root.querySelector('[data-switchboard-status]');
  if (!frame || !shell || !placeholder || !status) return null;

  let hasRequested = Boolean(frame.getAttribute('src'));
  let loadTimer = null;

  const clearLoadTimer = () => {
    clearTimer(loadTimer);
    loadTimer = null;
  };

  const resetRequest = (message) => {
    clearLoadTimer();
    hasRequested = false;
    shell.setAttribute('aria-busy', 'false');
    frame.hidden = true;
    placeholder.hidden = false;
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
    shell.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading the interactive explorer.';
    status.hidden = false;
    placeholder.hidden = true;
    frame.hidden = false;
    clearLoadTimer();
    loadTimer = setTimer(() => {
      resetRequest('The interactive explorer took too long to load. The service overview remains available.');
    }, loadTimeout);
    frame.src = source;
  };

  windowImpl.addEventListener('message', (event) => {
    if (frame.hidden) return;
    if (event.origin !== windowImpl.location.origin) return;
    if (event.source !== frame.contentWindow) return;
    if (event.data?.type !== 'networks-nodes-switchboard-height') return;
    applyHeight(Number(event.data.height));
  });

  const handleFrameLoad = () => {
    if (!hasRequested) return;
    const frameDocument = frame.contentDocument;
    if (!frameDocument?.querySelector('#capability-network')) {
      resetRequest('The interactive explorer could not be loaded. The service overview remains available.');
      return;
    }

    clearLoadTimer();
    shell.setAttribute('aria-busy', 'false');
    placeholder.hidden = true;
    frame.hidden = false;
    status.hidden = true;

    applyHeight(
      Math.max(
        frameDocument.body.scrollHeight,
        frameDocument.documentElement.scrollHeight,
      ),
    );

  };

  frame.addEventListener('load', handleFrameLoad);

  frame.addEventListener('error', () => {
    if (!hasRequested) return;
    resetRequest('The interactive explorer could not be loaded. The service overview remains available.');
  });

  if (hasRequested) {
    shell.setAttribute('aria-busy', 'true');
    placeholder.hidden = true;
    frame.hidden = false;
    loadTimer = setTimer(() => {
      resetRequest('The interactive explorer took too long to load. The service overview remains available.');
    }, loadTimeout);
    if (frame.contentDocument?.readyState === 'complete') {
      setTimer(handleFrameLoad, 0);
    }
  } else {
    requestExplorer();
  }

  return { requestExplorer };
}

export { DEFAULT_LOAD_TIMEOUT, MAXIMUM_HEIGHT, MINIMUM_HEIGHT };
