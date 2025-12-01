const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { songName, artist } = req.body || {};

  if (!songName || !songName.trim()) {
    res.status(400).send('Song name is required');
    return;
  }

  try {
    // Same SMTP setup as send-quote.js
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlBody = `
      <h2>New Spotify Song Suggestion</h2>
      <p><strong>Song name:</strong> ${songName}</p>
      <p><strong>Artist:</strong> ${artist && artist.trim() ? artist : 'Not provided'}</p>
      <hr />
      <p>This suggestion was submitted from the Spotify section of your portfolio site.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `New song suggestion: ${songName}`,
      html: htmlBody,
    });

    // Same UX as send-quote.js
    res.writeHead(303, { Location: '/thank-you.html' });
    res.end();
  } catch (err) {
    console.error('Error sending song suggestion:', err);
    res
      .status(500)
      .send('There was a problem sending your suggestion. Please try again later.');
  }
};
