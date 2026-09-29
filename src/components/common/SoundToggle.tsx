import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { soundFx } from "../../lib/soundFx";

export const SoundToggle = () => {
  const [enabled, setEnabled] = useState(() => soundFx.isEnabled());

  const toggle = () => {
    const next = soundFx.toggle();
    setEnabled(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={enabled ? "Mute interactive audio feedback" : "Enable tactile sound effects"}
      aria-label={enabled ? "Mute interactive audio feedback" : "Enable tactile sound effects"}
      aria-pressed={enabled}
      className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold transition-all duration-300 ${
        enabled
          ? "border-[#00FF94]/40 bg-[#00FF94]/10 text-[var(--accent)] shadow-[0_0_16px_rgba(0,255,148,0.18)]"
          : "border-white/[0.08] bg-[var(--panel)]/70 text-[var(--text-3)] hover:border-white/[0.2] hover:text-[var(--text)]"
      }`}
    >
      {enabled ? (
        <>
          <Volume2 size={13} className="text-[var(--accent)] animate-pulse" aria-hidden />
          <span className="flex items-end gap-0.5 h-3" aria-hidden>
            <span className="w-0.5 h-2 bg-[#00FF94] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-0.5 h-3 bg-[#00FF94] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-0.5 h-1.5 bg-[#00FF94] rounded-full animate-bounce [animation-delay:-0.45s]" />
          </span>
          <span className="tracking-wider">SFX ON</span>
        </>
      ) : (
        <>
          <VolumeX size={13} aria-hidden />
          <span className="tracking-wider">SFX OFF</span>
        </>
      )}
    </button>
  );
};

export default SoundToggle;
