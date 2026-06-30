import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";

/**
 * Smooth-scroll engine (Lenis). Drives the whole kinetic feel of the site.
 * Exposes the live scroll velocity so components can react to scroll speed
 * (velocity-skewed marquees, parallax, etc.). Lenis keeps the native scroll
 * position in sync, so framer-motion's useScroll keeps working untouched.
 */
interface ScrollState {
  velocity: number;
  scroll: number;
  lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollState>({ velocity: 0, scroll: 0, lenis: null });

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
  const [state, setState] = useState<ScrollState>({ velocity: 0, scroll: 0, lenis: null });

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
    setState((s) => ({ ...s, lenis }));

    lenis.on("scroll", ({ velocity, scroll }: { velocity: number; scroll: number }) => {
      setState({ velocity, scroll, lenis });
    });

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
