import { Download } from "lucide-react";
import { socialLinks } from "../../data/portfolio";

interface ResumeButtonProps {
  variant?: "solid" | "outline";
  className?: string;
  label?: string;
}

/**
 * Downloads the resume immediately from Google Drive.
 *
 * The href points at Drive's `uc?export=download&id=…` endpoint, which responds
 * with `Content-Disposition: attachment`, so the browser downloads the PDF on
 * click instead of opening a preview. Returns null until a real Drive id is set
 * in `src/data/portfolio.ts` (RESUME_DRIVE_FILE_ID).
 */
const ResumeButton = ({ variant = "solid", className = "", label = "Download Resume" }: ResumeButtonProps) => {
  if (!socialLinks.resume) return null;

  const base =
    "inline-flex items-center justify-center gap-2 px-7 py-4 font-bold tracking-wide rounded-sm transition-all duration-300 focus-visible-ring";
  const styles =
    variant === "solid"
      ? "bg-[#00FF94] text-[#050505] hover:shadow-[0_0_24px_rgba(0,255,148,0.55)] hover:-translate-y-0.5"
      : "bg-transparent border border-[rgba(215,226,234,0.28)] text-[#EDF5FA] hover:border-[#00FF94] hover:text-[#00FF94]";

  return (
    <a
      href={socialLinks.resume}
      download="Krishna-Mathur-Resume.pdf"
      className={`${base} ${styles} ${className}`}
    >
      <Download size={18} />
      {label}
    </a>
  );
};

export default ResumeButton;
