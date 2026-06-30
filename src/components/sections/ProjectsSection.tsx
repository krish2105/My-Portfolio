import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { projects } from "../../data/portfolio";
import type { Project } from "../../types/portfolio";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ProjectCard from "../projects/ProjectCard";
import ProjectModal from "../projects/ProjectModal";
import { RevealText } from "../common/Reveal";

const FILTERS = ["All", "AI/ML", "Deep Learning", "GenAI", "Data"] as const;
type Filter = (typeof FILTERS)[number];

const Header = () => (
  <div className="px-6 md:px-[8vw]">
    <div className="mb-6 flex items-center gap-4">
      <span className="kicker">(05)</span>
      <RevealText className="kicker">Selected Work</RevealText>
    </div>
    <h2 className="max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-tighter text-[#EDF5FA] md:text-7xl">
      <RevealText as="span">PROJECTS</RevealText>
    </h2>
  </div>
);

const FilterBar = ({ filter, setFilter }: { filter: Filter; setFilter: (f: Filter) => void }) => (
  <div className="mt-7 flex flex-wrap gap-2 px-6 md:px-[8vw]" role="group" aria-label="Filter projects by domain">
    {FILTERS.map((f) => {
      const active = f === filter;
      return (
        <button
          key={f}
          onClick={() => setFilter(f)}
          aria-pressed={active}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
            active
              ? "border-[#00FF94] bg-[#00FF94]/10 text-[#00FF94]"
              : "border-[var(--border)] text-[#A0ADBA] hover:border-[var(--border-strong)] hover:text-[#EDF5FA]"
          }`}
        >
          {f}
        </button>
      );
    })}
  </div>
);

/** Desktop: vertical scroll is converted into a pinned horizontal track. */
const HorizontalGallery = ({
  items,
  onOpen,
  filter,
  setFilter,
}: {
  items: Project[];
  onOpen: (p: Project) => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // Re-measure when the filtered set changes (track width changes).
  }, [items]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <div ref={wrapRef} style={{ height: `${distance + window.innerHeight}px` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="py-8">
          <Header />
          <FilterBar filter={filter} setFilter={setFilter} />
        </div>
        <motion.div ref={trackRef} style={{ x }} className="flex gap-8 px-6 md:px-[8vw]">
          {items.map((p) => (
            <motion.div
              key={p.id}
              layout
              className="w-[78vw] shrink-0 md:w-[46vw] lg:w-[38vw]"
            >
              <ProjectCard project={p} onOpen={() => onOpen(p)} />
            </motion.div>
          ))}
          <div className="flex w-[40vw] shrink-0 items-center md:w-[24vw]">
            <a
              href="#contact"
              data-cursor="Talk"
              className="font-display text-3xl font-black tracking-tight text-[#7e8c9a] transition-colors hover:text-[#00FF94] md:text-5xl"
            >
              Let's
              <br />
              build →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/** Mobile: simple vertical stack — robust and swipe-free. */
const VerticalStack = ({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) => (
  <div className="space-y-8 px-6 pt-8">
    {items.map((p) => (
      <ProjectCard key={p.id} project={p} onOpen={() => onOpen(p)} />
    ))}
  </div>
);

const DEFAULT_TITLE = "Krishna Mathur — AI Developer, Data Analyst & GenAI Builder";

const ProjectsSection = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.tags?.includes(filter))),
    [filter]
  );

  // Deep-linkable case studies: /work/:slug opens the matching modal (shareable,
  // survives reload via the SPA rewrite) without a router. Sync via History API.
  const openProject = (p: Project) => {
    setSelected(p);
    document.title = `${p.shortTitle} — Krishna Mathur`;
    if (window.location.pathname !== `/work/${p.id}`)
      window.history.pushState({ slug: p.id }, "", `/work/${p.id}`);
  };
  const closeProject = () => {
    setSelected(null);
    document.title = DEFAULT_TITLE;
    if (window.location.pathname.startsWith("/work/")) window.history.pushState({}, "", "/");
  };

  useEffect(() => {
    const sync = () => {
      const m = window.location.pathname.match(/^\/work\/([^/]+)/);
      const p = m ? projects.find((x) => x.id === m[1]) : undefined;
      setSelected(p ?? null);
      document.title = p ? `${p.shortTitle} — Krishna Mathur` : DEFAULT_TITLE;
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return (
    <section id="projects" className="relative border-t border-[var(--border)] py-20">
      {isDesktop ? (
        <HorizontalGallery items={filtered} onOpen={openProject} filter={filter} setFilter={setFilter} />
      ) : (
        <>
          <Header />
          <FilterBar filter={filter} setFilter={setFilter} />
          <VerticalStack items={filtered} onOpen={openProject} />
        </>
      )}
      <ProjectModal project={selected} onClose={closeProject} />
    </section>
  );
};

export default ProjectsSection;
