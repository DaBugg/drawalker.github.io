const test = require('node:test');
const assert = require('node:assert/strict');

const {
  MAX_TOKEN_LENGTH,
  TURNSTILE_VERIFY_URL,
  verifyTurnstileToken,
} = require('../lib/verify-turnstile');

test('Turnstile fails closed when its secret is unavailable', async () => {
  let fetchCalls = 0;
  const result = await verifyTurnstileToken('token', '', {
    secret: '',
    fetchImpl: async () => {
      fetchCalls += 1;
    },
  });

  assert.deepEqual(result, {
    success: false,
    reason: 'misconfigured',
    status: 503,
    error: 'The security check is temporarily unavailable. Please try again later.',
  });
  assert.equal(fetchCalls, 0);
});

test('Turnstile rejects missing and overlong tokens without contacting the provider', async () => {
  let fetchCalls = 0;
  const fetchImpl = async () => {
    fetchCalls += 1;
  };

  const missing = await verifyTurnstileToken('', '', { secret: 'test-secret', fetchImpl });
  const overlong = await verifyTurnstileToken('x'.repeat(MAX_TOKEN_LENGTH + 1), '', {
    secret: 'test-secret',
    fetchImpl,
  });

  assert.equal(missing.status, 403);
  assert.equal(missing.reason, 'required');
  assert.equal(overlong.status, 403);
  assert.equal(overlong.reason, 'rejected');
  assert.equal(fetchCalls, 0);
});

test('Turnstile sends bounded server-side validation with a request idempotency key', async () => {
  let request;
  const fetchImpl = async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      json: async () => ({
        success: true,
        action: 'project_review',
        hostname: 'www.networksandnodes.org',
      }),
    };
  };

  const result = await verifyTurnstileToken('test-token', '203.0.113.9', {
    secret: 'test-secret',
    fetchImpl,
    expectedAction: 'project_review',
    expectedHostname: 'WWW.NETWORKSANDNODES.ORG.',
    idempotencyKey: 'request-123',
  });

  assert.deepEqual(result, { success: true });
  assert.equal(request.url, TURNSTILE_VERIFY_URL);
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['Content-Type'], 'application/x-www-form-urlencoded');
  assert.ok(request.options.signal instanceof AbortSignal);

  const params = new URLSearchParams(request.options.body);
  assert.equal(params.get('secret'), 'test-secret');
  assert.equal(params.get('response'), 'test-token');
  assert.equal(params.get('remoteip'), '203.0.113.9');
  assert.equal(params.get('idempotency_key'), 'request-123');
});

test('Turnstile requires boolean success and matches the expected action and hostname', async () => {
  const cases = [
    { success: 'true', action: 'project_review', hostname: 'www.networksandnodes.org' },
    { success: true, action: 'different_action', hostname: 'www.networksandnodes.org' },
    { success: true, action: 'project_review', hostname: 'example.com' },
    { success: true, action: 'project_review' },
  ];

  for (const providerResult of cases) {
    const result = await verifyTurnstileToken('test-token', '', {
      secret: 'test-secret',
      fetchImpl: async () => ({ ok: true, json: async () => providerResult }),
      expectedAction: 'project_review',
      expectedHostname: 'www.networksandnodes.org',
    });

    assert.equal(result.success, false);
    assert.equal(result.status, 403);
    assert.equal(result.reason, 'rejected');
  }
});

test('Turnstile reports a replayed or expired token as a controlled duplicate rejection', async () => {
  const result = await verifyTurnstileToken('spent-token', '', {
    secret: 'test-secret',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        success: false,
        'error-codes': ['timeout-or-duplicate'],
      }),
    }),
  });

  assert.equal(result.success, false);
  assert.equal(result.status, 403);
  assert.equal(result.reason, 'duplicate');
  assert.match(result.error, /expired or was already used/u);
});

test('Turnstile converts provider HTTP, JSON, network, and timeout failures into safe 503 results', async () => {
  const failures = [
    async () => ({ ok: false, json: async () => ({}) }),
    async () => ({ ok: true, json: async () => { throw new SyntaxError('bad-json'); } }),
    async () => { throw new Error('network includes sensitive provider detail'); },
    async (_url, options) => new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(new Error('aborted')));
    }),
  ];

  for (const [index, fetchImpl] of failures.entries()) {
    const result = await verifyTurnstileToken('test-token', '', {
      secret: 'test-secret',
      fetchImpl,
      timeoutMs: index === failures.length - 1 ? 1 : 100,
    });
    assert.equal(result.success, false, index);
    assert.equal(result.status, 503, index);
    assert.equal(result.reason, 'unavailable', index);
    assert.doesNotMatch(result.error, /sensitive|bad-json|network/u);
  }
});
