import { Rise } from "../common/Reveal";
import { projects, capabilities } from "../../data/portfolio";

/* Numbers are derived from the data files so they never go stale. */
const totalSkills = capabilities.reduce((sum, group) => sum + group.skills.length, 0);
const roundedSkills = Math.floor(totalSkills / 10) * 10;

const stats: { value: string; suffix?: string; label: string }[] = [
  { value: String(projects.length), label: "Projects built & shipped" },
  { value: String(capabilities.length), label: "AI & data domains" },
  { value: String(roundedSkills), suffix: "+", label: "Skills & tools" },
  // Since starting B.Tech CSE (AI/ML) in 2021.
  { value: "5", suffix: "+", label: "Years building in AI & CS" },
];

const StatsBand = () => (
  <section
    aria-label="Portfolio at a glance"
    className="relative border-t border-[var(--border)] px-6 py-16 md:px-[8vw] md:py-20"
  >
    <dl className="grid grid-cols-2 gap-y-10 gap-x-6 md:grid-cols-4 md:gap-x-8">
      {stats.map((stat, i) => (
        <Rise key={stat.label} delay={i * 0.08}>
          <div className="flex flex-col">
            <dt className="font-display text-5xl font-black leading-none tracking-tight text-[#EDF5FA] md:text-6xl">
              {stat.value}
              {stat.suffix && <span className="text-[#00FF94]">{stat.suffix}</span>}
            </dt>
            <dd className="mt-3 max-w-[14ch] text-sm leading-snug text-[#7e8c9a] md:text-[15px]">
              {stat.label}
            </dd>
          </div>
        </Rise>
      ))}
    </dl>
  </section>
);

export default StatsBand;
