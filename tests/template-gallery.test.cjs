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

function readConcepts() {
  const script = fs.readFileSync(galleryScriptPath, "utf8");
  const match = script.match(/const concepts = (\[[\s\S]*?\n  \]);/);
  assert.ok(match, "gallery script must expose one canonical concepts array");
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

test("the canonical collection controls the specified library and featured order", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const galleryScript = fs.readFileSync(galleryScriptPath, "utf8");
  const concepts = readConcepts();
  const library = [...concepts].sort((a, b) => a.libraryRank - b.libraryRank);
  const featured = concepts
    .filter((concept) => concept.featuredRank !== null)
    .sort((a, b) => a.featuredRank - b.featuredRank);

  assert.equal(concepts.length, 16);
  assert.deepEqual(library.map((concept) => concept.id), expectedLibraryOrder);
  assert.deepEqual(featured.map((concept) => concept.id), expectedLibraryOrder.slice(0, 5));
  assert.equal(new Set(concepts.map((concept) => concept.id)).size, 16);
  assert.equal(new Set(concepts.map((concept) => concept.href)).size, 16);
  assert.equal(new Set(concepts.map((concept) => concept.libraryRank)).size, 16);
  assert.equal(new Set(featured.map((concept) => concept.featuredRank)).size, 5);
  assert.ok(featured.every((concept) => concept.featured));

  const cards = [...galleryHtml.matchAll(
    /<article class="concept[^"]*" data-concept-id="([^"]+)" data-category="([^"]+)">\s*<a href="([^"]+)" target="_blank" rel="noopener noreferrer">/g,
  )];
  assert.equal(cards.length, 16, "every library card must have a stable ID and safe new-tab link");
  assert.deepEqual(cards.map((match) => match[1]), expectedLibraryOrder);

  const cardById = new Map(cards.map((match) => [match[1], match]));
  for (const concept of concepts) {
    const card = cardById.get(concept.id);
    assert.ok(card, `missing gallery card for ${concept.id}`);
    assert.equal(card[3], concept.href);
    assert.deepEqual(card[2].split(" ").sort(), [...concept.categories].sort());
  }

  assert.match(galleryScript, /const library = \[\.\.\.concepts\]\.sort/);
  assert.match(galleryScript, /\.filter\(\(concept\) => concept\.featuredRank !== null\)/);
  assert.match(galleryScript, /featuredIndex = \(featuredIndex \+ featured\.length - 1\) % featured\.length/);
  assert.match(galleryScript, /featuredIndex = \(featuredIndex \+ 1\) % featured\.length/);
  assert.match(galleryHtml, /data-feature-title>AERON<\/h2>/);
  assert.match(galleryHtml, /data-feature-link href="\/templates\/drone-demo\/" target="_blank" rel="noopener noreferrer"/);
});

test("featured concepts use local, dimensioned project imagery", () => {
  const concepts = readConcepts();
  const featured = concepts.filter((concept) => concept.featuredRank !== null);

  for (const concept of featured) {
    const preview = concept.featured;
    assert.match(preview.imageSrc, /^\/(?:templates|images)\//);
    assert.ok(Number.isInteger(preview.imageWidth) && preview.imageWidth > 0);
    assert.ok(Number.isInteger(preview.imageHeight) && preview.imageHeight > 0);
    const assetPath = path.join(repositoryRoot, decodeURIComponent(preview.imageSrc.slice(1)));
    assert.ok(fs.existsSync(assetPath), `missing featured asset: ${preview.imageSrc}`);
  }
});

test("matching land artwork replaces the gallery thumbnail treatments", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const galleryScript = fs.readFileSync(galleryScriptPath, "utf8");
  const artwork = [
    "aeron-land.png",
    "dailypour-land.png",
    "gatkeeper-land.png",
    "lgpr-land.png",
    "rapidroot-land.png",
    "sitepilot-land.png",
  ];

  for (const filename of artwork) {
    assert.match(galleryHtml, new RegExp(`/images/${filename.replace(".", "\\.")}`));
    assert.ok(fs.existsSync(path.join(repositoryRoot, "images", filename)));
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "package.json"), "utf8"));
  assert.match(packageJson.scripts.build, /images\/\*-land\.png/);

  assert.doesNotMatch(galleryHtml, /mux-player|@mux\/mux-player/);
  assert.doesNotMatch(galleryScript, /playbackId|data-feature-video|data-aeron-card-player/);
  assert.match(galleryScript, /imageSrc: "\/images\/aeron-land\.png"/);
  assert.match(galleryScript, /imageSrc: "\/images\/lgpr-land\.png"/);
});

test("the gallery pairs one wide and one tall concept without incomplete rows", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const cardClasses = [...galleryHtml.matchAll(
    /<article class="concept (large|tall)" data-concept-id="([^"]+)"/g,
  )];

  assert.equal(cardClasses.length, 16);
  for (let index = 0; index < cardClasses.length; index += 2) {
    assert.deepEqual(
      new Set([cardClasses[index][1], cardClasses[index + 1][1]]),
      new Set(["large", "tall"]),
      `gallery pair ${index / 2 + 1} must contain one wide and one tall concept`,
    );
  }
});

test("all 16 concepts provide one same-tab return to Networks & Nodes", () => {
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
  assert.match(returnScript, /\.nn-studio-return:focus-visible/);
  assert.match(returnScript, /@media \(max-width: 560px\)/);
  assert.match(returnScript, /min-height: 44px/);
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
