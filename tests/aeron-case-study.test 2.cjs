const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repositoryRoot = path.resolve(__dirname, "..");
const caseStudyPath = path.join(repositoryRoot, "work/aeron/index.html");
const caseStudy = fs.readFileSync(caseStudyPath, "utf8");
const homepage = fs.readFileSync(path.join(repositoryRoot, "index.html"), "utf8");
const routes = require(path.join(repositoryRoot, "config/routes.cjs"));

test("AERON is an indexable Networks & Nodes design case study", () => {
  assert.match(caseStudy, /<title>Drone Website Design Case Study \| AERON Concept<\/title>/);
  assert.match(caseStudy, /name="robots" content="index, follow, max-image-preview:large"/);
  assert.match(caseStudy, /rel="canonical" href="https:\/\/www\.networksandnodes\.org\/work\/aeron\/"/);
  assert.match(caseStudy, /AERON is a fictional website demonstration created by Networks &amp; Nodes/);
  assert.match(caseStudy, /It does not claim a client launch or product-performance outcome/);
  const jsonLdMatch = caseStudy.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(jsonLdMatch, "AERON must provide article and breadcrumb structured data");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.ok(jsonLd["@graph"].some((entry) => entry["@type"] === "Article"));
  assert.ok(jsonLd["@graph"].some((entry) => entry["@type"] === "BreadcrumbList"));

  for (const asset of ["images/aeron-case-study.webp", "images/aeron-drone-hero.webp", "images/aeron-interface.webp"]) {
    assert.ok(fs.existsSync(path.join(repositoryRoot, asset)), `${asset} must exist`);
  }
});

test("AERON connects the homepage, case study, gallery, and noindex demonstration", () => {
  assert.match(homepage, /href="\/work\/aeron\/"/);
  assert.match(caseStudy, /href="\/templates\/"/);
  assert.match(
    caseStudy,
    /href="\/templates\/drone-demo\/" target="_blank" rel="noopener noreferrer"/,
  );

  const concept = fs.readFileSync(path.join(repositoryRoot, "templates/drone-demo/index.html"), "utf8");
  assert.match(concept, /name="robots" content="noindex, nofollow, max-image-preview:large"/);

  const route = routes.find((candidate) => candidate.id === "aeronCaseStudy");
  assert.deepEqual(route, {
    id: "aeronCaseStudy",
    sourcePath: "work/aeron/index.html",
    publicPath: "/work/aeron/",
    indexable: true,
    canonicalIntent: "self",
    sitemap: true,
  });
});
