import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CredentialsSection from "./CredentialsSection";
import { credentialGroups } from "../../../lib/credentials";
import type { Certification, RecognitionItem, Testimonial, WritingItem } from "../../../types/portfolio";

const award: RecognitionItem = { id: "a1", title: "Student Excellence Award", year: "2025", context: "Awarded on graduating." };
const quote = (over: Partial<Testimonial> = {}): Testimonial => ({
  id: "t1",
  quote: "Delivered on time and communicated clearly.",
  author: "Jane Doe",
  role: "Engineering Manager, Acme",
  type: "linkedin",
  status: "verified",
  permission: true,
  ...over,
});
const cert: Certification = { id: "c1", name: "Machine Learning Specialization", issuer: "DeepLearning.AI", year: "2026", credentialUrl: "https://example.com/verify/123" };
const post: WritingItem = { id: "w1", title: "Why RAG needs a faithfulness gate", blurb: "Notes from building FinCopilot.", date: "2026-08", url: "https://example.com/post", status: "published" };
const none = { recognition: [], testimonials: [], certifications: [], writing: [] };

const PLACEHOLDER_COPY = /coming soon|pending|awaiting|planned|request a|notify me/i;

describe("CredentialsSection", () => {
  it("renders only the groups that have real items — awards alone means no empty recommendation/writing slots", () => {
    render(<CredentialsSection groups={credentialGroups({ ...none, recognition: [award] })} />);
    expect(screen.getByText("Student Excellence Award")).toBeInTheDocument();
    expect(screen.queryByText(PLACEHOLDER_COPY)).not.toBeInTheDocument();
    for (const heading of ["Recommendations", "Certifications", "Writing"]) expect(screen.queryByText(heading)).not.toBeInTheDocument();
  });

  it("shows a verified, permissioned recommendation with its author and role", () => {
    render(<CredentialsSection groups={credentialGroups({ ...none, testimonials: [quote()] })} />);
    expect(screen.getByText("Recommendations")).toBeInTheDocument();
    expect(screen.getByText(/Delivered on time and communicated clearly/)).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Engineering Manager, Acme")).toBeInTheDocument();
  });

  it("never shows a pending quote or one without the author's permission", () => {
    const groups = credentialGroups({
      ...none,
      recognition: [award],
      testimonials: [quote({ id: "p", quote: "Pending draft", status: "pending" }), quote({ id: "n", quote: "No permission yet", permission: false })],
    });
    render(<CredentialsSection groups={groups} />);
    expect(screen.queryByText(/Pending draft/)).not.toBeInTheDocument();
    expect(screen.queryByText(/No permission yet/)).not.toBeInTheDocument();
    expect(screen.queryByText("Recommendations")).not.toBeInTheDocument();
  });

  it("lists a certification with issuer, year and a verification link when one is public", () => {
    render(<CredentialsSection groups={credentialGroups({ ...none, certifications: [cert] })} />);
    expect(screen.getByText("Certifications")).toBeInTheDocument();
    expect(screen.getByText("Machine Learning Specialization")).toBeInTheDocument();
    expect(screen.getByText(/DeepLearning\.AI/)).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /verify/i })).toHaveAttribute("href", "https://example.com/verify/123");
  });

  it("lists only published writing, linking out to the post", () => {
    const groups = credentialGroups({ ...none, writing: [post, { ...post, id: "w2", title: "Unpublished idea", status: "planned" }] });
    render(<CredentialsSection groups={groups} />);
    expect(screen.getByText("Writing")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Why RAG needs a faithfulness gate/ })).toHaveAttribute("href", "https://example.com/post");
    expect(screen.queryByText("Unpublished idea")).not.toBeInTheDocument();
  });

  it("renders nothing at all when there is nothing real to show", () => {
    const { container } = render(<CredentialsSection groups={credentialGroups(none)} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is a labelled landmark with the stable section id", () => {
    const { container } = render(<CredentialsSection groups={credentialGroups({ ...none, recognition: [award] })} />);
    const section = container.querySelector("section#credentials");
    expect(section).not.toBeNull();
    expect(section?.getAttribute("aria-labelledby")).toBe("credentials-heading");
    expect(container.querySelector("#credentials-heading")).not.toBeNull();
  });
});
