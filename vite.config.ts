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
    modulePreload: {
      // Defence in depth alongside removing manualChunks below: Vite's
      // default modulePreload injects a <link rel="modulepreload"> for
      // every chunk statically reachable from a dynamic import(), which
      // would defeat the point of the R3F hero and transformers.js/ONNX
      // chunks being conditionally loaded (useWebGLSupport gate, explicit
      // "Try it"/"Analyse sentiment" clicks) if either ever ends up in that
      // reachable set again.
      resolveDependencies: (_filename, deps) =>
        deps.filter((d) => !d.includes("NeuralGraphR3F") && !d.includes("transformers")),
    },
    rollupOptions: {
      output: {
        // Rollup's default (true) hoists transitive static imports of a
        // dynamic import() target into whichever chunk references it, to
        // save a round-trip once that dynamic import actually resolves —
        // wrong here, since the whole point is to NOT fetch these chunks
        // until the gate/click fires.
        hoistTransitiveImports: false,
        // NOTE: deliberately NOT using manualChunks to force "three"/
        // "@react-three"/"@huggingface/transformers" into named vendor
        // chunks (r3f-vendor/transformers-vendor), despite that looking
        // like the obvious way to guarantee they can never get inlined into
        // the main chunk. Measured, real bug: doing so made Rollup emit a
        // *static* `import ... from "./r3f-vendor-*.js"` at the top of the
        // main entry chunk — visible directly in dist output and confirmed
        // via a live network trace — so every visitor's browser fetched
        // ~890 KB + ~553 KB on page load regardless of device/clicks,
        // silently defeating the lazy-loading this repo otherwise goes out
        // of its way to guarantee. Removing manualChunks and letting
        // Rollup's automatic splitting handle it (it already does, since
        // both are exclusively reached via lazy()/dynamic import()) made
        // that static import disappear entirely — confirmed via the same
        // trace. See docs/QA_REPORT.md's Phase C entry (2026-07-31) for the
        // before/after numbers. If reintroducing manualChunks here, re-run
        // that network trace before trusting it again.
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
        // Matches Rollup's automatic (not manualChunks — see the removal
        // note above) output names for the R3F hero and transformers.js:
        // NeuralGraphR3F-*.js now carries the actual three.js/@react-three
        // code (its only consumer), and transformers.web-*.js /
        // transformers-*.js cover @huggingface/transformers' own auto-split
        // chunk naming. Re-check these patterns against a real `npm run
        // build` output if this ever silently stops excluding them (the
        // precache entry count/size in the build log is the tell — see
        // docs/QA_REPORT.md's Phase C entry for the real numbers).
        globIgnores: ["**/NeuralGraphR3F*.js", "**/transformers*.js", "**/ort*.js"],
        maximumFileSizeToCacheInBytes: 2_500_000,
        // Real static files (PDFs), not SPA routes — the navigateFallback
        // otherwise substitutes the cached app-shell HTML for any
        // navigation-mode request (including an <iframe> embed), which
        // carries the homepage's frame-ancestors 'none' CSP and blocks
        // the résumé preview iframe with ERR_BLOCKED_BY_RESPONSE.
        navigateFallbackDenylist: [/^\/api\//, /^\/resume\//, /^\/ai-systems-sheet\.pdf$/],
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
