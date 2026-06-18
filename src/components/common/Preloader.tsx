import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%*<>?/\\|";

/** Scrambles each character to random glyphs before resolving to the final character. */
const DecryptedText = ({
  text,
  className,
  startDelay = 0,
  charDelay = 55,
  scrambleDuration = 380,
}: {
  text: string;
  className?: string;
  startDelay?: number;
  charDelay?: number;
  scrambleDuration?: number;
}) => {
  const [chars, setChars] = useState<string[]>(() => Array(text.length).fill(" "));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    text.split("").forEach((finalChar, idx) => {
      const delay = startDelay + idx * charDelay;
      const steps = Math.max(4, Math.round(scrambleDuration / 40));

      const timer = setTimeout(() => {
        let count = 0;
        const tick = () => {
          setChars((prev) => {
            const next = [...prev];
            next[idx] = count < steps
              ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
              : finalChar;
            return next;
          });
          count++;
          if (count <= steps) {
            rafRef.current = requestAnimationFrame(tick);
          }
        };
        rafRef.current = requestAnimationFrame(tick);
      }, delay);

      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [text, startDelay, charDelay, scrambleDuration]);

  return <span className={className}>{chars.join("")}</span>;
};

/**
 * Full-screen entry sequence: a counter races 0 → 100 while the name decrypts,
 * then the panel slides away to expose the hero. Skipped for reduced motion.
 */
const Preloader = ({ onDone }: { onDone: () => void }) => {
  const [count, setCount] = useState(0);
  const [exit, setExit] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No intro animation — reveal the site immediately and unmount the panel.
      setExit(true);
      onDone();
      return;
    }

    // Small initial pause so the decrypt animation has a frame to mount
    const initTimer = setTimeout(() => setStarted(true), 50);

    let n = 0;
    const id = setInterval(() => {
      n += Math.max(2, Math.round((100 - n) / 5));
      if (n >= 100) {
        n = 100;
        clearInterval(id);
        setTimeout(() => setExit(true), 150);
        setTimeout(onDone, 800);
      }
      setCount(n);
    }, 26);

    return () => {
      clearInterval(id);
      clearTimeout(initTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-display font-black text-5xl md:text-8xl tracking-tighter"
            >
              {started && (
                <DecryptedText
                  text="KRISHNA"
                  className="name-energy"
                  startDelay={0}
                  charDelay={60}
                  scrambleDuration={420}
                />
              )}
              <span className="text-[#00FF94]">.</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="kicker mt-6"
          >
            {started && (
              <DecryptedText
                text="Initialising Intelligence"
                startDelay={200}
                charDelay={38}
                scrambleDuration={300}
              />
            )}
          </motion.div>

          <div className="absolute bottom-10 right-8 md:right-16 font-display font-black text-[18vw] md:text-[12vw] leading-none text-[#0f0f0f] select-none">
            {count}
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] bg-[#00FF94]" style={{ width: `${count}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
