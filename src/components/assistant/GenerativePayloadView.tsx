import { useState } from "react";
import { Check, Copy, ExternalLink, Sparkles, Layers } from "lucide-react";
import type { Project } from "../../types/portfolio";

export interface RadarDomain {
  label: string;
  score: number;
  max: number;
}

export type GenerativePayload =
  | {
      type: "radar";
      title: string;
      roleTitle: string;
      domains: RadarDomain[];
      summary: string;
    }
  | {
      type: "comparison";
      projectA: Project;
      projectB: Project;
      rows: { label: string; a: string; b: string }[];
    }
  | {
      type: "executive_brief";
      title: string;
      summary: string;
      bullets: string[];
      topProjects: { id: string; name: string }[];
    };

/** SVG Radar Chart for Role-Fit evaluation */
const RadarChart = ({ domains, title, roleTitle, summary }: { domains: RadarDomain[]; title: string; roleTitle: string; summary: string }) => {
  const size = 260;
  const center = size / 2;
  const radius = size * 0.38;
  const count = domains.length;

  const points = domains.map((d, i) => {
    const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
    const r = (d.score / d.max) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, label: d.label, score: d.score, max: d.max, angle };
  });

  const polygonPoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  // Grid concentric rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="kicker text-[10px] text-[var(--accent)] uppercase">{roleTitle}</span>
          <h4 className="font-display text-xs font-bold text-[var(--text)]">{title}</h4>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-[#00FF94]/30 bg-[#00FF94]/10 px-2 py-0.5 font-mono text-[10px] text-[var(--accent)]">
          <Sparkles size={10} aria-hidden /> GenUI
        </span>
      </div>

      <div className="relative my-2 flex justify-center" aria-hidden="true">
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric grid rings */}
          {rings.map((r, idx) => (
            <polygon
              key={idx}
              points={domains
                .map((_, i) => {
                  const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
                  const x = center + radius * r * Math.cos(angle);
                  const y = center + radius * r * Math.sin(angle);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(" ")}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}

          {/* Radial axes */}
          {domains.map((_, i) => {
            const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="2,2"
              />
            );
          })}

          {/* Data Polygon */}
          <polygon
            points={polygonPoints}
            fill="var(--accent)"
            fillOpacity={0.22}
            stroke="var(--accent)"
            strokeWidth="2"
            className="transition-all duration-700"
          />

          {/* Data Vertices */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="var(--accent)"
              stroke="var(--panel)"
              strokeWidth="1.5"
            />
          ))}

          {/* Labels */}
          {points.map((p, i) => {
            const labelDist = radius + 18;
            const lx = center + labelDist * Math.cos(p.angle);
            const ly = center + labelDist * Math.sin(p.angle);
            return (
              <text
                key={i}
                x={lx}
                y={ly}
                textAnchor={Math.abs(lx - center) < 10 ? "middle" : lx > center ? "start" : "end"}
                dominantBaseline="central"
                className="fill-[var(--text-2)] font-mono text-[9px] font-medium"
              >
                {p.label} ({p.score}%)
              </text>
            );
          })}
        </svg>
      </div>

      <p className="mt-2 border-t border-[var(--border)] pt-2 text-[11px] leading-relaxed text-[var(--text-3)]">
        {summary}
      </p>

      {/* Screen reader accessible fallback */}
      <dl className="sr-only">
        {domains.map((d) => (
          <div key={d.label}>
            <dt>{d.label}</dt>
            <dd>{d.score} out of {d.max}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

/** Interactive Side-by-Side Architectural Matrix */
const ComparisonMatrix = ({
  projectA,
  projectB,
  rows,
  onOpenProject,
}: {
  projectA: Project;
  projectB: Project;
  rows: { label: string; a: string; b: string }[];
  onOpenProject: (id: string) => void;
}) => {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--accent)]">
          Architectural Matrix
        </span>
        <span className="flex items-center gap-1 rounded-full border border-[#00FF94]/30 bg-[#00FF94]/10 px-2 py-0.5 font-mono text-[10px] text-[var(--accent)]">
          <Layers size={10} aria-hidden /> Matrix
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <button
          type="button"
          onClick={() => onOpenProject(projectA.id)}
          className="group rounded-lg border border-[var(--border)] bg-[var(--panel)] p-2 text-left transition-all hover:border-[#00FF94]/40"
        >
          <span className="block font-mono text-[9px] text-[var(--text-3)]">{projectA.number}</span>
          <span className="font-display text-xs font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
            {projectA.shortTitle}
          </span>
          <span className="mt-0.5 block truncate font-mono text-[9px] text-[var(--text-3)]">
            {projectA.category.split("·")[0].trim()}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onOpenProject(projectB.id)}
          className="group rounded-lg border border-[var(--border)] bg-[var(--panel)] p-2 text-left transition-all hover:border-[#00FF94]/40"
        >
          <span className="block font-mono text-[9px] text-[var(--text-3)]">{projectB.number}</span>
          <span className="font-display text-xs font-bold text-[var(--text)] group-hover:text-[var(--accent)]">
            {projectB.shortTitle}
          </span>
          <span className="mt-0.5 block truncate font-mono text-[9px] text-[var(--text-3)]">
            {projectB.category.split("·")[0].trim()}
          </span>
        </button>
      </div>

      <div className="mt-3 divide-y divide-[var(--border)] border-t border-[var(--border)] text-xs">
        {rows.map((row) => (
          <div key={row.label} className="py-2">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--text-3)]">
              {row.label}
            </span>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <span className="text-[11px] leading-snug text-[var(--text)]">{row.a}</span>
              <span className="text-[11px] leading-snug text-[var(--text-2)]">{row.b}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Executive Brief Card */
const ExecutiveBriefCard = ({
  title,
  summary,
  bullets,
  topProjects,
  onOpenProject,
}: {
  title: string;
  summary: string;
  bullets: string[];
  topProjects: { id: string; name: string }[];
  onOpenProject: (id: string) => void;
}) => {
  const [copied, setCopied] = useState(false);

  const copyBrief = () => {
    const text = `${title}\n\n${summary}\n\nHighlights:\n${bullets.map((b) => `• ${b}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 rounded-xl border border-[var(--border-strong)] bg-[var(--panel-2)] p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-xs font-bold text-[var(--text)]">{title}</h4>
        <button
          type="button"
          onClick={copyBrief}
          className="flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--panel)] px-2 py-1 text-[10px] text-[var(--text-2)] hover:text-[var(--text)]"
        >
          {copied ? <Check size={11} className="text-[#00FF94]" /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-[var(--text-2)]">{summary}</p>

      <ul className="mt-2.5 space-y-1 text-[11px] text-[var(--text-3)]">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {topProjects.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-2.5">
          {topProjects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpenProject(p.id)}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--panel)] px-2.5 py-1 text-[10px] text-[var(--text-2)] hover:border-[#00FF94]/40 hover:text-[var(--text)]"
            >
              {p.name} <ExternalLink size={9} aria-hidden />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const GenerativePayloadView = ({
  payload,
  onOpenProject,
}: {
  payload: GenerativePayload;
  onOpenProject: (id: string) => void;
}) => {
  if (payload.type === "radar") {
    return (
      <RadarChart
        domains={payload.domains}
        title={payload.title}
        roleTitle={payload.roleTitle}
        summary={payload.summary}
      />
    );
  }

  if (payload.type === "comparison") {
    return (
      <ComparisonMatrix
        projectA={payload.projectA}
        projectB={payload.projectB}
        rows={payload.rows}
        onOpenProject={onOpenProject}
      />
    );
  }

  if (payload.type === "executive_brief") {
    return (
      <ExecutiveBriefCard
        title={payload.title}
        summary={payload.summary}
        bullets={payload.bullets}
        topProjects={payload.topProjects}
        onOpenProject={onOpenProject}
      />
    );
  }

  return null;
};
