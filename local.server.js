// server.js

// -----------------------------
// 0) Environment variables (.env)
// -----------------------------
// Expects a .env file in the same folder containing:
//
// SPOTIFY_CLIENT_ID=your_client_id_here
// SPOTIFY_CLIENT_SECRET=your_client_secret_here
// SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
// SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
//
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------
// 1) Spotify config
// -----------------------------
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// If you're on Node < 18 and "fetch" is not defined, uncomment this block
// and run: npm install node-fetch
//
//const fetch = (...args) =>
//import('node-fetch').then(({ default: fetch }) => fetch(...args));

// -----------------------------
// 2) Static files
//    Serves index.html, styles.css, script.js, etc.
// -----------------------------
app.use(express.static(path.join(__dirname)));

// -----------------------------
// 3) Simple health check
// -----------------------------
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', time: new Date().toISOString() });
});

// -----------------------------
// 4) Spotify OAuth – /login and /callback
//    Used once to obtain your REFRESH TOKEN.
// -----------------------------

// /login – send you to Spotify's consent screen
app.get('/login', (req, res) => {
  const scope = 'user-read-currently-playing user-read-playback-state';

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
  });

  const authorizeUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  res.redirect(authorizeUrl);
});

// /callback – Spotify redirects here with ?code=...
app.get('/callback', async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;

  if (error) {
    return res.send(`Spotify auth error: ${error}`);
  }
  if (!code) {
    return res.send('No "code" query parameter provided.');
  }

  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    });

    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`,
      },
      body: body.toString(),
    });

    const tokenData = await tokenRes.json();
    console.log('Spotify token response:', tokenData);

    if (!tokenData.refresh_token) {
      return res.send(
        '<h1>No refresh_token returned</h1><p>Check the server console for the full response.</p>'
      );
    }

    // Show refresh token so you can copy it into .env
    res.send(`
      <h1>Spotify Refresh Token</h1>
      <p>Copy this value and paste it into your <code>.env</code> file as <code>SPOTIFY_REFRESH_TOKEN</code>:</p>
      <pre>${tokenData.refresh_token}</pre>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error exchanging code for tokens');
  }
});

// -----------------------------
// 5) Helpers for real "Now Playing"
// -----------------------------

// Exchange refresh token for a short-lived access token
async function getAccessTokenFromRefreshToken() {
  if (!REFRESH_TOKEN) {
    throw new Error('SPOTIFY_REFRESH_TOKEN is not set in .env');
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN,
  });

  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`,
    },
    body: body.toString(),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Error getting access token:', data);
    throw new Error(data.error_description || 'Failed to get access token');
  }

  return data.access_token;
}

// Call Spotify "currently playing" endpoint and normalize the data
async function getNowPlaying(accessToken) {
  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  // 204/202 means nothing is currently playing
  if (res.status === 204 || res.status === 202) {
    return { isPlaying: false };
  }

  const data = await res.json();

  if (!res.ok) {
    console.error('Error from Spotify now playing:', data);
    throw new Error(data.error?.message || 'Failed to fetch now playing');
  }

  if (!data || !data.item) {
    return { isPlaying: false };
  }

  const item = data.item;
  const progressMs = data.progress_ms ?? 0;
  const durationMs = item.duration_ms ?? 0;

  return {
    isPlaying: !!data.is_playing,
    title: item.name,
    artist: item.artists?.map((a) => a.name).join(', ') || '',
    album: item.album?.name || '',
    albumImageUrl: item.album?.images?.[0]?.url || null,
    progressMs,
    durationMs,
    trackUrl: item.external_urls?.spotify || null,
  };
}

// -----------------------------
// 6) Real /api/spotify endpoint
//    Front-end fetches this to render the card.
// -----------------------------
app.get('/api/spotify', async (req, res) => {
  try {
    console.log('GET /api/spotify (real Spotify)');

    const accessToken = await getAccessTokenFromRefreshToken();
    const nowPlaying = await getNowPlaying(accessToken);

    res.json(nowPlaying);
  } catch (err) {
    console.error('Error in /api/spotify:', err);
    res.status(500).json({
      isPlaying: false,
      error: 'Unable to fetch from Spotify',
    });
  }
});

// -----------------------------
// 7) Start server
// -----------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});