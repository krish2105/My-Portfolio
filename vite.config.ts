import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
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
        // Don't precache the heavy lazy 3D chunk or big media; runtime-cache instead.
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        globIgnores: ["**/NeuralGraphR3F*.js"],
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
