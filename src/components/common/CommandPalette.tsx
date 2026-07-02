import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowDownToLine,
  Mail,
  Copy,
  Search,
  CornerDownLeft,
  Compass,
  SunMoon,
  Wrench,
  PartyPopper,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import type { ComponentType } from "react";
import { NAV_ITEMS } from "../../data/nav";
import { socialLinks } from "../../data/portfolio";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";
import { useTheme } from "../../lib/theme";
import { isValidUrl } from "../../utils/linkValidation";

interface Command {
  id: string;
  label: string;
  hint?: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
  run: () => void;
  /** Hidden from the default/substring-matched list; only surfaces on an exact query match. */
  secret?: boolean;
}

const EMAIL = "krishnamathur008@gmail.com";
const EASTER_EGG_PHRASE = "party";

const CommandPalette = ({
  open,
  onClose,
  onOpenUses,
  onEasterEgg,
}: {
  open: boolean;
  onClose: () => void;
  onOpenUses?: () => void;
  onEasterEgg?: () => void;
}) => {
  const { lenis } = useSmoothScroll();
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => () => {
      onClose();
      setTimeout(() => scrollTo(id === "home" ? 0 : `#${id}`, lenis), 60);
    };
    const nav: Command[] = NAV_ITEMS.map((n) => ({
      id: `go-${n.id}`,
      label: `Go to ${n.label}`,
      hint: "Section",
      Icon: Compass,
      run: go(n.id),
    }));
    const actions: Command[] = [];
    if (socialLinks.resume)
      actions.push({
        id: "resume",
        label: "Download résumé",
        hint: "PDF",
        Icon: ArrowDownToLine,
        run: () => {
          window.open(socialLinks.resume, "_blank", "noopener,noreferrer");
          onClose();
        },
      });
    actions.push({
      id: "copy-email",
      label: "Copy email address",
      hint: EMAIL,
      Icon: Copy,
      run: () => {
        navigator.clipboard?.writeText(EMAIL).catch(() => {});
        onClose();
      },
    });
    actions.push({
      id: "email",
      label: "Email Krishna",
      Icon: Mail,
      run: () => {
        window.location.href = socialLinks.email;
        onClose();
      },
    });
    if (isValidUrl(socialLinks.github))
      actions.push({
        id: "github",
        label: "Open GitHub",
        Icon: FaGithub,
        run: () => {
          window.open(socialLinks.github, "_blank", "noopener,noreferrer");
          onClose();
        },
      });
    if (isValidUrl(socialLinks.linkedin))
      actions.push({
        id: "linkedin",
        label: "Open LinkedIn",
        Icon: FaLinkedinIn,
        run: () => {
          window.open(socialLinks.linkedin, "_blank", "noopener,noreferrer");
          onClose();
        },
      });
    actions.push({
      id: "theme",
      label: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
      hint: "Theme",
      Icon: SunMoon,
      run: () => {
        toggle();
        onClose();
      },
    });
    if (onOpenUses)
      actions.push({
        id: "uses",
        label: "What this site is built with",
        hint: "/uses",
        Icon: Wrench,
        run: () => {
          onOpenUses();
          onClose();
        },
      });
    if (onEasterEgg)
      actions.push({
        id: EASTER_EGG_PHRASE,
        label: "🎉",
        Icon: PartyPopper,
        secret: true,
        run: () => {
          onEasterEgg();
          onClose();
        },
      });
    return [...nav, ...actions];
  }, [lenis, onClose, onOpenUses, onEasterEgg, theme, toggle]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.filter((c) => !c.secret);
    const secretMatch = commands.find((c) => c.secret && c.id === q);
    if (secretMatch) return [secretMatch];
    return commands.filter((c) => !c.secret && (c.label + " " + (c.hint ?? "")).toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      // Reset transient palette state each time it opens, then focus the input.
      /* eslint-disable react-hooks/set-state-in-effect */
      setQuery("");
      setActive(0);
      /* eslint-enable react-hooks/set-state-in-effect */
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-start justify-center bg-[var(--bg)]/70 p-4 pt-[12vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--panel-2)]/95 shadow-[0_40px_120px_-24px_rgba(0,0,0,0.9)] ring-1 ring-[#00FF94]/10"
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
              <Search size={18} className="text-[var(--text-3)]" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Jump to a section, copy email, open links…"
                aria-label="Search commands"
                className="w-full bg-transparent py-4 text-[15px] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none"
              />
              <kbd className="hidden rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-3)] sm:block">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-[var(--text-3)]">No matching commands.</p>
              )}
              {filtered.map((c, i) => {
                const isActive = i === active;
                const Icon = c.Icon;
                return (
                  <button
                    key={c.id}
                    onMouseEnter={() => setActive(i)}
                    onClick={c.run}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isActive ? "bg-[#00FF94]/12 text-[var(--text)]" : "text-[var(--text-2)] hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-[var(--accent)]" : "text-[var(--text-3)]"} aria-hidden />
                    <span className="flex-1 text-sm">{c.label}</span>
                    {c.hint && <span className="font-mono text-[11px] text-[var(--text-3)]">{c.hint}</span>}
                    {isActive && <CornerDownLeft size={13} className="text-[var(--accent)]" aria-hidden />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
