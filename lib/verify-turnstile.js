const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const MAX_TOKEN_LENGTH = 2048;
const DEFAULT_TIMEOUT_MS = 10000;

function failure(reason, status, error) {
  return { success: false, reason, status, error };
}

function normalizeHostname(value) {
  return typeof value === 'string'
    ? value.trim().toLowerCase().replace(/\.$/u, '')
    : '';
}

async function verifyTurnstileToken(token, remoteIp, options = {}) {
  const secret = Object.prototype.hasOwnProperty.call(options, 'secret')
    ? options.secret
    : process.env.TURNSTILE_SECRET_KEY;
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const timeoutMs = Number.isFinite(options.timeoutMs)
    ? Math.max(1, options.timeoutMs)
    : DEFAULT_TIMEOUT_MS;

  if (typeof secret !== 'string' || !secret.trim()) {
    return failure(
      'misconfigured',
      503,
      'The security check is temporarily unavailable. Please try again later.',
    );
  }

  if (typeof token !== 'string' || !token.trim()) {
    return failure('required', 403, 'Please complete the security check and try again.');
  }

  const normalizedToken = token.trim();
  if (normalizedToken.length > MAX_TOKEN_LENGTH) {
    return failure('rejected', 403, 'The security check was rejected. Please try again.');
  }

  if (typeof fetchImpl !== 'function') {
    return failure(
      'unavailable',
      503,
      'The security check is temporarily unavailable. Please try again later.',
    );
  }

  const params = new URLSearchParams();
  params.append('secret', secret.trim());
  params.append('response', normalizedToken);
  if (typeof remoteIp === 'string' && remoteIp && remoteIp.length <= 128) {
    params.append('remoteip', remoteIp);
  }
  if (typeof options.idempotencyKey === 'string' && options.idempotencyKey) {
    params.append('idempotency_key', options.idempotencyKey);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      signal: controller.signal,
    });

    if (!response || !response.ok) {
      return failure(
        'unavailable',
        503,
        'The security check is temporarily unavailable. Please try again later.',
      );
    }

    const result = await response.json();
    if (!result || typeof result !== 'object') {
      return failure(
        'unavailable',
        503,
        'The security check is temporarily unavailable. Please try again later.',
      );
    }

    if (result.success !== true) {
      const errorCodes = Array.isArray(result['error-codes']) ? result['error-codes'] : [];
      const duplicate = errorCodes.includes('timeout-or-duplicate');
      return failure(
        duplicate ? 'duplicate' : 'rejected',
        403,
        duplicate
          ? 'The security check expired or was already used. Please complete it again.'
          : 'The security check was rejected. Please try again.',
      );
    }

    if (
      typeof options.expectedAction === 'string' &&
      options.expectedAction &&
      result.action !== options.expectedAction
    ) {
      return failure('rejected', 403, 'The security check was rejected. Please try again.');
    }

    const expectedHostname = normalizeHostname(options.expectedHostname);
    if (expectedHostname && normalizeHostname(result.hostname) !== expectedHostname) {
      return failure('rejected', 403, 'The security check was rejected. Please try again.');
    }

    return { success: true };
  } catch (_) {
    return failure(
      'unavailable',
      503,
      'The security check is temporarily unavailable. Please try again later.',
    );
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  DEFAULT_TIMEOUT_MS,
  MAX_TOKEN_LENGTH,
  TURNSTILE_VERIFY_URL,
  verifyTurnstileToken,
};
