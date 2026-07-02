import { ArrowUpRight, PenLine } from "lucide-react";
import type { WritingItem, TrustPlaceholder } from "../../../types/portfolio";
import { Rise } from "../../common/Reveal";
import SafeExternalLink from "../../common/SafeExternalLink";

const RealRow = ({ w }: { w: WritingItem }) => (
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
    <ArrowUpRight size={20} aria-hidden className="shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  </SafeExternalLink>
);

const PlaceholderRow = ({ placeholder }: { placeholder: TrustPlaceholder }) => (
  <div className="flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between md:gap-6">
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-dashed border-[var(--border-strong)] text-[var(--text-3)]">
        <PenLine size={14} aria-hidden />
      </span>
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-3)]">Planned</p>
        <p className="mt-1 max-w-2xl text-sm text-[var(--text-3)]">{placeholder.emptyStateCopy}</p>
      </div>
    </div>
    <SafeExternalLink
      href={placeholder.ctaHref}
      className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--text-2)] transition-colors hover:border-[#00FF94]/40 hover:text-[var(--accent)]"
    >
      {placeholder.ctaLabel} →
    </SafeExternalLink>
  </div>
);

/**
 * Published writing renders as a real row; while `writing` is empty, a
 * single honest "planned" row replaces the whole list — no fabricated post
 * titles or dates.
 */
const WritingCards = ({ writing, placeholder }: { writing: WritingItem[]; placeholder?: TrustPlaceholder }) => {
  const published = writing.filter((w) => w.status === "published");

  return (
    <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
      {published.length > 0
        ? published.map((w, i) => (
            <Rise key={w.id} delay={i * 0.06}>
              <RealRow w={w} />
            </Rise>
          ))
        : placeholder && (
            <Rise>
              <PlaceholderRow placeholder={placeholder} />
            </Rise>
          )}
    </div>
  );
};

export default WritingCards;
