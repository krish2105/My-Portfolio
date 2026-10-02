import { Briefcase, GraduationCap } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import type { Testimonial, TestimonialType } from "../../../types/portfolio";
import { Rise } from "../../common/Reveal";
import SafeExternalLink from "../../common/SafeExternalLink";

const ICON_BY_TYPE: Record<TestimonialType, typeof FaLinkedinIn> = {
  linkedin: FaLinkedinIn,
  faculty: GraduationCap,
  internship: Briefcase,
};

/** Verified, permissioned recommendations only (the caller has already filtered). */
const RecommendationCards = ({ items }: { items: Testimonial[] }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
    {items.map((t, i) => {
      const Icon = ICON_BY_TYPE[t.type];
      return (
        <Rise key={t.id} delay={i * 0.08}>
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
        </Rise>
      );
    })}
  </div>
);

export default RecommendationCards;
