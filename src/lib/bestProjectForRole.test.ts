import { describe, it, expect } from "vitest";
import { bestProjectForRole } from "./bestProjectForRole";
import { projects } from "../data/portfolio";

describe("bestProjectForRole", () => {
  it("matches a fraud/risk role to FraudShield", () => {
    expect(bestProjectForRole("fraud risk analyst", projects)?.id).toBe("fraudshield");
  });

  it("matches a healthcare role to MediFlow", () => {
    expect(bestProjectForRole("hospital operations", projects)?.id).toBe("mediflow");
  });

  it("matches an NLP/GenAI role to a real GenAI project", () => {
    const result = bestProjectForRole("conversational NLP chatbot role", projects);
    expect(["fincopilot", "sakan-ai", "compliance-agent"]).toContain(result?.id);
  });

  it("falls back to a flagship project when nothing scores", () => {
    const result = bestProjectForRole("xyzxyz totally unrelated", projects);
    expect(result?.flagship).toBe(true);
  });

  it("returns null for an empty project list", () => {
    expect(bestProjectForRole("anything", [])).toBeNull();
  });
});
