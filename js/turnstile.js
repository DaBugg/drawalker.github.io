(function (global) {
  let scriptPromise = null;

  function loadTurnstileScript() {
    if (global.turnstile) return Promise.resolve();
    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Turnstile'));
      document.head.appendChild(script);
    });

    return scriptPromise;
  }

  async function fetchSiteKey() {
    try {
      const response = await fetch('/api/turnstile-config', { cache: 'no-store' });
      if (!response.ok) return '';
      const data = await response.json();
      return data.siteKey || '';
    } catch (_) {
      return '';
    }
  }

  async function render(container, options) {
    if (!container) return null;

    const siteKey = (options && options.siteKey) || (await fetchSiteKey());
    if (!siteKey) return null;

    await loadTurnstileScript();
    if (!global.turnstile) return null;

    return global.turnstile.render(container, {
      sitekey: siteKey,
      theme: (options && options.theme) || 'auto',
      callback: options && options.callback,
      'expired-callback': options && options.onExpire,
      'error-callback': options && options.onError,
    });
  }

  function remove(widgetId) {
    if (widgetId == null || !global.turnstile) return;
    global.turnstile.remove(widgetId);
  }

  function reset(widgetId) {
    if (widgetId == null || !global.turnstile) return;
    global.turnstile.reset(widgetId);
  }

  global.siteTurnstile = {
    loadTurnstileScript,
    fetchSiteKey,
    render,
    remove,
    reset,
  };
})(window);
