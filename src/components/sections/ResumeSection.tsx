import { memo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Download, ExternalLink, GraduationCap, Briefcase, Award, Code2, Copy, Check, Eye, EyeOff } from "lucide-react";
import { track } from "@vercel/analytics";
import { journey, capabilities, recognition, socialLinks, projects, RESUME_DRIVE_FILE_ID } from "../../data/portfolio";
import { buildHiringSummary } from "../../lib/hiringSummary";
import { RevealText, Rise } from "../common/Reveal";
import { useViewMode, VIEW_MODES } from "../../lib/viewMode";

/* ── Compact timeline card ────────────────────────────────────────── */
const TimelineCard = ({
  title,
  subtitle,
  date,
  icon: Icon,
  index,
}: {
  title: string;
  subtitle: string;
  date: string;
  icon: typeof Briefcase;
  index: number;
}) => (
  <Rise delay={index * 0.06}>
    <div className="group relative flex gap-5 rounded-xl border border-white/[0.06] bg-[var(--panel)]/60 p-5 backdrop-blur-sm transition-all duration-500 hover:border-[#00FF94]/25 hover:bg-[var(--panel)] md:p-6">
      {/* Icon */}
      <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-[var(--panel-2)] text-[var(--accent)] transition-all duration-300 group-hover:border-[#00FF94]/30 group-hover:shadow-[0_0_16px_rgba(0,255,148,0.15)]">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <span className="mb-1 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[var(--accent)]/70">
          {date}
        </span>
        <h4 className="font-display text-base font-bold leading-tight tracking-tight text-[var(--text)] md:text-lg">
          {title}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-3)]">{subtitle}</p>
      </div>
    </div>
  </Rise>
);

/* ── Skill chip ───────────────────────────────────────────────────── */
const SkillChip = ({ name, isCore }: { name: string; isCore: boolean }) => (
  <span
    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
      isCore
        ? "border-[#00FF94]/30 bg-[#00FF94]/8 text-[var(--accent)]"
        : "border-white/[0.06] text-[var(--text-3)] hover:border-white/[0.12]"
    }`}
  >
    {name}
  </span>
);

/* ── Download CTA card ────────────────────────────────────────────── */
const DownloadCard = () => {
  const hasResume = !!socialLinks.resume;
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const canPreview =
    hasResume && !!RESUME_DRIVE_FILE_ID && RESUME_DRIVE_FILE_ID !== "REPLACE_WITH_YOUR_DRIVE_FILE_ID";
  const previewUrl = `https://drive.google.com/file/d/${RESUME_DRIVE_FILE_ID}/preview`;

  const copySummary = async () => {
    const summary = buildHiringSummary();
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fall back to a
      // manual-select textarea so the content is still reachable.
      const ta = document.createElement("textarea");
      ta.value = summary;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    track("hiring_summary_copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <Rise delay={0.1}>
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--panel)]/60 p-8 backdrop-blur-sm md:p-10">
        {/* Glow background */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#00FF94]/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-[#00FF94]/5 blur-2xl" />

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00FF94]/20 bg-[#00FF94]/8 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF94]" />
            <span className="text-xs font-medium text-[var(--accent)]">
              Open to opportunities
            </span>
          </div>

          <h3 className="font-display text-2xl font-black tracking-tight text-[var(--text)] md:text-3xl">
            The one-page version
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-2)] md:text-base">
            Education, experience, projects and technical skills — ready for
            download, or copy a hiring summary straight to your clipboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {hasResume ? (
              <a
                href={socialLinks.resume}
                download="Krishna-Mathur-Resume.pdf"
                data-cursor="Download"
                className="group inline-flex items-center gap-3 rounded-full bg-[#00FF94] px-7 py-4 font-bold tracking-wide text-[#050505] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,255,148,0.5)]"
              >
                <Download
                  size={18}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
                DOWNLOAD RESUME
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-3 rounded-full border border-dashed border-[#7e8c9a]/40 px-7 py-4 text-sm font-medium text-[var(--text-3)]">
                <Download size={18} />
                Resume link coming soon
              </span>
            )}
            {canPreview && (
              <button
                type="button"
                onClick={() => {
                  const next = !previewOpen;
                  setPreviewOpen(next);
                  if (next) track("resume_preview_opened");
                }}
                data-cursor={previewOpen ? "Close" : "Preview"}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-5 py-4 text-sm font-bold text-[var(--text-2)] transition-all duration-300 hover:border-[#00FF94]/40 hover:text-[var(--text)]"
              >
                {previewOpen ? <EyeOff size={16} /> : <Eye size={16} />}
                {previewOpen ? "Hide preview" : "Preview resume"}
              </button>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="View"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-5 py-4 text-sm font-bold text-[var(--text-2)] transition-all duration-300 hover:border-[#00FF94]/40 hover:text-[var(--text)]"
              >
                <ExternalLink size={16} />
                LinkedIn
              </a>
            )}
            <button
              type="button"
              onClick={copySummary}
              data-cursor="Copy"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-5 py-4 text-sm font-bold text-[var(--text-2)] transition-all duration-300 hover:border-[#00FF94]/40 hover:text-[var(--text)]"
            >
              {copied ? <Check size={16} className="text-[var(--accent)]" /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy hiring summary"}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Hiring summary copied to clipboard" : ""}
            </span>
          </div>

          {canPreview && previewOpen && (
            <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
              <iframe
                src={previewUrl}
                title="Résumé preview"
                loading="lazy"
                className="h-[70vh] w-full"
                allow="autoplay"
              />
              <div className="flex items-center justify-between border-t border-white/[0.08] px-4 py-2">
                <span className="text-xs text-[var(--text-3)]">
                  Blocked by your browser?
                </span>
                <a
                  href={socialLinks.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  Open full PDF →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Rise>
  );
};

/** One flagship project, summarised differently per audience — same underlying
 * real data (`valueProp`/`technologies`/`impact`), just a different lens. */
const FlagshipRow = ({ project, mode }: { project: (typeof projects)[number]; mode: "recruiter" | "technical" | "business" }) => {
  const detail =
    mode === "technical"
      ? project.technologies.slice(0, 5).join(" · ")
      : mode === "business"
        ? project.impact?.[0] ?? project.description
        : project.valueProp ?? project.description;
  return (
    <li className="flex flex-col gap-0.5 py-2.5">
      <span className="text-sm font-semibold text-[var(--text)]">{project.shortTitle}</span>
      <span className="text-xs leading-relaxed text-[var(--text-3)]">{detail}</span>
    </li>
  );
};

/* ── Main section ─────────────────────────────────────────────────── */
const ResumeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const { mode, setMode } = useViewMode();
  const [expanded, setExpanded] = useState(false);

  const allSkills = capabilities.flatMap((g) => g.skills);
  const coreAll = allSkills.filter((s) => s.level === "Core");
  const workingAll = allSkills.filter((s) => s.level === "Working Knowledge");
  const restAll = allSkills.filter((s) => s.level !== "Core" && s.level !== "Working Knowledge");

  // Pick top 12 core skills for the resume snapshot, or all of them once expanded.
  const coreSkills = expanded ? coreAll : coreAll.slice(0, 12);
  const workingSkills = expanded ? workingAll : workingAll.slice(0, 8);
  const restSkills = expanded ? restAll : [];

  const flagshipProjects = projects.filter((p) => p.flagship);

  // Timeline entries — education & experience interleaved
  const timelineEntries = [
    {
      title: journey[1].title,           // Masters
      subtitle: journey[1].institution,
      date: journey[1].date,
      icon: GraduationCap,
    },
    {
      title: journey[2].title,           // ML Intern
      subtitle: journey[2].institution,
      date: journey[2].date,
      icon: Briefcase,
    },
    {
      title: journey[3].title,           // B.Tech
      subtitle: journey[3].institution,
      date: journey[3].date,
      icon: GraduationCap,
    },
    {
      title: recognition[0].title,       // Award
      subtitle: recognition[0].context.split(".")[0] + ".",
      date: recognition[0].year,
      icon: Award,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="resume"
      className="relative overflow-hidden border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40"
    >
      {/* ── Background glow ── */}
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[50vh] w-[50vh] -translate-y-1/2 translate-x-1/4"
      >
        <div className="h-full w-full rounded-full bg-radial-glow opacity-40 blur-2xl" />
      </motion.div>

      {/* ── Header ── */}
      <div className="mb-16 flex items-center gap-4">
        <span className="kicker">(07)</span>
        <RevealText className="kicker">Resume</RevealText>
      </div>

      <Rise>
        <h2 className="max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-tighter text-[var(--text)] md:text-7xl">
          <span>RESUME</span>{" "}
          <span className="text-outline-accent">&</span>{" "}
          <span className="text-gradient">EXPERIENCE</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-2)] md:text-lg">
          A snapshot of my academic background, professional experience, and the
          technical skills I bring to every project.
        </p>
      </Rise>

      {/* ── Two-column layout ── */}
      <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Left: Timeline */}
        <div>
          <Rise>
            <h3 className="kicker mb-6">Education & Experience</h3>
          </Rise>
          <div className="space-y-4">
            {timelineEntries.map((entry, i) => (
              <TimelineCard key={entry.title} {...entry} index={i} />
            ))}
          </div>
        </div>

        {/* Right: Skills snapshot + Download CTA */}
        <div className="flex flex-col gap-10">
          {/* Core skills */}
          <Rise delay={0.05}>
            <div className="rounded-xl border border-white/[0.06] bg-[var(--panel)]/60 p-6 backdrop-blur-sm md:p-7">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Code2 size={18} className="text-[var(--accent)]" />
                  <h3 className="kicker">Core competencies</h3>
                </div>
                <div className="flex gap-1.5" role="group" aria-label="Snapshot audience">
                  {VIEW_MODES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      aria-pressed={mode === m.id}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                        mode === m.id
                          ? "border-[#00FF94] bg-[#00FF94]/10 text-[var(--accent)]"
                          : "border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text)]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {coreSkills.map((s) => (
                  <SkillChip key={s.name} name={s.name} isCore />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {workingSkills.map((s) => (
                  <SkillChip key={s.name} name={s.name} isCore={false} />
                ))}
              </div>
              {expanded && restSkills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {restSkills.map((s) => (
                    <SkillChip key={s.name} name={s.name} isCore={false} />
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-4 text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                {expanded ? "Show fewer skills" : "Show all skills"}
              </button>

              <div className="mt-6 border-t border-white/[0.06] pt-5">
                <p className="kicker mb-1">Flagship projects — {VIEW_MODES.find((m) => m.id === mode)?.label} snapshot</p>
                <ul className="divide-y divide-white/[0.06]">
                  {flagshipProjects.map((p) => (
                    <FlagshipRow key={p.id} project={p} mode={mode} />
                  ))}
                </ul>
              </div>
            </div>
          </Rise>

          {/* Download CTA */}
          <DownloadCard />
        </div>
      </div>

      {/* ── Bottom accent ── */}
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

export default memo(ResumeSection);
