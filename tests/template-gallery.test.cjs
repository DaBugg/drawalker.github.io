const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const repositoryRoot = path.resolve(__dirname, "..");
const templatesRoot = path.join(repositoryRoot, "templates");
const galleryRoot = templatesRoot;
const galleryScriptPath = path.join(templatesRoot, "template-gallery", "script.js");

const expectedLibraryOrder = [
  "aeron",
  "northstar-credit",
  "forgeworks",
  "lgpr",
  "off-map-club",
  "structure-house",
  "fleetaxis",
  "sitepilot",
  "rapidroot",
  "sl-plumbing",
  "gatekeeper",
  "harborline",
  "apexline",
  "daily-pour",
  "coastal-stretch",
  "meridian",
];

const expectedOriginalOrder = [
  "forgeworks",
  "apexline",
  "harborline",
  "meridian",
  "rapidroot",
  "fleetaxis",
  "daily-pour",
  "lgpr",
  "sitepilot",
  "sl-plumbing",
  "structure-house",
  "aeron",
  "northstar-credit",
  "gatekeeper",
  "coastal-stretch",
  "off-map-club",
];

const conceptIndexFiles = [
  "drone-demo/index.html",
  "finance/index.html",
  "forgeworks-industrial/index.html",
  "advertising Agency Demo/index.html",
  "travel/index.html",
  "construction/index.html",
  "fleetaxis-logistics/index.html",
  "sitepilot-operations/index.html",
  "rapidroot-home-services/index.html",
  "SL-Web-Demo/index.html",
  "lead-gen-demo/index.html",
  "harborline-development/index.html",
  "apexline-commercial/index.html",
  "coffee-shop/index.html",
  "stretch-consierge/stretch-concierge-site/index.html",
  "meridian-advisory/index.html",
];

const conceptRoots = [
  "SL-Web-Demo",
  "advertising Agency Demo",
  "apexline-commercial",
  "coffee-shop",
  "construction",
  "drone-demo",
  "finance",
  "fleetaxis-logistics",
  "forgeworks-industrial",
  "harborline-development",
  "lead-gen-demo",
  "meridian-advisory",
  "rapidroot-home-services",
  "sitepilot-operations",
  "stretch-consierge/stretch-concierge-site",
  "travel",
];

function readConcepts() {
  const script = fs.readFileSync(galleryScriptPath, "utf8");
  const match = script.match(/const concepts = (\[[\s\S]*?\n  \]);/);
  assert.ok(match, "gallery script must expose one canonical concepts array");
  return JSON.parse(JSON.stringify(vm.runInNewContext(`(${match[1]})`)));
}

function readOriginalOrder() {
  const script = fs.readFileSync(galleryScriptPath, "utf8");
  const match = script.match(/const originalOrder = (\[[\s\S]*?\n  \]);/);
  assert.ok(match, "gallery script must expose the restored original order");
  return JSON.parse(JSON.stringify(vm.runInNewContext(`(${match[1]})`)));
}

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

function collectHtmlFiles(directory, entries = []) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (item.name === "node_modules") continue;
    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) collectHtmlFiles(itemPath, entries);
    else if (item.name.endsWith(".html")) entries.push(itemPath);
  }
  return entries;
}

function resolveLocalReference(sourceFile, reference) {
  const cleanReference = reference.trim().replace(/^['"]|['"]$/g, "").split(/[?#]/)[0];
  if (
    !cleanReference
    || cleanReference.startsWith("#")
    || cleanReference.startsWith("//")
    || cleanReference.includes(" + ")
    || cleanReference.includes("${")
    || /^[a-z][a-z\d+.-]*:/i.test(cleanReference)
  ) {
    return null;
  }

  const decoded = decodeURIComponent(cleanReference);
  let target = decoded.startsWith("/")
    ? path.join(repositoryRoot, decoded.slice(1))
    : path.resolve(path.dirname(sourceFile), decoded);
  if (decoded.endsWith("/") || (fs.existsSync(target) && fs.statSync(target).isDirectory())) {
    target = path.join(target, "index.html");
  }
  return target;
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

test("the gallery uses the requested library and featured order", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const galleryScript = fs.readFileSync(galleryScriptPath, "utf8");
  assert.deepEqual(readOriginalOrder(), expectedOriginalOrder);

  const cards = [...galleryHtml.matchAll(
    /<article class="concept[^"]*" data-concept-id="([^"]+)" data-category="([^"]+)">\s*<a href="([^"]+)" target="_blank" rel="noopener noreferrer">/g,
  )];
  assert.equal(cards.length, 16, "every library card must have a stable ID and safe new-tab link");
  assert.deepEqual(cards.map((match) => match[1]), expectedLibraryOrder);

  assert.match(galleryScript, /The Daily Pour/);
  assert.match(galleryScript, /FleetAxis Logistics/);
  assert.match(galleryScript, /Off Map Club/);
  assert.match(galleryScript, /AERON/);
  assert.match(galleryScript, /Northstar Credit/);
  assert.match(galleryScript, /featuredIndex = \(featuredIndex \+ featured\.length - 1\) % featured\.length/);
  assert.match(galleryScript, /featuredIndex = \(featuredIndex \+ 1\) % featured\.length/);
  assert.match(galleryHtml, /data-feature-title>The Daily Pour<\/h2>/);
  assert.match(galleryHtml, /data-feature-link href="\/templates\/coffee-shop\/"/);
});

test("the featured rotation uses the requested five visual treatments", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const galleryScript = fs.readFileSync(galleryScriptPath, "utf8");
  const integrationStyles = fs.readFileSync(
    path.join(templatesRoot, "template-gallery", "integration-pass.css"),
    "utf8",
  );
  assert.match(galleryHtml, /<div class="featured-preview daily-feature">/);
  assert.match(galleryScript, /"daily-feature"/);
  assert.match(galleryScript, /"fleet-feature"/);
  assert.match(galleryScript, /"offmap-feature"/);
  assert.match(galleryScript, /"aeron-feature"/);
  assert.match(galleryScript, /"northstar-feature"/);
  assert.match(integrationStyles, /\/images\/dailypour-land\.png/);
  assert.match(integrationStyles, /\/templates\/fleetaxis-logistics\/preview\.svg/);
  assert.match(integrationStyles, /\/templates\/travel\/off-map-feature\.png/);
  assert.match(integrationStyles, /\/templates\/drone-demo\/aeron-drone-hero\.png/);
  assert.match(integrationStyles, /\/templates\/finance\/assets\/meadow-credit-recovery-clean\.webp/);
});

test("the gallery uses its original designed thumbnail treatments", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const galleryScript = fs.readFileSync(galleryScriptPath, "utf8");
  const galleryStyles = fs.readFileSync(path.join(templatesRoot, "template-gallery", "gallery-expansion.css"), "utf8");
  assert.doesNotMatch(galleryHtml, /\/images\/[^"']+-land\.png/);
  assert.doesNotMatch(galleryHtml, /mux-player|@mux\/mux-player/);
  assert.doesNotMatch(galleryScript, /playbackId|data-feature-video|data-aeron-card-player|imageSrc/);
  assert.match(galleryHtml, /<div class="preview aeron">[\s\S]*BUILD FOR THE MISSION/);
  assert.match(galleryHtml, /<div class="preview lgpr">[\s\S]*attention/);
  assert.match(galleryStyles, /\.aeron \{/);
  assert.match(galleryStyles, /\.lgpr \{/);
  assert.match(galleryStyles, /\.coffee \{/);
});

test("the original gallery composition keeps its mixed card sizes", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const galleryStyles = fs.readFileSync(
    path.join(templatesRoot, "template-gallery", "gallery-expansion.css"),
    "utf8",
  );
  const galleryScript = fs.readFileSync(galleryScriptPath, "utf8");
  assert.deepEqual(readOriginalOrder(), expectedOriginalOrder);
  assert.match(galleryHtml, /class="concept wide"/);
  assert.match(galleryHtml, /class="concept large"/);
  assert.match(galleryHtml, /class="concept tall"/);
  assert.doesNotMatch(galleryHtml, /class="concept-preview-image"|class="preview image-preview/);
  assert.doesNotMatch(galleryStyles, /grid-auto-flow: dense|--concept-span|--preview-ratio/);
  assert.doesNotMatch(galleryScript, /layoutMasonry|gridRowEnd/);
  assert.match(galleryHtml, /class="concept large" data-concept-id="sitepilot"/);
  assert.match(galleryHtml, /class="concept tall" data-concept-id="sl-plumbing"/);
  assert.ok(
    expectedOriginalOrder.indexOf("sl-plumbing") === expectedOriginalOrder.indexOf("sitepilot") + 1,
    "SitePilot and S&L must remain adjacent so their 7/5-column cards share a row",
  );
});

test("all 16 concepts provide shared home and gallery return navigation", () => {
  for (const relativePath of conceptIndexFiles) {
    const html = fs.readFileSync(path.join(templatesRoot, relativePath), "utf8");
    const returnLinks = [...html.matchAll(/<a class="nn-studio-return"[^>]*>/g)];
    assert.equal(returnLinks.length, 1, `${relativePath} must contain exactly one studio return link`);
    assert.match(returnLinks[0][0], /href="https:\/\/www\.networksandnodes\.org\/"/);
    assert.match(returnLinks[0][0], /aria-label="Back to Networks &amp; Nodes"/);
    assert.doesNotMatch(returnLinks[0][0], /target=/, "studio return must stay in the concept tab");
    assert.equal(
      (html.match(/\/templates\/template-gallery\/studio-return\.js/g) || []).length,
      1,
      `${relativePath} must load the shared return treatment once`,
    );
  }

  const returnScript = fs.readFileSync(
    path.join(templatesRoot, "template-gallery", "studio-return.js"),
    "utf8",
  );
  assert.match(returnScript, /Networks & Nodes home/);
  assert.match(returnScript, /← Back to template gallery/);
  assert.match(returnScript, /https:\/\/www\.networksandnodes\.org\/templates\//);
  assert.match(returnScript, /\.nn-template-return__link:focus-visible/);
  assert.match(returnScript, /@media \(max-width: 560px\)/);
  assert.match(returnScript, /min-height: 44px/);
});

test("every concept page is excluded from search and clearly returns to the studio", () => {
  const conceptHtmlFiles = conceptRoots.flatMap((root) => (
    collectHtmlFiles(path.join(templatesRoot, root))
  ));

  assert.equal(conceptHtmlFiles.length, 55, "the indexing policy must cover every concept HTML page");

  const returnScript = fs.readFileSync(
    path.join(templatesRoot, "template-gallery", "studio-return.js"),
    "utf8",
  );
  assert.match(returnScript, /existingReturn\.replaceWith\(returnNav\)/);
  assert.match(returnScript, /returnNav\.append\(existingReturn, galleryReturn\)/);

  for (const htmlFile of conceptHtmlFiles) {
    const html = fs.readFileSync(htmlFile, "utf8");
    const relativePath = path.relative(repositoryRoot, htmlFile);
    assert.match(
      html,
      /<meta name="robots" content="noindex, nofollow, max-image-preview:large">/i,
      `${relativePath} must keep demonstration content out of search`,
    );
    assert.doesNotMatch(
      html,
      /<script[^>]+type="application\/ld\+json"/i,
      `${relativePath} must not publish fictional entity or proof schema`,
    );
    assert.equal(
      (html.match(/class="nn-studio-return"/g) || []).length,
      1,
      `${relativePath} must contain exactly one studio return`,
    );
    assert.match(html, /Website demonstration by Networks &amp; Nodes/);
    assert.equal(
      (html.match(/\/templates\/template-gallery\/studio-return\.js/g) || []).length,
      1,
      `${relativePath} must load the shared return treatment exactly once`,
    );
  }
});

test("gallery and concept entry pages have no missing local links or assets", () => {
  const htmlFiles = ["index.html", ...conceptIndexFiles].map((relativePath) => (
    path.join(templatesRoot, relativePath)
  ));
  const missing = [];
  const stylesheets = new Set();

  for (const htmlFile of htmlFiles) {
    const html = fs.readFileSync(htmlFile, "utf8");
    const references = [
      ...[...html.matchAll(/(?:href|src|poster)="([^"]+)"/g)].map((match) => match[1]),
      ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((match) => (
        match[1].split(",").map((candidate) => candidate.trim().split(/\s+/)[0])
      )),
    ];

    for (const reference of references) {
      const target = resolveLocalReference(htmlFile, reference);
      if (!target) continue;
      if (!fs.existsSync(target)) {
        missing.push(`${path.relative(repositoryRoot, htmlFile)} -> ${reference}`);
      } else if (path.extname(target) === ".css") {
        stylesheets.add(target);
      }
    }
  }

  for (const stylesheet of stylesheets) {
    const css = fs.readFileSync(stylesheet, "utf8");
    for (const match of css.matchAll(/url\(([^)]+)\)/g)) {
      const target = resolveLocalReference(stylesheet, match[1]);
      if (target && !fs.existsSync(target)) {
        missing.push(`${path.relative(repositoryRoot, stylesheet)} -> ${match[1]}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});

test("the template gallery is the canonical search-facing library", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const homepageHtml = fs.readFileSync(path.join(repositoryRoot, "index.html"), "utf8");
  const sitemap = fs.readFileSync(path.join(repositoryRoot, "sitemap.xml"), "utf8");
  const jsonLdMatch = galleryHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  assert.match(galleryHtml, /<link rel="canonical" href="https:\/\/www\.networksandnodes\.org\/templates\/">/);
  assert.doesNotMatch(galleryHtml, /<meta name="robots" content="noindex/i);
  assert.match(galleryHtml, /<meta name="robots" content="index, follow, max-image-preview:large">/i);
  assert.match(galleryHtml, /<title>Website Design Concepts by Industry \| Networks &amp; Nodes<\/title>/);
  assert.match(galleryHtml, /Website concepts designed around how different customers buy\./);
  assert.match(galleryHtml, /Browse website concepts by industry and buying context\./);

  assert.ok(jsonLdMatch, "the gallery must provide CollectionPage and ItemList structured data");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  const collection = jsonLd["@graph"].find((entry) => entry["@type"] === "CollectionPage");
  const itemList = jsonLd["@graph"].find((entry) => entry["@type"] === "ItemList");
  const breadcrumb = jsonLd["@graph"].find((entry) => entry["@type"] === "BreadcrumbList");
  assert.ok(collection);
  assert.ok(itemList);
  assert.ok(breadcrumb);
  assert.equal(itemList.numberOfItems, 16);
  assert.deepEqual(
    itemList.itemListElement.map((entry) => entry.position),
    Array.from({ length: 16 }, (_, index) => index + 1),
  );
  assert.equal(new Set(itemList.itemListElement.map((entry) => entry.url)).size, 16);

  assert.ok((homepageHtml.match(/href="\/templates\/"/g) || []).length >= 4);
  assert.match(homepageHtml, />Website concepts<\/a>/);
  assert.match(homepageHtml, /Website Design Concept Library/);

  assert.match(sitemap, /<loc>https:\/\/www\.networksandnodes\.org\/templates\/<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.networksandnodes\.org\/templates\/.+<\/loc>/);
});

test("the homepage promotes the gallery instead of Redeemed Hands", () => {
  const homepage = fs.readFileSync(path.join(repositoryRoot, "index.html"), "utf8");
  assert.match(homepage, /<h3>Website Design Concept Library<\/h3>/);
  assert.match(homepage, /href="\/templates\/"/);
  assert.doesNotMatch(homepage, /<h3>Redeemed Hands<\/h3>/);
});

test("non-3D media loads automatically and 3D retains an explicit gate", () => {
  const homepage = fs.readFileSync(path.join(repositoryRoot, "index.html"), "utf8");
  const switchboard = fs.readFileSync(path.join(repositoryRoot, "switchboard.html"), "utf8");
  assert.match(homepage, /<mux-player[\s\S]*?playback-id="Rgqqh00rKkzeGpQYUe00QDb7Tqtnfnhd6B016z44NacQzc"[\s\S]*?autoplay="muted"/);
  assert.match(homepage, /<iframe[\s\S]*?src="\/switchboard\.html"[\s\S]*?loading="eager"/);
  assert.doesNotMatch(homepage, /data-switchboard-load/);
  assert.match(switchboard, /<div class="product-main"[^>]*>[\s\S]*?class="model-load-action"[\s\S]*?data-load-product-model/);
  assert.match(switchboard, /if \(!hasApproved3d\) return;/);
  assert.match(switchboard, /background: linear-gradient\(145deg, #ef4444, #b91c1c\)/);
  assert.match(switchboard, /}, 90000\);/);
  assert.match(switchboard, /height: clamp\(132px, 11vw, 158px\)/);
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
