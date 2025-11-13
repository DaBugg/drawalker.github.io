// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Serve static files (HTML, CSS, JS, images) from this folder
app.use(express.static(path.join(__dirname)));

// 2) Example API endpoint: basic health check
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', time: new Date().toISOString() });
});

// 3) Spotify mock endpoint (same shape as our front-end mockData)
app.get('/api/spotify', (req, res) => {
    const mockData = {
      isPlaying: true,
      title: 'Hello from EXPRESS API',   // 👈 changed
      artist: 'Mock Artist',
      album: 'Mock Album Name',
      albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b273b1f24afcbec4e6c8059d18dd',
      progressMs: 73000,
      durationMs: 210000,
      trackUrl: 'https://open.spotify.com/track/0000000000000000000000'
    };
  
    console.log('GET /api/spotify');     // 👈 add this too
    res.json(mockData);
  });
  

// 4) Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
