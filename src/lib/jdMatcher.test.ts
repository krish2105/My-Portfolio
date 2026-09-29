import { describe, it, expect } from "vitest";
import { matchJobDescription } from "./jdMatcher";
import { capabilities, projects } from "../data/portfolio";

describe("matchJobDescription", () => {
  it("scores higher for a JD packed with real Core skills than one with none", () => {
    const strongJD =
      "Looking for an engineer with Python, Machine Learning, Artificial Intelligence, Generative AI, SQL and Prompt Engineering experience.";
    const weakJD = "Looking for someone who enjoys gardening and long walks on the beach.";

    const strong = matchJobDescription(strongJD, capabilities, projects);
    const weak = matchJobDescription(weakJD, capabilities, projects);

    expect(strong.score).toBeGreaterThan(weak.score);
    expect(strong.matchedSkills.length).toBeGreaterThan(0);
    expect(weak.matchedSkills.length).toBe(0);
  });

  it("only reports skills that are real, exact substrings of the JD text", () => {
    const jd = "We need strong Python and LangGraph experience for an agentic AI role.";
    const result = matchJobDescription(jd, capabilities, projects);
    result.matchedSkills.forEach((skill) => {
      expect(jd.toLowerCase()).toContain(skill.toLowerCase());
    });
  });

  it("returns a bestProject pointer derived from the same real project data", () => {
    const jd = "Agentic RAG and LangGraph pipeline experience required.";
    const result = matchJobDescription(jd, capabilities, projects);
    expect(result.bestProject).not.toBeNull();
    expect(projects.some((p) => p.id === result.bestProject?.id)).toBe(true);
  });

  it("never exceeds 100 or goes below 0", () => {
    const result = matchJobDescription("", capabilities, projects);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
