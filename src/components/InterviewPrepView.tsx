import { projects } from "../data/portfolio";
import { buildStarBullets } from "../lib/interviewPrep";
import { buildInterviewQuestions } from "../lib/interviewQuestions";

const FLAGSHIP_IDS = ["fincopilot", "sakan-ai", "compliance-agent", "autovaluate"];

/**
 * Unlisted personal-use view — reachable at `?mode=interview`, same pattern
 * as `/uses` (no auth, not linked from nav, just not indexed/advertised).
 * Collapses the site's real flagship data into a dense STAR-format prep
 * sheet Krishna can skim on his phone before a call. Renders standalone
 * (skips the hero/R3F/Preloader entirely) so it loads instantly.
 */
const InterviewPrepView = () => {
  const flagships = projects.filter((p) => FLAGSHIP_IDS.includes(p.id));

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-[var(--bg)] px-6 py-10 text-[var(--text)] md:px-10 md:py-16">
      <p className="kicker text-[var(--accent)]">Interview prep — personal use, not indexed</p>
      <h1 className="mt-3 font-display text-3xl font-black tracking-tight md:text-4xl">
        Flagship talking points
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-2)]">
        Every line below is pulled directly from the live site's own data — nothing written fresh for this page.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {flagships.map((p) => {
          const star = buildStarBullets(p);
          const questions = buildInterviewQuestions(p);
          return (
            <section key={p.id} className="rounded-2xl border border-[var(--border-strong)] bg-[var(--panel)] p-6 md:p-7">
              <h2 className="font-display text-xl font-black text-[var(--text)] md:text-2xl">{p.shortTitle}</h2>
              <p className="mt-1 text-xs text-[var(--text-3)]">{p.category}</p>

              <dl className="mt-5 space-y-3">
                {(
                  [
                    ["Situation", star.situation],
                    ["Task", star.task],
                    ["Action", star.action],
                    ["Result", star.result],
                  ] as const
                ).map(([label, text]) => (
                  <div key={label}>
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">{label}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-[var(--text-2)]">{text}</dd>
                  </div>
                ))}
              </dl>

              {p.metrics && p.metrics.length > 0 && (
                <p className="mt-4 font-mono text-xs text-[var(--text-3)]">
                  {p.metrics.map((m) => `${m.label}: ${m.value}`).join(" · ")}
                </p>
              )}

              {questions.length > 0 && (
                <div className="mt-5 border-t border-[var(--border)] pt-4">
                  <p className="kicker mb-2">Likely questions</p>
                  <ol className="list-decimal space-y-1.5 pl-4">
                    {questions.map((q, i) => (
                      <li key={i} className="text-sm leading-relaxed text-[var(--text-2)]">
                        {q}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <a href="/" className="mt-10 inline-block text-sm font-medium text-[var(--accent)] hover:underline">
        ← Back to the live site
      </a>
    </main>
  );
};

export default InterviewPrepView;
