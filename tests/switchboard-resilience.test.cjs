const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repositoryRoot = path.resolve(__dirname, "..");

test("interactive media components are bundled with the site", () => {
  const homepage = fs.readFileSync(path.join(repositoryRoot, "index.html"), "utf8");
  const main = fs.readFileSync(path.join(repositoryRoot, "src/main.js"), "utf8");
  const mediaCarousel = fs.readFileSync(
    path.join(repositoryRoot, "src/media-carousel.mjs"),
    "utf8",
  );
  const switchboard = fs.readFileSync(path.join(repositoryRoot, "switchboard.html"), "utf8");
  const viewerLoader = fs.readFileSync(
    path.join(repositoryRoot, "src/model-viewer-loader.mjs"),
    "utf8",
  );

  assert.doesNotMatch(homepage, /cdn\.jsdelivr\.net\/npm\/@mux\/mux-player/);
  assert.match(main, /import \{ initializeMediaCarousel \} from "\.\/media-carousel\.mjs";/);
  assert.match(mediaCarousel, /import\("@mux\/mux-player"\)/);
  assert.match(mediaCarousel, /IntersectionObserverImpl/);
  assert.doesNotMatch(switchboard, /ajax\.googleapis\.com\/ajax\/libs\/model-viewer/);
  assert.match(switchboard, /networks-nodes-switchboard-ready/);
  assert.match(
    switchboard,
    /const models = \[\s*\{\s*scene: "website"[\s\S]*scene: "product"/,
  );
  assert.match(
    switchboard,
    /data-product-scene="website" aria-current="step">Website<\/button>[\s\S]*data-product-scene="product">Product<\/button>/,
  );
  assert.match(viewerLoader, /import\("@google\/model-viewer"\)/);
});

test("homepage explorer does not inspect iframe contentDocument during load", () => {
  const embed = fs.readFileSync(
    path.join(repositoryRoot, "src/switchboard-embed.mjs"),
    "utf8",
  );

  assert.doesNotMatch(embed, /frame\.contentDocument.*querySelector/);
  assert.match(embed, /networks-nodes-switchboard-ready/);
  assert.match(embed, /completeRequest\(\);/);
});

test("one homepage feature failure cannot stop later initializers", () => {
  const main = fs.readFileSync(path.join(repositoryRoot, "src/main.js"), "utf8");

  assert.match(main, /function initializeHomepageFeature\(label, initializer\)[\s\S]*?try[\s\S]*?return initializer\(\);[\s\S]*?catch \(error\)/);
  for (const feature of [
    "media carousel",
    "switchboard embed",
    "mobile menu",
    "project-review analytics",
    "project-review CTA tracking",
    "contact form",
    "scroll reveals",
    "scroll progress",
  ]) {
    assert.match(
      main,
      new RegExp(`initializeHomepageFeature\\(\\s*"${feature}"`),
      `${feature} must initialize independently`,
    );
  }
});
