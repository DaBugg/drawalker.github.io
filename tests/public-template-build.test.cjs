const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");

const repositoryRoot = path.resolve(__dirname, "..");
const copyModuleUrl = pathToFileURL(
  path.join(repositoryRoot, "scripts", "copy-public-templates.mjs"),
).href;

test("template deployment copies runtime assets but excludes internal and source-only files", async () => {
  const { isPublicTemplatePath } = await import(copyModuleUrl);

  for (const runtimePath of [
    "index.html",
    "template-gallery/styles.css",
    "template-gallery/studio-return.js",
    "drone-demo/assets/model.glb",
    "advertising Agency Demo/images/hospitality.webp",
    "SL-Web-Demo/robots.txt",
  ]) {
    assert.equal(isPublicTemplatePath(runtimePath), true, runtimePath);
  }

  for (const privatePath of [
    ".DS_Store",
    "SEO-IMPROVEMENT-PLAN.md",
    "PHASE-5A-BUSINESS-FACT-SHEET.md",
    "advertising Agency Demo/package.json",
    "advertising Agency Demo/app/page.tsx",
    "advertising Agency Demo/public/images/hospitality.webp",
    "advertising Agency Demo/node_modules/next/package.json",
    "lead-gen-demo/gatekeeper.html.bak",
  ]) {
    assert.equal(isPublicTemplatePath(privatePath), false, privatePath);
  }

  assert.equal(isPublicTemplatePath("advertising Agency Demo/app", { directory: true }), false);
  assert.equal(isPublicTemplatePath("drone-demo/assets", { directory: true }), true);
});

test("production build uses the filtered template copier", () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, "package.json"), "utf8"),
  );
  assert.match(packageJson.scripts.build, /node scripts\/copy-public-templates\.mjs/);
  assert.doesNotMatch(packageJson.scripts.build, /cp -R templates dist/);
});

test("unlisted client demos ship at stable paths with layered noindex controls", () => {
  const sitemap = fs.readFileSync(path.join(repositoryRoot, "sitemap.xml"), "utf8");
  const homepage = fs.readFileSync(path.join(repositoryRoot, "index.html"), "utf8");
  const gallery = fs.readFileSync(path.join(repositoryRoot, "templates", "index.html"), "utf8");
  const vercel = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "vercel.json"), "utf8"));
  const demos = ["addison-trace-simple", "addison-trace-balanced"];

  for (const demo of demos) {
    const demoDirectory = path.join(repositoryRoot, "templates", "hidden", demo);
    assert.ok(fs.existsSync(path.join(demoDirectory, "index.html")), `${demo} needs an entry page`);
    for (const filename of fs.readdirSync(demoDirectory).filter((file) => file.endsWith(".html"))) {
      const html = fs.readFileSync(path.join(demoDirectory, filename), "utf8");
      assert.match(
        html,
        /<meta\s+name="robots"\s+content="noindex, nofollow, noarchive">/i,
        `${demo}/${filename} must remain unlisted`,
      );
    }
    assert.doesNotMatch(sitemap, new RegExp(demo));
    assert.doesNotMatch(homepage, new RegExp(demo));
    assert.doesNotMatch(gallery, new RegExp(demo));
  }

  const hiddenHeader = vercel.headers?.find((entry) => entry.source === "/templates/hidden/:path*");
  assert.ok(hiddenHeader, "hidden client demos need a route-wide X-Robots-Tag");
  assert.ok(
    hiddenHeader.headers.some(
      (header) => header.key === "X-Robots-Tag" && header.value === "noindex, nofollow, noarchive",
    ),
  );
});
