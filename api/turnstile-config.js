module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json({
    ok: true,
    siteKey: process.env.TURNSTILE_SITE_KEY || '',
  });
};
