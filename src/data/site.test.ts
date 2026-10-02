import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { profile } from "./portfolio";
import { SITE_DESCRIPTION, SITE_SOCIAL_DESCRIPTION, SITE_TITLE } from "./site";
import { resumeLocationLine, resumeTargetRole } from "../../scripts/resume-content";

/**
 * One positioning, one source of truth. The site used to say "AI Developer" in the title, "AI/ML Analyst" on the
 * résumé and rotate four different titles in the hero — a recruiter could not tell what to hire him as. These tests
 * fail if any surface drifts from `profile.headline` / `profile.targetRole` again.
 */
const read = (rel: string) => fs.readFileSync(path.resolve(__dirname, "../..", rel), "utf8");
const html = read("index.html");
const attr = (re: RegExp) => html.match(re)?.[1];

describe("single positioning", () => {
  it("index.html carries exactly the title and descriptions defined in site.ts", () => {
    expect(attr(/<title>([^<]*)<\/title>/)).toBe(SITE_TITLE);
    expect(attr(/<meta name="description" content="([^"]*)"/)).toBe(SITE_DESCRIPTION);
    expect(attr(/<meta property="og:title" content="([^"]*)"/)).toBe(SITE_TITLE);
    expect(attr(/<meta name="twitter:title" content="([^"]*)"/)).toBe(SITE_TITLE);
    expect(attr(/<meta property="og:description" content="([^"]*)"/)).toBe(SITE_SOCIAL_DESCRIPTION);
    expect(attr(/<meta name="twitter:description" content="([^"]*)"/)).toBe(SITE_SOCIAL_DESCRIPTION);
  });

  it("the title leads with the one role", () => {
    expect(SITE_TITLE).toContain(profile.targetRole);
  });

  it("JSON-LD jobTitle and the résumé headline are the same role as the site", () => {
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]) as { "@graph": { "@type": string; jobTitle?: string }[] };
    const person = ld["@graph"].find((n) => n["@type"] === "Person")!;
    expect(person.jobTitle).toBe(profile.targetRole);
    expect(resumeTargetRole).toBe(profile.targetRole);
  });

  it("work authorisation on the site is the résumé's own wording", () => {
    expect(resumeLocationLine.toLowerCase()).toContain(profile.workAuthorization.toLowerCase());
  });

  it("an availability date, if ever set, is a real ISO date — never free text or a guess", () => {
    if (profile.availableFrom) expect(profile.availableFrom).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
  });

  it("no user-facing source still calls him an 'AI Developer'", () => {
    const files = [
      "index.html",
      "src/App.tsx",
      "src/components/sections/ProjectsSection.tsx",
      "src/components/layout/Footer.tsx",
      "src/lib/copilotCommands.ts",
      "src/data/portfolio.ts",
      "src/data/assistant.ts",
      "scripts/generate-project-pages.ts",
      "README.md",
    ];
    for (const f of files) expect(read(f), f).not.toMatch(/AI Developer/i);
  });
});
