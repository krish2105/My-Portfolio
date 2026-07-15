/// <reference types="vitest/config" />
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const MIME_BY_EXT: Record<string, string> = {
  ".wasm": "application/wasm",
  ".mjs": "text/javascript",
  ".js": "text/javascript",
};

/**
 * Dev-server-only: onnxruntime-web dynamically `import()`s its emscripten
 * `.mjs` WASM glue file at runtime (see src/lib/transformersEnv.ts — we
 * self-host these under public/ort/ and public/models/ to avoid a CDN
 * dependency). Vite's dev server refuses by design to serve `/public`
 * files as ES module imports ("This file is in /public and will be copied
 * as-is during build... It can only be referenced via HTML tags"), which
 * breaks both live demos (sentiment analysis, Copilot "Smart answers") in
 * `npm run dev` — production is unaffected, since Vercel serves the built
 * dist as plain static files with no import-analysis middleware in the way.
 * This plugin intercepts requests under /ort/ and /models/ and serves them
 * as raw static passthroughs, before Vite's own module pipeline sees them.
 */
const serveOnnxAssetsInDev = (): Plugin => ({
  name: "serve-onnx-assets-in-dev",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split("?")[0] ?? "";
      if (!url.startsWith("/ort/") && !url.startsWith("/models/")) return next();
      const filePath = join(server.config.publicDir, url);
      if (!existsSync(filePath) || !statSync(filePath).isFile()) return next();
      const ext = extname(filePath);
      res.setHeader("Content-Type", MIME_BY_EXT[ext] ?? "application/octet-stream");
      createReadStream(filePath).pipe(res);
    });
  },
});

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
  build: {
    rollupOptions: {
      output: {
        // Safety net, not the primary splitting mechanism: the R3F hero and
        // transformers.js are already deferred via lazy()/dynamic import()
        // (see HeroBackdrop.tsx, transformersEnv.ts). This just guarantees
        // those two heavy vendor trees can never get silently re-inlined
        // into the main chunk if a future import accidentally pulls them in
        // eagerly elsewhere.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("three") || id.includes("@react-three")) return "r3f-vendor";
          if (id.includes("@huggingface/transformers")) return "transformers-vendor";
          return undefined;
        },
      },
    },
  },
  plugins: [
    serveOnnxAssetsInDev(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Krishna Mathur — AI Developer, Data Analyst & GenAI Builder",
        short_name: "Krishna Mathur",
        description:
          "Portfolio of Krishna Mathur — practical AI systems, analytics dashboards and GenAI workflows.",
        theme_color: "#050505",
        background_color: "#050505",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Don't precache the heavy lazy 3D / ML chunks or big media; runtime-cache instead.
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        // r3f-vendor/transformers-vendor are the manualChunks names (see
        // build.rollupOptions.output.manualChunks above) that now carry the
        // actual heavy three.js/transformers.js code — NeuralGraphR3F*.js
        // itself shrank to just component logic once the vendor code moved
        // into its own chunk, so it no longer needs excluding.
        globIgnores: ["**/r3f-vendor*.js", "**/transformers-vendor*.js", "**/ort*.js"],
        maximumFileSizeToCacheInBytes: 2_500_000,
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/projects/") || url.pathname.endsWith(".webp"),
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
