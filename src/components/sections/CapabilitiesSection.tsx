import { memo } from "react";
import { capabilities } from "../../data/portfolio";
import type { CapabilityGroup } from "../../types/portfolio";
import { RevealText } from "../common/Reveal";
import SectionHeader from "../common/SectionHeader";

/** One capability group: its skills as chips, with "Core" skills highlighted so depth is visible at a glance. */
const CapabilityCard = ({ group, index }: { group: CapabilityGroup; index: number }) => (
  <div className="flex h-full flex-col bg-[var(--panel)] p-7 transition-colors duration-300 hover:bg-[var(--panel-2)]">
    <span className="kicker mb-1">0{index + 1}</span>
    <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text)] md:text-2xl">{group.title}</h3>
    <p className="mt-2 mb-5 text-sm text-[var(--text-3)]">{group.description}</p>
    <ul className="mt-auto flex flex-wrap gap-2">
      {group.skills.map((skill) => {
        const isCore = skill.level === "Core";
        return (
          <li
            key={skill.name}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              isCore
                ? "border-[#00FF94]/40 bg-[#00FF94]/10 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)]"
            }`}
            title={skill.level}
          >
            {skill.name}
          </li>
        );
      })}
    </ul>
  </div>
);

/**
 * Skills as one grouped list. (It used to be an 80-tag node graph with clipped labels, followed by scroll-scrubbed cards
 * repeating the same tags — and the Résumé section listed them a third time.)
 */
const CapabilitiesSection = () => (
  <section id="skills" className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
    <SectionHeader id="skills" label="Skills" />

    <h2 className="mb-16 max-w-4xl font-display text-3xl font-bold leading-[1.15] tracking-tight text-[var(--text)] md:text-5xl">
      <RevealText as="span">A toolkit spanning intelligence,</RevealText>{" "}
      <span className="text-[var(--text-3)]">
        <RevealText as="span" delay={0.08}>
          data and the business it serves.
        </RevealText>
      </span>
    </h2>

    <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-2 lg:grid-cols-3">
      {capabilities.map((group, i) => (
        <CapabilityCard key={group.id} group={group} index={i} />
      ))}
    </div>
  </section>
);

export default memo(CapabilitiesSection);
