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

  // FALLBACKS so it never uses localhost even if env vars are missing
  const host = process.env.SMTP_HOST || 'smtp.porkbun.com';
  const port = Number(process.env.SMTP_PORT) || 587;

  console.log('Using SMTP:', { host, port });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
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

    // Redirect to thank-you page after successful send
    res.writeHead(303, { Location: '/thank-you.html' });
    res.end();
  } catch (err) {
    console.error('Error sending quote email:', err);
    // Simple error response for now
    res
      .status(500)
      .send('There was a problem sending your request. Please try again later.');
  }
};
