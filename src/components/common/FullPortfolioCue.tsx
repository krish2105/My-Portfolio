import { useViewMode } from "../../lib/viewMode";

/**
 * The recruiter page is deliberately short. This cue (shown only there) makes the full portfolio discoverable instead of
 * a hidden toggle: the Technical and Business views show every project, the About story, GitHub activity, the labs
 * and the résumé tools.
 */
const FullPortfolioCue = () => {
  const { mode, setMode } = useViewMode();
  if (mode !== "recruiter") return null;

  const btn =
    "rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[#00FF94] hover:text-[var(--accent)]";

  return (
    <div className="mx-6 mt-12 flex flex-col gap-4 rounded-2xl border border-dashed border-[var(--border-strong)] p-6 md:mx-[8vw] md:flex-row md:items-center md:justify-between">
      <p className="max-w-xl text-sm leading-relaxed text-[var(--text-2)]">
        This is the short recruiter view. Want the engineering depth — every project, the architecture, GitHub activity, the live labs and the résumé tools?
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={btn} onClick={() => setMode("technical")}>
          Technical view →
        </button>
        <button type="button" className={btn} onClick={() => setMode("business")}>
          Business view →
        </button>
      </div>
    </div>
  );
};

export default FullPortfolioCue;
