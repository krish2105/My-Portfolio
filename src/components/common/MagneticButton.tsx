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

    const updateRect = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    updateRect();

    const ro = new ResizeObserver(updateRect);
    ro.observe(el);
    window.addEventListener("scroll", updateRect, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updateRect);
    };
  }, [isReducedMotion]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || !rectRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = rectRef.current;
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
