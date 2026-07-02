import { GraduationCap, Briefcase } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import type { Testimonial, TestimonialType, TrustPlaceholder } from "../../../types/portfolio";
import { Rise } from "../../common/Reveal";
import SafeExternalLink from "../../common/SafeExternalLink";

const ICON_BY_TYPE: Record<TestimonialType, typeof FaLinkedinIn> = {
  linkedin: FaLinkedinIn,
  faculty: GraduationCap,
  internship: Briefcase,
};

const RealCard = ({ t }: { t: Testimonial }) => {
  const Icon = ICON_BY_TYPE[t.type];
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-7 md:p-8">
      <span className="mb-4 grid h-9 w-9 place-items-center rounded-full border border-[#00FF94]/30 bg-[#00FF94]/10">
        <Icon size={16} className="text-[var(--accent)]" aria-hidden />
      </span>
      <blockquote className="flex-1 text-sm leading-relaxed text-[var(--text-2)]">“{t.quote}”</blockquote>
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
  );
};

const PlaceholderCard = ({ placeholder }: { placeholder: TrustPlaceholder }) => {
  const Icon = placeholder.category === "writing" ? FaLinkedinIn : ICON_BY_TYPE[placeholder.category as TestimonialType];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--panel)]/40 p-7 md:p-8">
      <span className="mb-4 grid h-9 w-9 place-items-center rounded-full border border-[var(--border-strong)] text-[var(--text-3)]">
        <Icon size={16} aria-hidden />
      </span>
      <p className="kicker mb-2">{placeholder.label}</p>
      <p className="flex-1 text-sm leading-relaxed text-[var(--text-3)]">{placeholder.emptyStateCopy}</p>
      <SafeExternalLink
        href={placeholder.ctaHref}
        className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--text-2)] transition-colors hover:border-[#00FF94]/40 hover:text-[var(--accent)]"
      >
        {placeholder.ctaLabel} →
      </SafeExternalLink>
    </div>
  );
};

/**
 * One card per testimonial category (LinkedIn / Faculty / Internship). Real
 * content renders when `testimonials` has an entry of that type; otherwise
 * an honest, labelled placeholder with a request CTA — never fabricated copy.
 */
const TrustCards = ({
  testimonials,
  placeholders,
}: {
  testimonials: Testimonial[];
  placeholders: TrustPlaceholder[];
}) => {
  const categories: TestimonialType[] = ["linkedin", "faculty", "internship"];

  const cards = categories.flatMap((cat) => {
    const real = testimonials.filter((t) => t.type === cat && t.status === "verified");
    if (real.length > 0) return real.map((t) => ({ key: t.id, node: <RealCard t={t} /> }));
    const placeholder = placeholders.find((p) => p.category === cat);
    return placeholder ? [{ key: cat, node: <PlaceholderCard placeholder={placeholder} /> }] : [];
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
      {cards.map((c, i) => (
        <Rise key={c.key} delay={i * 0.08}>
          {c.node}
        </Rise>
      ))}
    </div>
  );
};

export default TrustCards;
