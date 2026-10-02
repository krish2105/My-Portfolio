import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { RevealText, RevealWords } from "./Reveal";

/**
 * Regression: a masked reveal slides its child from *behind* an `overflow: hidden` edge. IntersectionObserver clips the
 * target by its ancestors' overflow, so a child translated fully behind the mask has no visible area and is never
 * reported as intersecting — the reveal never ran and every section label stayed invisible. The observer must watch the
 * (untranslated) mask instead.
 */
describe("masked reveals observe the mask, not the hidden child", () => {
  const observed: Element[] = [];
  const original = window.IntersectionObserver;

  beforeEach(() => {
    observed.length = 0;
    class SpyObserver {
      root = null;
      rootMargin = "";
      thresholds: ReadonlyArray<number> = [];
      scrollMargin = "";
      observe = vi.fn((el: Element) => void observed.push(el));
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    window.IntersectionObserver = SpyObserver as unknown as typeof IntersectionObserver;
  });
  afterEach(() => {
    window.IntersectionObserver = original;
  });

  it("RevealText", () => {
    const { container } = render(<RevealText className="kicker">Experience</RevealText>);
    const mask = container.querySelector(".line-mask")!;
    expect(observed).toContain(mask);
    expect(observed).not.toContain(container.querySelector(".kicker"));
  });

  it("RevealWords", () => {
    const { container } = render(<RevealWords text="Let us build" />);
    const masks = [...container.querySelectorAll(".line-mask")];
    expect(masks).toHaveLength(3);
    for (const m of masks) expect(observed).toContain(m);
    for (const child of container.querySelectorAll(".line-mask > span")) expect(observed).not.toContain(child);
  });
});
