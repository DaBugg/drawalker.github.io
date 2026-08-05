const ALLOWED_SERVICES = Object.freeze([
  'Website / digital experience',
  'Automation / AI workflow',
  'Custom software / CRM',
  'Marketing / lead generation',
  'U.S. market adaptation',
  'Not sure yet',
]);

const FIELD_LIMITS = Object.freeze({
  name: 100,
  email: 254,
  organization: 120,
  project: 4000,
  honeypot: 200,
});

const HTML_ENTITIES = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
});

const SINGLE_LINE_CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;
const MULTILINE_CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u;
const EMAIL_PATTERN = /^[^\s@,;<>()[\]\\]+@[^\s@,;<>()[\]\\]+\.[^\s@,;<>()[\]\\]+$/u;

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getFirstField(body, names) {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(body, name)) {
      return body[name];
    }
  }
  return undefined;
}

function normalizeField(body, names, options) {
  const rawValue = getFirstField(body, names);
  const { required, maxLength, multiline = false } = options;

  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return required
      ? { ok: false, reason: `missing_${names[0]}` }
      : { ok: true, value: '' };
  }

  if (typeof rawValue !== 'string') {
    return { ok: false, reason: `invalid_${names[0]}_type` };
  }

  let value = rawValue;
  if (multiline) {
    value = value.replace(/\r\n?/g, '\n');
    if (MULTILINE_CONTROL_CHARACTERS.test(value)) {
      return { ok: false, reason: `invalid_${names[0]}_characters` };
    }
  } else if (SINGLE_LINE_CONTROL_CHARACTERS.test(value)) {
    return { ok: false, reason: `invalid_${names[0]}_characters` };
  }

  value = value.trim();
  if (!value) {
    return required
      ? { ok: false, reason: `missing_${names[0]}` }
      : { ok: true, value: '' };
  }

  if (value.length > maxLength) {
    return { ok: false, reason: `${names[0]}_too_long` };
  }

  return { ok: true, value };
}

function invalid(reason, error) {
  return { ok: false, reason, error };
}

function validateProjectReview(body) {
  if (!isRecord(body)) {
    return invalid('invalid_body', 'Please check the form fields and try again.');
  }

  const honeypot = normalizeField(body, ['website'], {
    required: false,
    maxLength: FIELD_LIMITS.honeypot,
  });
  if (!honeypot.ok) {
    return invalid(honeypot.reason, 'Please check the form fields and try again.');
  }
  if (honeypot.value) {
    return invalid('honeypot', 'We could not process your request. Please try again.');
  }

  const name = normalizeField(body, ['name'], {
    required: true,
    maxLength: FIELD_LIMITS.name,
  });
  const email = normalizeField(body, ['email'], {
    required: true,
    maxLength: FIELD_LIMITS.email,
  });
  const organization = normalizeField(body, ['role', 'contact'], {
    required: false,
    maxLength: FIELD_LIMITS.organization,
  });
  const project = normalizeField(body, ['project', 'projectDetails', 'details'], {
    required: true,
    maxLength: FIELD_LIMITS.project,
    multiline: true,
  });
  const service = normalizeField(body, ['service', 'project_type'], {
    required: true,
    maxLength: Math.max(...ALLOWED_SERVICES.map((value) => value.length)),
  });

  const fields = [name, email, organization, project, service];
  const failedField = fields.find((field) => !field.ok);
  if (failedField) {
    return invalid(
      failedField.reason,
      'Please complete the required fields using the form limits and try again.',
    );
  }

  if (!EMAIL_PATTERN.test(email.value)) {
    return invalid('invalid_email', 'Please enter a valid work email.');
  }

  if (!ALLOWED_SERVICES.includes(service.value)) {
    return invalid('invalid_service', 'Please choose one of the available starting services.');
  }

  return {
    ok: true,
    value: {
      name: name.value,
      email: email.value,
      organization: organization.value,
      project: project.value,
      service: service.value,
    },
  };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

function buildProjectReviewEmail(projectReview) {
  const organization = projectReview.organization || 'Not provided';
  const htmlProject = escapeHtml(projectReview.project).replace(/\n/g, '<br />');

  const html = [
    '<h2>New Networks &amp; Nodes project review request</h2>',
    `<p><strong>Name:</strong> ${escapeHtml(projectReview.name)}</p>`,
    `<p><strong>Work email:</strong> ${escapeHtml(projectReview.email)}</p>`,
    `<p><strong>Company or organization:</strong> ${escapeHtml(organization)}</p>`,
    `<p><strong>Where should we begin?</strong> ${escapeHtml(projectReview.service)}</p>`,
    '<hr />',
    '<p><strong>What needs to work better?</strong></p>',
    `<p>${htmlProject}</p>`,
  ].join('\n');

  const text = [
    'New Networks & Nodes project review request',
    `Name: ${projectReview.name}`,
    `Work email: ${projectReview.email}`,
    `Company or organization: ${organization}`,
    `Where should we begin?: ${projectReview.service}`,
    '',
    'What needs to work better?',
    projectReview.project,
  ].join('\n');

  return { html, text };
}

module.exports = {
  ALLOWED_SERVICES,
  FIELD_LIMITS,
  buildProjectReviewEmail,
  escapeHtml,
  validateProjectReview,
};
