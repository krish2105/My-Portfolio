import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useState } from "react";
import { ExternalLink, NotebookPen } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import type { Project } from "../../types/portfolio";
import ProjectCover from "./ProjectCover";
import SafeExternalLink from "../common/SafeExternalLink";

/** A pointer-tilting project card used in the horizontal gallery. */
const ProjectCard = ({ project }: { project: Project }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = !!project.images?.[0] && !imgFailed;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const link = project.liveUrl || project.caseStudyUrl || project.repositoryUrl;

  return (
    <motion.article
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0a0a0a]"
      data-cursor={link ? "Open" : ""}
    >
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
        <span className="absolute right-5 top-4 font-display text-5xl font-black text-[#EDF5FA]/10 md:text-7xl">
          {project.number}
        </span>
        <span className="absolute left-5 top-5 rounded-full border border-[#00FF94]/40 bg-[#050505]/60 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#00FF94] backdrop-blur">
          {project.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <p className="kicker mb-3">{project.category}</p>
        <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-[#EDF5FA] md:text-3xl">
          {link ? (
            <SafeExternalLink href={link} className="transition-colors hover:text-[#00FF94]">
              {project.title}
            </SafeExternalLink>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-[#A0ADBA]">{project.description}</p>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 6).map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] text-[#687686]"
              >
                {t}
              </span>
            ))}
          </div>
          {project.note && <p className="mt-4 text-xs italic text-[#687686]">{project.note}</p>}

          {(project.repositoryUrl || project.liveUrl || project.caseStudyUrl) && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {project.repositoryUrl && (
                <SafeExternalLink
                  href={project.repositoryUrl}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium text-[#A0ADBA] transition-colors hover:border-[#00FF94]/50 hover:text-[#00FF94]"
                  aria-label={`${project.title} source code on GitHub`}
                >
                  <FaGithub size={13} aria-hidden /> Code
                </SafeExternalLink>
              )}
              {project.liveUrl && (
                <SafeExternalLink
                  href={project.liveUrl}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#00FF94]/40 bg-[#00FF94]/10 px-3 py-1.5 text-[11px] font-medium text-[#00FF94] transition-colors hover:bg-[#00FF94]/20"
                  aria-label={`${project.title} live demo`}
                >
                  <ExternalLink size={13} aria-hidden /> Live Demo
                </SafeExternalLink>
              )}
              {project.caseStudyUrl && (
                <SafeExternalLink
                  href={project.caseStudyUrl}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-medium text-[#A0ADBA] transition-colors hover:border-[#00FF94]/50 hover:text-[#00FF94]"
                  aria-label={`${project.title} notebook or case study`}
                >
                  <NotebookPen size={13} aria-hidden /> Notebook
                </SafeExternalLink>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
