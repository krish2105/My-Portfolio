import type { Project } from "../types/portfolio";

export interface ComparisonRow {
  label: string;
  a: string;
  b: string;
}

export interface ProjectComparison {
  a: Project;
  b: Project;
  rows: ComparisonRow[];
}

const metricSummary = (p: Project) =>
  p.metrics && p.metrics.length > 0 ? `${p.metrics[0].label}: ${p.metrics[0].value}` : "Not yet measured";

/** A real, data-only side-by-side — every field comes straight from portfolio.ts. */
export const compareProjects = (a: Project, b: Project): ProjectComparison => ({
  a,
  b,
  rows: [
    { label: "Category", a: a.category, b: b.category },
    { label: "Status", a: a.status, b: b.status },
    { label: "Problem", a: a.problem ?? "—", b: b.problem ?? "—" },
    { label: "Stack", a: a.technologies.slice(0, 5).join(", "), b: b.technologies.slice(0, 5).join(", ") },
    { label: "Key metric", a: metricSummary(a), b: metricSummary(b) },
    { label: "Flagship", a: a.flagship ? "Yes" : "No", b: b.flagship ? "Yes" : "No" },
  ],
});

/** Loose fuzzy match against id/title/shortTitle — lets a visitor type "fraudshield" or "Fraud Shield". */
export const findProjectByName = (query: string, projects: Project[]): Project | null => {
  const q = query.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!q) return null;
  return (
    projects.find((p) => p.id.replace(/[^a-z0-9]/g, "") === q) ??
    projects.find((p) => p.shortTitle.toLowerCase().replace(/[^a-z0-9]/g, "").includes(q)) ??
    projects.find((p) => p.title.toLowerCase().replace(/[^a-z0-9]/g, "").includes(q)) ??
    null
  );
};

/** Finds the single project a free-text question names — by its distinctive first word ("Sakan", "MediFlow")
 * or its full name with spaces dropped ("fraud shield"). Generic/short words ("AI") never match, and a
 * question naming more than one project returns null rather than guessing. */
export const findMentionedProject = (query: string, projects: Project[]): Project | null => {
  const words = new Set(query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  const squeezed = query.toLowerCase().replace(/[^a-z0-9]/g, "");
  const hits = projects.filter((p) => {
    const first = p.shortTitle.toLowerCase().split(/[^a-z0-9]+/)[0];
    if (first.length >= 4 && words.has(first)) return true;
    return [p.id, p.shortTitle].some((n) => {
      const name = n.toLowerCase().replace(/[^a-z0-9]/g, "");
      return name.length >= 6 && squeezed.includes(name);
    });
  });
  return hits.length === 1 ? hits[0] : null;
};

/** Parses "compare X vs Y" / "/compare X vs Y" / "X vs Y" style questions into two resolved projects, or null if either side doesn't match. */
export const parseComparisonQuery = (query: string, projects: Project[]): [Project, Project] | null => {
  const m = query.replace(/^\s*\/?compare\s+/i, "").match(/(.+?)\s+(?:vs\.?|versus|and|with)\s+(.+)/i);
  if (!m) return null;
  const a = findProjectByName(m[1], projects);
  const b = findProjectByName(m[2], projects);
  return a && b && a.id !== b.id ? [a, b] : null;
};
