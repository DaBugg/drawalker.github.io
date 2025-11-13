// script.js

document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  initSpotifyCard();
});

// 1) Footer year
function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// 2) Initialize Spotify card with mock data (no backend yet)
function initSpotifyCard() {
  const card = document.getElementById('spotify-card');
  if (!card) return; // If card isn't on the page, do nothing

  // For now, this is just a hard-coded example.
  // Later we'll replace THIS with data from a real webserver.
  const mockData = {
    isPlaying: true,
    title: "Mock Song Title",
    artist: "Mock Artist",
    album: "Mock Album Name",
    albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273b1f24afcbec4e6c8059d18dd", // example cover
    progressMs: 73_000,  // 1:13
    durationMs: 210_000, // 3:30
    trackUrl: "https://open.spotify.com/track/0000000000000000000000"
  };

  updateSpotifyCard(card, mockData);
}

// 3) Update the DOM using a Spotify "now playing" object
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
    openLinkEl.href = 'https://open.spotify.com';
    return;
  }

  statusEl.textContent = 'Listening now';
  trackEl.textContent = data.title || 'Unknown track';
  artistEl.textContent = data.artist || 'Unknown artist';
  albumEl.textContent = data.album || '';

  if (data.albumImageUrl) {
    coverEl.src = data.albumImageUrl;
    coverEl.alt = `Album cover for ${data.album || data.title || 'track'}`;
  }

  if (typeof data.progressMs === 'number' && typeof data.durationMs === 'number' && data.durationMs > 0) {
    const percentage = (data.progressMs / data.durationMs) * 100;
    progressEl.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    currentTimeEl.textContent = formatMs(data.progressMs);
    durationEl.textContent = formatMs(data.durationMs);
  } else {
    progressEl.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
  }

  if (data.trackUrl) {
    openLinkEl.href = data.trackUrl;
  }
}

// 4) Helper to turn milliseconds into M:SS
function formatMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
