// email.js
const express = require('express');

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  console.log('REQ:', req.method, req.url);
  next();
});

app.get('/test', (req, res) => {
  res.send('OK from /test');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
