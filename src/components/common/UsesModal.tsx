import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { usesGroups } from "../../data/uses";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The classic developer "/uses" page — what this site is actually built
 * with. Rendered as an accessible dialog (not a real route, since the site
 * has no router) but deep-linkable at /uses via the same History API
 * pattern the project case-study modal already uses.
 */
const UsesModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-[var(--bg)]/85 p-4 backdrop-blur-md md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="uses-title"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-2xl rounded-2xl border border-[var(--border-strong)] bg-[var(--panel-2)] p-6 shadow-[0_40px_120px_-24px_rgba(0,0,0,0.9)] ring-1 ring-[#00FF94]/10 outline-none md:p-10"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] text-[var(--text-2)] transition-colors hover:border-[#00FF94]/50 hover:text-[var(--accent)]"
            >
              <X size={18} aria-hidden />
            </button>

            <p className="kicker">/uses</p>
            <h2 id="uses-title" className="mt-3 font-display text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
              What this site is <span className="text-gradient">built with</span>
            </h2>

            {usesGroups.map((group) => (
              <div key={group.id} className="mt-7">
                <p className="kicker mb-3">{group.title}</p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex flex-col gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3.5">
                      <span className="text-sm font-semibold text-[var(--text)]">{item.name}</span>
                      <span className="text-xs text-[var(--text-3)]">{item.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UsesModal;
