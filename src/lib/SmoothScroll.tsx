/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect --
   This module is the smooth-scroll provider: it intentionally co-exports the
   <SmoothScroll> component alongside the useSmoothScroll() hook and scrollTo()
   helper, and seeds the Lenis instance into state once on mount. */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";

/**
 * Smooth-scroll engine (Lenis). Drives the whole kinetic feel of the site.
 * Lenis keeps the native scroll position in sync, so framer-motion's
 * useScroll/useVelocity keep working untouched for any component that needs
 * reactive scroll/velocity values — this context only exposes the stable
 * `lenis` instance (for imperative `.scrollTo()` calls), set once on mount.
 * It intentionally does NOT re-publish scroll/velocity on every tick: every
 * consumer only ever destructures `{ lenis }`, so doing so previously forced
 * 8 component trees to re-render on every single scroll frame for no
 * benefit — the #1 cause of scroll jank found in the 2026-07-08 perf audit.
 */
interface ScrollState {
  lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollState>({ lenis: null });

export const useSmoothScroll = () => useContext(ScrollContext);

/** Imperative scroll-to helper that respects the Lenis instance. */
export const scrollTo = (target: string | number, lenis: Lenis | null) => {
  // Negative offset leaves room for the fixed navbar so section headings
  // aren't tucked underneath it after a nav click.
  const NAV_OFFSET = -90;
  if (lenis) {
    lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.4 });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
};

const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [state, setState] = useState<ScrollState>({ lenis: null });

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;
    // Set once on mount only — do NOT re-set on every "scroll" tick. Any
    // component that needs reactive velocity/scroll should use Framer
    // Motion's own useScroll()/useVelocity() (already the pattern used in
    // HeroSection/Marquee), not this context.
    setState({ lenis });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <ScrollContext.Provider value={state}>{children}</ScrollContext.Provider>;
};

export default SmoothScroll;
