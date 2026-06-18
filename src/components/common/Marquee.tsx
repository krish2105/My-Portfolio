import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "motion/react";

/** Wrap a value into the [min, max) range — the marquee loop helper. */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Scroll-velocity-reactive marquee (the canonical framer-motion pattern).
 * Loops continuously at `baseVelocity`; scrolling adds to that velocity and
 * flips direction, and a slight skew sells the speed.
 */
const Marquee = ({
  items,
  baseVelocity = -2,
  className = "",
  separator = "/",
}: {
  items: string[];
  baseVelocity?: number;
  className?: string;
  separator?: string;
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(smoothVelocity, [-1000, 0, 1000], [-5, 0, 5], { clamp: true });

  // The row is doubled, so wrapping at [-50, 0] gives a seamless loop.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) directionFactor.current = -1;
    else if (factor > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  const row = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div className="flex whitespace-nowrap will-change-transform" style={{ x, skewX: skew }}>
        {row.map((item, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-6">
            {item}
            <span className="text-[#00FF94]">{separator}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
