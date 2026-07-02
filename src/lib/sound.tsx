/* eslint-disable react-refresh/only-export-components --
   This module intentionally co-exports the SoundProvider component and the
   useSound() hook (same pattern as theme.tsx). */
import { createContext, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";

export type SoundKind = "tick" | "hover" | "cta";

interface SoundCtx {
  enabled: boolean;
  toggle: () => void;
  play: (kind: SoundKind) => void;
}

const Ctx = createContext<SoundCtx>({ enabled: false, toggle: () => {}, play: () => {} });

export const useSound = () => useContext(Ctx);

const STORAGE_KEY = "sound-enabled";

/**
 * Tiny synthesized UI ticks (Web Audio oscillators — no audio files to host
 * or license) for ⌘K, project-card hover and CTA clicks. Off by default;
 * the visitor opts in via the mute toggle next to the theme switch. Always
 * silent under prefers-reduced-motion, matching every other motion affordance.
 */
const readInitial = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState(readInitial);
  const ctxRef = useRef<AudioContext | null>(null);

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const play = (kind: SoundKind) => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      ctxRef.current = new AudioCtx();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const freq = { tick: 920, hover: 1180, cta: 660 }[kind];
    const duration = kind === "cta" ? 0.09 : 0.05;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  return <Ctx.Provider value={{ enabled, toggle, play }}>{children}</Ctx.Provider>;
};
