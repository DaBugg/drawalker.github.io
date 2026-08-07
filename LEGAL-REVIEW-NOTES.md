# Networks & Nodes legal and policy review notes

Internal owner checklist for the Phase 3 FAQ, privacy draft, and terms draft. This file is not rendered by the production site.

Audit date: 2026-08-07

## Repository-verified website practices

- The project-review form asks for name, work email, optional company or organization, project details, and one
  service selection. It sends the validated request by email and does not persist it in an application database in
  this repository.
- The form sends a Turnstile token, request IP address, request identifier, action, and hostname to Cloudflare for
  server-side spam verification.
- The homepage loads Umami Cloud with automatic pageviews disabled. The custom implementation sends only fixed
  project-review CTA, form-start, success, and broad failure events; it does not add submitted form values or security
  tokens to those event payloads.
- Vercel hosts the site and server function. Cloudflare provides domain/content-delivery, R2 asset, and security
  services. Mux provides streamed website media. Their production request logs, regions, and retention still require
  account-level verification.
- Public fictional website concepts do not transmit or store their displayed form entries in repository code, but
  some concepts request third-party fonts, images, scripts, or media.
- The production SMTP provider is not established by source control because deployment environment values can override
  the repository default.

## Decisions requiring owner confirmation

- The pricing process and whether any minimum engagement, deposit, or payment schedule should be published.
- The process for estimating schedules and whether any standard project phases or timing expectations should be published.
- Whether ongoing support is offered, under what service model, and with what response expectations.
- The ownership and licensing policy for custom work, pre-existing materials, open-source software, and third-party services.
- The approved client-agreement language governing confidentiality, warranties, liability, disputes, and governing law.
- The form-submission retention period and the process for access, correction, and deletion requests.
- The approved list of email, hosting, spam-protection, analytics, and other data-processing providers used in production.
- Whether Networks & Nodes sells, shares, or uses inquiry information for any purpose beyond responding to the request.
- The legal name and entity or DBA status of the website operator.
- Whether the site is directed only to business users and the approved minimum-age/children statement.
- The effective date and revision process for the privacy notice and website terms.

## Publication status

`privacy.html` and `terms.html` are intentionally labeled as drafts and set to `noindex` until owner confirmation and qualified legal review are complete. The pages state what the current repository establishes and avoid supplying missing policies as facts.
