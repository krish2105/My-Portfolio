import { ArrowUpRight } from "lucide-react";
import { writing } from "../../data/portfolio";
import { RevealText, Rise } from "../common/Reveal";
import SafeExternalLink from "../common/SafeExternalLink";

/**
 * "Thinking in public" — real published posts only. Renders nothing until
 * `writing` in `src/data/portfolio.ts` has real entries (honesty gate, same
 * pattern as GitHubActivity/RecognitionSection).
 */
const WritingSection = () => {
  if (writing.length === 0) return null;

  return (
    <section id="writing" className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(03B)</span>
        <RevealText className="kicker">Writing</RevealText>
      </div>

      <Rise>
        <h2 className="mb-16 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-[var(--text)] md:text-6xl">
          Thinking <span className="text-gradient">in public</span>
        </h2>
      </Rise>

      <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
        {writing.map((w, i) => (
          <Rise key={w.id} delay={i * 0.06}>
            <SafeExternalLink
              href={w.url}
              className="group flex flex-col gap-2 py-6 transition-colors hover:text-[var(--accent)] md:flex-row md:items-center md:justify-between md:gap-6"
            >
              <div>
                <p className="font-mono text-xs text-[var(--text-3)]">{w.date}</p>
                <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent)] md:text-2xl">
                  {w.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-[var(--text-2)]">{w.blurb}</p>
              </div>
              <ArrowUpRight
                size={20}
                aria-hidden
                className="shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </SafeExternalLink>
          </Rise>
        ))}
      </div>
    </section>
  );
};

export default WritingSection;
