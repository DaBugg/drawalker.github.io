// api/spotify-login.js
// Redirects you to Spotify's authorization screen to get a code.

module.exports = (req, res) => {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env;
  
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
      console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI');
      return res
        .status(500)
        .send('Spotify client id / redirect URI env vars not set');
    }
  
    // Scopes required to read your current playback
    const scopes = [
      'user-read-currently-playing',
      'user-read-playback-state',
    ].join(' ');
  
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    });
  
    const authorizeUrl =
      'https://accounts.spotify.com/authorize?' + params.toString();
  
    res.redirect(authorizeUrl);
  };
  