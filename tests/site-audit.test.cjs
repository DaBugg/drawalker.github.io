const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("homepage exposes the approved commercial vocabulary in semantic HTML", () => {
  const html = read("index.html");

  assert.match(html, /Websites · Custom software · Automation · Connected workflows/);
  assert.match(html, /custom software/i);
  assert.match(html, /CRM/i);
  assert.match(html, /lead generation/i);
  assert.match(html, /U\.S\. market adaptation/i);
  assert.match(html, /replace disconnected tools/);
  assert.match(html, /reduce manual work/);
  assert.match(html, /established businesses, founder-led teams/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test("homepage has clear conversion paths and complete service intents", () => {
  const html = read("index.html");

  assert.match(html, />\s*Request a project review\s*</);
  assert.match(html, /href="#contact" data-scroll-target="contact"/);
  assert.match(html, /No sales presentation\./);
  assert.match(html, /Transportation Solutions &amp; Lighting,[\s\S]*?approximately 10 hours per week in reported manual dispatch/);
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
  assert.match(caseStudy, /Approximately 10 hours per week in reported manual dispatch work reduced\./);
  assert.match(caseStudy, /Visit the client website/);
  assert.match(sitemap, /work\/transportation-solutions-lighting\.html/);
});

test("Phase 2 gives every featured project consistent, defensible proof", () => {
  const homepage = read("index.html");
  const workSection = homepage.match(/<section class="section work"[\s\S]*?<\/section>/)?.[0] || "";

  assert.equal((workSection.match(/<article class="project">/g) || []).length, 3);
  for (const label of ["Business problem", "What we built", "Systems connected"]) {
    assert.equal((workSection.match(new RegExp(`<dt>${label}<\\/dt>`, "g")) || []).length, 3);
  }
  assert.equal((workSection.match(/<dt>(?:Reported outcome|Current status)<\/dt>/g) || []).length, 3);
  assert.match(workSection, /Approximately 10 hours per week in reported manual dispatch work reduced\./);
  assert.doesNotMatch(workSection, /~10|MVP → market|Clearer path/);
  assert.match(workSection, /Three featured projects showing work across strategy, design, and implementation/);
});

test("project cards lead to internal details before explicit external actions", () => {
  const homepage = read("index.html");
  const tsl = homepage.match(/<article class="project">[\s\S]*?<\/article>/)?.[0] || "";
  const codeLink = homepage.match(/<article class="project">[\s\S]*?CodeLink[\s\S]*?<\/article>/)?.[0] || "";
  const redeemed = homepage.match(/<article class="project">[\s\S]*?Redeemed Hands[\s\S]*?<\/article>/)?.[0] || "";

  assert.ok(tsl.indexOf('/work/transportation-solutions-lighting.html') < tsl.indexOf('https://www.tsandl.us/'));
  assert.ok(codeLink.indexOf('/work/codelink.html') < codeLink.indexOf('https://www.codelink.live/waitlist'));
  assert.match(redeemed, /href="\/work\/redeemed-hands\.html"/);
  assert.doesNotMatch(redeemed, /redeemedhands\.com/);
  assert.match(tsl, /Visit the client website/);
  assert.match(codeLink, /View the product page/);
});

test("all featured projects have reusable detail pages and indexed routes", () => {
  const sitemap = read("sitemap.xml");
  const viteConfig = read("vite.config.mjs");
  const cases = [
    ["work/transportation-solutions-lighting.html", "Reported project outcome"],
    ["work/codelink.html", "Public product page available. No quantitative outcome published."],
    ["work/redeemed-hands.html", "Completed homepage preview documented in the repository."],
  ];

  for (const [file, proof] of cases) {
    const html = read(file);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file} should have one h1`);
    assert.match(html, /Business|Problem/i);
    assert.ok(html.includes(proof), `${file} missing its proof/status statement`);
    assert.ok(sitemap.includes(file), `${file} missing from sitemap`);
    assert.ok(viteConfig.includes(file), `${file} missing from the production build inputs`);
  }
});

test("owner proof requests stay in an internal repository checklist", () => {
  const homepage = read("index.html");
  const inventory = read("PROJECT-PROOF-INVENTORY.md");

  for (const item of [
    "Client approved testimonial",
    "Baseline and after state metric",
    "Project timeline",
    "Public launch URL",
    "Permission to name the client",
  ]) {
    assert.match(inventory, new RegExp(item));
  }
  assert.doesNotMatch(homepage, /Owner supplied proof checklist/);
  assert.doesNotMatch(homepage, /Client approved testimonial|Baseline and after state metric|Permission to name the client/);
});

test("section navigation has real fragment fallbacks and case studies preserve the portfolio tab", () => {
  const homepage = read("index.html");
  const caseStudy = read("work/transportation-solutions-lighting.html");
  const navigation = read("js/in-page-navigation.js");
  const homepageHeader = homepage.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] || "";
  const caseStudyHeader = caseStudy.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] || "";

  assert.match(homepageHeader, /href="#services"/);
  assert.match(homepageHeader, /href="#contact"/);
  assert.doesNotMatch(caseStudyHeader, /href="\/?#[^"]+"/);
  assert.match(homepage, /data-scroll-target="work"/);
  assert.match(navigation, /event\.preventDefault\(\)/);
  assert.match(homepage, /codelink\.live\/waitlist"[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer"/);
  assert.match(caseStudy, /www\.tsandl\.us\/" target="_blank" rel="noopener noreferrer"/);
});

test("homepage and switchboard form one combined capabilities section", () => {
  const homepage = read("index.html");
  const switchboard = read("switchboard.html");

  assert.doesNotMatch(homepage, /Connected capabilities/i);
  assert.doesNotMatch(switchboard, /Connected capabilities/i);
  assert.match(homepage, /<h2 id="services-title">What we build\.<\/h2>/);
  assert.match(homepage, /Websites and digital experiences/);
  assert.match(homepage, /Custom software and internal tools/);
  assert.match(homepage, /Automation, AI, and connected workflows/);
  assert.match(homepage, /Explore the detailed capabilities below/);
  assert.doesNotMatch(homepage, /capability-rail/);
  assert.equal((switchboard.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(switchboard, /System Selector/i);
});

test("Phase 1 keeps the hero compact and the project review accessible", () => {
  const html = read("index.html");
  const css = read("css/site.css");

  assert.match(html, /<section class="contact" id="contact">/);
  assert.match(html, /Start with the problem, not a commitment\./);
  assert.match(html, /What happens after you submit/);
  assert.match(html, /Send review request/);
  assert.doesNotMatch(html, /usually within one business day/);
  assert.match(css, /\.hero-title\s*\{[\s\S]*?max-width: min\(100%, 680px\)/);
  assert.match(css, /\.solution-groups\s*\{[\s\S]*?grid-template-columns: repeat\(3/);
  assert.match(css, /:where\(a, button, summary, input, textarea\):focus-visible/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 640px\)/);
});

test("switchboard exposes six connected capability states with proof and outcomes", () => {
  const html = read("switchboard.html");
  const capabilities = ["website", "automation", "software", "growth", "market", "experience"];

  for (const capability of capabilities) {
    assert.match(html, new RegExp(`data-service="${capability}"`));
    assert.match(html, new RegExp(`data-demo="${capability}"`));
  }
  assert.equal((html.match(/data-service="/g) || []).length, 6);
  assert.equal((html.match(/<section class="demo" data-demo="/g) || []).length, 6);
  assert.match(html, /What it can include/);
  assert.match(html, /View related work/);
  assert.match(html, /Less manual handoff\. Faster response\. Better visibility\./);
  assert.match(html, /shortcutServices = \["experience", "website", "growth", "market", "software", "automation"\]/);
  assert.deepEqual(
    [...html.matchAll(/data-service="([^"]+)"/g)].map((match) => match[1]),
    ["experience", "website", "growth", "market", "software", "automation"],
  );
  assert.match(html, /\.prototype-note\s*\{\s*display: none;/);
  assert.doesNotMatch(html.match(/data-demo="automation"[\s\S]*?data-demo="software"/)?.[0] || "", /Ads \/ Marketing/);
  assert.match(html.match(/data-demo="growth"[\s\S]*?data-demo="experience"/)?.[0] || "", /id="marketing-app-carousel"/);
  assert.match(html, /font-size: clamp\(0\.47rem, 0\.68vw, 0\.6rem\)/);
});

test("switchboard opens on Digital Experiences", () => {
  const html = read("switchboard.html");
  const experienceDemo = html.match(/<section class="demo" data-demo="experience"[^>]*>/)?.[0] || "";
  const websiteDemo = html.match(/<section class="demo" data-demo="website"[^>]*>/)?.[0] || "";
  const experienceKey = html.match(/<button[\s\S]*?data-service="experience"[\s\S]*?<\/button>/)?.[0] || "";

  assert.doesNotMatch(experienceDemo, /\shidden/);
  assert.match(websiteDemo, /\shidden/);
  assert.match(experienceKey, /aria-selected="true"/);
  assert.match(html, /id="system-count">01 \/ 06</);
  assert.match(html, /aria-labelledby="key-experience"/);
  assert.match(html, /selectService\("experience"\)/);
  assert.match(html, /servicePanel\.hidden = id === "experience"/);
});

test("mobile growth prioritizes connected channels over the full funnel", () => {
  const html = read("switchboard.html");

  assert.match(html, /class="capability-flow growth-flow"/);
  assert.match(html, /class="growth-mobile-summary"/);
  assert.match(html, /Search \+ social/);
  assert.match(html, /Message matched to intent/);
  assert.match(html, /Form qualification/);
  assert.match(html, /\.growth-demo-header,[\s\S]*?\.growth-flow\s*\{\s*display: none;/);
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

test("the construction model is excluded and unloaded on mobile", () => {
  const switchboard = read("switchboard.html");

  assert.match(switchboard, /mobileProductQuery = window\.matchMedia\("\(max-width: 700px\)"\)/);
  assert.match(switchboard, /if \(!mobileProductQuery\.matches\)/);
  assert.match(switchboard, /productModel\.removeAttribute\("src"\)/);
  assert.match(switchboard, /renderProduct\(0, !productDemo\.hidden\)/);
});

test("large 3D assets and the available carousel videos use the public R2 CDN", () => {
  const homepage = read("index.html");
  const main = read("src/main.js");
  const helper = read("src/asset-url.js");
  const switchboard = read("switchboard.html");

  assert.match(helper, /import\.meta\.env\.VITE_ASSET_URL/);
  assert.match(helper, /https:\/\/assets\.networksandnodes\.org/);
  assert.match(homepage, /data-video-native/);

  for (const asset of [
    "Immersive-designs.MP4",
    "Language-translation.MOV",
    "Realtor-redesign.mp4",
  ]) {
    assert.match(main, new RegExp(`assetUrl\\("${asset.replace(".", "\\.")}\\"\\)`));
  }

  for (const asset of [
    "Chicago_Air_Jordan1_Compress-v1.glb",
    "Building_Under_Cons_Compress-v1.glb",
    "Midnight_Sentinel_Compress-v1.glb",
    "Stock-shirt-compressed-v1.glb",
  ]) {
    assert.match(switchboard, new RegExp(`assetUrl\\("${asset.replace(".", "\\.")}\\"\\)`));
    assert.doesNotMatch(switchboard, new RegExp(`/images/${asset.replace(".", "\\.")}`));
  }

  assert.match(main, /type: "mux"[\s\S]*label: "Measured outcomes"/);
});

test("hero carousel keeps the approved video order", () => {
  const main = read("src/main.js");
  const immersive = main.indexOf('label: "Immersive experiences"');
  const market = main.indexOf('label: "U.S. market readiness"');
  const brand = main.indexOf('label: "Brand systems"');
  const measured = main.indexOf('label: "Measured outcomes"');

  assert.ok(immersive < market && market < brand && brand < measured);
  assert.match(
    main,
    /Language-translation\.MOV"\),[\s\S]*?fit: "contain"[\s\S]*?Realtor-redesign\.mp4"\),[\s\S]*?fit: "contain"/,
  );
});
