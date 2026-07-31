const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("homepage exposes the approved commercial vocabulary in semantic HTML", () => {
  const html = read("index.html");

  assert.match(html, /Web Design · Software · Automation · Growth/);
  assert.match(html, /custom software/i);
  assert.match(html, /CRM/i);
  assert.match(html, /Lead generation &amp; marketing/i);
  assert.match(html, /U\.S\.-market adaptation/i);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test("homepage has clear conversion paths and complete service intents", () => {
  const html = read("index.html");

  assert.match(html, />\s*Start a project\s*</);
  assert.match(html, /Request a discovery call/);
  for (const intent of [
    "Website / digital experience",
    "Automation / AI workflow",
    "Custom software / CRM",
    "Marketing / lead generation",
    "U.S. market adaptation",
    "Not sure yet",
  ]) {
    assert.ok(html.includes(`value="${intent}"`), `missing service intent: ${intent}`);
  }
});

test("homepage preserves the four-stage process with tangible artifacts", () => {
  const html = read("index.html");

  for (const stage of ["Review", "Define", "Build", "Improve"]) {
    assert.match(html, new RegExp(`<h3>${stage}</h3>`));
  }
  assert.match(html, /audit or system map/);
  assert.match(html, /scope and priority brief/);
  assert.match(html, /working product/);
  assert.match(html, /analytics or iteration report/);
});

test("the flagship project uses an owned case-study route", () => {
  const homepage = read("index.html");
  const caseStudy = read("work/transportation-solutions-lighting.html");
  const sitemap = read("sitemap.xml");

  assert.match(homepage, /href="\/work\/transportation-solutions-lighting\.html"/);
  assert.equal((caseStudy.match(/<h1\b/g) || []).length, 1);
  assert.match(caseStudy, /Reported outcome/);
  assert.match(caseStudy, /Visit the client website/);
  assert.match(sitemap, /work\/transportation-solutions-lighting\.html/);
});

test("switchboard explains the system, outcomes, touch controls, and project action", () => {
  const html = read("switchboard.html");

  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /Explore how Networks &amp; Nodes connects websites/);
  assert.match(html, /What changes/);
  assert.match(html, /Tap or select a service/);
  assert.match(html, /Discuss this capability/);
  assert.match(html, /outcome:/);
});

test("rich media is progressively initialized", () => {
  const homepage = read("index.html");
  const main = read("src/main.js");
  const switchboard = read("switchboard.html");
  const frameMarkup = homepage.match(/<iframe\s+data-video-frame[\s\S]*?<\/iframe>/)?.[0] || "";

  assert.doesNotMatch(frameMarkup, /\ssrc=/);
  assert.match(homepage, /data-video-poster/);
  assert.match(main, /IntersectionObserver/);
  assert.match(main, /deactivateMedia/);
  assert.match(main, /document\.hidden/);
  assert.doesNotMatch(
    switchboard,
    /<script[^>]+src="https:\/\/ajax\.googleapis\.com\/ajax\/libs\/model-viewer/i,
  );
  assert.match(switchboard, /function loadModelViewer/);
});

test("hero carousel keeps the approved video order", () => {
  const main = read("src/main.js");
  const immersive = main.indexOf('label: "Immersive experiences"');
  const market = main.indexOf('label: "U.S. market readiness"');
  const brand = main.indexOf('label: "Brand systems"');
  const measured = main.indexOf('label: "Measured outcomes"');

  assert.ok(immersive < market && market < brand && brand < measured);
});
