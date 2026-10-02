import { defineConfig } from "vitest/config";

/**
 * Browser end-to-end suite (real Chrome via puppeteer-core against the production build).
 * Run with `npm run build && npm run e2e`. Kept in its own config so the fast jsdom unit run
 * (`npm test`) never picks these files up — they are named *.e2e.ts for that reason.
 */
export default defineConfig({
  test: {
    include: ["e2e/**/*.e2e.ts"],
    environment: "node",
    globalSetup: ["./e2e/global-setup.ts"],
    testTimeout: 120_000,
    hookTimeout: 60_000,
    // One browser at a time: the suite shares a single preview server and CPU-sensitive timing checks.
    fileParallelism: false,
    pool: "forks",
  },
});
