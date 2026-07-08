import { useEffect, useRef, useState, type RefObject } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useMotionValue,
  useSpring,
} from "motion/react";
import { track } from "@vercel/analytics";
import { profile, socialLinks } from "../../data/portfolio";
import HeroBackdrop from "./HeroBackdrop";
import MagneticButton from "../common/MagneticButton";
import SocialLinks from "../common/SocialLinks";
import ProfileCard from "../profile/ProfileCard";
import HeroMetrics from "./HeroMetrics";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useSound } from "../../lib/sound";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Base weight for the kinetic name (rest state), clamped between these. */
const WEIGHT_MIN = 650;
const WEIGHT_MAX = 900;
const WEIGHT_REST = 780;

/**
 * Drives the hero name's variable-font weight from scroll velocity (fast
 * scroll -> heavier) and cursor proximity (closer -> heavier), spring-
 * smoothed so it never snaps. Skipped entirely under reduced-motion or on
 * touch devices, where the name just sits at its resting weight.
 */
const useKineticWeight = (containerRef: RefObject<HTMLElement | null>) => {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const fine = useMediaQuery("(pointer: fine)");
  const active = !reduced && fine;

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const proximity = useMotionValue(0); // 0 (far) .. 1 (right on top of the name)

  useEffect(() => {
    if (!active) return;
    const el = containerRef.current;
    if (!el) return;

    // Cache the rect, refreshed on resize/scroll only — avoids a forced
    // synchronous layout read on every pointermove (2026-07-08 perf audit).
    let rect = el.getBoundingClientRect();
    const updateRect = () => {
      rect = el.getBoundingClientRect();
    };
    updateRect();
    const ro = new ResizeObserver(updateRect);
    ro.observe(el);
    window.addEventListener("scroll", updateRect, { passive: true });

    const onMove = (e: PointerEvent) => {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const maxDist = Math.max(rect.width, rect.height) * 0.9;
      proximity.set(Math.max(0, 1 - dist / maxDist));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("pointermove", onMove);
    };
  }, [active, containerRef, proximity]);

  const weight = useTransform(
    [scrollVelocity, proximity],
    ([v, p]: number[]) => {
      if (!active) return WEIGHT_REST;
      const fromVelocity = Math.min(Math.abs(v) / 12, 1) * 90; // fast scroll -> up to +90
      const fromProximity = p * 60; // cursor right on top -> up to +60
      const w = WEIGHT_REST + fromVelocity + fromProximity;
      return Math.min(WEIGHT_MAX, Math.max(WEIGHT_MIN, w));
    }
  );
  return useSpring(weight, { stiffness: 120, damping: 20, mass: 0.5 });
};

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
        className="text-[var(--accent)]"
      >
        {profile.titles[i]}
      </motion.span>
    </span>
  );
};

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const { lenis } = useSmoothScroll();
  const { play } = useSound();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const nameWeight = useKineticWeight(nameRef);
  // Three parallax speeds for the background layers, so the aurora reads as
  // real depth (near layers move faster) rather than one flat glowing blob.
  const yLayer1 = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const yLayer2 = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const yLayer3 = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  const letters = "KRISHNA".split("");
  const letters2 = "MATHUR".split("");

  return (
    <section ref={ref} id="home" className="relative min-h-[100svh] w-full overflow-hidden bg-[var(--bg)] bg-grid">
      {/* Single, calm background: the firing-neuron field */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-75">
          <HeroBackdrop />
        </div>
        {/* Soft accent glow anchored behind the headline */}
        <motion.div
          style={{ y: yLayer1 }}
          className="absolute left-[10%] top-1/2 h-[60vmin] w-[60vmin] -translate-y-1/2 rounded-full bg-radial-glow blur-3xl"
        />
        {/* Layered, differently-paced auroras — real parallax depth instead
            of one flat blob. Each layer drifts on its own cycle/offset. */}
        <motion.div
          style={{ y: yLayer2 }}
          aria-hidden
          className="aurora pointer-events-none absolute left-[2%] top-[12%] h-[55vmin] w-[55vmin] rounded-full"
        />
        <motion.div
          style={{ y: yLayer3 }}
          aria-hidden
          className="aurora aurora-layer-2 pointer-events-none absolute right-[6%] top-[38%] h-[38vmin] w-[38vmin] rounded-full"
        />
        <motion.div
          style={{ y: yLayer1 }}
          aria-hidden
          className="aurora aurora-layer-3 pointer-events-none absolute left-[32%] bottom-[4%] h-[30vmin] w-[30vmin] rounded-full"
        />
        {/* Readability washes so the text always sits on calm contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/60 via-transparent to-[var(--bg)]" />
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

          <motion.h1
            ref={nameRef}
            style={{ fontWeight: nameWeight }}
            className="font-kinetic leading-[0.85] tracking-tighter text-[clamp(3rem,9vw,8.5rem)]"
          >
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
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-7 flex flex-col gap-2"
          >
            <p className="font-display text-xl font-bold tracking-tight md:text-2xl">
              <RoleRotator />
            </p>
            <p className="max-w-lg text-base text-[var(--text-2)] leading-relaxed">
              {profile.tagline} From{" "}
              <span className="text-[var(--text)]">fraud detection</span> to hospital
              resource allocation, analytics dashboards and GenAI workflows.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-8"
          >
            <HeroMetrics />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <MagneticButton>
              <a
                href="#projects"
                data-cursor="View"
                onClick={(e) => {
                  e.preventDefault();
                  track("hero_cta_view_projects");
                  play("cta");
                  scrollTo("#projects", lenis);
                }}
                className="group inline-flex items-center gap-3 rounded-full bg-[#00FF94] px-7 py-4 font-bold tracking-wide text-[#050505] transition-shadow hover:shadow-[0_0_30px_rgba(0,255,148,0.45)]"
              >
                EXPLORE THE WORK
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </MagneticButton>
            {socialLinks.resume && (
              <MagneticButton>
                <a
                  href={socialLinks.resume}
                  download="Krishna-Mathur-Resume.pdf"
                  data-cursor="Download"
                  onClick={() => track("resume_download", { source: "hero" })}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 py-4 font-bold tracking-wide text-[var(--text)] transition-colors hover:border-[#00FF94] hover:text-[var(--accent)]"
                >
                  Download Resume
                </a>
              </MagneticButton>
            )}
            <a
              href="#contact"
              data-cursor="Talk"
              onClick={(e) => {
                e.preventDefault();
                track("hero_cta_contact");
                scrollTo("#contact", lenis);
              }}
              className="font-semibold tracking-wide text-[var(--text-2)] underline-offset-4 transition-colors hover:text-[var(--text)] hover:underline"
            >
              Start a conversation →
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
            status={profile.availabilityShort}
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
