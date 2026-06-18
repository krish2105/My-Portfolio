import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Project } from "../../types/portfolio";
import ProjectVisual from "../common/ProjectVisual";
import SafeExternalLink from "../common/SafeExternalLink";

/** A pointer-tilting project card used in the horizontal gallery. */
const ProjectCard = ({ project }: { project: Project }) => {
  const ref = useRef<HTMLDivElement>(null);
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
          <ProjectVisual type={project.visualType} />
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
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
