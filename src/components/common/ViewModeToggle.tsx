import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, Code2, TrendingUp, ChevronDown } from "lucide-react";
import { useViewMode, VIEW_MODES, type ViewMode } from "../../lib/viewMode";

const ICONS: Record<ViewMode, typeof Briefcase> = {
  recruiter: Briefcase,
  technical: Code2,
  business: TrendingUp,
};

/**
 * Audience routing control — lets a visitor tell the site who they are
 * (Recruiter / Technical / Business) so sections can lead with the right
 * depth. A compact button + popover (not an inline 3-way switch) to stay
 * legible in the navbar; fully keyboard-operable as a listbox, and the
 * active choice is announced via a visually-hidden live region.
 */
const ViewModeToggle = ({ className = "" }: { className?: string }) => {
  const { mode, setMode } = useViewMode();
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const Icon = ICONS[mode];
  const activeLabel = VIEW_MODES.find((m) => m.id === mode)?.label ?? "Recruiter";

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: ViewMode) => {
    setMode(next);
    setOpen(false);
    const label = VIEW_MODES.find((m) => m.id === next)?.label ?? next;
    setAnnouncement(`Viewing as ${label}`);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        data-cursor="View"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Viewing as ${activeLabel}. Change audience view`}
        className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] px-3 text-xs font-medium text-[var(--text)] transition-colors hover:border-[#00FF94]/50 hover:text-[var(--accent)]"
      >
        <Icon size={14} aria-hidden />
        <span className="hidden sm:inline">{activeLabel}</span>
        <ChevronDown size={12} aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Choose your audience view"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--panel-2)] p-1.5 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)]"
          >
            {VIEW_MODES.map((m) => {
              const ItemIcon = ICONS[m.id];
              const isActive = m.id === mode;
              return (
                <button
                  key={m.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => choose(m.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-[#00FF94]/12 text-[var(--accent)]"
                      : "text-[var(--text-2)] hover:bg-white/[0.04] hover:text-[var(--text)]"
                  }`}
                >
                  <ItemIcon size={14} aria-hidden />
                  {m.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
};

export default ViewModeToggle;
