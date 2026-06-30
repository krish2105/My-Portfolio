import { motion, useScroll, useSpring } from "motion/react";

/** A thin accent bar fixed at the very top that tracks page scroll progress. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#00b368] via-[#00FF94] to-[#6bffc0]"
    />
  );
};

export default ScrollProgress;
