async function verifyTurnstileToken(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { success: true, skipped: true };
  }

  if (!token) {
    return { success: false, error: 'Turnstile verification required.' };
  }

  const params = new URLSearchParams();
  params.append('secret', secret);
  params.append('response', token);
  if (remoteIp) params.append('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    return { success: false, error: 'Turnstile verification failed.' };
  }

  const result = await response.json();
  if (!result.success) {
    return { success: false, error: 'Turnstile verification failed.' };
  }

  return { success: true };
}

module.exports = { verifyTurnstileToken };
