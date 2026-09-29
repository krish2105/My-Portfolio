import { Download } from "lucide-react";
import { track } from "@vercel/analytics";
import { socialLinks } from "../../data/portfolio";

interface ResumeButtonProps {
  variant?: "solid" | "outline";
  className?: string;
  label?: string;
}

/**
 * Downloads the self-hosted résumé PDF (public/resume/Krishna_Mathur_Resume.pdf,
 * regenerated via `npm run resume:build` — see scripts/generate-resume.ts).
 * The `download` attribute forces a save instead of an in-browser preview.
 */
const ResumeButton = ({ variant = "solid", className = "", label = "Download Resume" }: ResumeButtonProps) => {
  if (!socialLinks.resume) return null;

  const base =
    "inline-flex items-center justify-center gap-2 px-7 py-4 font-bold tracking-wide rounded-sm transition-all duration-300 focus-visible-ring";
  const styles =
    variant === "solid"
      ? "bg-[#00FF94] text-[#050505] hover:shadow-[0_0_24px_rgba(0,255,148,0.55)] hover:-translate-y-0.5"
      : "bg-transparent border border-[rgba(215,226,234,0.28)] text-[var(--text)] hover:border-[#00FF94] hover:text-[var(--accent)]";

  return (
    <a
      href={socialLinks.resume}
      download="Krishna-Mathur-Resume.pdf"
      onClick={() => track("resume_download")}
      className={`${base} ${styles} ${className}`}
    >
      <Download size={18} />
      {label}
    </a>
  );
};

export default ResumeButton;
