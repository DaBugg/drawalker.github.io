const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repositoryRoot = path.resolve(__dirname, "..");
const templatesRoot = path.join(repositoryRoot, "templates");
const galleryRoot = path.join(templatesRoot, "template-gallery");

function collectTemplateEntries(directory, entries = []) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (item.name === "node_modules" || item.name === "template-gallery") continue;

    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) {
      collectTemplateEntries(itemPath, entries);
    } else if (item.name === "index.html") {
      entries.push(path.relative(templatesRoot, itemPath));
    }
  }

  return entries;
}

test("the template gallery links every template website exactly once", () => {
  const galleryHtml = fs.readFileSync(path.join(galleryRoot, "index.html"), "utf8");
  const cardTargets = [...galleryHtml.matchAll(
    /<article class="concept[^>]*>[\s\S]*?<a href="([^"]+)"/g,
  )].map((match) => path.relative(
    templatesRoot,
    path.resolve(galleryRoot, decodeURIComponent(match[1])),
  ));

  assert.equal(new Set(cardTargets).size, cardTargets.length, "gallery links must be unique");
  assert.deepEqual(cardTargets.sort(), collectTemplateEntries(templatesRoot).sort());
});
