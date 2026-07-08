import { memo, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "../../data/portfolio";
import { useTheme } from "../../lib/theme";
import { RevealText, Rise } from "../common/Reveal";

// Word-reveal dim/bright color pairs, tuned per theme so the dim state is
// unambiguously legible (not just past the AA minimum) against that theme's
// background: dark ~5.9:1 on #050505, light ~10:1 on #f5f7fa.
const WORD_COLORS = {
  dark: ["#7e8c9a", "#EDF5FA"] as [string, string],
  light: ["#333f49", "#0c1218"] as [string, string],
};

/* ── Scroll-linked word highlight ─────────────────────────────────────
   Each word starts dim and shifts to bright as you scroll through the
   container, creating a "reading spotlight" effect.                    */
const ScrollRevealParagraph = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 35%"],
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />
        );
      })}
    </p>
  );
};

const Word = ({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const { theme } = useTheme();
  const color = useTransform(progress, range, WORD_COLORS[theme]);

  return (
    <motion.span
      style={{ color }}
      className="mr-[0.3em] transition-[filter] duration-300"
    >
      {word}
    </motion.span>
  );
};

/* ── Meta stat cards ──────────────────────────────────────────────── */
const meta = [
  { label: "Based in", value: "Dubai, UAE", icon: "📍" },
  { label: "From", value: "Jaipur, India", icon: "🏠" },
  { label: "Focus", value: "AI · Data · GenAI", icon: "🧠" },
  { label: "Status", value: "Studying & Building", icon: "⚡" },
];

const StatCard = ({
  item,
  index,
}: {
  item: (typeof meta)[number];
  index: number;
}) => (
  <Rise delay={index * 0.08}>
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[var(--panel)]/80 p-6 backdrop-blur-sm transition-all duration-500 hover:border-[#00FF94]/30 hover:bg-[var(--panel)] md:p-7">
      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#00FF94]/0 blur-2xl transition-all duration-500 group-hover:bg-[#00FF94]/10" />

      <div className="relative">
        <span className="mb-3 block text-2xl">{item.icon}</span>
        <p className="kicker mb-2">{item.label}</p>
        <p className="font-display text-lg font-bold text-[var(--text)] transition-colors duration-300 group-hover:text-[var(--accent)] md:text-xl">
          {item.value}
        </p>
      </div>
    </div>
  </Rise>
);

/* ── Main section ─────────────────────────────────────────────────── */
const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax for the background glow
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40"
    >
      {/* ── Animated background elements ── */}
      <motion.div
        style={{ y: glowY, scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="h-full w-full rounded-full bg-radial-glow opacity-50 blur-xl" />
      </motion.div>

      {/* Subtle accent line — vertical, like a spine */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="absolute left-6 top-28 bottom-28 hidden w-[2px] origin-top bg-gradient-to-b from-[#00FF94] via-[#00FF94]/20 to-transparent md:left-[8vw] md:block"
      />

      {/* ── Section kicker ── */}
      <div className="mb-14 flex items-center gap-4 md:pl-8">
        <span className="kicker">(01)</span>
        <RevealText className="kicker">About</RevealText>
      </div>

      {/* ── Headline ── */}
      <div className="max-w-5xl md:pl-8">
        <Rise>
          <h2 className="font-display text-4xl font-black leading-[1.05] tracking-tight md:text-7xl">
            <span className="text-[var(--text)]">I build AI for </span>
            <span className="text-gradient">decisions</span>
            <span className="text-[var(--text-3)]">
              {" "}
              — not demos.
            </span>
          </h2>
        </Rise>
      </div>

      {/* ── Scroll-driven paragraph reveals ── */}
      <div className="mt-16 max-w-3xl space-y-8 md:mt-24 md:pl-8">
        {profile.aboutStatements.map((statement, i) => (
          <ScrollRevealParagraph
            key={i}
            text={statement}
            className="text-lg leading-relaxed md:text-xl"
          />
        ))}
      </div>

      {/* ── Stat cards grid ── */}
      <div className="mt-20 md:mt-28 md:pl-8">
        <Rise delay={0.05}>
          <p className="kicker mb-8">At a glance</p>
        </Rise>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {meta.map((item, i) => (
            <StatCard key={item.label} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* ── Decorative bottom accent ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-28 h-[1px] max-w-xs origin-center bg-gradient-to-r from-transparent via-[#00FF94]/50 to-transparent md:mt-36"
      />
    </section>
  );
};

export default memo(AboutSection);
