import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Node 26 defines globalThis.localStorage as undefined without --localstorage-file,
// which also prevents jsdom from instantiating window.localStorage properly.
// Provide an in-memory Storage implementation for tests.
class MockStorage implements Storage {
  private store: Record<string, string> = {};

  get length() {
    return Object.keys(this.store).length;
  }

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
}

const mockStorage = new MockStorage();
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: mockStorage,
    writable: true,
    configurable: true,
  });
}
try {
  delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
} catch {
  /* ignore */
}
Object.defineProperty(globalThis, "localStorage", {
  value: mockStorage,
  writable: true,
  configurable: true,
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

// jsdom doesn't implement ResizeObserver — MagneticButton/ProfileCard (and
// anything else tracking element size) need this stubbed or they throw on mount.
if (typeof window.ResizeObserver === "undefined") {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
}

// jsdom doesn't implement Element.scrollTo — anything that scrolls a
// container programmatically (e.g. Assistant's message list) needs this
// stubbed or it throws on mount.
if (typeof Element.prototype.scrollTo === "undefined") {
  Element.prototype.scrollTo = () => {};
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
