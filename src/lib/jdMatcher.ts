import type { CapabilityGroup, Project } from "../types/portfolio";
import { bestProjectForRole } from "./bestProjectForRole";

export interface JDMatchResult {
  /** 0-100. A skill-coverage score, not a guarantee — a JD naturally won't overlap every
   * domain (business-strategy skills rarely matter to a pure-technical JD, for instance),
   * so a modest score is honest, not a bug. */
  score: number;
  matchedSkills: string[];
  totalSkillsChecked: number;
  bestProject: Project | null;
}

/** Deterministic keyword-overlap score against real capabilities data — no LLM call,
 * same "no fabrication" approach as bestProjectForRole.ts. Core skills count double,
 * since a JD mentioning something Krishna lists as Core is a stronger real signal
 * than one mentioning something at Academic Experience level. */
export const matchJobDescription = (
  jdText: string,
  capabilities: CapabilityGroup[],
  projectPool: Project[]
): JDMatchResult => {
  const q = jdText.toLowerCase();
  const allSkills = capabilities.flatMap((g) => g.skills);
  const weightOf = (level: string) => (level === "Core" ? 2 : 1);

  const matched = allSkills.filter((s) => q.includes(s.name.toLowerCase()));
  const totalWeight = allSkills.reduce((sum, s) => sum + weightOf(s.level), 0);
  const matchedWeight = matched.reduce((sum, s) => sum + weightOf(s.level), 0);
  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  return {
    score,
    matchedSkills: [...new Set(matched.map((s) => s.name))],
    totalSkillsChecked: allSkills.length,
    bestProject: bestProjectForRole(jdText, projectPool),
  };
};
