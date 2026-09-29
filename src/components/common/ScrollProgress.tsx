import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";

const SIZE = 44;
const STROKE = 2.5;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A fixed corner dial that tracks scroll progress as a ring (replacing the
 * old top-of-page bar) and doubles as a "back to top" affordance once the
 * visitor has scrolled past the hero.
 */
const ScrollProgress = () => {
  const { lenis } = useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const dashoffset = useTransform(progress, (p) => CIRCUMFERENCE * (1 - p));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (p) => setVisible(p > 0.06));
  }, [scrollYProgress]);

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() => scrollTo(0, lenis)}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      style={{
        pointerEvents: visible ? "auto" : "none",
        // Custom properties only (not the final bottom/left) so the
        // responsive md:bottom-*/left-* utilities below still win at that
        // breakpoint — an inline `style.bottom` would always beat them
        // regardless of media query, since inline style outranks any class.
        ["--sib" as string]: "env(safe-area-inset-bottom)",
        ["--sil" as string]: "env(safe-area-inset-left)",
      }}
      // Fixed corner FAB — offset from the physical bottom/left edge by the
      // iOS home-indicator/rounded-corner safe area, not just a flat 1.25rem/
      // 1.75rem, so it's never rendered under it.
      className="fixed bottom-[max(1.25rem,var(--sib))] left-[max(1.25rem,var(--sil))] z-[60] grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] bg-[var(--panel)]/90 text-[var(--accent)] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] backdrop-blur transition-colors hover:border-[#00FF94] md:bottom-[max(1.75rem,var(--sib))] md:left-[max(1.75rem,var(--sil))]"
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 -rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          style={{ strokeDashoffset: dashoffset }}
        />
      </svg>
      <span aria-hidden className="text-sm leading-none">
        ↑
      </span>
    </motion.button>
  );
};

export default ScrollProgress;
