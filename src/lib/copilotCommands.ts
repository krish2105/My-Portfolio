import type { AssistantAction } from "../data/assistant";
import type { ViewMode } from "./viewMode";
import { profile, projects, capabilities } from "../data/portfolio";
import { compareProjects, parseComparisonQuery, findProjectByName, findMentionedProject } from "./compareProjects";
import { bestProjectForRole } from "./bestProjectForRole";
import { buildInterviewQuestions } from "./interviewQuestions";
import { matchJobDescription } from "./jdMatcher";
import type { GenerativePayload } from "../components/assistant/GenerativePayloadView";

export interface Msg {
  role: "user" | "bot";
  text: string;
  actions?: AssistantAction[];
  /** True when this answer came from the semantic (RAG) search path, not the keyword matcher. */
  semantic?: boolean;
  /** True when this answer was generated directly via Gemini Generative AI. */
  gemini?: boolean;
  /** Optional interactive Generative UI payload (radar chart, comparison matrix, brief). */
  payload?: GenerativePayload;
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
        payload: {
          type: "comparison",
          projectA: a,
          projectB: b,
          rows: cmp.rows,
        },
      };
    }
  }

  if (/\b(?:why hire|skills?|domains?|fit|radar|competenc\w*)\b/i.test(q)) {
    return {
      role: "bot",
      text: "Krishna's core technical competencies span 5 key AI domains: Agentic RAG, Systems & Python, MLOps, Data & SQL, and Autonomous LangGraph Pipelines.",
      actions: [
        { label: "View Flagship Projects", type: "scroll", target: "projects" },
        { label: "Download Resume", type: "scroll", target: "resume" },
      ],
      payload: {
        type: "radar",
        title: "Technical Domain Competencies",
        roleTitle: "AI & GenAI Systems Engineer",
        domains: [
          { label: "Agentic RAG", score: 95, max: 100 },
          { label: "Systems & Python", score: 92, max: 100 },
          { label: "MLOps & Docker", score: 88, max: 100 },
          { label: "Data & SQL", score: 90, max: 100 },
          { label: "LangGraph / Agents", score: 94, max: 100 },
        ],
        summary: "Specialized in turning complex, messy data and documents into cited, deterministic decision systems and production agent pipelines.",
      },
    };
  }

  if (/(?:brief|executive summary|quick summary|summary of krishna)/i.test(q)) {
    return {
      role: "bot",
      text: `Executive brief for ${profile.name} — ${profile.headline}.`,
      actions: [
        { label: "View Resume", type: "scroll", target: "resume" },
        { label: "Contact Krishna", type: "scroll", target: "contact" },
      ],
      payload: {
        type: "executive_brief",
        title: "Krishna Mathur — Executive Overview",
        summary: "Master of AI in Business candidate at SP Jain (Dubai) with a B.Tech in CSE (AI & ML). Designs production-grade decision tools, agentic RAG copilots, and explainable ML architectures.",
        bullets: [
          "Built 4 independent production flagships (FinCopilot, Sakan AI, ComplianceAgent, AutoValuate).",
          "Engineered multi-agent LangGraph pipelines with live WebSocket reasoning traces.",
          "Implemented from-scratch GNNs and Self-RAG faithfulness validation gates.",
          "AI Intern at Learners University College (LUC) in Dubai & Class Representative at SP Jain.",
        ],
        topProjects: [
          { id: "fincopilot", name: "FinCopilot" },
          { id: "sakan-ai", name: "Sakan AI" },
          { id: "compliance-agent", name: "ComplianceAgent" },
        ],
      },
    };
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

  // A question that names exactly one project ("tell me about MediFlow") gets that project's
  // real summary instead of falling through to the generic About answer.
  const mentioned = findMentionedProject(q, projects);
  if (mentioned) {
    const metric = mentioned.metrics?.[0];
    return {
      role: "bot",
      text: `${mentioned.shortTitle} — ${mentioned.valueProp ?? mentioned.description}${
        metric ? `\n\nKey metric — ${metric.label}: ${metric.value}` : ""
      }\n\nStack: ${mentioned.technologies.slice(0, 6).join(", ")}`,
      actions: [{ label: "Open case study", type: "project", target: mentioned.id }],
    };
  }

  return null;
};
