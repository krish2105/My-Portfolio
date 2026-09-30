import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { act, render, waitFor } from "@testing-library/react";
import Preloader from "./Preloader";
import { INTRO_SEEN_KEY } from "../../lib/intro";

const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  // The intro plays once per session, so every test starts as a "first visit".
  sessionStorage.clear();
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.useRealTimers();
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

  it("first visit: plays, finishes within ~700ms, and marks the session as seen", async () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    render(<Preloader onDone={onDone} />);
    expect(onDone).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(INTRO_SEEN_KEY)).toBe("1");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(720);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  // Regression: it used to hold the hero behind a full-screen overlay for 1.5–3.5s on *every* load,
  // which was the main reason mobile LCP was 4–6s. Repeat visits must not even mount (or flash) the overlay.
  it("repeat visit in the same session: skips immediately without rendering the overlay", () => {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    const onDone = vi.fn();
    const { container } = render(<Preloader onDone={onDone} />);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[role="status"]')).toBeNull();
  });

  it("reduced motion does not consume the once-per-session flag", () => {
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
    render(<Preloader onDone={vi.fn()} />);
    expect(sessionStorage.getItem(INTRO_SEEN_KEY)).toBeNull();
  });
});
