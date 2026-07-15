import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "../../types/portfolio";

const DOMAINS = ["AI/ML", "Deep Learning", "GenAI", "Data"] as const;

interface Line {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * A bipartite map connecting domains (tags) to the projects that use them —
 * lets a visitor start from "what domain am I hiring for?" rather than
 * scrolling the whole project list. Plain HTML buttons + one decorative
 * `aria-hidden` SVG for connector lines (same pattern as SkillConstellation):
 * every node is a real, keyboard-reachable control, nothing is graphics-only.
 *
 * Connector coordinates are measured from the actual button positions
 * (getBoundingClientRect), not estimated from a fixed-spacing formula —
 * domain/project pills are variable-width and wrap, so their real layout
 * position can't be predicted from index alone.
 */
const ProjectSystemMap = ({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) => {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const domainRefs = useRef(new Map<string, HTMLButtonElement>());
  const projectRefs = useRef(new Map<string, HTMLButtonElement>());

  const highlighted = activeDomain ? projects.filter((p) => p.tags?.includes(activeDomain)) : projects;

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!activeDomain || !container) {
        setLines([]);
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const domainEl = domainRefs.current.get(activeDomain);
      if (!containerRect.width || !containerRect.height || !domainEl) {
        setLines([]);
        return;
      }
      const toPct = (r: DOMRect) => ({
        x: ((r.left + r.width / 2 - containerRect.left) / containerRect.width) * 100,
        y: ((r.top + r.height / 2 - containerRect.top) / containerRect.height) * 100,
      });
      const domainPos = toPct(domainEl.getBoundingClientRect());
      const next: Line[] = [];
      projects.forEach((p) => {
        if (!p.tags?.includes(activeDomain)) return;
        const el = projectRefs.current.get(p.id);
        if (!el) return;
        const pos = toPct(el.getBoundingClientRect());
        next.push({ key: p.id, x1: domainPos.x, y1: domainPos.y, x2: pos.x, y2: pos.y });
      });
      setLines(next);
    };

    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [activeDomain, projects]);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Project system map — select a domain to see which projects use it"
      className="relative w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 md:p-8"
    >
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {lines.map((l) => (
          <line
            key={l.key}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="#00FF94"
            strokeOpacity={0.35}
            strokeWidth={0.3}
          />
        ))}
      </svg>

      <p className="kicker relative mb-6">Domains</p>
      <div className="relative mb-10 flex flex-wrap justify-center gap-3">
        {DOMAINS.map((d) => {
          const isActive = d === activeDomain;
          return (
            <button
              key={d}
              type="button"
              ref={(el) => {
                if (el) domainRefs.current.set(d, el);
                else domainRefs.current.delete(d);
              }}
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
              ref={(el) => {
                if (el) projectRefs.current.set(p.id, el);
                else projectRefs.current.delete(p.id);
              }}
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
