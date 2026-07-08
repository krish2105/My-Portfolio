import { describe, it, expect } from "vitest";
import { compareProjects, findProjectByName, parseComparisonQuery } from "./compareProjects";
import { projects } from "../data/portfolio";

describe("findProjectByName", () => {
  it("matches by id, shortTitle or title, case/punctuation-insensitively", () => {
    expect(findProjectByName("fraudshield", projects)?.id).toBe("fraudshield");
    expect(findProjectByName("Fraud Shield", projects)?.id).toBe("fraudshield");
    expect(findProjectByName("mediflow ai", projects)?.id).toBe("mediflow");
  });

  it("returns null for no match", () => {
    expect(findProjectByName("not a real project", projects)).toBeNull();
  });
});

describe("parseComparisonQuery", () => {
  it("parses 'X vs Y' into two real projects", () => {
    const result = parseComparisonQuery("FraudShield vs MediFlow", projects);
    expect(result?.[0].id).toBe("fraudshield");
    expect(result?.[1].id).toBe("mediflow");
  });

  it("parses 'compare X and Y'", () => {
    const result = parseComparisonQuery("compare FraudShield and MediFlow", projects);
    expect(result?.[0].id).toBe("fraudshield");
    expect(result?.[1].id).toBe("mediflow");
  });

  it("returns null when either side doesn't resolve to a real project", () => {
    expect(parseComparisonQuery("FraudShield vs a made up thing", projects)).toBeNull();
  });
});

describe("compareProjects", () => {
  it("builds rows entirely from real project fields, no fabrication", () => {
    const a = projects.find((p) => p.id === "fraudshield")!;
    const b = projects.find((p) => p.id === "mediflow")!;
    const cmp = compareProjects(a, b);
    expect(cmp.rows.find((r) => r.label === "Category")?.a).toBe(a.category);
    expect(cmp.rows.find((r) => r.label === "Key metric")?.b).toContain(b.metrics![0].value);
  });

  it("honestly reports 'Not yet measured' when a project has no metrics", () => {
    const a = projects.find((p) => p.id === "smartloanbot")!; // no metrics in real data
    const b = projects.find((p) => p.id === "flower-classifier")!; // no metrics in real data
    const cmp = compareProjects(a, b);
    const row = cmp.rows.find((r) => r.label === "Key metric");
    expect(row?.a).toBe("Not yet measured");
    expect(row?.b).toBe("Not yet measured");
  });
});
