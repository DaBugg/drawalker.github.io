# Production source and ownership

## Canonical source

The production source of truth for `https://www.networksandnodes.org/` is:

| Item | Authoritative value | Evidence status |
|---|---|---|
| Git repository | `https://github.com/DaBugg/drawalker.github.io` | Verified from `origin` and `package.json` |
| Known local workspace | `/Users/dw/Documents/GitHub/drawalker.github.io` | Verified locally |
| Release branch | `main` | Verified locally; the Vercel branch trigger is not encoded in this repository |
| Production-matching audit baseline | `d5b431828d2fc63daebaf58c98a081e786f0371e` | Verified by the August 4, 2026 production/source audit |
| Application | Static multi-page HTML and vanilla JavaScript built with Vite | Verified from source and build configuration |
| Build output | `dist/` | Verified from the Vite build |
| Vercel project link | `drawalker-github-io` | Verified from the local Vercel link; live project/domain settings require owner dashboard confirmation |

Do not infer that a commit is live merely because it is on `main`, matches
`origin/main`, or built successfully. A release becomes verified only when its
commit, Vercel deployment, and production checks are recorded together.

## Production layers

```text
GitHub production source
        |
        v
Vercel static build and /api serverless functions
        |
        v
Cloudflare public edge for networksandnodes.org

Browser media requests
        |
        v
assets.networksandnodes.org (configured by VITE_ASSET_URL; Cloudflare/R2 is owner-managed)
```

The source audit verified Vercel hosting and Cloudflare proxy behavior. Exact
account IDs, zone settings, DNS records, R2 bindings, environment values, and
the Vercel production-branch trigger are external state. They must be checked
by the site owner in the relevant dashboards and must not be guessed from this
repository.

## Source-of-truth map

| Concern | Authoritative repository source |
|---|---|
| Route source path, public path, indexability, canonical intent, sitemap intent | `config/routes.cjs` |
| Vite page inputs | `vite.config.mjs`, derived from `config/routes.cjs` |
| Repository-controlled Vercel redirects | `vercel.json` |
| Page metadata and canonicals | Each production HTML document |
| Crawler directives | `robots.txt`, plus externally injected Cloudflare directives when enabled |
| XML sitemap | `sitemap.xml` |
| Form entry point | `api/send-quote.js` |
| Form destination | `CONTACT_EMAIL` in the deployment environment; never record its value in Git |
| SMTP delivery | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` in the deployment environment |
| Turnstile | `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` |
| External asset base | `VITE_ASSET_URL`, with a source fallback to `https://assets.networksandnodes.org` |
| Environment-variable inventory | `.env.example` |

Repository files cannot prove a Cloudflare transformation, DNS rule, deployed
environment value, inbox delivery, or active Vercel dashboard/Git-integration
setting. Verify those at the platform and retain the evidence in the release
record.

## Ownership and authority

| Area | Accountable role |
|---|---|
| GitHub repository and release approval | Site owner |
| Vercel project and deployment settings | Site owner |
| Cloudflare zone, R2, and transformations | Site owner |
| DNS | Site owner |
| Form inbox, SMTP delivery, and downstream lead handling | Site owner |
| Production rollback decision and execution | Site owner |
| Local repository implementation and validation | Developer/maintainer, within the authority granted for the batch |

The default implementation authority is local repository work only. A preview,
production deployment, DNS change, Cloudflare change, cache purge, or live form
submission requires separate site-owner approval.

## Known nonproduction implementation

The following older project exists but is not production source:

- Path:
  `/Users/dw/Documents/Codex/2026-07-28/prior-conversation-with-codex-conversation-role`
- Known commit: `d1611523f16a3d56cffaf306775a1a46ac5b4109`
- Implementation family: older Next/Vinext prototype and source archive

Retain it only as historical design/reference material. Do not deploy it, use
its archive for production recovery, or copy its framework configuration over
this Vite repository. Any external locator that calls that project canonical is
stale and is superseded by this document. This documentation update does not
delete the old project or edit the external locator.

### In-repository legacy and prototype material

The following tracked paths are retained as historical or experimental
references and are not production page inputs:

- `index/`
- `test-pages-bad/`
- `test-pages-new/`
- `my-designs.html`
- `under-construction.html`

The production page inventory is the explicit manifest in
`config/routes.cjs`. Do not add legacy material to that manifest, deploy it
separately, or use it for rollback without a new, reviewed owner decision.

### Tracked dependency cleanup debt

This repository currently tracks files below `node_modules/` despite the
current ignore rule. Until a separate reviewed cleanup removes those tracked
artifacts, do not run `npm ci` in the canonical working copy because it can
create a large unrelated diff. Install from the lockfile only in a disposable
clean checkout or worktree, and do not include dependency-tree churn in an SEO
release.

## Identifying a release

Before work or rollback, record:

```sh
git status --short --branch
git rev-parse HEAD
git remote get-url origin
```

Then match the commit to a specific Vercel deployment and the public production
response using the release-record template in
[`DEPLOYMENT-RUNBOOK.md`](DEPLOYMENT-RUNBOOK.md). The Git commit alone is not a
complete deployment record.
