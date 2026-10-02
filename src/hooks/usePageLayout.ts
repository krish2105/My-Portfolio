import { useMemo } from "react";
import { hasCredentials } from "../lib/credentials";
import { navFor, sectionIdsFor, sectionNumber, sectionsFor } from "../lib/pageLayout";
import { useViewMode } from "../lib/viewMode";

// Portfolio data is static for the life of the page, so this is computed once.
const HAS_CREDENTIALS = hasCredentials();

/** The mode-aware page layout — what to render and navigate, from the one table in lib/pageLayout. */
export const usePageLayout = () => {
  const { mode } = useViewMode();
  return useMemo(() => {
    const o = { hasCredentials: HAS_CREDENTIALS };
    return {
      mode,
      sections: sectionsFor(mode, o),
      nav: navFor(mode, o),
      sectionIds: sectionIdsFor(mode, o),
      numberOf: (id: string) => sectionNumber(mode, id, o),
    };
  }, [mode]);
};

/** "(03)" for a numbered section in the current mode, "" otherwise — the kicker beside each section heading. */
export const useSectionNumber = (id: string): string => {
  const n = usePageLayout().numberOf(id);
  return n == null ? "" : `(${String(n).padStart(2, "0")})`;
};
