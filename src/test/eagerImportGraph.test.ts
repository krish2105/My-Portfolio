import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Bundle-size guard: walks the *static* import graph from the app entry and fails if a heavy,
 * on-demand library becomes reachable from it. Dynamic `import()` / `React.lazy` edges are
 * deliberately not followed, so lazily-loaded chunks stay lazy. (Measured: pdf-lib and its font /
 * compression deps were 38% of the entry bundle and cost ~1.5 s of mobile boot-up.)
 */
const SRC = path.resolve(__dirname, "..");
const ENTRY = path.join(SRC, "main.tsx");
const FORBIDDEN_EAGER = ["pdf-lib", "@pdf-lib/fontkit", "@huggingface/transformers", "three", "@react-three/fiber"];

const STATIC_IMPORT = /^\s*(?:import|export)\s+(?!type\b)(?:[^"'`;]*?\sfrom\s+)?["']([^"']+)["']/gm;

const resolveLocal = (from: string, spec: string): string | null => {
  const base = path.resolve(path.dirname(from), spec);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null; // css/assets/etc.
};

const eagerGraph = () => {
  const seen = new Set<string>();
  const externals = new Map<string, string>(); // package -> first importer
  const queue = [ENTRY];
  while (queue.length) {
    const file = queue.pop()!;
    if (seen.has(file) || !/\.(ts|tsx)$/.test(file)) continue;
    seen.add(file);
    const code = fs.readFileSync(file, "utf8");
    for (const m of code.matchAll(STATIC_IMPORT)) {
      const spec = m[1];
      if (spec.startsWith(".")) {
        const resolved = resolveLocal(file, spec);
        if (resolved) queue.push(resolved);
      } else {
        const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
        if (!externals.has(pkg)) externals.set(pkg, path.relative(SRC, file));
      }
    }
  }
  return { seen, externals };
};

describe("eager (entry) import graph", () => {
  const { seen, externals } = eagerGraph();

  it("actually walks the app (sanity check for the walker itself)", () => {
    expect(seen.size).toBeGreaterThan(20);
    expect(externals.has("react")).toBe(true);
  });

  it.each(FORBIDDEN_EAGER)("does not statically pull %s into the entry bundle", (pkg) => {
    expect(externals.has(pkg) ? `${pkg} imported eagerly by ${externals.get(pkg)}` : "ok").toBe("ok");
  });
});
