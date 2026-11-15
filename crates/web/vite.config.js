import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const webDirectory = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/orbit-architect/",
  server: {
    fs: {
      allow: [fileURLToPath(new URL("../..", import.meta.url))],
    },
  },
  build: {
    rollupOptions: {
      output: { assetFileNames: "assets/[hash][extname]" },
    },
  },
  resolve: {
    alias: {
      "@web": webDirectory,
    },
  },
});