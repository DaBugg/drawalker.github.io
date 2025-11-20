// email.js
const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');

// Load .env from project root
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middleware ----

// Log incoming requests (debug)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Serve static files (HTML, CSS, JS) from this folder
app.use(express.static(path.join(__dirname)));

// Parse form bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---- Email / quote logic ----

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,                  // e.g. smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,   // e.g. 587
  secure: false,                                // false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Handle POST /submit-quote from the form
app.post('/submit-quote', async (req, res) => {
  const {
    name,
    email,
    phone,
    contact,
    project_type,
    budget,
    date,
    time,
    details,
    newsletter,
  } = req.body;

  const wantsNewsletter = newsletter ? 'Yes' : 'No';

  const htmlBody = `
    <h2>New Website Quote Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <p><strong>Preferred contact:</strong> ${contact || 'N/A'}</p>
    <p><strong>Project type:</strong> ${project_type || 'N/A'}</p>
    <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
    <p><strong>Preferred date/time:</strong> ${date || 'N/A'} ${time || ''}</p>
    <p><strong>Newsletter opt-in:</strong> ${wantsNewsletter}</p>
    <hr />
    <p><strong>Project details:</strong></p>
    <p>${(details || '').replace(/\n/g, '<br>')}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Website Quote Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL, // your inbox
      replyTo: email,
      subject: `New website quote from ${name}`,
      html: htmlBody,
    });

    res.redirect('/thank-you.html');
  } catch (err) {
    console.error('Error sending quote email:', err);
    res.status(500).send('Error: ' + err.message);
  }
});

// Optional quick test route
app.get('/test', (req, res) => {
  res.send('Server is working');
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
