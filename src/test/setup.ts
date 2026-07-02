import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// jsdom doesn't implement IntersectionObserver — Motion's `whileInView`
// (used by Reveal/Rise) needs this stubbed or it throws on mount.
if (typeof window.IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    root = null;
    rootMargin = "";
    thresholds: ReadonlyArray<number> = [];
    scrollMargin = "";
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

// jsdom doesn't implement matchMedia — every hook/component that checks
// prefers-reduced-motion / pointer capability needs this stubbed.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
