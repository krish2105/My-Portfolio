import { useEffect, useState } from "react";

/**
 * Detects whether the device can comfortably run the WebGL hero.
 * Returns false for: no WebGL context, reduced-motion preference,
 * coarse pointers (touch/low-power), or very small viewports — so the
 * lightweight Canvas 2D fallback is used instead.
 */
export const useWebGLSupport = (): boolean => {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    const lowCores = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;

    if (reduced || coarse || small || lowCores) {
      setSupported(false);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
};
