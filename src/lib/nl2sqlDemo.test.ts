import { describe, it, expect } from "vitest";
import { matchNL2SQL, NL2SQL_EXAMPLES } from "./nl2sqlDemo";

describe("matchNL2SQL (rule-based toy matcher)", () => {
  it("matches every shipped example question", () => {
    for (const example of NL2SQL_EXAMPLES) {
      expect(matchNL2SQL(example)).not.toBeNull();
    }
  });

  it("returns a SELECT statement for a recognised pattern", () => {
    const rule = matchNL2SQL("How many customers do we have?");
    expect(rule?.sql).toMatch(/^SELECT/i);
  });

  it("is case-insensitive", () => {
    expect(matchNL2SQL("HOW MANY CUSTOMERS")).not.toBeNull();
  });

  it("honestly returns null for unrecognised questions instead of guessing", () => {
    expect(matchNL2SQL("what's the meaning of life")).toBeNull();
    expect(matchNL2SQL("")).toBeNull();
  });
});
