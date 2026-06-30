import type { ReactNode } from "react";
import { MapPin, GraduationCap, Sparkles, ArrowUpRight } from "lucide-react";
import { profile, projects, capabilities, now } from "../../data/portfolio";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";
import { RevealText, Rise } from "../common/Reveal";

const totalSkills = capabilities.reduce((s, g) => s + g.skills.length, 0);
const roundedSkills = Math.floor(totalSkills / 10) * 10;

const find = (id: string) => now.find((n) => n.id === id)?.value ?? "";

/** A glass bento tile with a pointer-tracked spotlight (CSS vars — no rerender). */
const Tile = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div
    onPointerMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    }}
    className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0a0a0a]/80 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-[#00FF94]/30 md:p-7 ${className}`}
  >
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: "radial-gradient(240px circle at var(--mx,50%) var(--my,0%), rgba(0,255,148,0.10), transparent 70%)",
      }}
    />
    <div className="relative h-full">{children}</div>
  </div>
);

const Metric = ({ value, suffix, label }: { value: string; suffix?: string; label: string }) => (
  <div className="flex h-full flex-col justify-center">
    <p className="font-display text-4xl font-black leading-none tracking-tight text-[#EDF5FA] md:text-5xl">
      {value}
      {suffix && <span className="text-[#00FF94]">{suffix}</span>}
    </p>
    <p className="mt-2 text-xs leading-snug text-[#7e8c9a]">{label}</p>
  </div>
);

const NowTile = ({ label, value }: { label: string; value: string }) => (
  <div className="flex h-full flex-col">
    <span className="kicker mb-2">{label}</span>
    <p className="text-[15px] leading-relaxed text-[#A0ADBA] md:text-base">{value}</p>
  </div>
);

const BentoSection = () => {
  const { lenis } = useSmoothScroll();

  return (
    <section
      aria-label="At a glance"
      className="relative border-t border-[var(--border)] px-6 py-20 md:px-[8vw] md:py-28"
    >
      <div className="mb-10 flex items-center gap-4">
        <span className="kicker">/ Snapshot</span>
        <RevealText className="kicker">At a glance</RevealText>
      </div>

      <Rise>
        <div className="grid auto-rows-[minmax(120px,auto)] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {/* Availability — hero tile */}
          <Tile className="col-span-2 row-span-2 flex flex-col justify-between bg-gradient-to-br from-[#0a0e0c] to-[#0a0a0a]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00FF94]/25 bg-[#00FF94]/10 px-3 py-1 text-xs font-medium text-[#00FF94]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FF94]" />
                Open to opportunities
              </span>
              <p className="mt-5 font-display text-2xl font-bold leading-tight tracking-tight text-[#EDF5FA] md:text-3xl">
                Building practical AI, data & GenAI systems — and looking for the next one.
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#A0ADBA]">{profile.availability}</p>
            </div>
            <button
              onClick={() => scrollTo("#contact", lenis)}
              data-cursor="Talk"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#00FF94] px-5 py-2.5 text-sm font-bold text-[#050505] transition-transform hover:scale-[1.03]"
            >
              Get in touch <ArrowUpRight size={15} aria-hidden />
            </button>
          </Tile>

          <Tile>
            <Metric value={String(projects.length)} label="Projects built & shipped" />
          </Tile>
          <Tile>
            <Metric value={String(roundedSkills)} suffix="+" label="Skills & tools" />
          </Tile>

          {/* Location */}
          <Tile className="col-span-2">
            <div className="flex h-full items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[#111] text-[#00FF94]">
                <MapPin size={18} aria-hidden />
              </span>
              <div>
                <p className="kicker mb-1">Based in</p>
                <p className="font-display text-lg font-bold text-[#EDF5FA]">
                  {profile.location} <span className="text-[#7e8c9a]">·</span> {profile.secondaryLocation}
                </p>
              </div>
            </div>
          </Tile>

          {/* Now: building */}
          <Tile className="col-span-2">
            <NowTile label="Building" value={find("building")} />
          </Tile>

          {/* Studying */}
          <Tile className="col-span-2 md:col-span-1">
            <div className="flex h-full flex-col">
              <GraduationCap size={18} className="mb-2 text-[#00FF94]" aria-hidden />
              <span className="kicker mb-1">Studying</span>
              <p className="text-sm leading-snug text-[#A0ADBA]">Master of AI in Business · SP Jain, Dubai</p>
            </div>
          </Tile>

          {/* Exploring */}
          <Tile className="col-span-2 md:col-span-1">
            <div className="flex h-full flex-col">
              <Sparkles size={18} className="mb-2 text-[#00FF94]" aria-hidden />
              <NowTile label="Exploring" value={find("exploring")} />
            </div>
          </Tile>
        </div>
      </Rise>
    </section>
  );
};

export default BentoSection;
