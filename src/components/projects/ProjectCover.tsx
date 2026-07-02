import { Brain, Sparkles, Database, Cpu, Network } from "lucide-react";
import type { Project } from "../../types/portfolio";

const ICON_BY_TAG: Record<string, typeof Brain> = {
  "Deep Learning": Brain,
  GenAI: Sparkles,
  Data: Database,
  "AI/ML": Cpu,
};

/** Cheap deterministic hash so the same project always gets the same layout. */
const hashOf = (s: string) => s.split("").reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 997, 7);

/**
 * Generated cover for projects that don't have a real screenshot — a
 * distinct, on-brand "concept card" (category icon, tech stack, faint
 * circuit motif) rather than a flat placeholder box. Deterministic per
 * project (id-seeded), so it never re-shuffles between renders.
 */
const ProjectCover = ({ project }: { project: Project }) => {
  const tag = project.tags?.[0] ?? "AI/ML";
  const Icon = ICON_BY_TAG[tag] ?? Network;
  const seed = hashOf(project.id);
  const iconX = 55 + (seed % 30); // 55–85% — keeps the icon off-center, never clipped
  const iconY = 20 + ((seed >> 3) % 25); // 20–45%
  const iconSize = 90 + (seed % 40);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[var(--panel)] p-6">
      {/* soft top-down light + faint grid, same restrained language as the rest of the site */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(0,255,148,0.06),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(237,245,250,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(237,245,250,0.6)_1px,transparent_1px)] [background-size:38px_38px]" />

      {/* large, faint category glyph — deterministically placed per project */}
      <Icon
        aria-hidden
        style={{ position: "absolute", left: `${iconX}%`, top: `${iconY}%`, width: iconSize, height: iconSize }}
        className="-translate-x-1/2 -translate-y-1/2 text-[var(--accent)] opacity-[0.09]"
        strokeWidth={1}
      />

      <div className="relative z-[1] flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-[#00FF94]/30 bg-[#00FF94]/10">
          <Icon size={16} className="text-[var(--accent)]" aria-hidden />
        </span>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-3)]">{project.category}</p>
      </div>

      <div className="relative z-[1]">
        <p className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-[var(--text)]/70 md:text-3xl">
          {project.shortTitle}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--border-strong)] bg-[var(--bg)]/40 px-2.5 py-1 text-[10px] text-[var(--text-2)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCover;
