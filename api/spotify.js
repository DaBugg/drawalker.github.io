// api/spotify.js

// Node 18+ on Vercel has global `fetch`, so no import needed.

module.exports = async (req, res) => {
    try {
      const {
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET,
        SPOTIFY_REFRESH_TOKEN,
      } = process.env;
  
      if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
        console.error('Missing Spotify env vars');
        return res.status(500).json({
          isPlaying: false,
          error: 'Spotify environment variables not set',
        });
      }
  
      // 1) Exchange refresh token for access token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: SPOTIFY_REFRESH_TOKEN,
        }),
      });
  
      if (!tokenResponse.ok) {
        const text = await tokenResponse.text();
        console.error('Spotify token error:', tokenResponse.status, text);
        return res.status(500).json({
          isPlaying: false,
          error: 'Failed to get access token',
        });
      }
  
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
  
      if (!accessToken) {
        console.error('No access token in Spotify token response', tokenData);
        return res.status(500).json({
          isPlaying: false,
          error: 'No access token returned',
        });
      }
  
      // 2) Call “currently playing”
      const nowPlayingResponse = await fetch(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      // 204 = nothing playing
      if (nowPlayingResponse.status === 204) {
        return res.status(200).json({ isPlaying: false });
      }
  
      if (!nowPlayingResponse.ok) {
        const text = await nowPlayingResponse.text();
        console.error(
          'Spotify now playing error:',
          nowPlayingResponse.status,
          text
        );
        return res.status(500).json({
          isPlaying: false,
          error: 'Failed to get now playing',
        });
      }
  
      const nowPlaying = await nowPlayingResponse.json();
  
      if (!nowPlaying || !nowPlaying.item) {
        return res.status(200).json({ isPlaying: false });
      }
  
      const item = nowPlaying.item;
  
      const title = item.name || null;
      const artists = (item.artists || []).map((a) => a.name);
      const artist = artists.join(', ') || null;
      const album = item.album?.name || null;
      const albumImageUrl = item.album?.images?.[0]?.url || null;
      const trackUrl = item.external_urls?.spotify || null;
      const progressMs = nowPlaying.progress_ms ?? 0;
      const durationMs = item.duration_ms ?? 0;
  
      // Shape matches your updateSpotifyCard expectations
      return res.status(200).json({
        isPlaying: !!nowPlaying.is_playing,
        title,
        artist,
        album,
        albumImageUrl,
        progressMs,
        durationMs,
        trackUrl,
      });
    } catch (err) {
      console.error('Spotify handler error:', err);
      return res.status(500).json({
        isPlaying: false,
        error: 'Internal server error',
      });
    }
  };
  