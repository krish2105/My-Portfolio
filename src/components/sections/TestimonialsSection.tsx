import { testimonials } from "../../data/portfolio";
import { RevealText, Rise } from "../common/Reveal";
import SafeExternalLink from "../common/SafeExternalLink";

/**
 * Third-party proof — real recommendations only. Renders nothing until
 * `testimonials` in `src/data/portfolio.ts` has real entries (honesty gate,
 * same pattern as GitHubActivity/RecognitionSection).
 */
const TestimonialsSection = () => {
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40"
    >
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(07)</span>
        <RevealText className="kicker">Testimonials</RevealText>
      </div>

      <Rise>
        <h2 className="mb-16 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-[var(--text)] md:text-6xl">
          What people <span className="text-gradient">say</span>
        </h2>
      </Rise>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {testimonials.map((t, i) => (
          <Rise key={t.id} delay={i * 0.08}>
            <figure className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-7 md:p-8">
              <blockquote className="flex-1 text-sm leading-relaxed text-[var(--text-2)]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6">
                {t.sourceUrl ? (
                  <SafeExternalLink href={t.sourceUrl} className="font-display text-base font-bold text-[var(--text)] hover:text-[var(--accent)]">
                    {t.author}
                  </SafeExternalLink>
                ) : (
                  <span className="font-display text-base font-bold text-[var(--text)]">{t.author}</span>
                )}
                <p className="mt-0.5 text-xs text-[var(--text-3)]">{t.role}</p>
              </figcaption>
            </figure>
          </Rise>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
