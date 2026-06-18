import { useState, useEffect } from "react";

export const useWebGLSupport = () => {
  const [isSupported] = useState(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return gl !== null;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Already checked on mount via lazy initialization
  }, []);

  return isSupported;
};
