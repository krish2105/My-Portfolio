import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import SectionSkeleton from "./SectionSkeleton";

describe("SectionSkeleton", () => {
  it("renders as a decorative, non-content placeholder", () => {
    const { container } = render(<SectionSkeleton />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
  });

  it("renders more placeholder blocks for the 'compact' variant (3-col grid) than 'tall' (2-col grid)", () => {
    const compact = render(<SectionSkeleton variant="compact" />);
    const compactBlocks = compact.container.querySelectorAll("[data-testid='skeleton-block']").length;

    const tall = render(<SectionSkeleton variant="tall" />);
    const tallBlocks = tall.container.querySelectorAll("[data-testid='skeleton-block']").length;

    // compact: 3 grid blocks + 2 header bars; tall: 2 grid blocks + 2 header bars.
    expect(compactBlocks).toBe(5);
    expect(tallBlocks).toBe(4);
  });
});
