import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { journey } from "./portfolio";
import { resumeExperience, resumeLeadership } from "../../scripts/resume-content";
import { buildSystemInstruction } from "../lib/geminiService";

/**
 * The same career facts live in three places (the site's `journey`, the résumé builder, and the PDF
 * generator's hard-coded line). They drifted once — the site said Feb–Jun 2025 / "50+ students" / Jaipur
 * while the résumé said Feb–Aug 2025 / 28 students / Mumbai — and a recruiter cross-checking would see it.
 * The résumé is the vetted source of truth; these tests fail if anything diverges from it again.
 */
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const monthYears = (s: string) =>
  [...s.matchAll(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{4})/gi)].map(
    (m) => `${MONTHS.indexOf(m[1].toLowerCase()) + 1}/${m[2]}`
  );

const siteIntern = journey.find((j) => j.id === "internship")!;
const siteClassRep = journey.find((j) => /class representative/i.test(j.title))!;
const resumeIntern = resumeExperience.find((e) => /intelliza/i.test(e.org))!;
const resumeClassRep = resumeLeadership.find((e) => /class representative/i.test(e.title))!;

describe("site ↔ résumé fact consistency", () => {
  it("Intelliza internship dates match", () => {
    expect(monthYears(siteIntern.date)).toEqual(monthYears(resumeIntern.date));
  });

  it("Intelliza internship location matches", () => {
    expect(siteIntern.location).toContain(resumeIntern.location.split(",")[0]);
  });

  it("Class-representative cohort size matches", () => {
    const fromResume = Number(resumeClassRep.bullets.join(" ").match(/on behalf of (\d+)/i)?.[1]);
    const fromSite = Number((siteClassRep.highlights ?? []).join(" ").match(/(\d+)\+?\s+(?:enterprise AI )?(?:postgraduate )?students/i)?.[1]);
    expect(fromResume).toBeGreaterThan(0);
    expect(fromSite).toBe(fromResume);
    expect((siteClassRep.highlights ?? []).join(" ")).not.toMatch(/\d+\+/);
  });

  it("the site does not claim internship work the résumé doesn't (credit scoring / underwriting / FastAPI)", () => {
    const claims = [siteIntern.description, ...(siteIntern.highlights ?? []), ...(siteIntern.skills ?? [])].join(" ");
    expect(claims).not.toMatch(/credit scoring|underwriting|eligibility|fastapi/i);
    expect(claims).toMatch(/flask/i); // the stack the résumé actually states
  });

  it("the PDF generator's hard-coded internship line uses the same dates", () => {
    const src = fs.readFileSync(path.resolve(__dirname, "../lib/pdfGenerator.ts"), "utf8");
    const line = src.match(/const dateStr = "([^"]+)"/)?.[1] ?? "";
    expect(monthYears(line)).toEqual(monthYears(resumeIntern.date));
  });

  it("the assistant's system prompt states the internship dates from the same data, not a stale copy", () => {
    const prompt = buildSystemInstruction("recruiter");
    const intelLine = prompt.split("\n").find((l) => /Past Industry Experience/.test(l)) ?? "";
    expect(monthYears(intelLine)).toEqual(monthYears(resumeIntern.date));
  });
});
