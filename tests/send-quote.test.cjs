const test = require('node:test');
const assert = require('node:assert/strict');

const sendQuoteModule = require('../api/send-quote');
const { ALLOWED_SERVICES } = require('../lib/project-review');

const { createSendQuoteHandler } = sendQuoteModule;

function validBody(overrides = {}) {
  return {
    name: 'Test Person',
    email: 'test.person@example.com',
    role: 'Example Organization',
    project: 'Please review this synthetic project request.',
    service: ALLOWED_SERVICES[0],
    website: '',
    'cf-turnstile-response': 'test-token',
    ...overrides,
  };
}

function createRequest(overrides = {}) {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: 'www.networksandnodes.org',
    },
    body: validBody(),
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides,
  };
}

function createResponse() {
  return {
    headers: {},
    statusCode: null,
    payload: null,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

function createHarness(overrides = {}) {
  const mail = [];
  const transportConfigurations = [];
  const verifications = [];
  const logs = [];
  let verificationCalls = 0;

  const logger = {};
  for (const level of ['info', 'warn', 'error']) {
    logger[level] = (event, details) => logs.push({ level, event, details });
  }

  const dependencies = {
    env: {
      SMTP_HOST: 'smtp.example.test',
      SMTP_PORT: '587',
      SMTP_USER: 'sender@example.test',
      SMTP_PASS: 'synthetic-password',
      CONTACT_EMAIL: 'recipient@example.test',
    },
    logger,
    requestIdFactory: () => 'request-123',
    verifyTurnstileToken: async (...arguments_) => {
      verificationCalls += 1;
      verifications.push(arguments_);
      return { success: true };
    },
    createTransport: (configuration) => {
      transportConfigurations.push(configuration);
      return {
        sendMail: async (message) => {
          mail.push(message);
          return { accepted: ['recipient@example.test'] };
        },
      };
    },
    ...overrides,
  };

  return {
    handler: createSendQuoteHandler(dependencies),
    logs,
    mail,
    transportConfigurations,
    verifications,
    verificationCalls: () => verificationCalls,
  };
}

test('HTTP and malformed-body failures return controlled non-2xx responses without provider calls', async () => {
  const methodHarness = createHarness();
  const methodResponse = createResponse();
  await methodHarness.handler(createRequest({ method: 'GET' }), methodResponse);
  assert.equal(methodResponse.statusCode, 405);
  assert.equal(methodResponse.headers.allow, 'POST');
  assert.equal(methodHarness.verificationCalls(), 0);
  assert.equal(methodHarness.mail.length, 0);

  const jsonHarness = createHarness();
  const jsonResponse = createResponse();
  await jsonHarness.handler(createRequest({ body: '{"broken":' }), jsonResponse);
  assert.equal(jsonResponse.statusCode, 400);
  assert.equal(jsonHarness.verificationCalls(), 0);
  assert.equal(jsonHarness.mail.length, 0);

  const mediaHarness = createHarness();
  const mediaResponse = createResponse();
  await mediaHarness.handler(createRequest({
    headers: { 'content-type': 'text/plain' },
    body: 'plain text',
  }), mediaResponse);
  assert.equal(mediaResponse.statusCode, 415);
  assert.equal(mediaHarness.verificationCalls(), 0);
});

test('URL-encoded native form bodies retain the supported request contract', async () => {
  const harness = createHarness();
  const response = createResponse();
  const body = new URLSearchParams(validBody()).toString();

  await harness.handler(createRequest({
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      host: 'www.networksandnodes.org',
    },
    body,
  }), response);

  assert.equal(response.statusCode, 200);
  assert.equal(harness.verificationCalls(), 1);
  assert.equal(harness.mail.length, 1);
});

test('required-field and allowlist validation happens before Turnstile or SMTP', async () => {
  const invalidBodies = [
    validBody({ name: '' }),
    validBody({ email: '' }),
    validBody({ project: '' }),
    validBody({ service: '' }),
    validBody({ service: 'Unknown service' }),
    validBody({ email: 'invalid-email' }),
    validBody({ name: { nested: true } }),
    validBody({ website: 'bot-value' }),
  ];

  for (const body of invalidBodies) {
    const harness = createHarness();
    const response = createResponse();
    await harness.handler(createRequest({ body }), response);
    assert.equal(response.statusCode, 400);
    assert.equal(harness.verificationCalls(), 0);
    assert.equal(harness.mail.length, 0);
  }
});

test('Turnstile rejection and unavailability never create an email', async () => {
  for (const turnstileResult of [
    {
      success: false,
      status: 403,
      reason: 'rejected',
      error: 'The security check was rejected. Please try again.',
    },
    {
      success: false,
      status: 503,
      reason: 'unavailable',
      error: 'The security check is temporarily unavailable. Please try again later.',
    },
  ]) {
    const harness = createHarness({
      verifyTurnstileToken: async () => turnstileResult,
    });
    const response = createResponse();
    await harness.handler(createRequest(), response);
    assert.equal(response.statusCode, turnstileResult.status);
    assert.equal(harness.mail.length, 0);
    assert.equal(response.payload.ok, false);
  }
});

test('SMTP configuration fails closed without logging configuration values', async () => {
  const harness = createHarness({
    env: {
      SMTP_HOST: 'smtp.example.test',
      SMTP_PORT: '587',
      SMTP_USER: '',
      SMTP_PASS: '',
      CONTACT_EMAIL: '',
    },
  });
  const response = createResponse();

  await harness.handler(createRequest(), response);

  assert.equal(response.statusCode, 503);
  assert.equal(harness.mail.length, 0);
  assert.equal(harness.logs.at(-1).event, 'project_review_delivery_failed');
  assert.doesNotMatch(JSON.stringify(harness.logs), /smtp\.example\.test/u);
});

test('successful provider acceptance sends one safely constructed current-language message', async () => {
  let releaseProvider;
  const providerPending = new Promise((resolve) => {
    releaseProvider = resolve;
  });
  const harness = createHarness({
    createTransport: (configuration) => {
      harness.transportConfigurations.push(configuration);
      return {
        sendMail: async (message) => {
          harness.mail.push(message);
          await providerPending;
        },
      };
    },
  });
  const response = createResponse();
  const requestPromise = harness.handler(createRequest({
    body: validBody({
      name: 'Test <img src=x onerror=alert(1)>',
      role: '<script>alert(1)</script>',
      project: '<svg onload=alert(1)>\nSecond line',
      to: 'attacker@example.test',
      subject: 'Injected subject',
    }),
  }), response);

  await Promise.resolve();
  assert.equal(response.statusCode, null);
  releaseProvider();
  await requestPromise;

  assert.equal(response.statusCode, 200);
  assert.equal(response.payload.ok, true);
  assert.equal(harness.mail.length, 1);
  const message = harness.mail[0];
  assert.equal(message.to, 'recipient@example.test');
  assert.deepEqual(message.replyTo, { address: 'test.person@example.com' });
  assert.equal(message.subject, 'New Networks & Nodes project review request');
  assert.equal(message.from.name, 'Networks & Nodes project review');
  assert.equal(harness.verifications[0][2].expectedAction, 'project_review');
  assert.equal(harness.verifications[0][2].expectedHostname, 'www.networksandnodes.org');
  assert.equal(harness.transportConfigurations[0].secure, false);
  assert.equal(harness.transportConfigurations[0].requireTLS, true);
  assert.doesNotMatch(message.html, /<img|<script|<svg/iu);
  assert.match(message.html, /&lt;img/u);
  assert.match(message.html, /&lt;script/u);
  assert.match(message.html, /&lt;svg/u);
  assert.doesNotMatch(message.html, /attacker@example\.test|Injected subject|Portfolio|legacy/iu);
  assert.equal(harness.logs.at(-1).event, 'project_review_provider_accepted');
});

test('port 465 uses immediate TLS without requesting a STARTTLS upgrade', async () => {
  const harness = createHarness({
    env: {
      SMTP_HOST: 'smtp.example.test',
      SMTP_PORT: '465',
      SMTP_USER: 'sender@example.test',
      SMTP_PASS: 'synthetic-password',
      CONTACT_EMAIL: 'recipient@example.test',
    },
  });
  const response = createResponse();

  await harness.handler(createRequest(), response);

  assert.equal(response.statusCode, 200);
  assert.equal(harness.transportConfigurations[0].secure, true);
  assert.equal(harness.transportConfigurations[0].requireTLS, false);
});

test('provider failures return a generic error and logs exclude raw error and form contents', async () => {
  const sensitiveSentinels = [
    'SENTINEL-NAME',
    'sentinel-email@example.test',
    'SENTINEL-PROJECT',
    'SENTINEL-TOKEN',
    'SENTINEL-PROVIDER-DETAIL',
  ];
  const harness = createHarness({
    createTransport: () => ({
      sendMail: async () => {
        const error = new Error('SENTINEL-PROVIDER-DETAIL');
        error.code = 'EAUTH';
        error.responseCode = 535;
        error.envelope = { to: 'sentinel-email@example.test' };
        throw error;
      },
    }),
  });
  const response = createResponse();

  await harness.handler(createRequest({
    body: validBody({
      name: 'SENTINEL-NAME',
      email: 'sentinel-email@example.test',
      project: 'SENTINEL-PROJECT',
      'cf-turnstile-response': 'SENTINEL-TOKEN',
    }),
  }), response);

  assert.equal(response.statusCode, 502);
  assert.equal(response.payload.error, 'There was a problem sending your request. Please try again later.');
  const serializedLogs = JSON.stringify(harness.logs);
  for (const sentinel of sensitiveSentinels) {
    assert.doesNotMatch(serializedLogs, new RegExp(sentinel, 'u'));
  }
  assert.match(serializedLogs, /"providerCode":"EAUTH"/u);
  assert.match(serializedLogs, /"responseCode":535/u);
});

test('a replay rejected by Turnstile results in only one provider send', async () => {
  let verificationCount = 0;
  let requestCount = 0;
  const harness = createHarness({
    requestIdFactory: () => `request-${++requestCount}`,
    verifyTurnstileToken: async () => {
      verificationCount += 1;
      return verificationCount === 1
        ? { success: true }
        : {
          success: false,
          status: 403,
          reason: 'duplicate',
          error: 'The security check expired or was already used. Please complete it again.',
        };
    },
  });
  const firstResponse = createResponse();
  const replayResponse = createResponse();

  await harness.handler(createRequest(), firstResponse);
  await harness.handler(createRequest(), replayResponse);

  assert.equal(firstResponse.statusCode, 200);
  assert.equal(replayResponse.statusCode, 403);
  assert.equal(harness.mail.length, 1);
});
