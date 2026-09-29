import { memo, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ExternalLink, MapPin, Building2, ShieldCheck, Globe } from "lucide-react";
import { journey } from "../../data/portfolio";
import type { JourneyItem } from "../../types/portfolio";
import { RevealText } from "../common/Reveal";

/**
 * One timeline entry with responsive two-column layout on desktop/tablet:
 * - Left column: Date kicker, role title, institution, narrative, and deliverables.
 * - Right column: Prominent, high-definition glassmorphic institution stage showcasing
 *   the large authentic vector logo, competency badges, location, and official portal link.
 */
const JourneyEntry = ({
  item,
  index,
}: {
  item: JourneyItem;
  index: number;
}) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="group relative"
    >
      {/* Pulse marker on the timeline rail */}
      <span className="absolute -left-8 top-3.5 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full bg-[#00FF94] shadow-[0_0_16px_rgba(0,255,148,0.8)] ring-4 ring-[#00FF94]/20 transition-transform duration-300 group-hover:scale-125 md:-left-12" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-stretch">
        {/* Left Column: Role Details & Narrative */}
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            {/* Header: Date + Role Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                {item.date}
              </span>
              {item.roleBadge && (
                <span className="rounded-full border border-[var(--border)] bg-[var(--panel-2)]/90 px-3 py-0.5 font-mono text-[11px] text-[var(--text-3)] shadow-sm">
                  {item.roleBadge}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl md:text-4xl">
              {item.title}
            </h3>

            {/* Institution & Location */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium">
              <span className="text-[var(--accent)] font-semibold text-base sm:text-lg">
                {item.institution}
              </span>
              {item.location && (
                <span className="inline-flex items-center gap-1 font-mono text-xs text-[var(--text-3)]">
                  <MapPin size={12} className="text-[var(--accent)]" />
                  {item.location}
                </span>
              )}
            </div>

            {/* Narrative description */}
            {item.description && (
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-2)] sm:text-base">
                {item.description}
              </p>
            )}

            {/* Key Deliverables / Highlights checklist */}
            {item.highlights && item.highlights.length > 0 && (
              <ul className="mt-5 space-y-2.5 border-l-2 border-[#00FF94]/30 pl-3.5">
                {item.highlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--text-2)] sm:text-sm"
                  >
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#00FF94] shadow-[0_0_8px_rgba(0,255,148,0.8)]" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Prominent Luxury Institution Showcase Card */}
        <div className="lg:col-span-5">
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]/90 p-5 sm:p-6 backdrop-blur-md shadow-md transition-all duration-300 hover:border-[#00FF94]/50 hover:shadow-[0_0_35px_rgba(0,255,148,0.16)] hover:-translate-y-0.5">
            {/* Ambient background glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#00FF94]/6 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            {/* Watermark index number */}
            <span className="pointer-events-none absolute right-4 top-2 font-display text-5xl sm:text-6xl font-black text-[var(--ghost-dim)] opacity-40 select-none transition-opacity duration-300 group-hover:opacity-80">
              0{index + 1}
            </span>

            <div>
              {/* Institutional Tier / Accreditation Header */}
              <div className="mb-3.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">
                  <Building2 size={12} className="text-[var(--accent)]" />
                  Affiliated Institution
                </span>
                {item.location && (
                  <span className="rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--accent)]">
                    {item.location}
                  </span>
                )}
              </div>

              {/* Large, Beautiful Logo Showcase Stage */}
              {item.logo && (
                <div className="relative flex h-32 sm:h-36 w-full items-center justify-center rounded-xl border border-black/10 bg-[#090d12] px-6 py-5 shadow-inner transition-transform duration-300 group-hover:scale-[1.01] group-hover:border-[#00FF94]/40 dark:border-white/10">
                  <img
                    src={item.logo}
                    alt={item.logoAlt || item.institution}
                    className="max-h-20 sm:max-h-24 w-auto max-w-[240px] object-contain drop-shadow-sm filter transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Key Competencies & Focus tags */}
              {item.skills && item.skills.length > 0 && (
                <div className="mt-4">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--text-3)]">
                    Key Competencies & Focus
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-[var(--border)] bg-[var(--panel-2)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--text-2)] transition-colors hover:border-[#00FF94]/40 hover:text-[var(--accent)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Official Portal Link with Interactive Live Hover Preview */}
            {item.url && (
              <div className="relative mt-5 border-t border-[var(--border)]/70 pt-3.5 flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[11px] text-[var(--text-3)] max-w-[190px]">
                  {item.verifiedDomain || item.url.replace(/^https?:\/\/(www\.)?/, "")}
                </span>

                <div
                  className="relative"
                  onMouseEnter={() => setShowPreview(true)}
                  onMouseLeave={() => setShowPreview(false)}
                  onFocus={() => setShowPreview(true)}
                  onBlur={() => setShowPreview(false)}
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit official portal of ${item.institution}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition-all duration-300 hover:border-[#00FF94] hover:bg-[#00FF94]/10 hover:text-[var(--accent)]"
                  >
                    <span>Portal</span>
                    <ExternalLink size={12} aria-hidden />
                  </a>

                  <AnimatePresence>
                    {showPreview && item.urlPreview && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        role="tooltip"
                        className="pointer-events-none absolute bottom-full right-0 mb-2.5 z-30 w-72 rounded-xl border border-[#00FF94]/30 bg-[#0b0f15]/95 p-3.5 shadow-2xl backdrop-blur-xl ring-1 ring-black/60"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#00FF94]">
                            <ShieldCheck size={13} className="text-[#00FF94]" aria-hidden />
                            Verified Destination
                          </span>
                          <span className="font-mono text-[10px] text-[var(--text-3)]">
                            {item.verifiedDomain || "Official"}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-[var(--text-2)] font-sans">
                          {item.urlPreview}
                        </p>
                        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-3)]">
                          <Globe size={11} className="text-[var(--accent)]" aria-hidden />
                          <span className="truncate">{item.url}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const JourneySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="journey" className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(03)</span>
        <RevealText className="kicker">Journey</RevealText>
      </div>

      <div ref={ref} className="relative pl-8 md:pl-16">
        {/* track + animated fill */}
        <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[var(--border)] md:left-4">
          <motion.div
            style={{ scaleY: lineProgress, transformOrigin: "top" }}
            className="h-full w-full bg-[#00FF94] shadow-[0_0_12px_rgba(0,255,148,0.6)]"
          />
        </div>

        <div className="space-y-16 md:space-y-24">
          {journey.map((item, i) => (
            <JourneyEntry key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(JourneySection);
