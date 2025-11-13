// spotify.js

/***** CONFIG *****/
const CLIENT_ID = 'YOUR_CLIENT_ID'; // safe in browser
const REDIRECT_URI = 'c204b7df4d884c0e88fc1d5de9b50000'; // must match Dashboard entry
const SCOPES = ['user-read-currently-playing','user-read-playback-state'];

// ===== Option A: paste a short-lived user token here for quick testing =====
let MANUAL_TOKEN = ''; // e.g. 'BQD...'; leave empty to use Implicit Grant

/***** Helpers *****/
function saveToken(token, expiresInSec) {
  const data = { token, expiresAt: Date.now() + (expiresInSec * 1000) };
  localStorage.setItem('sp_token', JSON.stringify(data));
  return token;
}
function getSavedToken() {
  const raw = localStorage.getItem('sp_token');
  if (!raw) return null;
  try {
    const { token, expiresAt } = JSON.parse(raw);
    if (!token || Date.now() >= expiresAt) return null;
    return token;
  } catch { return null; }
}

function buildAuthUrl() {
  const url = new URL('https://accounts.spotify.com/authorize');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('response_type', 'token'); // Implicit Grant
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('scope', SCOPES.join(' '));
  url.searchParams.set('show_dialog', 'false');
  return url.toString();
}

function parseHashForToken() {
  // Handles the redirect back to REDIRECT_URI#access_token=...&expires_in=3600...
  if (window.location.hash.includes('access_token')) {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    const expiresIn = Number(params.get('expires_in') || 3600);
    window.history.replaceState({}, document.title, window.location.pathname); // clean hash
    return saveToken(accessToken, expiresIn);
  }
  return null;
}

async function getAccessToken() {
  // Priority: manual pasted token > saved token > hash token > prompt login
  if (MANUAL_TOKEN) return MANUAL_TOKEN;
  const saved = getSavedToken();
  if (saved) return saved;
  const fromHash = parseHashForToken();
  if (fromHash) return fromHash;

  // Kick off Implicit Grant login (Option B)
  window.location = buildAuthUrl();
  return null; // navigation will occur
}

/***** API *****/
async function fetchWebApi(endpoint, method='GET', body) {
  const token = await getAccessToken();
  if (!token) return null;
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (res.status === 204) return null; // nothing playing
  if (!res.ok) {
    // Token likely expired; clear and retry once
    localStorage.removeItem('sp_token');
    if (!MANUAL_TOKEN) {
      const again = await getAccessToken();
      if (again && again !== token) {
        return fetchWebApi(endpoint, method, body);
      }
    }
    throw new Error(`Spotify API error ${res.status}`);
  }
  return res.json();
}

/***** UI Update *****/
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? '';
}
function setImg(id, src, alt) {
  const img = document.getElementById(id);
  if (img && src) { img.src = src; img.alt = alt || 'Album cover'; }
}

function formatTime(ms) {
  if (ms == null) return '--:--';
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function setProgress(elapsedMs, durationMs) {
  const bar = document.querySelector('.spotify__bar > span');
  const elapsed = document.getElementById('spotify-elapsed');
  const duration = document.getElementById('spotify-duration');
  if (!bar || durationMs == null) return;
  const pct = Math.max(0, Math.min(100, (elapsedMs / durationMs) * 100));
  bar.style.width = `${pct}%`;
  if (elapsed) elapsed.textContent = formatTime(elapsedMs);
  if (duration) duration.textContent = formatTime(durationMs);
}

async function refreshNowPlaying() {
  const wrap = document.querySelector('.spotify');
  wrap?.classList.add('is-loading');

  try {
    const data = await fetchWebApi('v1/me/player/currently-playing', 'GET');
    if (!data || !data.item) {
      setText('spotify-track', 'Nothing playing');
      setText('spotify-artist', '');
      setText('spotify-album', '');
      setProgress(0, 0);
      return;
    }

    const item = data.item;
    const artists = item.artists?.map(a => a.name).join(', ') || '';
    const album = item.album?.name || '';
    const img = item.album?.images?.[0]?.url;

    setText('spotify-track', item.name || '—');
    setText('spotify-artist', artists);
    setText('spotify-album', album);
    if (img) setImg('spotify-cover', img, `${album} cover`);

    setProgress(data.progress_ms ?? 0, item.duration_ms ?? 0);
  } catch (e) {
    setText('spotify-track', 'Unable to load Spotify');
    setText('spotify-artist', '');
    setText('spotify-album', '');
  } finally {
    wrap?.classList.remove('is-loading');
  }
}

// initial + poll every 15s
document.addEventListener('DOMContentLoaded', () => {
  refreshNowPlaying();
  setInterval(refreshNowPlaying, 15000);
});
