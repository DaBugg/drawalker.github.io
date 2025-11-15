// api/spotify-callback.js
// Handles the redirect back from Spotify, exchanges ?code= for tokens,
// and prints the refresh_token so you can copy it into Vercel envs.

module.exports = async (req, res) => {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
      process.env;
  
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
      console.error('Missing Spotify env vars for callback');
      return res
        .status(500)
        .send('Spotify env vars (client id/secret/redirect) not set');
    }
  
    const code = req.query.code;
  
    if (!code) {
      return res.status(400).send('Missing "code" query param');
    }
  
    try {
      const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
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
          grant_type: 'authorization_code',
          code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }),
      });
  
      if (!tokenRes.ok) {
        const text = await tokenRes.text();
        console.error('Spotify token exchange error:', tokenRes.status, text);
        return res
          .status(500)
          .send('Failed to exchange code for tokens. Check logs.');
      }
  
      const tokenData = await tokenRes.json();
      const { access_token, refresh_token, expires_in } = tokenData;
  
      console.log('Spotify tokenData:', tokenData);
  
      if (!refresh_token) {
        // Sometimes Spotify may not send a refresh token if one already exists for this client+user+scope
        // In that case you either reuse the old one, or revoke and re-authorize.
        return res
          .status(200)
          .send(
            'No refresh_token returned. Check server logs for tokenData. If you previously authorized this app, Spotify may not send a new refresh token.'
          );
      }
  
      // Show the refresh token in the browser so you can copy it
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(`
        <h1>Spotify Authorization Successful</h1>
        <p><strong>Copy this refresh_token and store it in Vercel as <code>SPOTIFY_REFRESH_TOKEN</code>:</strong></p>
        <pre style="white-space: pre-wrap; word-break: break-all; background: #111; color: #0f0; padding: 1rem; border-radius: 6px;">
  ${refresh_token}
        </pre>
        <p>Then redeploy your project. You can delete or disable the /api/spotify-login and /api/spotify-callback routes afterwards.</p>
        <p>Access token (temporary, for debugging):</p>
        <pre style="white-space: pre-wrap; word-break: break-all; background: #111; color: #ccc; padding: 1rem; border-radius: 6px;">
  ${access_token}
        </pre>
        <p>expires_in: ${expires_in} seconds</p>
      `);
    } catch (err) {
      console.error('Error in spotify-callback:', err);
      return res.status(500).send('Internal server error in callback');
    }
  };
  