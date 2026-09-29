import { memo } from "react";
import { recognition } from "../../data/portfolio";
import { RevealText, Rise } from "../common/Reveal";

const RecognitionSection = () => {
  return (
    <section
      id="recognition"
      className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40"
    >
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(06)</span>
        <RevealText className="kicker">Recognition</RevealText>
      </div>

      <Rise>
        <h2 className="mb-16 max-w-3xl font-display text-4xl font-black leading-[1.05] tracking-tight text-[var(--text)] md:text-6xl">
          Awards &amp; <span className="text-gradient">honours</span>
        </h2>
      </Rise>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {recognition.map((item, i) => (
          <Rise key={item.id} delay={i * 0.08}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-7 transition-all duration-500 hover:border-[#00FF94]/30 md:p-8">
              {/* hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#00FF94]/0 blur-2xl transition-all duration-500 group-hover:bg-[#00FF94]/10" />

              <div className="relative flex items-center justify-between">
                <span className="font-display text-3xl font-black text-[var(--accent)] md:text-4xl">★</span>
                <span className="font-mono text-xs text-[var(--text-3)]">{item.year}</span>
              </div>

              <h3 className="relative mt-6 font-display text-xl font-black leading-tight tracking-tight text-[var(--text)] md:text-2xl">
                {item.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-[var(--text-2)]">
                {item.context}
              </p>
            </article>
          </Rise>
        ))}
      </div>
    </section>
  );
};

export default memo(RecognitionSection);
