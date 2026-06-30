import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { projects } from "../../data/portfolio";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ProjectCard from "../projects/ProjectCard";
import { RevealText } from "../common/Reveal";

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

/** Desktop: vertical scroll is converted into a pinned horizontal track. */
const HorizontalGallery = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(trackRef.current.scrollWidth - window.innerWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <div ref={wrapRef} style={{ height: `${distance + window.innerHeight}px` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="py-10">
          <Header />
        </div>
        <motion.div ref={trackRef} style={{ x }} className="flex gap-8 px-6 md:px-[8vw]">
          {projects.map((p) => (
            <div key={p.id} className="w-[78vw] shrink-0 md:w-[46vw] lg:w-[38vw]">
              <ProjectCard project={p} />
            </div>
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
const VerticalStack = () => (
  <div className="space-y-8 px-6 pt-10">
    {projects.map((p) => (
      <ProjectCard key={p.id} project={p} />
    ))}
  </div>
);

const ProjectsSection = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <section id="projects" className="relative border-t border-[var(--border)] py-20">
      {isDesktop ? (
        <HorizontalGallery />
      ) : (
        <>
          <Header />
          <VerticalStack />
        </>
      )}
    </section>
  );
};

export default ProjectsSection;
