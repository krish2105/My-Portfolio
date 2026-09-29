import { describe, it, expect, vi, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import Preloader from "./Preloader";

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe("Preloader", () => {
  it("under prefers-reduced-motion, skips the intro animation and calls onDone immediately", async () => {
    window.matchMedia = ((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    const onDone = vi.fn();
    const { container } = render(<Preloader onDone={onDone} />);

    expect(onDone).toHaveBeenCalledTimes(1);
    // The panel starts its exit immediately (exit=true set synchronously);
    // AnimatePresence removes it from the DOM once the exit transition
    // finishes, which happens on a later tick.
    await waitFor(() => {
      expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
    });
  });

  it("without reduced motion, shows the loading status and has not called onDone yet", () => {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    const onDone = vi.fn();
    const { container } = render(<Preloader onDone={onDone} />);

    expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    expect(onDone).not.toHaveBeenCalled();
  });
});
