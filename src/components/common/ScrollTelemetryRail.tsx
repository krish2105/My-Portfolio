import { motion, useScroll } from "motion/react";
import { usePageLayout } from "../../hooks/usePageLayout";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { scrollTo, useSmoothScroll } from "../../lib/SmoothScroll";

/**
 * Desktop-only scroll rail: progress bar, current-section index and jump dots.
 *
 * Kept off the React render path — the progress bar is a transform-only motion value and the active section comes
 * from an IntersectionObserver. Section numbers and dots come from the same layout table as the navbar and the
 * "(0N)" kickers, so all three always agree for the current audience. (The frames-per-second pill that used to sit at
 * the top is gone: a debug readout is the wrong thing for a recruiter to see on a portfolio.)
 */
export const ScrollTelemetryRail = () => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  return isDesktop ? <Rail /> : null;
};

const Rail = () => {
  const { lenis } = useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const { nav, sectionIds } = usePageLayout();
  const activeId = useActiveSection(sectionIds);
  const activeIndex = nav.findIndex((n) => n.id === activeId);
  const activeLabel = activeIndex >= 0 ? String(activeIndex + 1).padStart(2, "0") : "01";

  return (
    <nav
      aria-label="Scroll progress and section index"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 select-none"
    >
      {/* Progress track */}
      <div className="relative w-1.5 h-36 rounded-full bg-[var(--border)] overflow-hidden my-1">
        <motion.div className="h-full w-full origin-top rounded-full bg-[var(--accent)]" style={{ scaleY: scrollYProgress }} />
      </div>

      {/* Current section index */}
      <div className="flex flex-col items-center gap-1 font-mono text-[10px]">
        <span className="font-bold text-[var(--accent)]">({activeLabel})</span>
        <span className="text-[9px] text-[var(--text-2)]">/ {String(nav.length).padStart(2, "0")}</span>
      </div>

      {/* Quick jump dots — each is a 24×24 hit target (WCAG 2.2 target size) drawing a small dot inside. */}
      <div className="flex flex-col items-center mt-0.5">
        {nav.map((sec, i) => {
          const label = String(i + 1).padStart(2, "0");
          const active = activeLabel === label;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollTo(`#${sec.id}`, lenis)}
              title={`Jump to ${sec.label}`}
              aria-label={`Jump to section ${label}: ${sec.label}`}
              className="group grid h-6 w-6 place-items-center rounded-full focus-visible-ring"
            >
              <span
                aria-hidden
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  active ? "w-4 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" : "w-1.5 bg-[var(--border-strong)] group-hover:bg-[var(--text-3)]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default ScrollTelemetryRail;
