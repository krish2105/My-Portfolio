import { describe, it, expect } from "vitest";
import { buildHiringSummary } from "./hiringSummary";
import { profile, socialLinks, projects } from "../data/portfolio";

describe("buildHiringSummary", () => {
  it("includes the real name, tagline and availability — nothing fabricated", () => {
    const summary = buildHiringSummary();
    expect(summary).toContain(profile.name);
    expect(summary).toContain(profile.tagline);
    expect(summary).toContain(profile.availability);
  });

  it("includes only real flagship projects that exist in portfolio.ts", () => {
    const summary = buildHiringSummary();
    const knownFlagships = ["fraudshield", "mediflow", "lulu-sales", "talktodata"]
      .map((id) => projects.find((p) => p.id === id))
      .filter(Boolean);

    knownFlagships.forEach((p) => {
      expect(summary).toContain(p!.shortTitle);
    });
  });

  it("includes real contact info from socialLinks", () => {
    const summary = buildHiringSummary();
    expect(summary).toContain(socialLinks.email.replace("mailto:", ""));
  });

  it("is a plain multi-line string with no undefined/null leaking in", () => {
    const summary = buildHiringSummary();
    expect(summary).not.toMatch(/undefined|null/i);
    expect(summary.split("\n").length).toBeGreaterThanOrEqual(5);
  });
});
