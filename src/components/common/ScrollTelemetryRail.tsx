import { useEffect, useRef } from "react";
import { motion, useScroll } from "motion/react";
import { Activity } from "lucide-react";
import { NAV_ITEMS, SECTION_IDS } from "../../data/nav";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { scrollTo, useSmoothScroll } from "../../lib/SmoothScroll";

/**
 * Desktop-only scroll rail: progress bar, live FPS readout, current-section index and jump dots.
 *
 * Kept deliberately off the React render path — the progress bar is a transform-only motion value,
 * the FPS readout writes straight to the DOM once a second, and the active section comes from an
 * IntersectionObserver. (The previous version ran layout reads + setState on every scroll event
 * on every device, and animated `height`, which profiled as the single biggest JS cost in a scroll.)
 * Section numbers follow NAV_ITEMS so they match the "(0N)" kickers on the page itself.
 */
export const ScrollTelemetryRail = () => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  return isDesktop ? <Rail /> : null;
};

const Rail = () => {
  const { lenis } = useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const activeId = useActiveSection(SECTION_IDS);
  const activeIndex = NAV_ITEMS.findIndex((n) => n.id === activeId);
  const activeLabel = activeIndex >= 0 ? String(activeIndex + 1).padStart(2, "0") : "01";
  const fpsRef = useRef<HTMLSpanElement>(null);

  // Real-time FPS monitor — counts rAF ticks and updates the text node directly (no re-render).
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const measure = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        if (fpsRef.current) fpsRef.current.textContent = String(Math.min(120, Math.round((frames * 1000) / (now - last))));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(measure);
    };
    raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <nav
      aria-label="Scroll progress and section index"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 select-none"
    >
      {/* Telemetry pill — opaque panel instead of backdrop-blur: a blur over scrolling content re-rasterises every frame. */}
      <div className="rounded-full border border-[var(--border)] bg-[var(--panel)] px-2 py-1 font-mono text-[10px] text-[var(--text-3)] flex items-center gap-1 shadow-lg">
        <Activity size={10} className="text-[var(--accent)]" />
        <span ref={fpsRef} className="font-semibold text-[var(--accent)]">
          60
        </span>
        <span>FPS</span>
      </div>

      {/* Progress track */}
      <div className="relative w-1.5 h-36 rounded-full bg-[var(--border)] overflow-hidden my-1">
        <motion.div
          className="h-full w-full origin-top rounded-full bg-[var(--accent)]"
          style={{ scaleY: scrollYProgress }}
        />
      </div>

      {/* Current section index */}
      <div className="flex flex-col items-center gap-1 font-mono text-[10px]">
        <span className="font-bold text-[var(--accent)]">({activeLabel})</span>
        <span className="text-[9px] text-[var(--text-2)]">/ {String(NAV_ITEMS.length).padStart(2, "0")}</span>
      </div>

      {/* Quick jump dots — each is a 24×24 hit target (WCAG 2.2 target size) drawing a small dot inside. */}
      <div className="flex flex-col items-center mt-0.5">
        {NAV_ITEMS.map((sec, i) => {
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
                  active
                    ? "w-4 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                    : "w-1.5 bg-[var(--border-strong)] group-hover:bg-[var(--text-3)]"
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
