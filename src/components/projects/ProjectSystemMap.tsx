import { useState } from "react";
import type { Project } from "../../types/portfolio";

const DOMAINS = ["AI/ML", "Deep Learning", "GenAI", "Data"] as const;

/**
 * A bipartite map connecting domains (tags) to the projects that use them —
 * lets a visitor start from "what domain am I hiring for?" rather than
 * scrolling the whole project list. Plain HTML buttons + one decorative
 * `aria-hidden` SVG for connector lines (same pattern as SkillConstellation):
 * every node is a real, keyboard-reachable control, nothing is graphics-only.
 */
const ProjectSystemMap = ({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) => {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const domainX = (i: number) => 10 + (i / Math.max(DOMAINS.length - 1, 1)) * 80;
  const projectX = (i: number, total: number) => 6 + (i / Math.max(total - 1, 1)) * 88;

  const highlighted = activeDomain ? projects.filter((p) => p.tags?.includes(activeDomain)) : projects;

  return (
    <div
      role="group"
      aria-label="Project system map — select a domain to see which projects use it"
      className="relative w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 md:p-8"
    >
      <svg aria-hidden viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {activeDomain &&
          projects.map((p, i) => {
            if (!p.tags?.includes(activeDomain)) return null;
            const di = DOMAINS.indexOf(activeDomain as (typeof DOMAINS)[number]);
            return (
              <line
                key={p.id}
                x1={domainX(di)}
                y1={10}
                x2={projectX(i, projects.length)}
                y2={30}
                stroke="#00FF94"
                strokeOpacity={0.35}
                strokeWidth={0.3}
              />
            );
          })}
      </svg>

      <p className="kicker relative mb-6">Domains</p>
      <div className="relative mb-10 flex flex-wrap justify-center gap-3">
        {DOMAINS.map((d) => {
          const isActive = d === activeDomain;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setActiveDomain(isActive ? null : d)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-visible-ring ${
                isActive
                  ? "border-[#00FF94] bg-[#00FF94]/15 text-[var(--accent)]"
                  : "border-[var(--border-strong)] bg-[var(--panel-2)] text-[var(--text-2)] hover:border-[#00FF94]/40 hover:text-[var(--text)]"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      <p className="kicker relative mb-4">Projects</p>
      <div className="relative flex flex-wrap justify-center gap-2">
        {projects.map((p) => {
          const dimmed = activeDomain && !p.tags?.includes(activeDomain);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpen(p)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all focus-visible-ring ${
                dimmed
                  ? "border-[var(--border)] text-[var(--text-3)] opacity-40"
                  : "border-[var(--border-strong)] text-[var(--text-2)] hover:border-[#00FF94]/40 hover:text-[var(--accent)]"
              }`}
            >
              {p.shortTitle}
            </button>
          );
        })}
      </div>

      <p className="relative mt-6 text-center text-xs text-[var(--text-3)]">
        {activeDomain
          ? `${highlighted.length} project${highlighted.length === 1 ? "" : "s"} tagged ${activeDomain} — click one to open its case study.`
          : "Select a domain to highlight matching projects, or click a project directly."}
      </p>
    </div>
  );
};

export default ProjectSystemMap;
