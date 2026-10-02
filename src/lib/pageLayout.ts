import type { ViewMode } from "./viewMode";

/**
 * The single table that decides what the page renders. App.tsx renders from it, and the navbar, mobile menu,
 * command palette, side rail, scrollspy and the "(0N)" section kickers all read the same table — so they can't
 * disagree about which sections exist or what number each one is.
 *
 * A section's key is also its DOM id (where it has one).
 */
export type SectionKey =
  | "home"
  | "projects"
  | "snapshot"
  | "marquee"
  | "about"
  | "journey"
  | "skills"
  | "github"
  | "demo"
  | "credentials"
  | "resume"
  | "contact";

export interface NavItem {
  id: string;
  label: string;
}

export interface LayoutOptions {
  /** False when there is not a single real award / recommendation / certification / post to show. */
  hasCredentials: boolean;
}

/** Recruiter default: a short, proof-first page. */
const RECRUITER: SectionKey[] = ["home", "projects", "journey", "skills", "credentials", "contact"];

/** Technical and Business keep everything (minus what was cut: "What I Do", the skills constellation, the empty Trust section). */
const FULL: SectionKey[] = ["home", "projects", "snapshot", "marquee", "about", "journey", "skills", "github", "demo", "credentials", "resume", "contact"];

const LAYOUTS: Record<ViewMode, SectionKey[]> = { recruiter: RECRUITER, technical: FULL, business: FULL };

/** Only sections with a label are navigation destinations (and therefore numbered). */
const NAV_LABELS: Partial<Record<SectionKey, string>> = {
  projects: "Work",
  about: "About",
  journey: "Experience",
  skills: "Skills",
  credentials: "Credentials",
  resume: "Résumé",
  contact: "Contact",
};

export const sectionsFor = (mode: ViewMode, { hasCredentials }: LayoutOptions): SectionKey[] =>
  LAYOUTS[mode].filter((k) => k !== "credentials" || hasCredentials);

export const navFor = (mode: ViewMode, o: LayoutOptions): NavItem[] =>
  sectionsFor(mode, o).flatMap((k) => (NAV_LABELS[k] ? [{ id: k, label: NAV_LABELS[k]! }] : []));

/** What the scrollspy observes: the hero plus every nav destination. */
export const sectionIdsFor = (mode: ViewMode, o: LayoutOptions): string[] => ["home", ...navFor(mode, o).map((n) => n.id)];

/** 1-based position in the nav, or null for sections that aren't nav destinations (or aren't on this page). */
export const sectionNumber = (mode: ViewMode, id: string, o: LayoutOptions): number | null => {
  const i = navFor(mode, o).findIndex((n) => n.id === id);
  return i < 0 ? null : i + 1;
};

/**
 * An action (assistant chip, command) may target a section the current mode doesn't render. Rather than silently
 * doing nothing: About → the top of the page, Résumé → the PDF itself.
 */
export const scrollFallback = (id: string, resumeUrl: string): { type: "scroll" | "link"; target: string } | null => {
  if (id === "about") return { type: "scroll", target: "home" };
  if (id === "resume") return { type: "link", target: resumeUrl };
  return null;
};
