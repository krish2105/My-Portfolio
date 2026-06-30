import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile, socialLinks } from "../../data/portfolio";
import HeroBackdrop from "./HeroBackdrop";
import SocialLinks from "../common/SocialLinks";
import ProfileCard from "../profile/ProfileCard";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Cycles through the profile titles with a masked swap. */
const RoleRotator = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % profile.titles.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="line-mask inline-flex h-[1.4em] overflow-hidden align-bottom">
      <motion.span
        key={i}
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-[#00FF94]"
      >
        {profile.titles[i]}
      </motion.span>
    </span>
  );
};

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const letters = "KRISHNA".split("");
  const letters2 = "MATHUR".split("");

  return (
    <section ref={ref} id="home" className="relative min-h-[100svh] w-full overflow-hidden bg-[#050505] bg-grid">
      {/* Single, calm background: the firing-neuron field */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-75">
          <HeroBackdrop />
        </div>
        {/* Soft accent glow anchored behind the headline */}
        <div className="absolute left-[10%] top-1/2 h-[60vmin] w-[60vmin] -translate-y-1/2 rounded-full bg-radial-glow blur-3xl" />
        {/* Readability washes so the text always sits on calm contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]" />
      </motion.div>

      {/* Foreground: text (left) + photo card (right) */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1500px] grid-cols-1 items-center gap-10 px-6 pt-28 pb-16 md:px-[8vw] lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-0"
      >
        {/* Left column */}
        <div className="flex flex-col">
          <div className="overflow-hidden mb-5">
            <motion.p
              initial={{ y: "120%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="kicker"
            >
              Master of AI in Business · {profile.location}
            </motion.p>
          </div>

          <h1 className="font-display font-black leading-[0.85] tracking-tighter text-[clamp(3rem,9vw,8.5rem)]">
            <span className="block overflow-hidden">
              {letters.map((l, idx) => (
                <motion.span
                  key={idx}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.25 + idx * 0.04 }}
                  className="name-energy inline-block"
                >
                  {l}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden">
              {letters2.map((l, idx) => (
                <motion.span
                  key={idx}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.45 + idx * 0.04 }}
                  className="name-outline-energy inline-block"
                >
                  {l}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-7 flex flex-col gap-2"
          >
            <p className="font-display text-xl font-bold tracking-tight md:text-2xl">
              <RoleRotator />
            </p>
            <p className="max-w-lg text-base text-[#A0ADBA] leading-relaxed">
              I build practical AI systems — from{" "}
              <span className="text-[#EDF5FA]">fraud detection</span> and healthcare
              optimisation to analytics dashboards and GenAI workflows — that turn data into decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <a
              href="#projects"
              data-cursor="View"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#projects", lenis);
              }}
              className="group inline-flex items-center gap-3 rounded-full bg-[#00FF94] px-7 py-4 font-bold tracking-wide text-[#050505] transition-transform hover:scale-[1.03]"
            >
              VIEW PROJECTS
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            {socialLinks.resume && (
              <a
                href={socialLinks.resume}
                download="Krishna-Mathur-Resume.pdf"
                data-cursor="Download"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-4 font-bold tracking-wide text-[#EDF5FA] transition-colors hover:border-[#00FF94] hover:text-[#00FF94]"
              >
                Download Resume
              </a>
            )}
            <a
              href="#contact"
              data-cursor="Talk"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#contact", lenis);
              }}
              className="font-semibold tracking-wide text-[#A0ADBA] underline-offset-4 transition-colors hover:text-[#EDF5FA] hover:underline"
            >
              Contact me →
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-6"
          >
            <SocialLinks />
          </motion.div>
        </div>

        {/* Right column — photo / profile card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.5 }}
          className="flex justify-center lg:justify-end"
        >
          <ProfileCard
            name="Krishna Mathur"
            title="AI / ML Developer · GenAI Builder"
            handle="krishnamathur"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/avatar.webp"
            miniAvatarUrl="/avatar.webp"
            showUserInfo
            enableTilt
            enableMobileTilt={false}
            behindGlowEnabled
            behindGlowColor="rgba(0, 255, 148, 0.55)"
            innerGradient="linear-gradient(145deg, rgba(0,255,148,0.14) 0%, rgba(0,179,104,0.06) 100%)"
            onContactClick={() => scrollTo("#contact", lenis)}
          />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="kicker flex flex-col items-center gap-2"
        >
          Scroll
          <span className="h-10 w-[1px] bg-gradient-to-b from-[#00FF94] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
