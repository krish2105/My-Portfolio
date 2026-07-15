import { describe, it, expect } from "vitest";
import { buildInterviewQuestions } from "./interviewQuestions";
import { projects } from "../data/portfolio";

describe("buildInterviewQuestions", () => {
  it("derives questions from a project's real decisions", () => {
    const fraudshield = projects.find((p) => p.id === "fraudshield")!;
    const questions = buildInterviewQuestions(fraudshield);
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toContain(fraudshield.decisions![0].choice);
  });

  it("falls back to the approach when a project has no decisions", () => {
    const waselx = projects.find((p) => p.id === "waselx")!;
    expect(waselx.decisions).toBeUndefined();
    const questions = buildInterviewQuestions(waselx);
    expect(questions.length).toBeGreaterThan(0);
  });

  it("never returns more than 4 questions", () => {
    const fraudshield = projects.find((p) => p.id === "fraudshield")!;
    expect(buildInterviewQuestions(fraudshield).length).toBeLessThanOrEqual(4);
  });
});
