import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { journey } from "../../data/portfolio";
import { RevealText, Rise } from "../common/Reveal";

const JourneySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="journey" className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(03)</span>
        <RevealText className="kicker">Journey</RevealText>
      </div>

      <div ref={ref} className="relative pl-8 md:pl-16">
        {/* track + animated fill */}
        <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-[var(--border)] md:left-4">
          <motion.div style={{ height: lineHeight }} className="w-full bg-[#00FF94]" />
        </div>

        <div className="space-y-16 md:space-y-24">
          {journey.map((item, i) => (
            <Rise key={item.id} delay={0.05} className="relative">
              <span className="absolute -left-8 top-2 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-[#00FF94] shadow-[0_0_16px_rgba(0,255,148,0.7)] md:-left-12" />
              <span className="kicker">{item.date}</span>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#EDF5FA] md:text-4xl">
                {item.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-[#00FF94] md:text-base">{item.institution}</p>
              {item.description && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#A0ADBA] md:text-base">
                  {item.description}
                </p>
              )}
              <span className="pointer-events-none absolute -top-6 right-0 font-display text-6xl font-black text-[#0d0d0d] md:text-8xl">
                0{i + 1}
              </span>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
