import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import HeroSection from "./HeroSection";
import { profile } from "../../data/portfolio";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("HeroSection", () => {
  it("renders the real profile name and the single role headline — nothing fabricated", () => {
    const { container } = render(<HeroSection />);
    // The kinetic hero name is split into one <span> per letter, so assert
    // against the concatenated text content rather than a single text node.
    // (Confirms it still spells the real name, even though the hero hardcodes
    // "KRISHNA"/"MATHUR" rather than deriving letters from profile.name.)
    expect(container.textContent).toContain("KRISHNA");
    expect(container.textContent).toContain("MATHUR");
    expect(profile.name).toBe("Krishna Mathur");
    // One role, not a rotating carousel of titles.
    expect(screen.getByText(profile.headline)).toBeInTheDocument();
    expect(profile.headline).toBe("AI Engineer — GenAI, RAG & agents");
  });

  it("subhead references the current flagship work, not the retired project names", () => {
    render(<HeroSection />);
    expect(screen.getByText(/agentic RAG copilots/i)).toBeInTheDocument();
    expect(screen.queryByText(/fraud detection/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/hospital resource allocation/i)).not.toBeInTheDocument();
  });

  it("states location, work authorisation and availability under the headline", () => {
    render(<HeroSection />);
    // Scope to the facts line itself — the profile card's status pill also says "Open to roles".
    const facts = within(screen.getByText(profile.location).closest("ul") as HTMLElement);
    expect(facts.getByText(profile.workAuthorization)).toBeInTheDocument();
    expect(facts.getByText(profile.availabilityShort)).toBeInTheDocument();
  });

  it("the profile card shows the role instead of repeating the name above the photo", () => {
    render(<HeroSection />);
    expect(screen.getByRole("heading", { level: 2, name: profile.targetRole })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: profile.name })).not.toBeInTheDocument();
  });
});
