import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import routes from "./config/routes.cjs";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const buildInputs = Object.fromEntries(
  routes.map((route) => [route.id, resolve(projectRoot, route.sourcePath)]),
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: buildInputs,
    },
  },
});
