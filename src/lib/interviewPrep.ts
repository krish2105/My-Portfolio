import type { Project } from "../types/portfolio";

export interface StarBullets {
  situation: string;
  task: string;
  action: string;
  result: string;
}

/** Maps a project's already-real fields onto the STAR interview format —
 * nothing invented, just reframed: problem→Situation, valueProp→Task,
 * approach/role→Action, impact/metrics→Result. */
export const buildStarBullets = (p: Project): StarBullets => ({
  situation: p.problem ?? p.description,
  task: p.valueProp ?? p.description,
  action: [p.role, ...(p.approach ?? [])].filter(Boolean).join(" "),
  result: (p.impact ?? []).join(" ") || (p.metrics ?? []).map((m) => `${m.label}: ${m.value}`).join(" · "),
});
