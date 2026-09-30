import { useEffect, useState } from "react";

/**
 * Flips to `true` once the page has finished loading and the browser is idle. Use it to defer
 * non-critical network/CPU work out of the critical path *without* tying it to scrolling — unlike a
 * viewport gate, it settles any resulting layout change (e.g. a section hiding itself after a failed
 * fetch) shortly after load instead of in the middle of a smooth-scroll animation.
 */
export const useIdleReady = (timeoutMs = 3000): boolean => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: timeoutMs });
      } else {
        // Safari has no requestIdleCallback.
        timerId = setTimeout(() => setReady(true), 1200);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, [timeoutMs]);

  return ready;
};
