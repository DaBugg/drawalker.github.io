const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  const parseUrlEncoded = (raw) => {
    const params = new URLSearchParams(raw);
    const out = {};
    for (const [key, value] of params.entries()) out[key] = value;
    return out;
  };

  const parseBody = () => {
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
  };

  const body = parseBody();
  const {
    role,
    service,
    name,
    email,
    work_links,
    workLinks,
    timeline,
    project,
    projectDetails,
    budget,
    // Backward-compat legacy fields:
    phone,
    contact,
    project_type,
    date,
    details,
    newsletter,
  } = body;

  const normalizedName = (name || '').trim();
  const normalizedEmail = (email || '').trim();
  const normalizedProject = (project || projectDetails || details || '').trim();
  const normalizedRole = (role || contact || '').trim();
  const normalizedService = (service || project_type || '').trim();
  const normalizedTimeline = (timeline || date || '').trim();
  const normalizedLinks = (work_links || workLinks || '').trim();
  const normalizedBudget = (budget || '').trim();
  const wantsNewsletter = newsletter ? 'Yes' : 'No';

  if (!normalizedName || !normalizedEmail || !normalizedProject) {
    res.status(400).json({
      ok: false,
      error: 'Missing required fields: name, email, and project details are required.',
    });
    return;
  }

  const htmlBody = `
    <h2>New Portfolio Contact Submission</h2>
    <p><strong>Name:</strong> ${normalizedName}</p>
    <p><strong>Email:</strong> ${normalizedEmail}</p>
    <p><strong>Role:</strong> ${normalizedRole || 'N/A'}</p>
    <p><strong>Service:</strong> ${normalizedService || 'N/A'}</p>
    <p><strong>Profile links:</strong> ${normalizedLinks || 'N/A'}</p>
    <p><strong>Timeline:</strong> ${normalizedTimeline || 'N/A'}</p>
    <p><strong>Budget:</strong> ${normalizedBudget || 'N/A'}</p>
    <p><strong>Phone (legacy):</strong> ${phone || 'N/A'}</p>
    <p><strong>Newsletter opt-in (legacy):</strong> ${wantsNewsletter}</p>
    <hr />
    <p><strong>Project details:</strong></p>
    <p>${normalizedProject.replace(/\n/g, '<br>')}</p>
  `;
  const textBody = [
    'New Portfolio Contact Submission',
    `Name: ${normalizedName}`,
    `Email: ${normalizedEmail}`,
    `Role: ${normalizedRole || 'N/A'}`,
    `Service: ${normalizedService || 'N/A'}`,
    `Profile links: ${normalizedLinks || 'N/A'}`,
    `Timeline: ${normalizedTimeline || 'N/A'}`,
    `Budget: ${normalizedBudget || 'N/A'}`,
    `Phone (legacy): ${phone || 'N/A'}`,
    `Newsletter opt-in (legacy): ${wantsNewsletter}`,
    '',
    'Project details:',
    normalizedProject,
  ].join('\n');

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

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: normalizedEmail,
      subject: `New portfolio inquiry from ${normalizedName}`,
      text: textBody,
      html: htmlBody,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error sending consultation email:', err);
    res.status(500).json({
      ok: false,
      error: 'There was a problem sending your request. Please try again later.',
    });
  }
};
