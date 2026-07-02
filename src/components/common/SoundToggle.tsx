import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "../../lib/sound";

/** Mute toggle for the site's optional UI sound ticks — off by default. */
const SoundToggle = ({ className = "" }: { className?: string }) => {
  const { enabled, toggle } = useSound();

  return (
    <button
      onClick={toggle}
      data-cursor="Sound"
      aria-label={enabled ? "Mute UI sounds" : "Unmute UI sounds"}
      title={enabled ? "Mute UI sounds" : "Unmute UI sounds"}
      aria-pressed={enabled}
      className={`grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:border-[#00FF94]/50 hover:text-[var(--accent)] ${className}`}
    >
      {enabled ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
    </button>
  );
};

export default SoundToggle;
