import { describe, it, expect } from "vitest";
import { generateTailoredResumePdf, ROLE_CONFIGS, type TargetRoleId } from "./pdfGenerator";

describe("pdfGenerator", () => {
  it("has complete role configs for all 3 supported targets", () => {
    const roles: TargetRoleId[] = ["ai-engineer", "mlops-engineer", "data-analytics"];
    for (const r of roles) {
      const cfg = ROLE_CONFIGS[r];
      expect(cfg).toBeDefined();
      expect(cfg.label).toBeTruthy();
      expect(cfg.summary.length).toBeGreaterThan(50);
      expect(cfg.topSkills.length).toBeGreaterThanOrEqual(5);
      expect(cfg.featuredProjects.length).toBe(3);
      expect(cfg.experienceHighlights.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("synthesizes valid PDF byte arrays for each role", async () => {
    const roles: TargetRoleId[] = ["ai-engineer", "mlops-engineer", "data-analytics"];
    for (const r of roles) {
      const bytes = await generateTailoredResumePdf(r);
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBeGreaterThan(1000); // realistic PDF size > 1KB
      // PDF header check "%PDF-"
      const header = String.fromCharCode(...bytes.slice(0, 5));
      expect(header).toBe("%PDF-");
    }
  });
});
