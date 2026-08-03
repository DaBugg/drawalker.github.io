import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
        switchboard: resolve(projectRoot, "switchboard.html"),
        transportationCaseStudy: resolve(
          projectRoot,
          "work/transportation-solutions-lighting.html",
        ),
        codeLinkCaseStudy: resolve(projectRoot, "work/codelink.html"),
        redeemedHandsCaseStudy: resolve(projectRoot, "work/redeemed-hands.html"),
      },
    },
  },
});
