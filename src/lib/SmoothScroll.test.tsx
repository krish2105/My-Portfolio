import { afterEach, describe, expect, it, vi } from "vitest";
import { scrollTo } from "./SmoothScroll";

type ScrollOpts = { offset: number; duration: number; onComplete?: () => void };

const fakeLenis = () => {
  const calls: { target: unknown; opts: ScrollOpts }[] = [];
  return {
    calls,
    lenis: { scrollTo: (target: unknown, opts: ScrollOpts) => calls.push({ target, opts }) } as never,
  };
};

const mountAt = (top: number) => {
  const el = document.createElement("section");
  el.id = "contact";
  el.getBoundingClientRect = () => ({ top }) as DOMRect;
  document.body.appendChild(el);
  return el;
};

describe("scrollTo (smooth-scroll helper)", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("scrolls with the navbar offset", () => {
    const { lenis, calls } = fakeLenis();
    scrollTo("#contact", lenis);
    expect(calls).toHaveLength(1);
    expect(calls[0].opts.offset).toBe(-90);
  });

  // Regression: a section above the target changed height *during* the animation (a lazy section
  // unmounting), so the precomputed destination was 361px off and the jump visibly overshot.
  it("re-targets once if layout shifted during the animation and the target ended up off-position", () => {
    const { lenis, calls } = fakeLenis();
    mountAt(-361); // landed 361px above where it should (should sit ~90px below the top)
    scrollTo("#contact", lenis);
    calls[0].opts.onComplete?.();
    expect(calls).toHaveLength(2);
  });

  it("does not re-target when it landed where it should", () => {
    const { lenis, calls } = fakeLenis();
    mountAt(90);
    scrollTo("#contact", lenis);
    calls[0].opts.onComplete?.();
    expect(calls).toHaveLength(1);
  });

  it("re-targets at most once (no infinite correction loop)", () => {
    const { lenis, calls } = fakeLenis();
    mountAt(-500);
    scrollTo("#contact", lenis);
    calls[0].opts.onComplete?.();
    calls[1].opts.onComplete?.();
    expect(calls).toHaveLength(2);
  });
});
