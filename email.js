// email.js
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Nodemailer transporter using env vars
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // 587 = false, 465 = true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /submit-quote
router.post('/submit-quote', async (req, res) => {
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

module.exports = router;
