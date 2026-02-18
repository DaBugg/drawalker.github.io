// about-me.js — About Me page (Spotify + personal content)

function bootAboutMe() {
  setCurrentYear();
  initSpotifyCard();
  initMobileNav();
}

function initMobileNav() {
  const btn = document.getElementById('nav-hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !open);
    links.classList.toggle('nav-links--open', !open);
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      links.classList.remove('nav-links--open');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAboutMe);
} else {
  bootAboutMe();
}


// =====================================
// 1) Footer year + Dark-Light Toggle
// =====================================
function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

(function () {
  const root = document.documentElement;
  const STORAGE_KEY = "theme";

  const stored = localStorage.getItem(STORAGE_KEY);
  const initial =
    stored === "light" || stored === "dark"
      ? stored
      : "dark";

  root.setAttribute("data-theme", initial);

  const toggleBtn = document.querySelector("[data-theme-toggle]");
  if (!toggleBtn) return;

  const iconEl = toggleBtn.querySelector(".theme-toggle__icon");
  const labelEl = toggleBtn.querySelector(".theme-toggle__label");

  function syncToggleUI(theme) {
    if (!iconEl || !labelEl) return;
    if (theme === "light") {
      iconEl.textContent = "\u2600\uFE0F";
      labelEl.textContent = "Light mode";
    } else {
      iconEl.textContent = "\uD83C\uDF19";
      labelEl.textContent = "Dark mode";
    }
  }

  syncToggleUI(initial);

  toggleBtn.addEventListener("click", () => {
    const current =
      root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
    syncToggleUI(next);
  });
})();


// =====================================
// 2) Spotify polling + progress config
// =====================================
const SPOTIFY_IDLE_IMAGE = '/images/not_playing.png';
const SPOTIFY_POLL_INTERVAL_MS = 10000;
const SPOTIFY_PROGRESS_TICK_MS = 250;

let spotifyPollTimer = null;
let spotifyRequestInFlight = false;
let spotifyProgressTimer = null;

const spotifyPlaybackState = {
  isPlaying: false,
  durationMs: 0,
  progressMs: 0,
  lastUpdateTs: 0,
  trackId: null
};

function initSpotifyCard() {
  const card = document.getElementById('spotify-card');
  if (!card) return;

  fetchAndUpdateSpotify(card);

  spotifyPollTimer = setInterval(() => {
    fetchAndUpdateSpotify(card);
  }, SPOTIFY_POLL_INTERVAL_MS);

  // Suggest-a-song toggle
  const wrapper = document.getElementById('spotify-suggest');
  if (wrapper) {
    const toggle = wrapper.querySelector('.spotify-suggest__toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const isOpen = wrapper.classList.toggle('spotify-suggest--open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
  }
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

function startSpotifyProgressAnimation() {
  stopSpotifyProgressAnimation();
  if (!spotifyPlaybackState.isPlaying || !spotifyPlaybackState.durationMs) return;

  spotifyPlaybackState.lastUpdateTs = Date.now();

  spotifyProgressTimer = setInterval(() => {
    tickSpotifyProgress();
  }, SPOTIFY_PROGRESS_TICK_MS);
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

function formatMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
