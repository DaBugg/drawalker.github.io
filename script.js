// script.js

function bootApp() {
  setCurrentYear();
  initSpotifyCard();
  initSkillsLinksProjectsParticles();
}

// Run immediately if DOM is already ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
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

  // 1) Initial theme: load from storage or default to dark
  const stored = localStorage.getItem(STORAGE_KEY);
  const initial =
    stored === "light" || stored === "dark"
      ? stored
      : "dark"; // your requested default

  root.setAttribute("data-theme", initial);

  // 2) Wire up the toggle button
  const toggleBtn = document.querySelector("[data-theme-toggle]");
  if (!toggleBtn) return;

  const iconEl = toggleBtn.querySelector(".theme-toggle__icon");
  const labelEl = toggleBtn.querySelector(".theme-toggle__label");

  function syncToggleUI(theme) {
    if (!iconEl || !labelEl) return;
    if (theme === "light") {
      iconEl.textContent = "☀️";
      labelEl.textContent = "Light mode";
    } else {
      iconEl.textContent = "🌙";
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
// Spotify polling + progress config
// =====================================
const SPOTIFY_IDLE_IMAGE = '/images/not_playing.png'; // adjust path if needed
const SPOTIFY_POLL_INTERVAL_MS = 10000;               // API call every 10s
const SPOTIFY_PROGRESS_TICK_MS = 250;                 // smooth bar tick

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

// =====================================
// 2) Initialize Spotify card (backend API)
// =====================================
function initSpotifyCard() {
  const card = document.getElementById('spotify-card');
  if (!card) {
    console.warn('[Spotify] #spotify-card not found in DOM');
    return; // if the card isn't on the page, do nothing
  }

  console.log('[Spotify] initSpotifyCard: starting polling for /api/spotify');

  // Initial fetch
  fetchAndUpdateSpotify(card);

  // Poll every 10 seconds
  spotifyPollTimer = setInterval(() => {
    fetchAndUpdateSpotify(card);
  }, SPOTIFY_POLL_INTERVAL_MS);
}

// Helper: do one fetch + DOM update
function fetchAndUpdateSpotify(card) {
  // Prevent overlapping requests if one is still in flight
  if (spotifyRequestInFlight) {
    console.log('[Spotify] Skipping poll; request already in flight');
    return;
  }

  spotifyRequestInFlight = true;
  console.log('[Spotify] fetch /api/spotify');

  // Ask our Vercel API for the current-song data
  fetch('/api/spotify', { cache: 'no-store' })
    .then((res) => {
      console.log('[Spotify] /api/spotify status:', res.status);
      if (!res.ok) {
        throw new Error('Failed to fetch /api/spotify');
      }
      return res.json();
    })
    .then((data) => {
      console.log('[Spotify] /api/spotify payload:', data);
      updateSpotifyCard(card, data);
    })
    .catch((err) => {
      console.error('[Spotify] Error fetching /api/spotify:', err);
      // Fallback to "not playing" view on error
      updateSpotifyCard(card, {
        isPlaying: false
      });
    })
    .finally(() => {
      spotifyRequestInFlight = false;
    });
}

// =====================================
// 3) Update the DOM using a Spotify "now playing" object
// =====================================
function updateSpotifyCard(card, data) {
  const coverEl = document.getElementById('spotify-cover');
  const trackEl = document.getElementById('spotify-track');
  const artistEl = document.getElementById('spotify-artist');
  const albumEl = document.getElementById('spotify-album');
  const statusEl = document.getElementById('spotify-status');
  const openLinkEl = document.getElementById('spotify-open-link');

  card.classList.remove('is-loading');

  // --- NOT PLAYING / IDLE STATE ----------------------------------
  if (!data || !data.isPlaying) {
    card.classList.add('spotify-card--idle');

    statusEl.textContent = 'Not currently listening to anything';
    trackEl.textContent = '—';
    artistEl.textContent = '';
    albumEl.textContent = '';

    if (openLinkEl) {
      openLinkEl.href = 'https://open.spotify.com';
    }

    // Swap album art to the "not playing" image
    if (coverEl) {
      coverEl.src = SPOTIFY_IDLE_IMAGE;
      coverEl.alt = 'No track currently playing';
    }

    // Stop animation + reset playback state
    spotifyPlaybackState.isPlaying = false;
    spotifyPlaybackState.durationMs = 0;
    spotifyPlaybackState.progressMs = 0;
    spotifyPlaybackState.trackId = null;
    spotifyPlaybackState.lastUpdateTs = 0;
    stopSpotifyProgressAnimation();
    renderSpotifyProgressFromState(); // sets bar + times to 0

    return;
  }

  // --- PLAYING STATE ---------------------------------------------
  card.classList.remove('spotify-card--idle');

  statusEl.textContent = 'Listening now';
  trackEl.textContent = data.title || 'Unknown track';
  artistEl.textContent = data.artist || 'Unknown artist';
  albumEl.textContent = data.album || '';

  if (data.albumImageUrl && coverEl) {
    coverEl.src = data.albumImageUrl;
    coverEl.alt = `Album cover for ${data.album || data.title || 'track'}`;
  }

  if (data.trackUrl && openLinkEl) {
    openLinkEl.href = data.trackUrl;
  }

  // Sync playback state with latest API payload
  spotifyPlaybackState.isPlaying = true;
  spotifyPlaybackState.durationMs =
    typeof data.durationMs === 'number' ? data.durationMs : 0;
  spotifyPlaybackState.progressMs =
    typeof data.progressMs === 'number' ? data.progressMs : 0;
  spotifyPlaybackState.trackId = data.trackId || data.id || null;
  spotifyPlaybackState.lastUpdateTs = Date.now();

  // Render once from the new ground truth, then start smooth animation
  renderSpotifyProgressFromState();
  startSpotifyProgressAnimation();
}

// =====================================
// Smooth progress animation helpers
// =====================================
function startSpotifyProgressAnimation() {
  // Clear any existing timer
  stopSpotifyProgressAnimation();

  if (!spotifyPlaybackState.isPlaying || !spotifyPlaybackState.durationMs) {
    return;
  }

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
  if (!spotifyPlaybackState.isPlaying || !spotifyPlaybackState.durationMs) {
    return;
  }

  const now = Date.now();
  const last = spotifyPlaybackState.lastUpdateTs || now;
  const elapsed = now - last;

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

// =====================================
// 4) Helper to turn milliseconds into M:SS
// =====================================
function formatMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}



// =====================================
// 5) Particles for Skills + Links + Projects section
// =====================================
//
// - Targets the combined wrapper: #skills-links-projects
// - Uses the overlay container:   #skillsParticlesContainer
// - Uses .cf-particle + @keyframes cf-float from CSS
//
function initSkillsLinksProjectsParticles() {
  const sectionEl = document.getElementById('skills-links-projects');
  const containerEl = document.getElementById('skillsParticlesContainer');

  // If the section or container doesn't exist, bail quietly
  if (!sectionEl || !containerEl) return;

  const PARTICLE_COUNT = 200; // tweak for more/less density

  function spawnParticles() {
    // Clear any existing particles (e.g. after a resize)
    containerEl.innerHTML = '';

    const W = sectionEl.offsetWidth || sectionEl.clientWidth || window.innerWidth;
    const H = sectionEl.offsetHeight || sectionEl.clientHeight || window.innerHeight;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'cf-particle';

      const size = 1 + Math.random() * 3;
      const startLeft = Math.random() * W;
      const startTop = Math.random() * H;

      // How far each particle drifts over the animation
      const dx = (Math.random() - 0.5) * W;   // drift left/right
      const dy = -H - Math.random() * 200;    // drift upward and off-screen

      const duration = 18 + Math.random() * 18; // 18–36s
      const delay = Math.random() * duration;

      Object.assign(p.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${startLeft}px`,
        top: `${startTop}px`,
        backgroundColor: `rgba(255, 255, 255, ${0.2 + Math.random() * 0.5})`,
        animation: `cf-float ${duration}s linear ${delay}s infinite`,
        willChange: 'transform, opacity'
      });

      // Feed offsets into the keyframes via CSS variables
      p.style.setProperty('--cf-move-x', `${dx}px`);
      p.style.setProperty('--cf-move-y', `${dy}px`);

      containerEl.appendChild(p);
    }
  }

  // Initial draw
  spawnParticles();

  // Rebuild particles on resize so they match new dimensions
  window.addEventListener('resize', spawnParticles);
}
