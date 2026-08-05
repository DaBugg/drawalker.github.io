# Networks & Nodes website

This repository is the production source of truth for
[networksandnodes.org](https://www.networksandnodes.org/). Networks & Nodes is a
service business offering websites, custom software, and automation.

## Production source

- Canonical repository: `https://github.com/DaBugg/drawalker.github.io`
- Known local workspace: `/Users/dw/Documents/GitHub/drawalker.github.io`
- Release branch: `main`
- Production-matching audit baseline: `d5b431828d2fc63daebaf58c98a081e786f0371e`
- Framework: static multi-page HTML and vanilla JavaScript built with Vite
- Hosting: Vercel, with serverless functions under `/api`
- Public edge: Cloudflare; the frontend defaults to
  `https://assets.networksandnodes.org` for externally delivered assets

The audit baseline records a verified production match; it is not a claim that
every later commit has been deployed. Record the exact commit and Vercel
deployment tested for every release.

The older Next/Vinext implementation under
`/Users/dw/Documents/Codex/2026-07-28/prior-conversation-with-codex-conversation-role`
is a nonproduction prototype/reference. Do not deploy it or use it to restore
the production site. Older locator instructions that identify it as canonical
are superseded by [the production-source record](docs/PRODUCTION-SOURCE.md).
The old files have deliberately not been deleted.

Legacy material inside this repository—including `index/`, `test-pages-bad/`,
`test-pages-new/`, `my-designs.html`, and `under-construction.html`—is also
nonproduction reference material. These files are not production page inputs in
`config/routes.cjs`; do not publish or restore the site from them.

## Local development

This repository currently has tracked dependency artifacts under
`node_modules/`. Until those are removed in a separate reviewed cleanup, do not
run `npm ci` in the canonical working copy: it can create a large unrelated
diff. When dependencies must be installed from the lockfile, use a disposable
clean checkout or worktree. With the existing installation, run:

```sh
npm test
npm run dev
```

`npm run dev` starts the Vite frontend. It does not by itself reproduce the
deployed Vercel function environment for `/api` routes.

Create and inspect the production build with:

```sh
npm run build
npm run preview
```

The build output is `dist/`. A successful build is local evidence only; it does
not authorize or prove a preview or production deployment.

## Source map

| Responsibility | Source |
|---|---|
| Production routes and indexability intent | `config/routes.cjs` |
| Vite inputs and build behavior | `vite.config.mjs`, `package.json` |
| Repository-controlled Vercel redirects | `vercel.json` |
| Primary pages | `index.html`, `work/*.html`, `switchboard.html` |
| Nonindexable utility pages | `privacy.html`, `terms.html`, `404.html` |
| Shared frontend styles and scripts | `css/`, `src/`, `js/` |
| Project-review form function | `api/send-quote.js` |
| Turnstile verification | `api/turnstile-config.js`, `lib/verify-turnstile.js` |
| Crawler policy and sitemap | `robots.txt`, `sitemap.xml` |
| Environment-variable names | `.env.example` |

Do not commit `.env` files or expose environment values in documentation,
issues, logs, or release records.

## Release governance

The site owner controls GitHub, Vercel, Cloudflare/R2, DNS, form delivery, and
deployment or rollback approval. Repository work is local-only unless the site
owner gives separate authority for a preview or production action.

Read these before changing or releasing the site:

- [Production source and ownership](docs/PRODUCTION-SOURCE.md)
- [Deployment and rollback runbook](docs/DEPLOYMENT-RUNBOOK.md)
- [SEO implementation plan](docs/NETWORKS-AND-NODES-MASTER-SEO-AUDIT-PLAN-2026-08-04.md.md)
- [SEO research standard](docs/SEO-GUIDANCE-RESEARCH-STANDARD.md)
