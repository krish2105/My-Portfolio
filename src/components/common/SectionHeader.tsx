import { useSectionNumber } from "../../hooks/usePageLayout";
import { RevealText } from "./Reveal";

/**
 * The "(0N) Label" kicker above a section heading. The number comes from the one layout table, so it always matches the
 * navbar, side rail and palette for the current audience mode — and is simply absent for sections that aren't nav
 * destinations (e.g. the GitHub and live-labs strips).
 */
const SectionHeader = ({ id, label, className = "mb-14" }: { id: string; label: string; className?: string }) => {
  const number = useSectionNumber(id);
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {number && <span className="kicker">{number}</span>}
      <RevealText className="kicker">{label}</RevealText>
    </div>
  );
};

export default SectionHeader;
