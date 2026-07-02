import { testimonials, writing, trustPlaceholders } from "../../../data/portfolio";
import { RevealText, Rise } from "../../common/Reveal";
import TrustCards from "./TrustCards";
import WritingCards from "./WritingCards";

/**
 * Honest, two-mode credibility layer: LinkedIn / faculty / internship
 * feedback and published writing. Every slot renders real content when it
 * exists, and an explicitly-labelled "pending/planned" placeholder with a
 * request CTA when it doesn't — nothing here is ever fabricated. Unlike the
 * old TestimonialsSection/WritingSection (which hid entirely when empty),
 * this section always renders — the honest emptiness IS the content.
 */
const TrustAndThinkingSection = () => {
  const writingPlaceholder = trustPlaceholders.find((p) => p.category === "writing");

  return (
    <section id="trust" className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(06B)</span>
        <RevealText className="kicker">Trust &amp; Thinking</RevealText>
      </div>

      <Rise>
        <h2 className="max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-[var(--text)] md:text-6xl">
          Verified <span className="text-gradient">feedback</span>, not marketing copy
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-2)] md:text-lg">
          These slots fill with real, verified feedback only — no invented quotes, clients or metrics. What isn't
          here yet is labelled honestly, with a way to request it.
        </p>
      </Rise>

      <div className="mt-16">
        <p className="kicker mb-6">Recommendations &amp; feedback</p>
        <TrustCards testimonials={testimonials} placeholders={trustPlaceholders} />
      </div>

      <div className="mt-16">
        <p className="kicker mb-2">Writing &amp; insights</p>
        <WritingCards writing={writing} placeholder={writingPlaceholder} />
      </div>
    </section>
  );
};

export default TrustAndThinkingSection;
