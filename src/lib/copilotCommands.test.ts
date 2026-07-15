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
});
