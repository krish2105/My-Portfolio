import type { AssistantAction } from "../data/assistant";
import { scrollFallback } from "./pageLayout";

/**
 * A chip may point at a section the current audience mode doesn't render (e.g. "Read the full About" on the short
 * recruiter page). Instead of silently doing nothing, fall back: About → top of page, Résumé → the PDF itself.
 */
export const resolveAction = (a: AssistantAction, exists: (sectionId: string) => boolean, resumeUrl: string): AssistantAction => {
  if (a.type !== "scroll" || exists(a.target)) return a;
  const fallback = scrollFallback(a.target, resumeUrl);
  return fallback ? { ...a, type: fallback.type, target: fallback.target } : a;
};
