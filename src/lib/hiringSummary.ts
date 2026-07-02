import { profile, socialLinks, capabilities, projects } from "../data/portfolio";

/**
 * A deterministic, clipboard-ready hiring summary built entirely from real
 * `portfolio.ts` data — no LLM, no fabrication. Same source of truth the
 * "Copy hiring summary" button and the Copilot's hiring-summary answer use.
 */
export const buildHiringSummary = (): string => {
  const coreSkills = Array.from(
    new Set(
      capabilities
        .flatMap((g) => g.skills)
        .filter((s) => s.level === "Core")
        .map((s) => s.name)
    )
  ).slice(0, 10);

  const flagships = projects.filter((p) => p.flagship);

  const lines = [
    `${profile.name} — ${profile.titles[0]}`,
    profile.tagline,
    `Core skills: ${coreSkills.join(", ")}.`,
    `Flagship projects: ${flagships.map((p) => p.shortTitle).join(", ")}.`,
    `${profile.availability} Based in ${profile.location} (also ${profile.secondaryLocation}).`,
    `Contact: ${socialLinks.email.replace("mailto:", "")}${socialLinks.linkedin ? ` · ${socialLinks.linkedin}` : ""}`,
  ];

  return lines.join("\n");
};
