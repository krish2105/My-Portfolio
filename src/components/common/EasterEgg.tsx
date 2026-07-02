import { motion, AnimatePresence } from "motion/react";

const DOT_COUNT = 24;

/** Pure pseudo-scatter (no Math.random — deterministic per index, still reads as varied). */
const DOTS = Array.from({ length: DOT_COUNT }, (_, i) => ({
  id: i,
  x: (i * 37) % 100,
  delay: ((i * 13) % 30) / 100,
  size: 6 + ((i * 7) % 10),
}));

/**
 * A brief, silly burst of accent-colored dots — triggered only by typing the
 * secret phrase into the command palette. Purely decorative, auto-dismisses,
 * and respects reduced-motion (renders nothing at all in that case, since
 * there's no non-animated version of "confetti" worth keeping).
 */
const EasterEgg = ({ active }: { active: boolean }) => {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return null;

  return (
    <AnimatePresence>
      {active && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[140] overflow-hidden">
          {DOTS.map((d) => (
            <motion.span
              key={d.id}
              initial={{ y: "-10vh", x: `${d.x}vw`, opacity: 1 }}
              animate={{ y: "110vh", opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, delay: d.delay, ease: "easeIn" }}
              className="absolute rounded-full bg-[#00FF94]"
              style={{ width: d.size, height: d.size, boxShadow: "0 0 12px rgba(0,255,148,0.7)" }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default EasterEgg;
