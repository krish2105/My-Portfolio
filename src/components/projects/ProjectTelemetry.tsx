import type { Project } from "../../types/portfolio";

/**
 * Compact "system status" readout — status, audience, stack size and which
 * links exist — styled like a telemetry strip rather than prose, so a
 * project reads like a live system at a glance.
 */
const ProjectTelemetry = ({ project }: { project: Project }) => {
  const links = [
    project.repositoryUrl && "Code",
    project.liveUrl && "Live",
    project.caseStudyUrl && "Notebook",
  ].filter(Boolean) as string[];

  const rows: { label: string; value: string }[] = [{ label: "Status", value: project.status }];
  if (project.audience) rows.push({ label: "Audience", value: project.audience });
  rows.push({ label: "Stack", value: `${project.technologies.length} technologies` });
  rows.push({ label: "Links", value: links.length ? links.join(" · ") : "Available on request" });

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] font-mono md:grid-cols-4">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-col gap-1 bg-[var(--panel)] p-4">
          <dt className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">{r.label}</dt>
          <dd className="text-[12px] leading-snug text-[var(--text)]">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export default ProjectTelemetry;
