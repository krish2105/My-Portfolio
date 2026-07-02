import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { capabilities } from "../../data/portfolio";
import type { CapabilityGroup } from "../../types/portfolio";
import { RevealText } from "../common/Reveal";

/**
 * One capability card, continuously scroll-scrubbed (not a once-off
 * intersection reveal) — its own slice of the section's overall scroll
 * progress drives opacity/scale/y, staggered by index so cards settle in
 * sequence as the section scrolls through view.
 */
const CapabilityCard = ({
  group,
  index,
  total,
  progress,
}: {
  group: CapabilityGroup;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const start = (index / total) * 0.5;
  const end = start + 0.5;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [48, 0]);
  const scale = useTransform(progress, [start, end], [0.94, 1]);

  return (
    <motion.div style={{ opacity, y, scale }} className="h-full">
      <div className="flex h-full flex-col bg-[var(--panel)] p-7 transition-colors duration-300 hover:bg-[var(--panel-2)]">
        <span className="kicker mb-1">0{index + 1}</span>
        <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text)] md:text-2xl">
          {group.title}
        </h3>
        <p className="mt-2 mb-5 text-sm text-[var(--text-3)]">{group.description}</p>
        <ul className="mt-auto flex flex-wrap gap-2">
          {group.skills.map((skill) => {
            const isCore = skill.level === "Core";
            return (
              <li
                key={skill.name}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  isCore
                    ? "border-[#00FF94]/40 bg-[#00FF94]/10 text-[#6BFFC0]"
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
    </motion.div>
  );
};

const CapabilitiesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.4"] });

  return (
    <section id="skills" className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(04)</span>
        <RevealText className="kicker">Capabilities</RevealText>
      </div>

      <h2 className="mb-16 max-w-4xl font-display text-3xl font-bold leading-[1.15] tracking-tight text-[var(--text)] md:text-5xl">
        <RevealText as="span">A toolkit spanning intelligence,</RevealText>{" "}
        <span className="text-[var(--text-3)]">
          <RevealText as="span" delay={0.08}>
            data and the business it serves.
          </RevealText>
        </span>
      </h2>

      <div
        ref={ref}
        className="grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-2 lg:grid-cols-3"
      >
        {capabilities.map((group, i) => (
          <CapabilityCard
            key={group.id}
            group={group}
            index={i}
            total={capabilities.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};

export default CapabilitiesSection;
