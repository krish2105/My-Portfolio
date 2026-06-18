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

      <div className="border-t border-[var(--border)]">
        {recognition.map((item, i) => (
          <Rise key={item.id} delay={i * 0.05}>
            <div className="group grid grid-cols-1 items-start gap-4 border-b border-[var(--border)] py-10 transition-colors hover:bg-[#0a0a0a] md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:py-14">
              <span className="font-display text-2xl font-black text-[#00FF94] md:text-4xl">★</span>
              <div>
                <h3 className="font-display text-3xl font-black tracking-tight text-[#EDF5FA] transition-transform duration-300 md:text-6xl md:group-hover:translate-x-3">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#A0ADBA] md:text-base">
                  {item.context}
                </p>
              </div>
              <span className="font-mono text-sm text-[#687686] md:text-base">{item.year}</span>
            </div>
          </Rise>
        ))}
      </div>
    </section>
  );
};

export default RecognitionSection;
