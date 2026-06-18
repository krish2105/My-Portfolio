import { profile } from "../../data/portfolio";
import SocialLinks from "../common/SocialLinks";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { lenis } = useSmoothScroll();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[#0a0a0a] px-6 pt-16 pb-10 md:px-[8vw]">
      <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker mb-4">Available for opportunities</p>
          <h2 className="font-display text-5xl font-black leading-[0.9] tracking-tighter text-[#EDF5FA] md:text-8xl">
            KRISHNA
            <br />
            <span className="text-outline">MATHUR</span>
          </h2>
        </div>

        <div className="flex flex-col items-start gap-6 md:items-end">
          <SocialLinks />
          <button
            onClick={() => scrollTo(0, lenis)}
            data-cursor="Top"
            className="group inline-flex items-center gap-3 text-sm font-medium text-[#A0ADBA] transition-colors hover:text-[#00FF94]"
            aria-label="Back to top"
          >
            Back to top
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-strong)] transition-colors group-hover:border-[#00FF94]">
              <ArrowUp size={16} />
            </span>
          </button>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-2 border-t border-[var(--border)] pt-8 text-xs text-[#687686] md:flex-row md:items-center md:justify-between">
        <p>
          © {currentYear} {profile.name} — AI Developer · Data Analyst · GenAI Builder
        </p>
        <p>Designed & developed with intelligence, curiosity and code.</p>
      </div>
    </footer>
  );
};

export default Footer;
