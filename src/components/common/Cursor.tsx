import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Download, Move } from "lucide-react";
import { soundFx } from "../../lib/soundFx";

/** Cursor targets opt into a semantic variant via [data-cursor]. */
const ICON_VARIANTS: Record<string, "download" | "drag"> = {
  Download: "download",
  Drag: "drag",
};

/**
 * Blended custom cursor. A small dot follows the pointer 1:1 and a larger ring
 * lags behind with spring physics. The ring grows and shows a label when
 * hovering interactive elements that opt in via [data-cursor].
 */
const Cursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");
  const [hidden, setHidden] = useState(false);
  const variant = ICON_VARIANTS[label];

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      // One-time capability check on mount — intentional initial setState.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true);
      return;
    }
    document.documentElement.classList.add("has-custom-cursor");

    let lastHovered = false;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor], input, textarea"
      );
      if (target) {
        if (!lastHovered) {
          soundFx.playHover();
          lastHovered = true;
        }
        setHovering(true);
        setLabel(target.dataset.cursor ?? "");
      } else {
        lastHovered = false;
        setHovering(false);
        setLabel("");
      }
    };
    const onDown = () => soundFx.playClick();
    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [x, y]);

  if (hidden) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className={`flex items-center justify-center rounded-full border ${
            variant ? "border-transparent bg-[#00FF94]" : "border-white/80"
          }`}
          animate={{
            width: hovering ? 64 : 34,
            height: hovering ? 64 : 34,
            x: hovering ? -32 : -17,
            y: hovering ? -32 : -17,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          {variant === "download" && <Download size={20} className="text-[#050505]" aria-hidden />}
          {variant === "drag" && <Move size={20} className="text-[#050505]" aria-hidden />}
          {!variant && label && (
            <span className="text-[9px] font-mono uppercase tracking-widest text-white">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00FF94] pointer-events-none"
        style={{ x, y }}
        animate={{ opacity: hovering ? 0 : 1 }}
      />
    </>
  );
};

export default Cursor;
