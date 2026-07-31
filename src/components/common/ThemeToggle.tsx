import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../lib/theme";

/** Accessible dark/light switch with an animated icon swap. The visible icon
 * stays 36px, but `before:-inset-1` expands the actual hit area to a full
 * 44px for touch — the 36px box alone fails the mobile touch-target minimum
 * audited in Phase C. */
const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      onClick={toggle}
      data-cursor="Theme"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`relative grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors before:absolute before:-inset-1 before:content-[''] hover:border-[#00FF94]/50 hover:text-[var(--accent)] ${className}`}
    >
      {/* overflow-hidden lives on this inner span, not the button — the
          button needs overflow visible so its ::before hit-area expansion
          above isn't clipped away. */}
      <span className="grid h-full w-full place-items-center overflow-hidden rounded-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ y: 14, opacity: 0, rotate: -30 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -14, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid place-items-center"
          >
            {theme === "dark" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
};

export default ThemeToggle;
