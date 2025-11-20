// api/send-quote.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

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
  } = req.body || {};

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

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Website Quote Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New website quote from ${name}`,
      html: htmlBody,
    });

    // For serverless, you can't do a traditional redirect to static file easily,
    // so just return JSON or a 200 and handle redirect in JS if you want.
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error sending quote email:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
