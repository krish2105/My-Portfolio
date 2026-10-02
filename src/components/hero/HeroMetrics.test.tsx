import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import HeroMetrics from "./HeroMetrics";
import { projects } from "../../data/portfolio";

describe("HeroMetrics", () => {
  const text = () => render(<HeroMetrics />).container.textContent ?? "";

  it("leads with the independent, live systems — derived from the data, not hand-typed", () => {
    const independentLive = projects.filter((p) => p.status === "Independent Project" && p.liveUrl).length;
    expect(independentLive).toBeGreaterThan(0);
    expect(text()).toContain(`${independentLive}independent systems, live`.replace(/ /g, " "));
  });

  it("is honest about the academic projects instead of folding them into a 'shipped' count", () => {
    const academic = projects.filter((p) => p.status !== "Independent Project").length;
    expect(text()).toContain(`${projects.length}projects (${academic} academic)`);
    expect(text()).not.toMatch(/shipped AI\/ML systems|flagship case studies/i);
  });

  it("shows a real engineering-evidence number taken from FinCopilot's own metrics", () => {
    const tests = projects.find((p) => p.id === "fincopilot")?.metrics?.find((m) => m.label === "Backend tests");
    expect(tests).toBeDefined();
    expect(text()).toContain(`${parseInt(tests!.value, 10)}backend tests (FinCopilot)`);
  });
});
