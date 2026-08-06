const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repositoryRoot = path.resolve(__dirname, "..");
const templatesRoot = path.join(repositoryRoot, "templates");
const galleryRoot = templatesRoot;

function collectTemplateEntries(directory, entries = []) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (item.name === "node_modules" || item.name === "template-gallery") continue;

    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) {
      collectTemplateEntries(itemPath, entries);
    } else if (item.name === "index.html" && directory !== templatesRoot) {
      entries.push(path.relative(templatesRoot, itemPath));
    }
  }

  return entries;
}

test("the template gallery links every template website exactly once", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const cardTargets = [...galleryHtml.matchAll(
    /<article class="concept[^>]*>[\s\S]*?<a href="([^"]+)"/g,
  )].map((match) => {
    const publicPath = decodeURIComponent(match[1]);
    assert.match(publicPath, /^\/templates\/.+\/$/, "gallery cards must use site-root template URLs");
    return `${publicPath.slice("/templates/".length)}index.html`;
  });

  assert.equal(new Set(cardTargets).size, cardTargets.length, "gallery links must be unique");
  assert.deepEqual(cardTargets.sort(), collectTemplateEntries(templatesRoot).sort());
});

test("the template gallery is the canonical search-facing library", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  assert.match(galleryHtml, /<link rel="canonical" href="https:\/\/www\.networksandnodes\.org\/templates\/">/);
  assert.doesNotMatch(galleryHtml, /<meta name="robots" content="noindex/i);
  assert.match(galleryHtml, /concept studies, active explorations, and selected project directions/i);
});

test("the homepage promotes the gallery instead of Redeemed Hands", () => {
  const homepage = fs.readFileSync(path.join(repositoryRoot, "index.html"), "utf8");
  assert.match(homepage, /<h3>Website Template Library<\/h3>/);
  assert.match(homepage, /href="\/templates\/"/);
  assert.doesNotMatch(homepage, /<h3>Redeemed Hands<\/h3>/);
});

test("non-3D media loads automatically and 3D retains an explicit gate", () => {
  const homepage = fs.readFileSync(path.join(repositoryRoot, "index.html"), "utf8");
  const switchboard = fs.readFileSync(path.join(repositoryRoot, "switchboard.html"), "utf8");
  assert.match(homepage, /<mux-player[\s\S]*?playback-id="Rgqqh00rKkzeGpQYUe00QDb7Tqtnfnhd6B016z44NacQzc"[\s\S]*?autoplay="muted"/);
  assert.match(homepage, /<iframe[\s\S]*?src="\/switchboard\.html"[\s\S]*?loading="eager"/);
  assert.doesNotMatch(homepage, /data-switchboard-load/);
  assert.match(switchboard, /data-load-product-model/);
  assert.match(switchboard, /if \(!hasApproved3d\) return;/);
});

test("every public gallery entry point resolves to the canonical templates route", () => {
  const galleryPath = "/templates/";
  const publicLinkFiles = [
    "index.html",
    "src/main.js",
    "switchboard.html",
  ];

  for (const file of publicLinkFiles) {
    const contents = fs.readFileSync(path.join(repositoryRoot, file), "utf8");
    assert.match(contents, new RegExp(galleryPath.replaceAll("/", "\\/")));
  }

  const templatesIndex = fs.readFileSync(path.join(templatesRoot, "index.html"), "utf8");
  assert.match(templatesIndex, /https:\/\/www\.networksandnodes\.org\/templates\//);

  const redirects = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "vercel.json"), "utf8")).redirects;
  for (const source of ["/templates", "/templates/template-gallery", "/templates/template-gallery/", "/templates/template-gallery/index.html"]) {
    const redirect = redirects.find((item) => item.source === source);
    assert.equal(
      redirect?.destination,
      "https://www.networksandnodes.org/templates/",
      `${source} must redirect to the canonical gallery`,
    );
  }

  const routes = require(path.join(repositoryRoot, "config/routes.cjs"));
  assert.equal(routes.find((route) => route.id === "templates")?.sourcePath, "templates/index.html");
  assert.equal(
    routes.find((route) => route.id === "templateGallery")?.sourcePath,
    "templates/template-gallery/index.html",
  );
});
