import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import CapabilitiesSection from "./CapabilitiesSection";
import { capabilities } from "../../data/portfolio";

describe("CapabilitiesSection (one grouped list)", () => {
  it("lists every capability group with all of its skills", () => {
    render(<CapabilitiesSection />);
    for (const g of capabilities) {
      const group = within(screen.getByRole("heading", { level: 3, name: g.title }).closest("div") as HTMLElement);
      for (const s of g.skills) expect(group.getByText(s.name)).toBeInTheDocument();
    }
  });

  it("marks the Core skills so a skimmer can see depth at a glance", () => {
    render(<CapabilitiesSection />);
    const firstCore = capabilities.flatMap((g) => g.skills).find((s) => s.level === "Core")!;
    expect(screen.getAllByText(firstCore.name)[0].closest("li")).toHaveAttribute("title", "Core");
  });

  it("no longer renders the unreadable skills constellation (an 80-tag graph with clipped labels)", () => {
    const { container } = render(<CapabilitiesSection />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector("section#skills")).not.toBeNull();
  });
});
