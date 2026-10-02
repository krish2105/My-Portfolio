import { ArrowRight } from "lucide-react";
import type { Project } from "../../types/portfolio";
import LiveStatusBadge from "../projects/LiveStatusBadge";
import { Rise } from "../common/Reveal";
import SafeExternalLink from "../common/SafeExternalLink";

interface FlagshipStripProps {
  projects: Project[];
  onOpen: (p: Project) => void;
}

const isFlagship = (p: Project) => p.status === "Independent Project";

/**
 * The recruiter's proof strip: the independent, live systems — each leading with ONE real outcome number from its own
 * `metrics`, a live-demo link (with a reachability badge), a case-study button, and a code link only where the repo is
 * public. Everything else sits in a compact "Also built" list that opens the same case-study modal. A project without
 * metrics simply shows no number — nothing is ever invented.
 */
const FlagshipStrip = ({ projects, onOpen }: FlagshipStripProps) => {
  const flagships = projects.filter(isFlagship);
  const others = projects.filter((p) => !isFlagship(p));

  return (
    <div className="px-6 md:px-[8vw]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
        {flagships.map((p, i) => {
          const metric = p.metrics?.[0];
          return (
            <Rise key={p.id} delay={i * 0.07}>
              <article className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 transition-colors duration-300 hover:border-[#00FF94]/30 md:p-7">
                <p className="kicker">{p.category.split("·")[0].trim()}</p>
                <h3 className="mt-3 font-display text-2xl font-black tracking-tight text-[var(--text)]">{p.shortTitle}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-2)]">{p.valueProp ?? p.description}</p>

                {metric && (
                  <div data-testid="proof-metric" className="mt-5 border-t border-[var(--border)] pt-4">
                    <p className="font-display text-3xl font-black leading-none tracking-tight text-[var(--accent)]">{metric.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-[var(--text-3)]">{metric.label}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  {p.liveUrl && (
                    <SafeExternalLink
                      href={p.liveUrl}
                      aria-label={`${p.shortTitle} live demo`}
                      className="font-semibold text-[var(--text)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
                    >
                      Live demo ↗
                    </SafeExternalLink>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpen(p)}
                    className="inline-flex items-center gap-1 font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
                  >
                    Case study <ArrowRight size={14} aria-hidden />
                  </button>
                  {p.repositoryUrl && (
                    <SafeExternalLink
                      href={p.repositoryUrl}
                      aria-label={`${p.shortTitle} source code on GitHub`}
                      className="text-[var(--text-2)] underline-offset-4 transition-colors hover:text-[var(--text)] hover:underline"
                    >
                      Code ↗
                    </SafeExternalLink>
                  )}
                </div>
                {p.liveUrl && (
                  <div className="mt-4">
                    <LiveStatusBadge url={p.liveUrl} />
                  </div>
                )}
              </article>
            </Rise>
          );
        })}
      </div>

      {others.length > 0 && (
        <div className="mt-12">
          <h3 className="kicker mb-4">Also built</h3>
          <ul aria-label="Also built" className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {others.map((p) => {
              const m = p.metrics?.[0];
              return (
                <li key={p.id} className="border-b border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => onOpen(p)}
                    className="flex w-full flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 text-left transition-colors hover:text-[var(--accent)]"
                  >
                    <span className="font-semibold text-[var(--text)]">{p.shortTitle}</span>
                    <span className="text-xs text-[var(--text-3)]">
                      {p.status.replace(" Project", "")}
                      {m ? ` · ${m.label}: ${m.value}` : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FlagshipStrip;
