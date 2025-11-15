// api/spotify.js

export default async function handler(req, res) {
    try {
      const {
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET,
        SPOTIFY_REFRESH_TOKEN,
      } = process.env;
  
      if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
        return res.status(500).json({ error: 'Spotify env vars not set' });
      }
  
      // 1) Get access token using refresh token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: SPOTIFY_REFRESH_TOKEN,
        }),
      });
  
      if (!tokenResponse.ok) {
        const text = await tokenResponse.text();
        console.error('Spotify token error:', text);
        return res.status(500).json({ error: 'Failed to get access token' });
      }
  
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
  
      // 2) Call currently-playing endpoint
      const nowPlayingResponse = await fetch(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (nowPlayingResponse.status === 204) {
        // No content = nothing playing
        return res.status(200).json({ playing: false });
      }
  
      if (!nowPlayingResponse.ok) {
        const text = await nowPlayingResponse.text();
        console.error('Spotify now playing error:', text);
        return res.status(500).json({ error: 'Failed to get now playing' });
      }
  
      const bodyText = await nowPlayingResponse.text();
      if (!bodyText) {
        return res.status(200).json({ playing: false });
      }
  
      const nowPlaying = JSON.parse(bodyText);
  
      const item = nowPlaying.item || {};
  
      return res.status(200).json({
        playing: !!nowPlaying.is_playing,
        track: {
          name: item.name || null,
          artists: (item.artists || []).map(a => a.name),
          album: item.album?.name || null,
          image: item.album?.images?.[0]?.url || null,
          url: item.external_urls?.spotify || null,
        },
      });
    } catch (err) {
      console.error('Spotify handler error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  