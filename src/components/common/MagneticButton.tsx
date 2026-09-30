import { useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
}

const SPRING = { stiffness: 150, damping: 15, mass: 0.1 };

/**
 * Magnetic hover pull. Uses Framer motion values (not React state) for the
 * offset so mousemove never triggers a re-render, and caches the button's
 * bounding rect (refreshed on resize/scroll via a ref, not on every
 * mousemove) instead of calling getBoundingClientRect() per pixel of
 * movement — that combination was the main source of mouse-input lag found
 * in the 2026-07-08 perf audit, since this wraps most primary CTAs.
 */
const MagneticButton = ({ children, className = "" }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const isReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  useEffect(() => {
    if (isReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    // Invalidate (don't re-measure) on resize/scroll — this wraps 7 CTAs, so measuring here meant 7 layout
    // reads per scroll event. handleMouse() re-reads the rect once, lazily, on the next hover.
    const invalidateRect = () => {
      rectRef.current = null;
    };
    const ro = new ResizeObserver(invalidateRect);
    ro.observe(el);
    window.addEventListener("scroll", invalidateRect, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", invalidateRect);
    };
  }, [isReducedMotion]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = rectRef.current ?? (rectRef.current = el.getBoundingClientRect());
    const { clientX, clientY } = e;
    const { height, width, left, top } = rect;
    x.set((clientX - (left + width / 2)) * 0.2);
    y.set((clientY - (top + height / 2)) * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (isReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
