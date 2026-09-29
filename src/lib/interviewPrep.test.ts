import { describe, it, expect } from "vitest";
import { buildStarBullets } from "./interviewPrep";
import { projects } from "../data/portfolio";

describe("buildStarBullets", () => {
  it("derives every STAR field from the project's own real data, never fabricating text", () => {
    const fincopilot = projects.find((p) => p.id === "fincopilot")!;
    const star = buildStarBullets(fincopilot);

    expect(star.situation).toBe(fincopilot.problem);
    expect(star.task).toBe(fincopilot.valueProp);
    expect(star.action).toContain(fincopilot.role);
    fincopilot.impact?.forEach((line) => expect(star.result).toContain(line));
  });

  it("falls back to metrics for Result when a project has no impact array", () => {
    const project = { ...projects[0], impact: undefined, metrics: [{ label: "Tests", value: "10 passing" }] };
    const star = buildStarBullets(project);
    expect(star.result).toContain("Tests: 10 passing");
  });
});
