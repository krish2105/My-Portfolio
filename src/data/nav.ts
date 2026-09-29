/** Single source of truth for in-page navigation (used by Navbar, MobileMenu, and the ⌘K command palette). */
export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About" },
  { id: "services", label: "What I Do" },
  { id: "journey", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "recognition", label: "Awards" },
  // Trust & Thinking always renders (real content or an honest placeholder
  // per slot) — unlike the old hidden Testimonials/Writing sections, it's
  // never gated out of nav.
  { id: "trust", label: "Trust & Thinking" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

export const SECTION_IDS = ["home", ...NAV_ITEMS.map((i) => i.id)];
