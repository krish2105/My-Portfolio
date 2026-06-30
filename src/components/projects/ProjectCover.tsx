import type { Project } from "../../types/portfolio";

/**
 * Premium, monochrome fallback header for projects that don't have a real
 * screenshot. Intentionally neutral (no accent fills) so it reads as a clean
 * editorial cover rather than abstract line-art.
 */
const ProjectCover = ({ project }: { project: Project }) => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0a0a0a]">
    {/* soft top-down light */}
    <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(237,245,250,0.07),transparent_60%)]" />
    {/* faint monochrome grid */}
    <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(237,245,250,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(237,245,250,0.6)_1px,transparent_1px)] [background-size:38px_38px]" />
    {/* centered editorial label */}
    <div className="relative z-[1] px-8 text-center">
      <p className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-[#EDF5FA]/25 md:text-4xl">
        {project.shortTitle}
      </p>
      <div className="mx-auto mt-4 h-px w-12 bg-[#EDF5FA]/15" />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#687686]">
        {project.category}
      </p>
    </div>
  </div>
);

export default ProjectCover;
