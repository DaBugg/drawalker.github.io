// local.server.js
const express = require('express');

const app = express();
const PORT = 3000; // hard-code for now

// Log every request so we know if anything is reaching the server
app.use((req, res, next) => {
  console.log('REQ:', req.method, req.url);
  next();
});

// Test route
app.get('/test', (req, res) => {
  res.send('OK from /test');
});

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Root is working');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
