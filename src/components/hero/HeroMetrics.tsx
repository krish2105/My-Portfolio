import { projects } from "../../data/portfolio";

/**
 * Small, honest proof strip: every number here is derived directly from
 * `projects` (never hand-typed), so it can't drift out of sync with the
 * project data as entries are added/edited.
 */
const HeroMetrics = () => {
  const shipped = projects.length;
  const flagship = projects.filter((p) => p.flagship).length;
  const mediflow = projects.find((p) => p.id === "mediflow");
  const utilisation = mediflow?.metrics?.find((m) => m.label === "Resource utilisation");

  const stats: { value: string; label: string }[] = [
    { value: String(shipped), label: "shipped AI/ML systems" },
    { value: String(flagship), label: "flagship case studies" },
  ];
  if (utilisation) {
    stats.push({ value: utilisation.value, label: "resource utilisation (MediFlow)" });
  }

  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col">
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-display text-2xl font-bold tracking-tight text-[var(--text)] md:text-3xl">
            {s.value}
          </dd>
          <span className="text-xs uppercase tracking-wide text-[var(--text-2)]">{s.label}</span>
        </div>
      ))}
    </dl>
  );
};

export default HeroMetrics;
