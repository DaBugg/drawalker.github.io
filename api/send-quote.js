const { randomUUID } = require('node:crypto');
const nodemailer = require('nodemailer');
const {
  buildProjectReviewEmail,
  validateProjectReview,
} = require('../lib/project-review');
const { verifyTurnstileToken } = require('../lib/verify-turnstile');

const JSON_CONTENT_TYPE = /^application\/(?:[a-z0-9.+-]+\+)?json$/iu;
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';
const SAFE_PROVIDER_CODE = /^[a-z0-9_-]{1,40}$/iu;
const SAFE_REQUEST_ID = /^[a-z0-9-]{1,64}$/iu;
const TURNSTILE_REASONS = new Set([
  'required',
  'rejected',
  'duplicate',
  'unavailable',
  'misconfigured',
]);
const TURNSTILE_ERRORS = Object.freeze({
  required: 'Please complete the security check and try again.',
  rejected: 'The security check was rejected. Please try again.',
  duplicate: 'The security check expired or was already used. Please complete it again.',
  unavailable: 'The security check is temporarily unavailable. Please try again later.',
  misconfigured: 'The security check is temporarily unavailable. Please try again later.',
});

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getContentType(req) {
  const value = req.headers?.['content-type'];
  if (typeof value !== 'string') return '';
  return value.split(';', 1)[0].trim().toLowerCase();
}

function parseUrlEncoded(raw) {
  const params = new URLSearchParams(raw);
  const value = Object.create(null);
  for (const [key, fieldValue] of params.entries()) value[key] = fieldValue;
  return value;
}

function parseRequestBody(req) {
  if (isRecord(req.body)) return { ok: true, value: req.body };
  if (req.body === undefined || req.body === null || req.body === '') {
    return { ok: true, value: {} };
  }

  const raw = Buffer.isBuffer(req.body)
    ? req.body.toString('utf8')
    : req.body;
  if (typeof raw !== 'string') {
    return { ok: false, status: 400, reason: 'invalid_body' };
  }

  const contentType = getContentType(req);
  if (JSON_CONTENT_TYPE.test(contentType)) {
    try {
      const value = JSON.parse(raw);
      return isRecord(value)
        ? { ok: true, value }
        : { ok: false, status: 400, reason: 'invalid_json_shape' };
    } catch (_) {
      return { ok: false, status: 400, reason: 'malformed_json' };
    }
  }

  if (contentType === FORM_CONTENT_TYPE) {
    return { ok: true, value: parseUrlEncoded(raw) };
  }

  if (!contentType) {
    try {
      const value = JSON.parse(raw);
      if (isRecord(value)) return { ok: true, value };
    } catch (_) {
      return { ok: true, value: parseUrlEncoded(raw) };
    }
    return { ok: false, status: 400, reason: 'invalid_body' };
  }

  return { ok: false, status: 415, reason: 'unsupported_content_type' };
}

function getRemoteIp(req) {
  const forwardedFor = req.headers?.['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    const firstAddress = forwardedFor.split(',', 1)[0].trim();
    if (firstAddress) return firstAddress;
  }

  const realIp = req.headers?.['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim();
  return typeof req.socket?.remoteAddress === 'string' ? req.socket.remoteAddress : '';
}

function getRequestHostname(req) {
  const host = req.headers?.host;
  if (typeof host !== 'string' || !host.trim()) return '';

  try {
    return new URL(`https://${host.trim()}`).hostname.toLowerCase();
  } catch (_) {
    return '';
  }
}

function readSmtpConfiguration(env) {
  const host = typeof env.SMTP_HOST === 'string' && env.SMTP_HOST.trim()
    ? env.SMTP_HOST.trim()
    : 'smtp.porkbun.com';
  const portValue = typeof env.SMTP_PORT === 'string' && env.SMTP_PORT.trim()
    ? env.SMTP_PORT.trim()
    : '587';
  const port = Number(portValue);
  const user = typeof env.SMTP_USER === 'string' ? env.SMTP_USER.trim() : '';
  const pass = typeof env.SMTP_PASS === 'string' ? env.SMTP_PASS : '';
  const recipient = typeof env.CONTACT_EMAIL === 'string' ? env.CONTACT_EMAIL.trim() : '';

  if (
    !host ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !user ||
    !pass ||
    !recipient
  ) {
    return null;
  }

  return { host, port, user, pass, recipient };
}

function safeRequestId(requestIdFactory) {
  const candidate = requestIdFactory();
  return typeof candidate === 'string' && SAFE_REQUEST_ID.test(candidate)
    ? candidate
    : randomUUID();
}

function logEvent(logger, level, event, details) {
  const method = logger && typeof logger[level] === 'function' ? logger[level] : null;
  if (method) method.call(logger, event, details);
}

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

function createSendQuoteHandler(dependencies = {}) {
  const createTransport = dependencies.createTransport || nodemailer.createTransport;
  const verifyToken = dependencies.verifyTurnstileToken || verifyTurnstileToken;
  const logger = dependencies.logger || console;
  const env = dependencies.env || process.env;
  const requestIdFactory = dependencies.requestIdFactory || randomUUID;

  return async function sendQuote(req, res) {
    const requestId = safeRequestId(requestIdFactory);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Request-ID', requestId);

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      logEvent(logger, 'warn', 'project_review_rejected', {
        requestId,
        stage: 'http',
        reason: 'method',
      });
      sendJson(res, 405, {
        ok: false,
        error: 'Method Not Allowed',
        failureStage: 'request',
        requestId,
      });
      return;
    }

    const parsedBody = parseRequestBody(req);
    if (!parsedBody.ok) {
      logEvent(logger, 'warn', 'project_review_rejected', {
        requestId,
        stage: 'request',
        reason: parsedBody.reason,
      });
      sendJson(res, parsedBody.status, {
        ok: false,
        error: 'Please check the form submission and try again.',
        failureStage: 'request',
        requestId,
      });
      return;
    }

    const validation = validateProjectReview(parsedBody.value);
    if (!validation.ok) {
      logEvent(logger, 'warn', 'project_review_rejected', {
        requestId,
        stage: 'validation',
        reason: validation.reason,
      });
      sendJson(res, 400, {
        ok: false,
        error: validation.error,
        failureStage: 'validation',
        requestId,
      });
      return;
    }

    let turnstileResult;
    try {
      turnstileResult = await verifyToken(
        parsedBody.value['cf-turnstile-response'],
        getRemoteIp(req),
        {
          expectedAction: 'project_review',
          expectedHostname: getRequestHostname(req),
          idempotencyKey: requestId,
        },
      );
    } catch (_) {
      turnstileResult = {
        success: false,
        status: 503,
        reason: 'unavailable',
        error: 'The security check is temporarily unavailable. Please try again later.',
      };
    }

    if (!turnstileResult || !turnstileResult.success) {
      const status = turnstileResult?.status === 403 ? 403 : 503;
      const reason = TURNSTILE_REASONS.has(turnstileResult?.reason)
        ? turnstileResult.reason
        : 'unavailable';
      const error = TURNSTILE_ERRORS[reason];
      logEvent(logger, status === 403 ? 'warn' : 'error', 'project_review_rejected', {
        requestId,
        stage: 'turnstile',
        reason,
      });
      sendJson(res, status, {
        ok: false,
        error,
        failureStage: 'security',
        requestId,
      });
      return;
    }

    const smtp = readSmtpConfiguration(env);
    if (!smtp) {
      logEvent(logger, 'error', 'project_review_delivery_failed', {
        requestId,
        stage: 'configuration',
        reason: 'smtp_unavailable',
      });
      sendJson(res, 503, {
        ok: false,
        error: 'Project review delivery is temporarily unavailable. Please try again later.',
        failureStage: 'delivery',
        requestId,
      });
      return;
    }

    const emailBody = buildProjectReviewEmail(validation.value);

    try {
      const transporter = createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        requireTLS: smtp.port !== 465,
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
      });

      await transporter.sendMail({
        from: {
          name: 'Networks & Nodes project review',
          address: smtp.user,
        },
        to: smtp.recipient,
        replyTo: { address: validation.value.email },
        subject: 'New Networks & Nodes project review request',
        text: emailBody.text,
        html: emailBody.html,
      });

      logEvent(logger, 'info', 'project_review_provider_accepted', {
        requestId,
        stage: 'smtp',
        outcome: 'accepted',
      });
      sendJson(res, 200, { ok: true, requestId });
    } catch (error) {
      const providerCode = typeof error?.code === 'string' && SAFE_PROVIDER_CODE.test(error.code)
        ? error.code
        : 'unknown';
      const responseCode = Number.isInteger(error?.responseCode)
        ? error.responseCode
        : undefined;
      const details = {
        requestId,
        stage: 'smtp',
        reason: 'provider_failure',
        providerCode,
      };
      if (responseCode !== undefined) details.responseCode = responseCode;
      logEvent(logger, 'error', 'project_review_delivery_failed', details);
      sendJson(res, 502, {
        ok: false,
        error: 'There was a problem sending your request. Please try again later.',
        failureStage: 'delivery',
        requestId,
      });
    }
  };
}

const handler = createSendQuoteHandler();
handler.createSendQuoteHandler = createSendQuoteHandler;
handler.parseRequestBody = parseRequestBody;
handler.readSmtpConfiguration = readSmtpConfiguration;

module.exports = handler;
