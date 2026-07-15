import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";
import { profile } from "../../data/portfolio";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("HeroSection", () => {
  it("renders the real profile name and the first rotating title — nothing fabricated", () => {
    const { container } = render(<HeroSection />);
    // The kinetic hero name is split into one <span> per letter, so assert
    // against the concatenated text content rather than a single text node.
    // (Confirms it still spells the real name, even though the hero hardcodes
    // "KRISHNA"/"MATHUR" rather than deriving letters from profile.name.)
    expect(container.textContent).toContain("KRISHNA");
    expect(container.textContent).toContain("MATHUR");
    expect(profile.name).toBe("Krishna Mathur");
    // RoleRotator starts on profile.titles[0].
    expect(screen.getByText(profile.titles[0])).toBeInTheDocument();
  });

  it("subhead references the current flagship work, not the retired project names", () => {
    render(<HeroSection />);
    expect(screen.getByText(/agentic RAG copilots/i)).toBeInTheDocument();
    expect(screen.queryByText(/fraud detection/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/hospital resource allocation/i)).not.toBeInTheDocument();
  });
});
