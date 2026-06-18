import { capabilities } from "../../data/portfolio";
import { RevealText, Rise } from "../common/Reveal";

const CapabilitiesSection = () => {
  return (
    <section id="skills" className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(04)</span>
        <RevealText className="kicker">Capabilities</RevealText>
      </div>

      <h2 className="mb-16 max-w-4xl font-display text-3xl font-bold leading-[1.15] tracking-tight text-[#EDF5FA] md:text-5xl">
        <RevealText as="span">A toolkit spanning intelligence,</RevealText>{" "}
        <span className="text-[#687686]">
          <RevealText as="span" delay={0.08}>
            data and the business it serves.
          </RevealText>
        </span>
      </h2>

      <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((group, i) => (
          <Rise key={group.id} delay={(i % 3) * 0.06} className="h-full">
            <div className="flex h-full flex-col bg-[#0a0a0a] p-7 transition-colors duration-300 hover:bg-[#0e0e0e]">
              <span className="kicker mb-1">0{i + 1}</span>
              <h3 className="font-display text-xl font-bold tracking-tight text-[#EDF5FA] md:text-2xl">
                {group.title}
              </h3>
              <p className="mt-2 mb-5 text-sm text-[#687686]">{group.description}</p>
              <ul className="mt-auto flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const isCore = skill.level === "Core";
                  return (
                    <li
                      key={skill.name}
                      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                        isCore
                          ? "border-[#00FF94]/40 bg-[#00FF94]/10 text-[#6BFFC0]"
                          : "border-[var(--border)] text-[#A0ADBA] hover:border-[var(--border-strong)]"
                      }`}
                      title={skill.level}
                    >
                      {skill.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Rise>
        ))}
      </div>
    </section>
  );
};

export default CapabilitiesSection;
