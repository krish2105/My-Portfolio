import { testimonials, writing } from "./portfolio";

/** Single source of truth for in-page navigation (used by Navbar, MobileMenu, and the ⌘K command palette). */
export interface NavItem {
  id: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About" },
  { id: "services", label: "What I Do" },
  { id: "journey", label: "Journey" },
  // "Writing" only appears once `writing` in portfolio.ts has real entries
  // (honesty gate — WritingSection itself renders nothing until then too).
  ...(writing.length > 0 ? [{ id: "writing", label: "Writing" }] : []),
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "recognition", label: "Awards" },
  // Same honesty gate as "Writing", for real testimonials only.
  ...(testimonials.length > 0 ? [{ id: "testimonials", label: "Testimonials" }] : []),
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
];

export const SECTION_IDS = ["home", ...NAV_ITEMS.map((i) => i.id)];
