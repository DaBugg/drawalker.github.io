/* Inline submit for Spotify "Suggest a Song" — avoids full-page redirect; shows on-page feedback. */
(function () {
  function parseJsonSafe(text) {
    try {
      return JSON.parse(text);
    } catch (_) {
      return null;
    }
  }

  function setFeedback(feedbackEl, title, subtitle, variant) {
    if (!feedbackEl) return;
    feedbackEl.hidden = false;
    feedbackEl.classList.remove('spotify-suggest__feedback--error', 'spotify-suggest__feedback--success');
    feedbackEl.classList.add(variant === 'error' ? 'spotify-suggest__feedback--error' : 'spotify-suggest__feedback--success');
    feedbackEl.innerHTML = '';
    const strong = document.createElement('strong');
    strong.className = 'spotify-suggest__feedback-title';
    strong.textContent = title;
    const span = document.createElement('span');
    span.className = 'spotify-suggest__feedback-sub';
    span.textContent = subtitle;
    feedbackEl.appendChild(strong);
    feedbackEl.appendChild(span);
  }

  function attachForm(form) {
    if (!form || form.dataset.spotifySuggestBound === '1') return;
    form.dataset.spotifySuggestBound = '1';

    let feedbackEl = document.getElementById('spotify-suggest-feedback');
    if (!feedbackEl) {
      feedbackEl = document.createElement('div');
      feedbackEl.id = 'spotify-suggest-feedback';
      feedbackEl.className = 'spotify-suggest__feedback';
      feedbackEl.setAttribute('role', 'status');
      feedbackEl.setAttribute('aria-live', 'polite');
      feedbackEl.hidden = true;
      form.appendChild(feedbackEl);
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const turnstileContainer = document.getElementById('spotify-suggest-turnstile');
    let turnstileWidgetId = null;
    let turnstileRequired = false;
    let turnstileReady = false;

    if (turnstileContainer && window.siteTurnstile) {
      window.siteTurnstile.fetchSiteKey().then((siteKey) => {
        if (!siteKey) {
          turnstileReady = true;
          return;
        }
        turnstileRequired = true;
        if (submitBtn) submitBtn.disabled = true;
        window.siteTurnstile.render(turnstileContainer, {
          siteKey,
          theme: 'auto',
          callback: () => {
            turnstileReady = true;
            if (submitBtn) submitBtn.disabled = false;
          },
          onExpire: () => {
            turnstileReady = false;
            if (submitBtn) submitBtn.disabled = true;
          },
          onError: () => {
            turnstileReady = false;
            if (submitBtn) submitBtn.disabled = true;
          },
        }).then((widgetId) => {
          turnstileWidgetId = widgetId;
        }).catch(() => {
          setFeedback(feedbackEl, 'Verification unavailable', 'Refresh the page and try again.', 'error');
          turnstileReady = false;
          if (submitBtn) submitBtn.disabled = true;
        });
      });
    } else {
      turnstileReady = true;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const songName = (fd.get('songName') || '').toString().trim();
      const artist = (fd.get('artist') || '').toString().trim();
      if (!songName) {
        setFeedback(feedbackEl, 'Add a song name', 'So I know what to look for.', 'error');
        return;
      }
      if (turnstileRequired && !turnstileReady) {
        setFeedback(feedbackEl, 'Verification needed', 'Complete the check before submitting.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      setFeedback(feedbackEl, 'Sending…', 'One moment.', 'success');

      try {
        const payload = Object.fromEntries(fd.entries());
        const res = await fetch(form.action || '/api/suggest-song', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        const data = text ? parseJsonSafe(text) : null;

        if (!res.ok) {
          const msg =
            (data && (data.error || data.message)) ||
            (res.status === 400 ? 'Song name is required.' : 'Could not send. Try again later.');
          setFeedback(feedbackEl, 'Not sent', msg, 'error');
          if (turnstileWidgetId != null && window.siteTurnstile) {
            window.siteTurnstile.reset(turnstileWidgetId);
            turnstileReady = false;
            if (submitBtn) submitBtn.disabled = turnstileRequired;
          }
          return;
        }

        form.reset();
        setFeedback(feedbackEl, 'Song Sent', 'Tune in to see if I listen.', 'success');
        if (turnstileWidgetId != null && window.siteTurnstile) {
          window.siteTurnstile.reset(turnstileWidgetId);
          turnstileReady = false;
          if (submitBtn) submitBtn.disabled = turnstileRequired;
        }
      } catch (_) {
        setFeedback(feedbackEl, 'Not sent', 'Network error. Try again in a moment.', 'error');
        if (turnstileWidgetId != null && window.siteTurnstile) {
          window.siteTurnstile.reset(turnstileWidgetId);
          turnstileReady = false;
          if (submitBtn) submitBtn.disabled = turnstileRequired;
        }
      } finally {
        if (submitBtn && (!turnstileRequired || turnstileReady)) {
          submitBtn.disabled = false;
        }
      }
    });
  }

  function boot() {
    attachForm(document.getElementById('spotify-suggest-form'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
