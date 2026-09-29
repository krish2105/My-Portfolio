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
      className={`group relative flex h-9 items-center justify-center gap-1.5 rounded-full border px-2.5 sm:px-3 font-mono text-[11px] font-semibold transition-all duration-300 before:absolute before:-inset-1 before:content-[''] ${
        enabled
          ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] shadow-[0_0_16px_rgba(0,180,100,0.18)]"
          : "border-[var(--border)] bg-[var(--panel)]/70 text-[var(--text-3)] hover:border-[var(--border-strong)] hover:text-[var(--text)]"
      }`}
    >
      {enabled ? (
        <>
          <Volume2 size={14} className="text-[var(--accent)] animate-pulse" aria-hidden />
          <span className="hidden sm:flex items-end gap-0.5 h-3" aria-hidden>
            <span className="w-0.5 h-2 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-0.5 h-3 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-0.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.45s]" />
          </span>
          <span className="hidden sm:inline tracking-wider">SFX ON</span>
        </>
      ) : (
        <>
          <VolumeX size={14} aria-hidden />
          <span className="hidden sm:inline tracking-wider">SFX OFF</span>
        </>
      )}
    </button>
  );
};

export default SoundToggle;
