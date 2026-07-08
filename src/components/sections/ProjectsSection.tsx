import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Network } from "lucide-react";
import { projects } from "../../data/portfolio";
import type { Project } from "../../types/portfolio";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ProjectCard from "../projects/ProjectCard";
import ProjectModal from "../projects/ProjectModal";
import ProjectSystemMap from "../projects/ProjectSystemMap";
import { RevealText } from "../common/Reveal";

const FILTERS = ["All", "AI/ML", "Deep Learning", "GenAI", "Data"] as const;
type Filter = (typeof FILTERS)[number];

const Header = () => (
  <div className="px-6 md:px-[8vw]">
    <div className="mb-6 flex items-center gap-4">
      <span className="kicker">(05)</span>
      <RevealText className="kicker">Selected Work</RevealText>
    </div>
    <h2 className="max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-tighter text-[var(--text)] md:text-7xl">
      <RevealText as="span">PROJECTS</RevealText>
    </h2>
  </div>
);

/**
 * Standalone toggle + panel for the Project System Map. Deliberately kept
 * OUTSIDE the pinned horizontal-scroll gallery below: that gallery's height
 * math (`h-screen` + `overflow-hidden`, scroll-linked track position) is
 * tightly tuned, and any extra content inside it risks pushing the toggle
 * itself out of the visible/hit-testable area at some viewport sizes.
 */
const SystemMapPanel = ({ onOpen }: { onOpen: (p: Project) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[var(--border)] px-6 py-10 md:px-[8vw]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="project-system-map"
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible-ring ${
          open
            ? "border-[#00FF94] bg-[#00FF94]/10 text-[var(--accent)]"
            : "border-[var(--border)] text-[var(--text-2)] hover:border-[#00FF94]/40 hover:text-[var(--text)]"
        }`}
      >
        <Network size={13} aria-hidden />
        {open ? "Hide system map" : "View system map — projects × domains"}
      </button>
      {open && (
        <div id="project-system-map" className="mt-6">
          <ProjectSystemMap projects={projects} onOpen={onOpen} />
        </div>
      )}
    </div>
  );
};

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
              ? "border-[#00FF94] bg-[#00FF94]/10 text-[var(--accent)]"
              : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
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
        <motion.div
          ref={trackRef}
          data-cursor="Drag"
          style={{ x }}
          className="flex gap-8 px-6 md:px-[8vw]"
        >
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
              className="font-display text-3xl font-black tracking-tight text-[var(--text-3)] transition-colors hover:text-[var(--accent)] md:text-5xl"
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

/**
 * Mobile: a swipe-driven horizontal gallery with native momentum + snap
 * (CSS scroll-snap — robust, accessible, no gesture library needed) instead
 * of a plain vertical stack, so the "kinetic" feel carries over to touch.
 */
const SwipeGallery = ({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) => {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  // rAF-coalesced: a touch-scroll fires far more often than 60fps worth of
  // useful updates, and each tick was forcing a scrollWidth/scrollLeft
  // layout read — cap the read to once per animation frame (2026-07-08 perf audit).
  const rafRef = useRef<number | null>(null);

  const onScroll = () => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = trackRef.current;
      if (!el) return;
      const cardWidth = el.scrollWidth / items.length;
      setActive(Math.round(el.scrollLeft / cardWidth));
    });
  };

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="pt-8">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((p) => (
          <div key={p.id} className="w-[85vw] shrink-0 snap-center">
            <ProjectCard project={p} onOpen={() => onOpen(p)} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Project slides">
        {items.map((p, i) => (
          <span
            key={p.id}
            role="presentation"
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-[var(--accent)]" : "w-1.5 bg-[var(--border-strong)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const DEFAULT_TITLE = "Krishna Mathur — AI Developer building decision tools from data, language & workflows";

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
          <SwipeGallery items={filtered} onOpen={openProject} />
        </>
      )}
      <SystemMapPanel onOpen={openProject} />
      <ProjectModal project={selected} onClose={closeProject} />
    </section>
  );
};

export default memo(ProjectsSection);
