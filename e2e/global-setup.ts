import fs from "node:fs";
import path from "node:path";
import { preview } from "vite";

/** Serves the production build (`dist/`) for the whole run, unless E2E_BASE_URL points at a running site. */
export default async function setup() {
  if (process.env.E2E_BASE_URL) return;
  if (!fs.existsSync(path.resolve("dist/index.html"))) {
    throw new Error("e2e: dist/ not found — run `npm run build` first (or set E2E_BASE_URL to a running site).");
  }
  const server = await preview({ preview: { host: "127.0.0.1", port: 4180, strictPort: true, open: false } });
  process.env.E2E_BASE_URL = "http://127.0.0.1:4180";
  return async () => {
    await server.close();
  };
}
