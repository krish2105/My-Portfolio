import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { ExternalLink, NotebookPen, ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project } from "../../types/portfolio";
import ProjectCover from "./ProjectCover";
import SafeExternalLink from "../common/SafeExternalLink";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useSound } from "../../lib/sound";

/**
 * A magnified preview of the project — a small "peek" beyond the always-
 * visible thumbnail. On desktop it follows the cursor (spring-lagged, so it
 * trails rather than snaps); on touch (`centered`) it's triggered by a
 * long-press and simply appears centered in the viewport, since a held
 * finger doesn't produce a meaningful stream of positions to follow.
 */
const HoverPreview = ({
  project,
  active,
  centered = false,
}: {
  project: Project;
  active: boolean;
  centered?: boolean;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!active || centered) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX + 24);
      y.set(e.clientY + 24);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active, centered, x, y]);

  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[80]">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={centered ? undefined : { x: springX, y: springY }}
            className={
              centered
                ? "absolute left-1/2 top-1/2 h-48 w-72 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-[var(--border-strong)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                : "absolute h-40 w-64 overflow-hidden rounded-xl border border-[var(--border-strong)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            }
          >
            {project.images?.[0] ? (
              <img
                src={project.images[0]}
                alt=""
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <ProjectCover project={project} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * A pointer-tilting project card. Clicking (or Enter/Space) opens the
 * case-study modal; the explicit Code / Live / Notebook links open externally
 * and stop propagation so they don't also trigger the modal.
 */
const ProjectCard = ({ project, onOpen }: { project: Project; onOpen?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [titleHover, setTitleHover] = useState(false);
  const [longPress, setLongPress] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasImage = !!project.images?.[0] && !imgFailed;
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { play } = useSound();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setLongPress(true), 450);
  };
  const endLongPress = () => {
    clearTimeout(longPressTimer.current);
    setLongPress(false);
  };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
    // Pointer-tracked spotlight (CSS vars — no React rerender).
    ref.current?.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    ref.current?.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] transition-colors duration-300 hover:border-[#00FF94]/30"
    >
      {/* Stretched full-card trigger: a single, unambiguous focusable control that
          opens the case study. Sits BELOW the real links below (lower z-index) so
          those remain independently clickable/keyboard-reachable — avoids nesting
          interactive controls inside another interactive control. */}
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={() => {
          setTitleHover(true);
          play("hover");
        }}
        onPointerLeave={() => setTitleHover(false)}
        onTouchStart={startLongPress}
        onTouchEnd={endLongPress}
        onTouchCancel={endLongPress}
        aria-label={`Open case study: ${project.title}`}
        data-cursor="View"
        className="absolute inset-0 z-[1] cursor-pointer focus-visible-ring"
      />
      {!reduced && <HoverPreview project={project} active={fine ? titleHover : longPress} centered={!fine} />}

      {/* Pointer-tracked spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx, 50%) var(--my, 0%), rgba(0,255,148,0.10), transparent 70%)",
        }}
      />
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          {hasImage ? (
            <img
              src={project.images[0]}
              alt={`${project.title} — interface screenshot`}
              loading="lazy"
              decoding="async"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <ProjectCover project={project} />
          )}
        </div>
        <span className="absolute right-5 top-4 font-display text-5xl font-black text-[var(--text)]/10 md:text-7xl">
          {project.number}
        </span>
        <span className="absolute left-5 top-5 rounded-full border border-[#00FF94]/40 bg-[var(--bg)]/60 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] backdrop-blur">
          {project.status}
        </span>
        {project.flagship && (
          <span className="absolute left-5 top-12 rounded-full border border-[var(--border-strong)] bg-[var(--bg)]/60 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[var(--text-2)] backdrop-blur">
            Flagship
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="kicker mb-3">{project.category}</p>
        <h3 className="flex items-start gap-2 font-display text-2xl font-bold leading-tight tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent)] md:text-3xl">
          {project.title}
          <ArrowUpRight
            size={20}
            aria-hidden
            className="mt-1 shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </h3>
        {project.valueProp && (
          <p className="mt-3 text-sm font-medium leading-snug text-[var(--accent)]">{project.valueProp}</p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-2)]">{project.description}</p>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 6).map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--text-3)]"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Elevated above the stretched card button (z-[1]) so these specific
              links remain independently clickable/keyboard-reachable. */}
          <div className="relative z-[3] mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent)]">
              Case study →
            </span>
            {project.repositoryUrl && (
              <SafeExternalLink
                href={project.repositoryUrl}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-2)] transition-colors hover:border-[#00FF94]/50 hover:text-[var(--accent)]"
                aria-label={`${project.title} source code on GitHub`}
              >
                <FaGithub size={13} aria-hidden /> Code
              </SafeExternalLink>
            )}
            {project.liveUrl && (
              <SafeExternalLink
                href={project.liveUrl}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#00FF94]/40 bg-[#00FF94]/10 px-3 py-1.5 text-[11px] font-medium text-[var(--accent)] transition-colors hover:bg-[#00FF94]/20"
                aria-label={`${project.title} live demo`}
              >
                <ExternalLink size={13} aria-hidden /> Live Demo
              </SafeExternalLink>
            )}
            {project.caseStudyUrl && (
              <SafeExternalLink
                href={project.caseStudyUrl}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-2)] transition-colors hover:border-[#00FF94]/50 hover:text-[var(--accent)]"
                aria-label={`${project.title} notebook or case study`}
              >
                <NotebookPen size={13} aria-hidden /> Notebook
              </SafeExternalLink>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
