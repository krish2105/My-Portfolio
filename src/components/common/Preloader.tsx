import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%*<>?/\\|";
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Resolves once the critical hero assets are actually ready to paint: the
 * self-hosted fonts and the hero avatar image. Capped by a safety timeout so
 * a slow/broken asset never hangs the preloader indefinitely.
 */
const waitForCriticalAssets = (): Promise<void> => {
  const fontsReady = document.fonts?.ready?.catch(() => undefined) ?? Promise.resolve();
  const avatarReady = new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = "/avatar.webp";
  });
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2600));
  return Promise.race([Promise.all([fontsReady, avatarReady]).then(() => undefined), timeout]);
};

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
 * Full-screen entry sequence: a counter climbs toward 100 while the name
 * decrypts, but only actually REACHES 100 once the critical hero assets
 * (fonts, avatar) are ready to paint — the count isn't a fake timer. The
 * panel then clip-path wipes away, on the site's signature ease, to expose
 * the hero. Skipped for reduced motion.
 */
const Preloader = ({ onDone }: { onDone: () => void }) => {
  const [count, setCount] = useState(0);
  const [exit, setExit] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No intro animation — reveal the site immediately and unmount the panel.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExit(true);
      onDone();
      return;
    }

    // Small initial pause so the decrypt animation has a frame to mount
    const initTimer = setTimeout(() => setStarted(true), 50);

    let n = 0;
    let assetsReady = false;
    const id = setInterval(() => {
      // Ramp climbs to 92% on its own (keeps the decrypt sequence feeling
      // alive even on a fast connection), then holds there until the real
      // asset-readiness signal arrives, at which point it's let through to 100.
      const ceiling = assetsReady ? 100 : 92;
      if (n < ceiling) {
        n = Math.min(ceiling, n + Math.max(1, Math.round((ceiling - n) / 5)));
        setCount(n);
      }
      if (n >= 100) {
        clearInterval(id);
        setTimeout(() => setExit(true), 150);
        setTimeout(onDone, 850);
      }
    }, 26);

    waitForCriticalAssets().then(() => {
      assetsReady = true;
    });

    return () => {
      clearInterval(id);
      clearTimeout(initTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          role="status"
          aria-label="Loading site"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
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
              <span className="text-[var(--accent)]">.</span>
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

          {/* Decorative watermark counter — intentionally low-contrast, and the
              same progress is already conveyed accessibly via the status role
              above and the visible bar below, so this is hidden from a11y trees
              rather than contrast-boosted (which would ruin the effect). */}
          <div
            aria-hidden="true"
            className="absolute bottom-10 right-8 md:right-16 font-display font-black text-[18vw] md:text-[12vw] leading-none text-[var(--text-3)] select-none"
          >
            {count}
          </div>
          <div aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] bg-[#00FF94]" style={{ width: `${count}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
