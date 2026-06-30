import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, NotebookPen } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project } from "../../types/portfolio";
import SafeExternalLink from "../common/SafeExternalLink";

const EASE = [0.16, 1, 0.3, 1] as const;

const SectionBlock = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mt-7">
    <p className="kicker mb-3">{label}</p>
    {children}
  </div>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2.5">
    {items.map((item, i) => (
      <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--text-2)] md:text-[15px]">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00FF94]" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

/**
 * Accessible case-study dialog. Traps focus, closes on Escape / backdrop click,
 * locks body scroll, and restores focus to the trigger on close.
 */
const ProjectModal = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    prevFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus.current?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
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
            aria-labelledby="case-study-title"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-3xl rounded-2xl border border-[var(--border-strong)] bg-[var(--panel-2)] p-6 shadow-[0_40px_120px_-24px_rgba(0,0,0,0.9)] ring-1 ring-[#00FF94]/10 outline-none md:p-10"
          >
            <button
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] text-[var(--text-2)] transition-colors hover:border-[#00FF94]/50 hover:text-[var(--accent)]"
            >
              <X size={18} aria-hidden />
            </button>

            <p className="kicker">
              {project.number} · {project.status}
            </p>
            <h2
              id="case-study-title"
              className="mt-3 max-w-[90%] font-display text-3xl font-black leading-[1.05] tracking-tight text-[var(--text)] md:text-4xl"
            >
              {project.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-3)]">{project.category}</p>

            {/* Screenshot gallery */}
            {project.images.length > 0 && (
              <div className="mt-7 flex gap-4 overflow-x-auto pb-2">
                {project.images.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${project.title} — view ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-44 w-auto shrink-0 rounded-lg border border-[var(--border)] object-cover md:h-56"
                  />
                ))}
              </div>
            )}

            {/* Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
                {project.metrics.map((m) => (
                  <div key={m.label} className="flex flex-col gap-1 bg-[var(--panel)] p-4">
                    <dt className="text-[11px] uppercase tracking-wider text-[var(--text-3)]">{m.label}</dt>
                    <dd className="font-display text-lg font-bold text-[var(--accent)] md:text-xl">{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {project.problem && (
              <SectionBlock label="The problem">
                <p className="text-sm leading-relaxed text-[var(--text-2)] md:text-[15px]">{project.problem}</p>
              </SectionBlock>
            )}

            {project.approach && project.approach.length > 0 && (
              <SectionBlock label="Approach">
                <BulletList items={project.approach} />
              </SectionBlock>
            )}

            {project.role && (
              <SectionBlock label="What I built">
                <p className="text-sm leading-relaxed text-[var(--text-2)] md:text-[15px]">{project.role}</p>
              </SectionBlock>
            )}

            {project.impact && project.impact.length > 0 && (
              <SectionBlock label="Impact">
                <BulletList items={project.impact} />
              </SectionBlock>
            )}

            {project.decisions && project.decisions.length > 0 && (
              <SectionBlock label="Trade-offs & decisions">
                <ul className="space-y-4">
                  {project.decisions.map((d, i) => (
                    <li key={i} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                      <p className="text-sm font-semibold text-[var(--text)]">{d.choice}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-2)]">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent)]">Why </span>
                        {d.why}
                      </p>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            )}

            <SectionBlock label="Stack">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-2)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </SectionBlock>

            {(project.repositoryUrl || project.liveUrl || project.caseStudyUrl) && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {project.liveUrl && (
                  <SafeExternalLink
                    href={project.liveUrl}
                    className="inline-flex items-center gap-2 rounded-full bg-[#00FF94] px-5 py-2.5 text-sm font-bold text-[#050505] transition-transform hover:scale-[1.03]"
                  >
                    <ExternalLink size={15} aria-hidden /> Live Demo
                  </SafeExternalLink>
                )}
                {project.repositoryUrl && (
                  <SafeExternalLink
                    href={project.repositoryUrl}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[#00FF94] hover:text-[var(--accent)]"
                  >
                    <FaGithub size={15} aria-hidden /> View Code
                  </SafeExternalLink>
                )}
                {project.caseStudyUrl && (
                  <SafeExternalLink
                    href={project.caseStudyUrl}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[#00FF94] hover:text-[var(--accent)]"
                  >
                    <NotebookPen size={15} aria-hidden /> Notebook
                  </SafeExternalLink>
                )}
              </div>
            )}

            {project.note && <p className="mt-6 text-xs italic leading-relaxed text-[var(--text-3)]">{project.note}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
