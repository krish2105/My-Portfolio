import type { AssistantAction } from "../data/assistant";
import type { ViewMode } from "./viewMode";
import { projects, capabilities } from "../data/portfolio";
import { compareProjects, parseComparisonQuery, findProjectByName } from "./compareProjects";
import { bestProjectForRole } from "./bestProjectForRole";
import { buildInterviewQuestions } from "./interviewQuestions";
import { matchJobDescription } from "./jdMatcher";

export interface Msg {
  role: "user" | "bot";
  text: string;
  actions?: AssistantAction[];
  /** True when this answer came from the semantic (RAG) search path, not the keyword matcher. */
  semantic?: boolean;
}

/** Tags that matter most to each audience — used to nudge (not override) semantic-search
 * ranking so a technical visitor's ambiguous question surfaces deep-learning/AI work first,
 * while a business visitor's surfaces data/GenAI outcome-flavoured projects first. */
export const MODE_TAG_BIAS: Record<ViewMode, string[]> = {
  recruiter: [],
  technical: ["Deep Learning", "AI/ML"],
  business: ["Data", "GenAI"],
};

/** Handles the three structured Copilot commands (compare / best-for-role / interview
 * questions) before falling through to the normal keyword/semantic matcher — each is
 * built entirely from real `portfolio.ts` data, never fabricated. */
export const specialCommandReply = (query: string): Msg | null => {
  const q = query.trim();

  if (/compare|\bvs\.?\b|\bversus\b/i.test(q)) {
    const pair = parseComparisonQuery(q, projects);
    if (pair) {
      const [a, b] = pair;
      const cmp = compareProjects(a, b);
      const body = cmp.rows
        .map((r) => `${r.label} — ${a.shortTitle}: ${r.a}\n${" ".repeat(r.label.length + 3)}${b.shortTitle}: ${r.b}`)
        .join("\n");
      return {
        role: "bot",
        text: `${a.shortTitle} vs ${b.shortTitle}\n\n${body}`,
        actions: [
          { label: `Open ${a.shortTitle}`, type: "project", target: a.id },
          { label: `Open ${b.shortTitle}`, type: "project", target: b.id },
        ],
      };
    }
  }

  const interviewMatch = q.match(/interview questions?\s*(?:for|about|on)?\s*(.+)/i);
  if (interviewMatch) {
    const project = findProjectByName(interviewMatch[1], projects);
    if (project) {
      const questions = buildInterviewQuestions(project);
      return {
        role: "bot",
        text: `Questions an interviewer could ask about ${project.shortTitle}:\n\n${questions.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
        actions: [{ label: "Open case study", type: "project", target: project.id }],
      };
    }
  }

  const roleMatch = q.match(/(?:best|good|strongest) project (?:for|to show)\s*(.+)/i);
  if (roleMatch) {
    const project = bestProjectForRole(roleMatch[1], projects);
    if (project) {
      return {
        role: "bot",
        text: `For "${roleMatch[1].trim()}", the strongest fit is ${project.shortTitle} — ${project.valueProp ?? project.description}`,
        actions: [{ label: "Open case study", type: "project", target: project.id }],
      };
    }
  }

  // Paste a full job description: "match job description: <text>" / "job description: <text>" / "jd: <text>".
  const jdMatch = q.match(/^(?:match\s+)?(?:job description|jd)\s*[:-]\s*(.{20,})/is);
  if (jdMatch) {
    const jd = jdMatch[1].trim();
    const result = matchJobDescription(jd, capabilities, projects);
    const skillsLine =
      result.matchedSkills.length > 0
        ? `Matched skills: ${result.matchedSkills.slice(0, 8).join(", ")}${result.matchedSkills.length > 8 ? "…" : ""}`
        : "No direct skill-name overlap found — the JD may use different terminology than the site's skill list.";
    return {
      role: "bot",
      text: `Skill-coverage score: ${result.score}% (${result.matchedSkills.length}/${result.totalSkillsChecked} listed skills mentioned).\n${skillsLine}${
        result.bestProject ? `\n\nStrongest project to point to: ${result.bestProject.shortTitle} — ${result.bestProject.valueProp ?? result.bestProject.description}` : ""
      }`,
      actions: result.bestProject ? [{ label: "Open case study", type: "project", target: result.bestProject.id }] : undefined,
    };
  }

  return null;
};
