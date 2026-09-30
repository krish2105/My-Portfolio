import { useEffect, useState, type RefObject } from "react";

/**
 * Latches to `true` once `ref` comes within `rootMargin` of the viewport. Lets a component defer
 * expensive work (network, WASM, PDF synthesis…) until the visitor is actually about to see it,
 * instead of paying for it during page load. Without IntersectionObserver it returns `true`
 * immediately (the old eager behaviour) rather than never running.
 */
export const useNearViewport = <T extends Element>(ref: RefObject<T | null>, rootMargin = "600px"): boolean => {
  const [near, setNear] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, ref, rootMargin]);

  return near;
};
