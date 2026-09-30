import { useState, useEffect } from "react";

export const useActiveSection = (sectionIds: string[]) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    const observed = new Set<Element>();
    const observeNew = () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element && !observed.has(element)) {
          observed.add(element);
          observer.observe(element);
        }
      });
    };
    observeNew();

    // Sections below the fold are React.lazy()'d, so their ids don't exist yet when this effect first
    // runs. Keep watching the DOM until every section has been picked up, otherwise the later ones
    // (Awards → Contact) are never observed and the active link sticks on the last eager section.
    let mutations: MutationObserver | null = null;
    if (observed.size < sectionIds.length) {
      mutations = new MutationObserver(() => {
        observeNew();
        if (observed.size >= sectionIds.length) {
          mutations?.disconnect();
          mutations = null;
        }
      });
      mutations.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      mutations?.disconnect();
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeId;
};
