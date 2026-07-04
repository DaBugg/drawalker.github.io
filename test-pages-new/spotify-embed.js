/* Spotify card for Portfolio.html embed — same behavior as about-me.js (polling + progress). */
(function () {
  const SPOTIFY_IDLE_IMAGE = (() => {
    try {
      const el = document.querySelector('script[src*="spotify-embed"]');
      if (el && el.src) return new URL('../images/not_playing.png', el.src).href;
    } catch (_) {}
    return 'images/not_playing.png';
  })();
  const SPOTIFY_POLL_INTERVAL_MS = 10000;
  const SPOTIFY_PROGRESS_TICK_MS = 250;

  let spotifyPollTimer = null;
  let spotifyRequestInFlight = false;
  let spotifyProgressTimer = null;
  let suggestToggleHandler = null;
  let suggestSubmitHandler = null;
  let suggestTurnstileWidgetId = null;
  let suggestTurnstileRequired = false;
  let suggestTurnstileReady = false;

  const spotifyPlaybackState = {
    isPlaying: false,
    durationMs: 0,
    progressMs: 0,
    lastUpdateTs: 0,
    trackId: null,
  };

  function formatMs(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function renderSpotifyProgressFromState() {
    const progressEl = document.getElementById('spotify-progress');
    const currentTimeEl = document.getElementById('spotify-current-time');
    const durationEl = document.getElementById('spotify-duration');

    if (!progressEl || !currentTimeEl || !durationEl) return;

    const { progressMs, durationMs } = spotifyPlaybackState;

    if (!durationMs || durationMs <= 0) {
      progressEl.style.width = '0%';
      currentTimeEl.textContent = '0:00';
      durationEl.textContent = '0:00';
      return;
    }

    const percentage = (progressMs / durationMs) * 100;
    const clamped = Math.min(100, Math.max(0, percentage));

    progressEl.style.width = `${clamped}%`;
    currentTimeEl.textContent = formatMs(progressMs);
    durationEl.textContent = formatMs(durationMs);
  }

  function stopSpotifyProgressAnimation() {
    if (spotifyProgressTimer) {
      clearInterval(spotifyProgressTimer);
      spotifyProgressTimer = null;
    }
  }

  function tickSpotifyProgress() {
    if (!spotifyPlaybackState.isPlaying || !spotifyPlaybackState.durationMs) return;

    const now = Date.now();
    const elapsed = now - (spotifyPlaybackState.lastUpdateTs || now);
    spotifyPlaybackState.lastUpdateTs = now;
    spotifyPlaybackState.progressMs += elapsed;

    if (spotifyPlaybackState.progressMs > spotifyPlaybackState.durationMs) {
      spotifyPlaybackState.progressMs = spotifyPlaybackState.durationMs;
    }

    renderSpotifyProgressFromState();
  }

  function startSpotifyProgressAnimation() {
    stopSpotifyProgressAnimation();
    if (!spotifyPlaybackState.isPlaying || !spotifyPlaybackState.durationMs) return;

    spotifyPlaybackState.lastUpdateTs = Date.now();

    spotifyProgressTimer = setInterval(() => {
      tickSpotifyProgress();
    }, SPOTIFY_PROGRESS_TICK_MS);
  }

  function updateSpotifyCard(card, data) {
    const coverEl = document.getElementById('spotify-cover');
    const trackEl = document.getElementById('spotify-track');
    const artistEl = document.getElementById('spotify-artist');
    const albumEl = document.getElementById('spotify-album');
    const statusEl = document.getElementById('spotify-status');
    const openLinkEl = document.getElementById('spotify-open-link');

    card.classList.remove('is-loading');

    if (!data || !data.isPlaying) {
      card.classList.add('spotify-card--idle');
      statusEl.textContent = 'Not currently listening to anything';
      trackEl.textContent = '\u2014';
      artistEl.textContent = '';
      albumEl.textContent = '';

      if (openLinkEl) openLinkEl.href = 'https://open.spotify.com';
      if (coverEl) {
        coverEl.src = SPOTIFY_IDLE_IMAGE;
        coverEl.alt = 'No track currently playing';
      }

      spotifyPlaybackState.isPlaying = false;
      spotifyPlaybackState.durationMs = 0;
      spotifyPlaybackState.progressMs = 0;
      spotifyPlaybackState.trackId = null;
      spotifyPlaybackState.lastUpdateTs = 0;
      stopSpotifyProgressAnimation();
      renderSpotifyProgressFromState();
      return;
    }

    card.classList.remove('spotify-card--idle');
    statusEl.textContent = 'Listening now';
    trackEl.textContent = data.title || 'Unknown track';
    artistEl.textContent = data.artist || 'Unknown artist';
    albumEl.textContent = data.album || '';

    if (data.albumImageUrl && coverEl) {
      coverEl.src = data.albumImageUrl;
      coverEl.alt = `Album cover for ${data.album || data.title || 'track'}`;
    }

    if (data.trackUrl && openLinkEl) openLinkEl.href = data.trackUrl;

    spotifyPlaybackState.isPlaying = true;
    spotifyPlaybackState.durationMs = typeof data.durationMs === 'number' ? data.durationMs : 0;
    spotifyPlaybackState.progressMs = typeof data.progressMs === 'number' ? data.progressMs : 0;
    spotifyPlaybackState.trackId = data.trackId || data.id || null;
    spotifyPlaybackState.lastUpdateTs = Date.now();

    renderSpotifyProgressFromState();
    startSpotifyProgressAnimation();
  }

  function fetchAndUpdateSpotify(card) {
    if (spotifyRequestInFlight) return;

    spotifyRequestInFlight = true;

    fetch('/api/spotify', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch /api/spotify');
        return res.json();
      })
      .then((data) => {
        updateSpotifyCard(card, data);
      })
      .catch(() => {
        updateSpotifyCard(card, { isPlaying: false });
      })
      .finally(() => {
        spotifyRequestInFlight = false;
      });
  }

  function teardown() {
    if (spotifyPollTimer) {
      clearInterval(spotifyPollTimer);
      spotifyPollTimer = null;
    }
    stopSpotifyProgressAnimation();
    const toggle = document.querySelector('#spotify-suggest .spotify-suggest__toggle');
    if (toggle && suggestToggleHandler) {
      toggle.removeEventListener('click', suggestToggleHandler);
      suggestToggleHandler = null;
    }
    const form = document.getElementById('spotify-suggest-form');
    if (form && suggestSubmitHandler) {
      form.removeEventListener('submit', suggestSubmitHandler);
      suggestSubmitHandler = null;
    }
    if (suggestTurnstileWidgetId != null && window.siteTurnstile) {
      window.siteTurnstile.remove(suggestTurnstileWidgetId);
      suggestTurnstileWidgetId = null;
    }
    suggestTurnstileRequired = false;
    suggestTurnstileReady = false;
  }

  function ensureSuggestNotification(form) {
    let note = document.getElementById('spotify-suggest-feedback');
    if (!note) {
      note = document.createElement('p');
      note.id = 'spotify-suggest-feedback';
      note.style.margin = '0.3rem 0 0';
      note.style.fontSize = '0.78rem';
      note.style.letterSpacing = '0.02em';
      note.style.color = '#86efac';
      note.style.display = 'none';
      form.appendChild(note);
    }
    return note;
  }

  function init() {
    teardown();

    const card = document.getElementById('spotify-card');
    if (!card) return;

    fetchAndUpdateSpotify(card);

    spotifyPollTimer = setInterval(() => {
      fetchAndUpdateSpotify(card);
    }, SPOTIFY_POLL_INTERVAL_MS);

    const wrapper = document.getElementById('spotify-suggest');
    if (wrapper) {
      const toggle = wrapper.querySelector('.spotify-suggest__toggle');
      const form = document.getElementById('spotify-suggest-form');
      if (toggle) {
        suggestToggleHandler = () => {
          const isOpen = wrapper.classList.toggle('spotify-suggest--open');
          toggle.setAttribute('aria-expanded', String(isOpen));
        };
        toggle.addEventListener('click', suggestToggleHandler);
      }
      if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const feedback = ensureSuggestNotification(form);
        const turnstileContainer = document.getElementById('spotify-suggest-turnstile');

        if (turnstileContainer && window.siteTurnstile) {
          window.siteTurnstile.fetchSiteKey().then((siteKey) => {
            if (!siteKey || suggestTurnstileWidgetId != null) return;
            suggestTurnstileRequired = true;
            suggestTurnstileReady = false;
            if (submitBtn) submitBtn.disabled = true;
            window.siteTurnstile.render(turnstileContainer, {
              siteKey,
              theme: 'dark',
              callback: () => {
                suggestTurnstileReady = true;
                if (submitBtn) submitBtn.disabled = false;
              },
              onExpire: () => {
                suggestTurnstileReady = false;
                if (submitBtn) submitBtn.disabled = true;
              },
              onError: () => {
                suggestTurnstileReady = false;
                if (submitBtn) submitBtn.disabled = true;
              },
            }).then((widgetId) => {
              if (widgetId != null) suggestTurnstileWidgetId = widgetId;
            }).catch(() => {
              feedback.textContent = 'Verification could not load. Please refresh and try again.';
              feedback.style.color = '#fca5a5';
              feedback.style.display = 'block';
              suggestTurnstileReady = false;
              if (submitBtn) submitBtn.disabled = true;
            });
          });
        } else {
          suggestTurnstileRequired = true;
          suggestTurnstileReady = false;
          feedback.textContent = 'Verification could not load. Please refresh and try again.';
          feedback.style.color = '#fca5a5';
          feedback.style.display = 'block';
          if (submitBtn) submitBtn.disabled = true;
        }

        suggestSubmitHandler = async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const songName = String(formData.get('songName') || '').trim();
          const artist = String(formData.get('artist') || '').trim();
          if (!songName) return;
          if (suggestTurnstileRequired && !suggestTurnstileReady) {
            feedback.textContent = 'Please complete the verification check before submitting.';
            feedback.style.color = '#fca5a5';
            feedback.style.display = 'block';
            return;
          }
          if (submitBtn) submitBtn.disabled = true;
          feedback.style.display = 'none';
          try {
            const payload = Object.fromEntries(formData.entries());
            const response = await fetch(form.action || '/api/suggest-song', {
              method: form.method || 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Submission failed');
            form.reset();
            feedback.textContent = 'Your song has been submitted.';
            feedback.style.color = '#86efac';
            feedback.style.display = 'block';
            if (suggestTurnstileWidgetId != null && window.siteTurnstile) {
              window.siteTurnstile.reset(suggestTurnstileWidgetId);
              suggestTurnstileReady = false;
              if (submitBtn) submitBtn.disabled = suggestTurnstileRequired;
            }
          } catch (_) {
            feedback.textContent = 'Could not submit right now. Please try again.';
            feedback.style.color = '#fca5a5';
            feedback.style.display = 'block';
            if (suggestTurnstileWidgetId != null && window.siteTurnstile) {
              window.siteTurnstile.reset(suggestTurnstileWidgetId);
              suggestTurnstileReady = false;
              if (submitBtn) submitBtn.disabled = suggestTurnstileRequired;
            }
          } finally {
            if (submitBtn && (!suggestTurnstileRequired || suggestTurnstileReady)) {
              submitBtn.disabled = false;
            }
          }
        };
        form.addEventListener('submit', suggestSubmitHandler);
      }
    }
  }

  window.portfolioEmbedSpotify = { init, teardown };
})();
