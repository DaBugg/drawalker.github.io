const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  ALLOWED_SERVICES,
  FIELD_LIMITS,
  buildProjectReviewEmail,
  validateProjectReview,
} = require('../lib/project-review');

const repositoryRoot = path.resolve(__dirname, '..');

function validPayload(overrides = {}) {
  return {
    name: 'Test Person',
    email: 'test.person@example.com',
    role: 'Example Organization',
    project: 'We need a reliable project-review workflow.',
    service: ALLOWED_SERVICES[0],
    website: '',
    'cf-turnstile-response': 'test-token',
    ...overrides,
  };
}

test('server service allowlist stays in parity with the production form', () => {
  const homepage = fs.readFileSync(path.join(repositoryRoot, 'index.html'), 'utf8');
  const formServices = [...homepage.matchAll(
    /<input\s+type="radio"\s+name="service"\s+value="([^"]+)"/g,
  )].map((match) => match[1]);

  assert.deepEqual(formServices, [...ALLOWED_SERVICES]);
});

test('validation accepts each exact service and normalizes current fields', () => {
  for (const service of ALLOWED_SERVICES) {
    const result = validateProjectReview(validPayload({
      name: '  Test Person  ',
      role: '  Example Organization  ',
      project: '  First line\r\nSecond line  ',
      service,
    }));

    assert.equal(result.ok, true, service);
    assert.deepEqual(result.value, {
      name: 'Test Person',
      email: 'test.person@example.com',
      organization: 'Example Organization',
      project: 'First line\nSecond line',
      service,
    });
  }
});

test('validation rejects every missing required field before delivery', () => {
  for (const field of ['name', 'email', 'project', 'service']) {
    const result = validateProjectReview(validPayload({ [field]: '' }));
    assert.equal(result.ok, false, field);
    assert.match(result.reason, new RegExp(field));
  }
});

test('validation rejects unknown services, malformed email, honeypot, types, controls, and limits', () => {
  const cases = [
    [validPayload({ service: 'website / digital experience' }), 'invalid_service'],
    [validPayload({ email: 'not-an-email' }), 'invalid_email'],
    [validPayload({ website: 'filled-by-bot' }), 'honeypot'],
    [validPayload({ name: { value: 'object' } }), 'invalid_name_type'],
    [validPayload({ name: 'Header\r\nInjection' }), 'invalid_name_characters'],
    [validPayload({ name: 'x'.repeat(FIELD_LIMITS.name + 1) }), 'name_too_long'],
    [validPayload({ email: `a@${'x'.repeat(FIELD_LIMITS.email)}.com` }), 'email_too_long'],
    [validPayload({ role: 'x'.repeat(FIELD_LIMITS.organization + 1) }), 'role_too_long'],
    [validPayload({ project: 'x'.repeat(FIELD_LIMITS.project + 1) }), 'project_too_long'],
  ];

  for (const [payload, reason] of cases) {
    const result = validateProjectReview(payload);
    assert.equal(result.ok, false, reason);
    assert.equal(result.reason, reason);
  }
});

test('HTML email encodes every displayed field and uses current project-review labels', () => {
  const validation = validateProjectReview(validPayload({
    name: 'Test <img src=x onerror=alert(1)> & "Person"',
    role: '<script>alert(1)</script>',
    project: "First <svg onload=alert(1)> & 'line'\nSecond line",
  }));
  assert.equal(validation.ok, true);

  const email = buildProjectReviewEmail(validation.value);
  assert.doesNotMatch(email.html, /<img|<script|<svg/iu);
  assert.match(email.html, /&lt;img src=x onerror=alert\(1\)&gt;/u);
  assert.match(email.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/u);
  assert.match(email.html, /&lt;svg onload=alert\(1\)&gt;/u);
  assert.match(email.html, /&amp;/u);
  assert.match(email.html, /&quot;Person&quot;/u);
  assert.match(email.html, /&#x27;line&#x27;<br \/>Second line/u);
  assert.match(email.html, /Networks &amp; Nodes project review request/u);
  assert.match(email.html, /Company or organization/u);
  assert.match(email.html, /Where should we begin\?/u);
  assert.doesNotMatch(email.html, /Portfolio|legacy/iu);

  assert.match(email.text, /<svg onload=alert\(1\)>/u);
  assert.match(email.text, /First .*\nSecond line/u);
  assert.doesNotMatch(email.text, /Portfolio|legacy/iu);
});
