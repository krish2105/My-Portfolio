import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "../../lib/sound";

/** Mute toggle for the site's optional UI sound ticks — off by default.
 * The visible icon stays 36px (matches ThemeToggle), but `before:-inset-1`
 * expands the actual hit area to a full 44px for touch — the 36px box alone
 * fails the mobile touch-target minimum audited in Phase C. */
const SoundToggle = ({ className = "" }: { className?: string }) => {
  const { enabled, toggle } = useSound();

  return (
    <button
      onClick={toggle}
      data-cursor="Sound"
      aria-label={enabled ? "Mute UI sounds" : "Unmute UI sounds"}
      title={enabled ? "Mute UI sounds" : "Unmute UI sounds"}
      aria-pressed={enabled}
      className={`relative grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors before:absolute before:-inset-1 before:content-[''] hover:border-[#00FF94]/50 hover:text-[var(--accent)] ${className}`}
    >
      {enabled ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
    </button>
  );
};

export default SoundToggle;
