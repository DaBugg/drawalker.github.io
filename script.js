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
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem(STORAGE_KEY, next);
      syncToggleUI(next);
    });
  })();


// =====================================
// Spotify polling config
// =====================================
const SPOTIFY_POLL_INTERVAL_MS = 10000; // 10 seconds
let spotifyPollTimer = null;
let spotifyRequestInFlight = false;

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
        isPlaying: false,
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
  const progressEl = document.getElementById('spotify-progress');
  const currentTimeEl = document.getElementById('spotify-current-time');
  const durationEl = document.getElementById('spotify-duration');
  const openLinkEl = document.getElementById('spotify-open-link');

  card.classList.remove('is-loading');

  if (!data || !data.isPlaying) {
    statusEl.textContent = 'Not playing anything right now';
    trackEl.textContent = '—';
    artistEl.textContent = '';
    albumEl.textContent = '';
    progressEl.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
    if (openLinkEl) openLinkEl.href = 'https://open.spotify.com';
    return;
  }

  statusEl.textContent = 'Listening now';
  trackEl.textContent = data.title || 'Unknown track';
  artistEl.textContent = data.artist || 'Unknown artist';
  albumEl.textContent = data.album || '';

  if (data.albumImageUrl && coverEl) {
    coverEl.src = data.albumImageUrl;
    coverEl.alt = `Album cover for ${data.album || data.title || 'track'}`;
  }

  if (
    typeof data.progressMs === 'number' &&
    typeof data.durationMs === 'number' &&
    data.durationMs > 0
  ) {
    const percentage = (data.progressMs / data.durationMs) * 100;
    progressEl.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    currentTimeEl.textContent = formatMs(data.progressMs);
    durationEl.textContent = formatMs(data.durationMs);
  } else {
    progressEl.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
  }

  if (data.trackUrl && openLinkEl) {
    openLinkEl.href = data.trackUrl;
  }
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