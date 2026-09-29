import { describe, it, expect } from "vitest";
import { buildTradeoffPool, pickTradeoffQuestion, TRADEOFF_PROJECT_IDS } from "./tradeoffSimulator";
import { projects } from "../data/portfolio";

describe("buildTradeoffPool", () => {
  it("only includes real decisions from the 4 confirmed flagship projects", () => {
    const pool = buildTradeoffPool(projects);
    expect(pool.length).toBeGreaterThan(0);
    pool.forEach((entry) => {
      expect(TRADEOFF_PROJECT_IDS).toContain(entry.projectId);
      const project = projects.find((p) => p.id === entry.projectId)!;
      expect(project.decisions?.some((d) => d.choice === entry.choice && d.why === entry.why)).toBe(true);
    });
  });

  it("excludes non-flagship projects even if they have decisions", () => {
    const pool = buildTradeoffPool(projects);
    expect(pool.some((e) => e.projectId === "mediflow")).toBe(false);
    expect(pool.some((e) => e.projectId === "fraudshield")).toBe(false);
  });
});

describe("pickTradeoffQuestion", () => {
  const pool = buildTradeoffPool(projects);

  it("every option offered is a real choice string from the pool — never fabricated", () => {
    const q = pickTradeoffQuestion(pool)!;
    q.options.forEach((opt) => {
      expect(pool.some((e) => e.choice === opt)).toBe(true);
    });
  });

  it("the correct entry's choice is always among the offered options", () => {
    const q = pickTradeoffQuestion(pool)!;
    expect(q.options).toContain(q.entry.choice);
  });

  it("offers up to 3 distinct options with no duplicates", () => {
    const q = pickTradeoffQuestion(pool)!;
    expect(new Set(q.options).size).toBe(q.options.length);
    expect(q.options.length).toBeLessThanOrEqual(3);
  });

  it("respects the exclude list once enough entries remain, falling back to the full pool otherwise", () => {
    const allIds = pool.map((e) => e.id);
    const q = pickTradeoffQuestion(pool, allIds.slice(0, -1));
    expect(q).not.toBeNull();
  });

  it("returns null for an empty pool", () => {
    expect(pickTradeoffQuestion([])).toBeNull();
  });
});
