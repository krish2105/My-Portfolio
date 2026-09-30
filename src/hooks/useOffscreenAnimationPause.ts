import { useEffect } from "react";

/**
 * Tags each top-level child of `#<containerId>` with `data-inview="true|false"` as it enters / leaves the
 * viewport. index.css pauses every CSS animation inside a section marked `false`.
 *
 * Why: browsers keep ticking (and restyling) CSS animations on elements that are far off-screen. The hero
 * name glow, the aurora blobs, the profile-card shine and the pulse dots were together forcing ~1,200 style
 * recalculations / ~21k restyled elements during a 2-second scroll of the *other* sections — measured, not
 * guessed — so the whole page paid for animations nobody could see.
 *
 * Below-the-fold sections are React.lazy()'d and mount after first render, so new children are picked up
 * with a MutationObserver.
 */
export const useOffscreenAnimationPause = (containerId = "main-content") => {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).dataset.inview = String(entry.isIntersecting);
        }
      },
      { rootMargin: "150px 0px" }
    );

    const seen = new WeakSet<Element>();
    const observeChildren = () => {
      for (const child of Array.from(container.children)) {
        if (!seen.has(child)) {
          seen.add(child);
          io.observe(child);
        }
      }
    };
    observeChildren();

    const mutations = new MutationObserver(observeChildren);
    mutations.observe(container, { childList: true });

    return () => {
      mutations.disconnect();
      io.disconnect();
    };
  }, [containerId]);
};
