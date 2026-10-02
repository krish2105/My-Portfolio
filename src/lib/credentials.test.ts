import { describe, expect, it } from "vitest";
import { credentialGroups, hasCredentials } from "./credentials";
import type { Certification, RecognitionItem, Testimonial, WritingItem } from "../types/portfolio";

const award: RecognitionItem = { id: "a", title: "Award", year: "2025", context: "ctx" };
const quote = (over: Partial<Testimonial> = {}): Testimonial => ({
  id: "t",
  quote: "Great.",
  author: "Jane Doe",
  role: "Manager",
  type: "linkedin",
  status: "verified",
  permission: true,
  ...over,
});
const post = (over: Partial<WritingItem> = {}): WritingItem => ({ id: "w", title: "Post", blurb: "b", date: "2026-01", url: "https://example.com", status: "published", ...over });
const cert: Certification = { id: "c", name: "Cert", issuer: "Issuer", year: "2026" };
const none = { recognition: [], testimonials: [], certifications: [], writing: [] };

describe("credentialGroups", () => {
  it("keeps only real items: verified + permissioned quotes, published posts", () => {
    const g = credentialGroups({
      ...none,
      testimonials: [quote(), quote({ id: "t2", status: "pending" }), quote({ id: "t3", permission: false }), quote({ id: "t4", permission: undefined })],
      writing: [post(), post({ id: "w2", status: "planned" }), post({ id: "w3", status: "pending" })],
    });
    expect(g.recommendations.map((t) => t.id)).toEqual(["t"]);
    expect(g.writing.map((w) => w.id)).toEqual(["w"]);
  });

  it("passes awards and certifications through", () => {
    const g = credentialGroups({ ...none, recognition: [award], certifications: [cert] });
    expect(g.awards).toEqual([award]);
    expect(g.certifications).toEqual([cert]);
  });
});

describe("hasCredentials", () => {
  it("is false when every group is empty — the section must not render at all", () => {
    expect(hasCredentials(credentialGroups(none))).toBe(false);
  });
  it("is true as soon as any single group has a real item", () => {
    expect(hasCredentials(credentialGroups({ ...none, recognition: [award] }))).toBe(true);
    expect(hasCredentials(credentialGroups({ ...none, certifications: [cert] }))).toBe(true);
    expect(hasCredentials(credentialGroups({ ...none, testimonials: [quote()] }))).toBe(true);
    expect(hasCredentials(credentialGroups({ ...none, writing: [post()] }))).toBe(true);
  });
  it("a pending quote alone does not count", () => {
    expect(hasCredentials(credentialGroups({ ...none, testimonials: [quote({ status: "pending" })] }))).toBe(false);
  });
});
