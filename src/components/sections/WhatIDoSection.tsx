import { useState } from "react";
import { motion } from "motion/react";
import { services } from "../../data/portfolio";
import { RevealText } from "../common/Reveal";

const WhatIDoSection = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" className="relative border-t border-[var(--border)] px-6 py-28 md:px-[8vw] md:py-40">
      <div className="mb-14 flex items-center gap-4">
        <span className="kicker">(02)</span>
        <RevealText className="kicker">What I Do</RevealText>
      </div>

      <ul className="border-t border-[var(--border)]">
        {services.map((s, i) => {
          const isActive = active === i;
          const dimmed = active !== null && !isActive;
          return (
            <li
              key={s.id}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="group border-b border-[var(--border)]"
              data-cursor="→"
            >
              <div
                className={`relative flex flex-col gap-4 py-8 transition-all duration-500 md:flex-row md:items-center md:gap-10 md:py-10 ${
                  dimmed ? "opacity-35" : "opacity-100"
                }`}
              >
                {/* animated accent fill on hover */}
                <motion.span
                  className="pointer-events-none absolute inset-0 origin-left bg-[#00FF94]"
                  initial={false}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "left" }}
                />
                <span
                  className={`relative font-mono text-sm transition-colors duration-300 ${
                    isActive ? "text-[#050505]" : "text-[#7e8c9a]"
                  }`}
                >
                  0{i + 1}
                </span>
                <h3
                  className={`relative font-display text-3xl font-black tracking-tight transition-all duration-300 md:text-6xl md:group-hover:translate-x-4 ${
                    isActive ? "text-[#050505]" : "text-[#EDF5FA]"
                  }`}
                >
                  {s.title}
                </h3>
                <p
                  className={`relative max-w-md text-sm leading-relaxed transition-colors duration-300 md:ml-auto md:text-right md:text-base ${
                    isActive ? "text-[#050505]" : "text-[#A0ADBA]"
                  }`}
                >
                  {s.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default WhatIDoSection;
