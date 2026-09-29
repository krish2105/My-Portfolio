import { useEffect, useState } from "react";

export type LiveStatus = "checking" | "live" | "waking" | "unreachable";

const WAKING_AFTER_MS = 4000;
const GIVE_UP_AFTER_MS = 20000;

/**
 * Lightweight, honest reachability ping for a live demo URL — not a full
 * health check (CORS means we can't read the real status code cross-origin
 * for most of these), just "did something respond." Free-tier Render APIs
 * behind these frontends cold-start after inactivity (documented in each
 * project's own `limitations[]`), so a slow-but-successful response is
 * reported as "waking", not "down".
 */
export const useLiveStatus = (url?: string): LiveStatus => {
  const [status, setStatus] = useState<LiveStatus>("checking");

  useEffect(() => {
    if (!url) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no async op to synchronize with; this is a static edge case, not a render loop.
      setStatus("unreachable");
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    const wakingTimer = setTimeout(() => {
      if (!cancelled) setStatus("waking");
    }, WAKING_AFTER_MS);
    const hardTimeout = setTimeout(() => controller.abort(), GIVE_UP_AFTER_MS);

    // no-cors: we only learn "it responded" vs "it didn't" — enough for a
    // reachability badge, and avoids needing each target to opt into CORS.
    fetch(url, { mode: "no-cors", cache: "no-store", signal: controller.signal })
      .then(() => {
        if (!cancelled) setStatus("live");
      })
      .catch(() => {
        if (!cancelled) setStatus("unreachable");
      })
      .finally(() => {
        clearTimeout(wakingTimer);
        clearTimeout(hardTimeout);
      });

    return () => {
      cancelled = true;
      clearTimeout(wakingTimer);
      clearTimeout(hardTimeout);
      controller.abort();
    };
  }, [url]);

  return status;
};
