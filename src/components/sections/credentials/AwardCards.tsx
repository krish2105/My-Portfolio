import type { RecognitionItem } from "../../../types/portfolio";
import { Rise } from "../../common/Reveal";

/** Awards & honours — one card each. Content comes straight from `recognition`. */
const AwardCards = ({ items }: { items: RecognitionItem[] }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
    {items.map((item, i) => (
      <Rise key={item.id} delay={i * 0.08}>
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-7 transition-colors duration-500 hover:border-[#00FF94]/30 md:p-8">
          <div className="relative flex items-center justify-between">
            <span aria-hidden className="font-display text-3xl font-black text-[var(--accent)] md:text-4xl">
              ★
            </span>
            <span className="font-mono text-xs text-[var(--text-3)]">{item.year}</span>
          </div>
          <h3 className="relative mt-6 font-display text-xl font-black leading-tight tracking-tight text-[var(--text)] md:text-2xl">{item.title}</h3>
          <p className="relative mt-3 text-sm leading-relaxed text-[var(--text-2)]">{item.context}</p>
        </article>
      </Rise>
    ))}
  </div>
);

export default AwardCards;
