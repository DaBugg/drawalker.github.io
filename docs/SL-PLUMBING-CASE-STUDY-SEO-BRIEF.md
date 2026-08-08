# S&L Plumbing case-study and construction SEO brief

Status: **HOLD — client approval and private-application security review required before publication**

Review date: 2026-08-07

This is an editorial and implementation brief, not a public case study. The repository has a public GitHub remote, so
the private application URL, operational records, screenshots, credentials, database details, and unapproved client
workflow description must not be added here.

## Evidence and publication status

### Publicly observable

- S&L Plumbing and Heating Corp. has a public commercial-plumbing website describing estimating, drafting/design,
  project management, and commercial plumbing work.
- A multi-page S&L website-rebrand demonstration exists at `templates/SL-Web-Demo/`. It is intentionally
  `noindex, nofollow` and is a demonstration, not proof of a completed production launch.
- The current client website has material launch risks that must be corrected during the rebrand: HTTP does not
  redirect to HTTPS, the inspected HTTPS endpoint did not present a normally trusted certificate, and the homepage
  did not expose a canonical URL. Recheck all three conditions at launch rather than assuming they remain unchanged.

### Owner-attested but not approved for publication

- The website rebrand is in progress.
- Additional private workflow work and possible follow-on marketing/automation work were described by the owner.
  Exact functionality is intentionally embargoed from this public repository until the client approves the scope and
  the application passes the security gate below.
- A 3D project representation is planned and must not be described as implemented.
- LinkedIn outreach/advertising and a bid-opportunity system are in progress or proposed. Treat both as proposed until
  their individual delivery status is confirmed.
- No traffic, lead, bid, revenue, time-saving, adoption, or operational outcome is verified.

## Conditional public page

After approval, create one indexed Networks & Nodes case study at `/work/sl-plumbing.html`. Keep the existing template
demonstration noindex and link to it only as a clearly labeled design preview.

The case study should separate:

1. completed and client-approved work;
2. work currently in progress;
3. planned or proposed additions; and
4. measured outcomes, which must remain absent until documented and approved.

Use a service-oriented call to action such as: “Planning a construction website or internal workflow tool? Discuss
the process your team needs to improve.” Do not promise that another company will receive the same result.

## Search-intent map

These are candidate topic clusters, not keyword-volume findings or ranking guarantees.

| Intent cluster | Dominant buyer need | Recommended page | Current decision |
|---|---|---|---|
| Construction company web design / contractor website redesign | Hire a team to improve positioning, proof, and project inquiries | `/services/construction-web-design.html` | Consider after offer review |
| Commercial plumbing website design | Evaluate relevant industry experience | S&L case study plus the construction web-design page | Supporting intent only |
| Custom construction software / construction workflow automation | Hire a team to improve an internal process | `/services/custom-construction-software.html` | Consider after offer review |
| Construction material receiving or location tracking | Understand or procure a material-coordination workflow | Approved S&L case-study section; later an original process guide | Conditional on approval |
| Construction bid opportunity alerts / bid finder | Find and filter relevant project opportunities | A future solution page only after the system and source permissions are verified | Proposed |
| Construction bid tracker | Manage received bids, deadlines, documents, and awards | Do not target unless the delivered product performs those functions | Avoid for current scope |

Do not generate separate near-duplicate pages for every construction trade or South Florida city. A page should be
published only when the offer, audience, examples, constraints, and buyer questions are materially distinct. This
follows the search-intent and pattern-approval requirements in `docs/SEO-GUIDANCE-RESEARCH-STANDARD.md` §§12–13 and
the claim controls in §16.5.

## Backlink and distribution plan

- Ask the client whether it wants to publish a launch or technology-project note that links to the approved Networks
  & Nodes case study.
- If the client wants a site credit, use voluntary, natural branded wording and an approved destination. Do not require
  keyword-rich footer credits as a condition of the project.
- Use an approved LinkedIn launch post for distribution and referral measurement; do not represent a social link as a
  guaranteed ranking improvement.
- Pursue construction or technology association profiles only when membership and participation have independent
  business value.
- Do not buy ranking links, automate directory submissions, require reciprocal links, or duplicate the same article
  across multiple sites.

Any paid placement must use the appropriate link qualification. See Google’s spam policies and outbound-link
qualification guidance:

- https://developers.google.com/search/docs/essentials/spam-policies
- https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links

## Private-application security gate

The owner confirmed that the application is intended to be private. Do not publish its URL, embed it, or link to it.
`noindex` and `robots.txt` are not access controls.

Before the application is treated as private or used as case-study proof:

- require authenticated employee access;
- enforce least-privilege database authorization and Row Level Security for tables, views, functions, storage, and
  realtime access;
- deny anonymous reads and writes;
- protect production, preview, custom-domain, and direct hosting-provider URLs;
- confirm no elevated server credential is delivered to browser code;
- preserve and review relevant access logs; and
- retest with unauthenticated, unauthorized-authenticated, authorized-user, and administrator roles.

For public media, create a separate demonstration dataset. Export only a flattened static image, remove metadata, run
visual and OCR review, and obtain written client approval for that exact asset. Do not capture the live dataset.

## Client approval checklist

- [ ] Confirm the preferred public company name.
- [ ] Approve use of the company name and logo in a Networks & Nodes case study.
- [ ] Approve the exact case-study scope and status wording.
- [ ] Confirm which work is completed, in progress, and proposed.
- [ ] Approve each sanitized screenshot as a specifically identified file.
- [ ] Confirm that approved media contains no operational record, project identifier, address, order identifier,
  supplier, material detail, employee information, note, timestamp, credential, or private URL.
- [ ] Approve any link from the case study to the production client website.
- [ ] Approve any voluntary client-site attribution link and its exact wording and destination.
- [ ] Record the approver, approval date, exact approved copy, and approved media filenames.

## Activation and validation sequence

1. Secure and retest the private application.
2. Obtain and retain written client approval.
3. Create sanitized demonstration media from fictional data.
4. Build the case-study page in complete raw HTML with unique metadata and a self-canonical.
5. Add the approved page to `config/routes.cjs`, the generated sitemap, and contextual internal navigation.
6. Replace the small Redeemed Hands homepage promotion only after the concurrent Redeemed Hands update is reviewed.
   Keep the Redeemed Hands page if it remains useful; do not redirect an unrelated client URL to S&L.
7. Validate the case study, demo label, social presentation, mobile layout, accessibility, links, and conversion CTA.
8. At the S&L production launch, verify trusted HTTPS, direct HTTP-to-HTTPS redirects, preferred-host redirects,
   canonicals, robots, sitemap, old-to-new URL mappings, analytics, and webmaster-tool ownership.
9. Monitor impressions, clicks, referring pages, approved engagement events, and project-review submissions. Do not
   attribute a ranking or conversion change to one backlink or page without adequate evidence.

