import { projects } from "../../data/portfolio";

/**
 * Small, honest proof strip: every number here is derived directly from `projects` (never hand-typed), so it can't
 * drift out of sync with the project data. Academic projects are counted but labelled as such — they are not folded
 * into an inflated "shipped systems" figure.
 */
const HeroMetrics = () => {
  const independentLive = projects.filter((p) => p.status === "Independent Project" && p.liveUrl).length;
  const academic = projects.filter((p) => p.status !== "Independent Project").length;
  const backendTests = projects.find((p) => p.id === "fincopilot")?.metrics?.find((m) => m.label === "Backend tests");
  const testCount = backendTests ? parseInt(backendTests.value, 10) : NaN;

  const stats: { value: string; label: string }[] = [
    { value: String(independentLive), label: "independent systems, live" },
    { value: String(projects.length), label: `projects (${academic} academic)` },
  ];
  if (!Number.isNaN(testCount)) stats.push({ value: String(testCount), label: "backend tests (FinCopilot)" });

  return (
    <dl className="grid grid-cols-3 gap-x-3 sm:gap-x-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col">
          <dt className="sr-only">{s.label}</dt>
          <dd className="flex flex-col">
            <span className="font-display text-2xl font-bold tracking-tight text-[var(--text)] md:text-3xl">{s.value}</span>
            <span aria-hidden="true" className="text-[11px] uppercase leading-snug tracking-wide text-[var(--text-2)] sm:text-xs">
              {s.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default HeroMetrics;
