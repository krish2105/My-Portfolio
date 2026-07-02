import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TrustCards from "./TrustCards";
import WritingCards from "./WritingCards";
import type { Testimonial, WritingItem, TrustPlaceholder } from "../../../types/portfolio";

const PLACEHOLDERS: TrustPlaceholder[] = [
  {
    id: "linkedin",
    category: "linkedin",
    label: "LinkedIn Recommendations",
    emptyStateCopy: "Pending verified recommendation.",
    ctaLabel: "Request a recommendation",
    ctaHref: "https://linkedin.com/in/example",
  },
  {
    id: "faculty",
    category: "faculty",
    label: "Mentor & Faculty Feedback",
    emptyStateCopy: "Awaiting verified academic feedback.",
    ctaLabel: "Request a quote",
    ctaHref: "mailto:test@example.com",
  },
  {
    id: "internship",
    category: "internship",
    label: "Internship & Collaboration",
    emptyStateCopy: "Permission-based feedback coming soon.",
    ctaLabel: "Request feedback",
    ctaHref: "mailto:test@example.com",
  },
  {
    id: "writing",
    category: "writing",
    label: "Writing & Insights",
    emptyStateCopy: "Planned article — coming soon.",
    ctaLabel: "Notify me when published",
    ctaHref: "mailto:test@example.com",
  },
];

describe("TrustCards (honesty-gated placeholders)", () => {
  it("shows a labelled placeholder per category when there are no verified testimonials", () => {
    render(<TrustCards testimonials={[]} placeholders={PLACEHOLDERS} />);
    expect(screen.getByText("Pending verified recommendation.")).toBeInTheDocument();
    expect(screen.getByText("Awaiting verified academic feedback.")).toBeInTheDocument();
    expect(screen.getByText("Permission-based feedback coming soon.")).toBeInTheDocument();
  });

  it("renders a real testimonial instead of the placeholder once one is verified", () => {
    const testimonials: Testimonial[] = [
      {
        id: "t-01",
        quote: "Great to work with.",
        author: "Jane Doe",
        role: "Engineering Manager",
        type: "linkedin",
        status: "verified",
        permission: true,
      },
    ];
    render(<TrustCards testimonials={testimonials} placeholders={PLACEHOLDERS} />);
    expect(screen.getByText("“Great to work with.”")).toBeInTheDocument();
    expect(screen.queryByText("Pending verified recommendation.")).not.toBeInTheDocument();
    // The other two categories still have no real entries, so they stay placeholders.
    expect(screen.getByText("Awaiting verified academic feedback.")).toBeInTheDocument();
  });

  it("does not surface a pending (non-verified) testimonial as real content", () => {
    const testimonials: Testimonial[] = [
      {
        id: "t-02",
        quote: "Draft quote awaiting sign-off.",
        author: "John Smith",
        role: "Professor",
        type: "faculty",
        status: "pending",
      },
    ];
    render(<TrustCards testimonials={testimonials} placeholders={PLACEHOLDERS} />);
    expect(screen.queryByText("“Draft quote awaiting sign-off.”")).not.toBeInTheDocument();
    expect(screen.getByText("Awaiting verified academic feedback.")).toBeInTheDocument();
  });
});

describe("WritingCards (honesty-gated placeholder)", () => {
  const placeholder = PLACEHOLDERS[3];

  it("shows the planned placeholder when there are no published posts", () => {
    render(<WritingCards writing={[]} placeholder={placeholder} />);
    expect(screen.getByText("Planned article — coming soon.")).toBeInTheDocument();
  });

  it("renders published posts instead of the placeholder", () => {
    const writing: WritingItem[] = [
      { id: "w-01", title: "A real post", blurb: "About something real.", date: "2026-01", url: "https://example.com", status: "published" },
    ];
    render(<WritingCards writing={writing} placeholder={placeholder} />);
    expect(screen.getByText("A real post")).toBeInTheDocument();
    expect(screen.queryByText("Planned article — coming soon.")).not.toBeInTheDocument();
  });
});
