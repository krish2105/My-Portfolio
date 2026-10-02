import { certifications, recognition, testimonials, writing } from "../data/portfolio";
import type { Certification, RecognitionItem, Testimonial, WritingItem } from "../types/portfolio";

export interface CredentialSources {
  recognition: RecognitionItem[];
  testimonials: Testimonial[];
  certifications: Certification[];
  writing: WritingItem[];
}

export interface CredentialGroups {
  awards: RecognitionItem[];
  recommendations: Testimonial[];
  certifications: Certification[];
  writing: WritingItem[];
}

/**
 * The real proof to show — nothing else. A quote needs `status: "verified"` AND `permission: true` (the author's
 * explicit OK to publish); a post must be `published`. Anything pending/planned is invisible, so the page never
 * shows an empty "coming soon" slot.
 */
export const credentialGroups = (src: CredentialSources = { recognition, testimonials, certifications, writing }): CredentialGroups => ({
  awards: src.recognition,
  recommendations: src.testimonials.filter((t) => t.status === "verified" && t.permission === true),
  certifications: src.certifications,
  writing: src.writing.filter((w) => w.status === "published"),
});

/** False → the whole Credentials section (and its nav entry) disappears. */
export const hasCredentials = (groups: CredentialGroups = credentialGroups()): boolean =>
  groups.awards.length + groups.recommendations.length + groups.certifications.length + groups.writing.length > 0;
