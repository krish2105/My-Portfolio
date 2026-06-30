import { now } from "../../data/portfolio";
import { RevealText, Rise } from "../common/Reveal";

const NowSection = () => (
  <section
    id="now"
    className="relative border-t border-[var(--border)] px-6 py-24 md:px-[8vw] md:py-32"
  >
    <div className="mb-12 flex items-center gap-4">
      <span className="kicker">/ Now</span>
      <RevealText className="kicker">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF94] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF94]" />
          </span>
          Currently
        </span>
      </RevealText>
    </div>

    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
      {now.map((item, i) => (
        <Rise key={item.id} delay={i * 0.06}>
          <div className="flex h-full flex-col gap-3 bg-[#070707] p-7 transition-colors hover:bg-[#0a0a0a] md:p-9">
            <dt className="kicker">{item.label}</dt>
            <dd className="text-lg leading-relaxed text-[#A0ADBA] md:text-xl">{item.value}</dd>
          </div>
        </Rise>
      ))}
    </dl>
  </section>
);

export default NowSection;
