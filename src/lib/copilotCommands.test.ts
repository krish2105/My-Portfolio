import { describe, it, expect } from "vitest";
import { specialCommandReply } from "./copilotCommands";

describe("specialCommandReply (Copilot structured commands)", () => {
  it("returns a comparison reply with two open-case-study actions for 'X vs Y'", () => {
    const reply = specialCommandReply("FraudShield vs MediFlow");
    expect(reply).not.toBeNull();
    expect(reply?.text).toContain("FraudShield AI vs MediFlow AI");
    expect(reply?.actions).toHaveLength(2);
    expect(reply?.actions?.[0]).toMatchObject({ type: "project", target: "fraudshield" });
  });

  it("returns interview questions derived from real project data", () => {
    const reply = specialCommandReply("interview questions for AutoValuate");
    expect(reply).not.toBeNull();
    expect(reply?.text).toContain("Questions an interviewer could ask about AutoValuate");
    expect(reply?.actions?.[0]).toMatchObject({ type: "project", target: "autovaluate" });
  });

  it("returns a best-project-for-role reply with a real project action", () => {
    const reply = specialCommandReply("best project for a healthcare product role");
    expect(reply).not.toBeNull();
    expect(reply?.text).toContain("MediFlow AI");
    expect(reply?.actions?.[0]).toMatchObject({ type: "project", target: "mediflow" });
  });

  it("returns null for a plain question, deferring to the normal keyword/semantic path", () => {
    expect(specialCommandReply("What has Krishna built?")).toBeNull();
    expect(specialCommandReply("Is he available for work?")).toBeNull();
  });

  it("does not treat 'fit' inside another word (e.g. 'benefit') as the skills-radar command", () => {
    expect(specialCommandReply("what is the benefit of hiring him")).toBeNull();
    expect(specialCommandReply("is this a profitable project")).toBeNull();
  });

  it("still returns the skills radar for 'fit' as a whole word", () => {
    expect(specialCommandReply("is he a good fit for this role")?.payload?.type).toBe("radar");
  });

  it("answers 'tell me about <project>' with that project's real summary and an open-case-study action", () => {
    const reply = specialCommandReply("tell me about MediFlow");
    expect(reply).not.toBeNull();
    expect(reply?.text).toContain("MediFlow AI");
    expect(reply?.actions?.[0]).toMatchObject({ type: "project", target: "mediflow" });
  });

  it("resolves multi-word and first-word project names ('fraud shield', 'Sakan')", () => {
    expect(specialCommandReply("what is fraud shield")?.actions?.[0]).toMatchObject({ target: "fraudshield" });
    expect(specialCommandReply("explain Sakan to me")?.actions?.[0]).toMatchObject({ target: "sakan-ai" });
  });

  it("does not guess a project from generic words like 'AI'", () => {
    expect(specialCommandReply("tell me about AI")).toBeNull();
    expect(specialCommandReply("tell me about yourself")).toBeNull();
  });

  it("returns a skill-coverage score and best-project pointer for a pasted job description", () => {
    const reply = specialCommandReply(
      "job description: We need an engineer with Python, Machine Learning, LangGraph and Generative AI experience for an agentic AI role."
    );
    expect(reply).not.toBeNull();
    expect(reply?.text).toMatch(/skill-coverage score: \d+%/i);
    expect(reply?.actions?.[0]).toMatchObject({ type: "project" });
  });

  it("does not treat a short 'job description:' fragment as a real JD paste", () => {
    expect(specialCommandReply("job description: short")).toBeNull();
  });
});
