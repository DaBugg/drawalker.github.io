const nodemailer = require('nodemailer');

function parseUrlEncoded(raw) {
  const params = new URLSearchParams(raw);
  const out = {};
  for (const [key, value] of params.entries()) out[key] = value;
  return out;
}

function parseBody(req) {
  if (!req.body) return {};
  if (Buffer.isBuffer(req.body)) {
    const raw = req.body.toString('utf8');
    try {
      return JSON.parse(raw);
    } catch (_) {
      return parseUrlEncoded(raw);
    }
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (_) {
      return parseUrlEncoded(req.body);
    }
  }
  return req.body;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  const body = parseBody(req);
  const songName = (body.songName || body.song_name || '').trim();
  const artist = (body.artist || '').trim();

  if (!songName) {
    res.status(400).json({ ok: false, error: 'Song name is required.' });
    return;
  }

  const host = process.env.SMTP_HOST || 'smtp.porkbun.com';
  const port = Number(process.env.SMTP_PORT) || 587;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlBody = `
      <h2>New Spotify Song Suggestion</h2>
      <p><strong>Song name:</strong> ${songName}</p>
      <p><strong>Artist:</strong> ${artist ? artist : 'Not provided'}</p>
      <hr />
      <p>This suggestion was submitted from the Spotify section of your portfolio site.</p>
    `;

  const textBody = [
    'New Spotify Song Suggestion',
    `Song name: ${songName}`,
    `Artist: ${artist || 'Not provided'}`,
    '',
    'Submitted from portfolio Spotify section.',
  ].join('\n');

  try {
    await transporter.sendMail({
      from: `"Spotify song suggestion" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `New song suggestion: ${songName}`,
      text: textBody,
      html: htmlBody,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error sending song suggestion:', err);
    res.status(500).json({
      ok: false,
      error: 'There was a problem sending your suggestion. Please try again later.',
    });
  }
};
