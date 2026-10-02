import { ArrowUpRight } from "lucide-react";
import type { WritingItem } from "../../../types/portfolio";
import { Rise } from "../../common/Reveal";
import SafeExternalLink from "../../common/SafeExternalLink";

/** Published posts only (the caller has already filtered). */
const WritingList = ({ items }: { items: WritingItem[] }) => (
  <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
    {items.map((w, i) => (
      <Rise key={w.id} delay={i * 0.06}>
        <SafeExternalLink
          href={w.url}
          className="group flex flex-col gap-2 py-6 transition-colors hover:text-[var(--accent)] md:flex-row md:items-center md:justify-between md:gap-6"
        >
          <div>
            <p className="font-mono text-xs text-[var(--text-3)]">{w.date}</p>
            <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent)] md:text-2xl">{w.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-[var(--text-2)]">{w.blurb}</p>
          </div>
          <ArrowUpRight size={20} aria-hidden className="shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </SafeExternalLink>
      </Rise>
    ))}
  </div>
);

export default WritingList;
