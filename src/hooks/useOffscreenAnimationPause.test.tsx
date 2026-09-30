import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, waitFor } from "@testing-library/react";
import { useOffscreenAnimationPause } from "./useOffscreenAnimationPause";

type Entry = { isIntersecting: boolean; target: Element };
let ioCallback: ((entries: Entry[]) => void) | null = null;
const observed: Element[] = [];

const IO = class {
  constructor(cb: (entries: Entry[]) => void) {
    ioCallback = cb;
  }
  observe(el: Element) {
    observed.push(el);
  }
  unobserve() {}
  disconnect() {}
};

const Host = () => {
  useOffscreenAnimationPause("main-content");
  return null;
};

const setup = () => {
  document.body.innerHTML = `<main id="main-content"><section id="home"></section><section id="about"></section></main>`;
  return document.getElementById("main-content")!;
};

describe("useOffscreenAnimationPause", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
    observed.length = 0;
    ioCallback = null;
  });

  it("marks each top-level section with data-inview as it leaves / enters the viewport", () => {
    vi.stubGlobal("IntersectionObserver", IO);
    setup();
    render(<Host />);
    expect(observed.map((e) => e.id)).toEqual(["home", "about"]);

    const [home, about] = observed as HTMLElement[];
    act(() =>
      ioCallback?.([
        { isIntersecting: true, target: home },
        { isIntersecting: false, target: about },
      ])
    );
    expect(home.dataset.inview).toBe("true");
    expect(about.dataset.inview).toBe("false");

    act(() => ioCallback?.([{ isIntersecting: true, target: about }]));
    expect(about.dataset.inview).toBe("true");
  });

  // Sections below the fold are React.lazy()'d and appear after first render.
  it("also picks up sections that are added to <main> later", async () => {
    vi.stubGlobal("IntersectionObserver", IO);
    const main = setup();
    render(<Host />);

    act(() => {
      const late = document.createElement("section");
      late.id = "resume";
      main.appendChild(late);
    });
    await waitFor(() => expect(observed.map((e) => e.id)).toContain("resume"));
  });

  it("does nothing (and does not throw) when the container does not exist", () => {
    vi.stubGlobal("IntersectionObserver", IO);
    document.body.innerHTML = "";
    expect(() => render(<Host />)).not.toThrow();
    expect(observed).toHaveLength(0);
  });
});
