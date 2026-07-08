import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { journey } from "../../data/portfolio";
import type { JourneyItem } from "../../types/portfolio";
import { RevealText } from "../common/Reveal";

/**
 * One timeline entry, continuously scroll-scrubbed against the timeline's
 * own progress (not a once-off intersection reveal) — settles into place as
 * the fill line reaches it, so the copy and the line always feel connected.
 */
const JourneyEntry = ({
  item,
  index,
  total,
  progress,
}: {
  item: JourneyItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const start = (index / total) * 0.7;
  const end = start + 0.3;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const x = useTransform(progress, [start, end], [-24, 0]);

  return (
    <motion.div style={{ opacity, x }} className="relative">
      <span className="absolute -left-8 top-2 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-[#00FF94] shadow-[0_0_16px_rgba(0,255,148,0.7)] md:-left-12" />
      <span className="kicker">{item.date}</span>
      <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[var(--text)] md:text-4xl">
        {item.title}
      </h3>
      <p className="mt-1 text-sm font-medium text-[var(--accent)] md:text-base">{item.institution}</p>
      {item.description && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-2)] md:text-base">
          {item.description}
        </p>
      )}
      <span className="pointer-events-none absolute -top-6 right-0 font-display text-6xl font-black text-[var(--ghost-dim)] md:text-8xl">
        0{index + 1}
      </span>
    </motion.div>
  );
};

const JourneySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  // A transform (scaleY), not height — height is a layout property that
  // forces reflow on every scroll frame; scaleY is compositor-only
  // (2026-07-08 perf audit).
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="journey" className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(03)</span>
        <RevealText className="kicker">Journey</RevealText>
      </div>

      <div ref={ref} className="relative pl-8 md:pl-16">
        {/* track + animated fill */}
        <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[var(--border)] md:left-4">
          <motion.div
            style={{ scaleY: lineProgress, transformOrigin: "top" }}
            className="h-full w-full bg-[#00FF94]"
          />
        </div>

        <div className="space-y-16 md:space-y-24">
          {journey.map((item, i) => (
            <JourneyEntry key={item.id} item={item} index={i} total={journey.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
