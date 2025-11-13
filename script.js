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
  
  // 2) Initialize Spotify card (now using the backend API)
  function initSpotifyCard() {
    const card = document.getElementById('spotify-card');
    if (!card) return; // if the card isn't on the page, do nothing
  
    // Ask our Node server for the current-song data
    fetch('/api/spotify')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch /api/spotify');
        }
        return res.json();
      })
      .then((data) => {
        updateSpotifyCard(card, data);
      })
      .catch((err) => {
        console.error(err);
        // Show a friendly error state
        updateSpotifyCard(card, {
          isPlaying: false, // tells the card to use the "not playing" view
        });
      });
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
  
  // 4) Helper to turn milliseconds into M:SS
  function formatMs(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  