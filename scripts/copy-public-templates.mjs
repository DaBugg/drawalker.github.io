import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceRoot = path.join(repositoryRoot, "templates");
const destinationRoot = path.join(repositoryRoot, "dist", "templates");

const blockedDirectories = new Set(["app", "node_modules", "public"]);
const blockedFiles = new Set([
  ".DS_Store",
  "next-env.d.ts",
  "next.config.ts",
  "package-lock.json",
  "package.json",
  "tsconfig.json",
]);
const publicExtensions = new Set([
  ".avif",
  ".css",
  ".gif",
  ".glb",
  ".html",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".json",
  ".mjs",
  ".mov",
  ".mp4",
  ".otf",
  ".png",
  ".svg",
  ".ttf",
  ".webm",
  ".webp",
  ".woff",
  ".woff2",
  ".xml",
]);

export function isPublicTemplatePath(relativePath, { directory = false } = {}) {
  const normalized = String(relativePath).replaceAll("\\", "/").replace(/^\/+/, "");
  const segments = normalized.split("/").filter(Boolean);
  if (segments.some((segment) => blockedDirectories.has(segment) || segment.startsWith("."))) return false;
  if (directory) return true;
  const filename = segments.at(-1) || "";
  if (blockedFiles.has(filename)) return false;
  if (filename === "robots.txt") return true;
  return publicExtensions.has(path.extname(filename).toLowerCase());
}

async function copyDirectory(sourceDirectory, destinationDirectory, relativeDirectory = "") {
  const entries = await readdir(sourceDirectory, { withFileTypes: true });
  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    const sourcePath = path.join(sourceDirectory, entry.name);
    const destinationPath = path.join(destinationDirectory, entry.name);
    if (entry.isDirectory()) {
      if (!isPublicTemplatePath(relativePath, { directory: true })) continue;
      await copyDirectory(sourcePath, destinationPath, relativePath);
      continue;
    }
    if (!entry.isFile() || !isPublicTemplatePath(relativePath)) continue;
    await mkdir(destinationDirectory, { recursive: true });
    await copyFile(sourcePath, destinationPath);
  }
}

export async function copyPublicTemplates() {
  await rm(destinationRoot, { recursive: true, force: true });
  await mkdir(destinationRoot, { recursive: true });
  await copyDirectory(sourceRoot, destinationRoot);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await copyPublicTemplates();
}
