import { memo, useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Download, ExternalLink, Copy, Check, Eye, EyeOff, ClipboardList } from "lucide-react";
import { track } from "@vercel/analytics";
import { capabilities, projects, socialLinks } from "../../data/portfolio";
import { buildHiringSummary } from "../../lib/hiringSummary";
import { matchJobDescription, type JDMatchResult } from "../../lib/jdMatcher";
import { Rise } from "../common/Reveal";
import SectionHeader from "../common/SectionHeader";

import { type TargetRoleId, ROLE_CONFIGS } from "../../lib/resumeRoles";
import { useNearViewport } from "../../hooks/useNearViewport";
import { buildResumePdf } from "../../lib/resumePdfClient";

/* ── Download CTA card ────────────────────────────────────────────── */
const DownloadCard = ({
  targetRole,
  onRoleChange,
}: {
  targetRole: TargetRoleId;
  onRoleChange: (r: TargetRoleId) => void;
}) => {
  const hasResume = !!socialLinks.resume;
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [dynamicPdfUrl, setDynamicPdfUrl] = useState<string | null>(null);
  const [compiledRole, setCompiledRole] = useState<TargetRoleId | null>(null);
  const generating = compiledRole !== targetRole;
  // pdf-lib (~410 KiB) and the synthesis itself only matter once a visitor actually reaches this card,
  // so both are deferred until it is near the viewport — and run in a Web Worker, off the main thread.
  const cardRef = useRef<HTMLDivElement>(null);
  const nearViewport = useNearViewport(cardRef);

  useEffect(() => {
    if (!nearViewport) return;
    let mounted = true;
    buildResumePdf(targetRole)
      .then((pdfBytes) => {
        if (!mounted) return;
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setDynamicPdfUrl(url);
        setCompiledRole(targetRole);
      })
      .catch((err) => {
        console.error("Failed to synthesize dynamic PDF", err);
      });

    return () => {
      mounted = false;
    };
  }, [targetRole, nearViewport]);

  const activePdfUrl = dynamicPdfUrl || socialLinks.resume;
  const canPreview = hasResume || !!dynamicPdfUrl;
  const previewUrl = activePdfUrl ? `${activePdfUrl}#view=FitH` : "";
  const roleConfig = ROLE_CONFIGS[targetRole];

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
      <div ref={cardRef} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--panel)]/60 p-8 backdrop-blur-sm md:p-10">
        {/* Glow background */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#00FF94]/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-[#00FF94]/5 blur-2xl" />

        <div className="relative">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00FF94]/20 bg-[#00FF94]/8 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#00FF94]" />
              <span className="text-xs font-medium text-[var(--accent)]">
                Open to opportunities
              </span>
            </div>
            <span className="rounded-full border border-white/[0.08] bg-[var(--panel-2)] px-3 py-1 font-mono text-[11px] text-[var(--text-3)]">
              PDF Synthesizer Active
            </span>
          </div>

          <h3 className="font-display text-2xl font-black tracking-tight text-[var(--text)] md:text-3xl">
            Interactive Role-Tailored Resume
          </h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-2)] md:text-base">
            Select your hiring profile to dynamically recompile the 1-page PDF in real-time,
            re-ordering project telemetry and engineering competencies for your target domain:
          </p>

          {/* Role selector */}
          <div className="mt-6 rounded-xl border border-white/[0.08] bg-[var(--panel-2)]/80 p-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
              Select Primary Target Role:
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Target Role">
              {(["ai-engineer", "mlops-engineer", "data-analytics"] as const).map((rId) => {
                const conf = ROLE_CONFIGS[rId];
                const active = targetRole === rId;
                return (
                  <button
                    key={rId}
                    type="button"
                    onClick={() => {
                      onRoleChange(rId);
                      track("resume_role_switched", { role: rId });
                    }}
                    aria-pressed={active}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "border-[#00FF94] bg-[#00FF94]/15 text-[var(--accent)] shadow-[0_0_14px_rgba(0,255,148,0.2)]"
                        : "border-white/[0.08] text-[var(--text-3)] hover:border-white/[0.2] hover:text-[var(--text)]"
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-2)]">
              <span className="font-semibold text-[var(--accent)]">Tailored focus: </span>
              {roleConfig.summary}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {activePdfUrl ? (
              <a
                href={activePdfUrl}
                download={`Krishna_Mathur_Resume_${targetRole}.pdf`}
                data-cursor="Download"
                className="group inline-flex items-center gap-3 rounded-full bg-[#00FF94] px-7 py-4 font-bold tracking-wide text-[#050505] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(0,255,148,0.5)]"
              >
                <Download
                  size={18}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
                DOWNLOAD RESUME ({roleConfig.shortLabel.toUpperCase()})
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-3 rounded-full border border-dashed border-[#7e8c9a]/40 px-7 py-4 text-sm font-medium text-[var(--text-3)]">
                <Download size={18} />
                Synthesizing PDF…
              </span>
            )}
            {canPreview && (
              <button
                type="button"
                onClick={() => {
                  const next = !previewOpen;
                  setPreviewOpen(next);
                  if (next) track("resume_preview_opened", { role: targetRole });
                }}
                data-cursor={previewOpen ? "Close" : "Preview"}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-4 text-sm font-bold text-[var(--text-2)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                {previewOpen ? <EyeOff size={16} /> : <Eye size={16} />}
                {previewOpen ? "Hide preview" : "Preview tailored PDF"}
              </button>
            )}
            <a
              href="/ai-systems-sheet.pdf"
              download="Krishna-Mathur-AI-Systems-Sheet.pdf"
              data-cursor="Download"
              onClick={() => track("ai_systems_sheet_downloaded")}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-4 text-sm font-bold text-[var(--text-2)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)]"
            >
              <Download size={16} />
              AI Systems Sheet (1-page)
            </a>
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="View"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-4 text-sm font-bold text-[var(--text-2)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                <ExternalLink size={16} />
                LinkedIn
              </a>
            )}
            <button
              type="button"
              onClick={copySummary}
              data-cursor="Copy"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-4 text-sm font-bold text-[var(--text-2)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--text)]"
            >
              {copied ? <Check size={16} className="text-[var(--accent)]" /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy hiring summary"}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? "Hiring summary copied to clipboard" : ""}
            </span>
          </div>

          {canPreview && previewOpen && (
            <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel-2)]">
              {generating ? (
                <div className="flex h-48 items-center justify-center font-mono text-sm text-[var(--accent)]">
                  Synthesizing tailored PDF in browser…
                </div>
              ) : (
                <iframe
                  key={targetRole}
                  src={previewUrl}
                  title={`Résumé preview (${roleConfig.label})`}
                  loading="lazy"
                  className="h-[75vh] w-full"
                  allow="autoplay"
                />
              )}
              <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2">
                <span className="text-xs text-[var(--text-3)]">
                  Live compiled in-browser with pdf-lib
                </span>
                <a
                  href={activePdfUrl || socialLinks.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  Open in new tab →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Rise>
  );
};

/** Paste-a-job-description matcher: a deterministic keyword-overlap score
 * against real capabilities data (see lib/jdMatcher.ts) — same "no
 * fabrication" approach as the Copilot's bestProjectForRole command,
 * exposed here too since not every visitor thinks to try the Copilot. */
const JDMatcherCard = () => {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<JDMatchResult | null>(null);

  const check = () => {
    if (!jd.trim()) return;
    const r = matchJobDescription(jd, capabilities, projects);
    setResult(r);
    track("jd_matcher_run", { score: r.score });
  };

  return (
    <Rise delay={0.08}>
      <div className="rounded-xl border border-white/[0.06] bg-[var(--panel)]/60 p-6 backdrop-blur-sm md:p-7">
        <div className="mb-3 flex items-center gap-3">
          <ClipboardList size={18} className="text-[var(--accent)]" />
          <h3 className="kicker">Paste a job description</h3>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-[var(--text-2)]">
          A quick, honest skill-overlap check — not a guarantee. Paste a JD and see which real skills match and the
          strongest project to point to.
        </p>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={4}
          placeholder="Paste a job description here…"
          className="w-full resize-none rounded-lg border border-white/[0.08] bg-[var(--panel-2)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] focus:border-[#00FF94]/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={check}
          disabled={!jd.trim()}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#00FF94] px-5 py-2.5 text-sm font-bold text-[#050505] transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          Check match
        </button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-black text-[var(--accent)]">{result.score}% overlap</span>
              <span className="text-xs text-[var(--text-3)]">
                {result.matchedSkills.length}/{result.totalSkillsChecked} skills mentioned
              </span>
            </div>
            {result.matchedSkills.length > 0 && (
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-3)]">
                Matched: {result.matchedSkills.slice(0, 10).join(", ")}
                {result.matchedSkills.length > 10 ? "…" : ""}
              </p>
            )}
            {result.bestProject && (
              <p className="mt-2 text-sm text-[var(--text-2)]">
                Strongest project to point to: <span className="font-semibold text-[var(--text)]">{result.bestProject.shortTitle}</span>
              </p>
            )}
          </motion.div>
        )}
      </div>
    </Rise>
  );
};

/* ── Main section ─────────────────────────────────────────────────── */
/**
 * Résumé tools — the things only this site can do: a PDF tailored to the role being hired for (with preview), a
 * paste-a-job-description matcher, and a one-click hiring summary. The experience timeline and skills snapshot that used
 * to sit here now live once, in their own sections.
 */
const ResumeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const [targetRole, setTargetRole] = useState<TargetRoleId>("ai-engineer");

  return (
    <section
      ref={sectionRef}
      id="resume"
      className="relative overflow-hidden border-t border-[var(--border)] px-6 py-20 md:px-[8vw] md:py-28"
    >
      {/* ── Background glow ── */}
      <motion.div
        style={{ y: glowY }}
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[50vh] w-[50vh] -translate-y-1/2 translate-x-1/4"
      >
        <div className="h-full w-full rounded-full bg-radial-glow opacity-40 blur-2xl" />
      </motion.div>

      {/* ── Header ── */}
      <SectionHeader id="resume" label="Résumé tools" className="mb-16" />

      <Rise>
        <h2 className="max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-tighter text-[var(--text)] md:text-7xl">
          <span>RÉSUMÉ</span> <span className="text-gradient">TOOLS</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-2)] md:text-lg">
          Download the PDF tailored to the role you are hiring for, or paste a job description to see how the skills line up.
        </p>
      </Rise>

      <div className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-2 lg:gap-12">
        <DownloadCard targetRole={targetRole} onRoleChange={setTargetRole} />
        <JDMatcherCard />
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
