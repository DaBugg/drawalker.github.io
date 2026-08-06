const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repositoryRoot = path.resolve(__dirname, "..");
const routes = require(path.join(repositoryRoot, "config/routes.cjs"));
const sitemap = fs.readFileSync(path.join(repositoryRoot, "sitemap.xml"), "utf8");
const siteOrigin = "https://www.networksandnodes.org";

const sitemapUrls = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
const expectedUrls = routes
  .filter((route) => route.sitemap)
  .map((route) => new URL(route.publicPath, siteOrigin).href);

test("the generated sitemap matches the canonical route manifest", () => {
  assert.match(sitemap, /Generated from config\/routes\.cjs/);
  assert.deepEqual(sitemapUrls, expectedUrls);
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
});

test("every sitemap route is indexable, self-canonical, and aligned with its source page", () => {
  for (const route of routes.filter((candidate) => candidate.sitemap)) {
    assert.equal(route.indexable, true, `${route.id} must be indexable`);
    assert.equal(route.canonicalIntent, "self", `${route.id} must be self-canonical`);

    const html = fs.readFileSync(path.join(repositoryRoot, route.sourcePath), "utf8");
    assert.doesNotMatch(html, /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i);

    const canonicalUrl = new URL(route.publicPath, siteOrigin).href;
    assert.match(
      html,
      new RegExp(`<link\\s+rel=["']canonical["'][^>]*href=["']${canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i"),
      `${route.id} must expose its sitemap URL as the canonical URL`,
    );
  }
});
