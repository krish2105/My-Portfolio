import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, waitFor } from "@testing-library/react";
import { useActiveSection } from "./useActiveSection";

type Entry = { isIntersecting: boolean; target: Element };
let ioCallback: ((entries: Entry[]) => void) | null = null;
const observed: string[] = [];

const IO = class {
  constructor(cb: (entries: Entry[]) => void) {
    ioCallback = cb;
  }
  observe(el: Element) {
    observed.push(el.id);
  }
  unobserve() {}
  disconnect() {}
};

const IDS = ["about", "projects", "resume"];
const Probe = ({ onValue }: { onValue: (v: string) => void }) => {
  onValue(useActiveSection(IDS));
  return null;
};

const addSection = (id: string) => {
  const el = document.createElement("section");
  el.id = id;
  document.body.appendChild(el);
  return el;
};

describe("useActiveSection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
    observed.length = 0;
    ioCallback = null;
  });

  it("reports the section that crosses the observation band", () => {
    vi.stubGlobal("IntersectionObserver", IO);
    const about = addSection("about");
    addSection("projects");
    let active = "";
    render(<Probe onValue={(v) => (active = v)} />);

    act(() => ioCallback?.([{ isIntersecting: true, target: about }]));
    expect(active).toBe("about");
  });

  // Regression: sections after the fold are React.lazy()'d, so their ids don't exist when the hook first
  // runs. They used to never be observed, leaving the nav stuck on "Work" through Awards → Contact.
  it("also observes sections that mount after the hook first ran (lazy-loaded sections)", async () => {
    vi.stubGlobal("IntersectionObserver", IO);
    addSection("about");
    addSection("projects");
    let active = "";
    render(<Probe onValue={(v) => (active = v)} />);
    expect(observed).toEqual(["about", "projects"]);

    let resume!: HTMLElement;
    act(() => {
      resume = addSection("resume");
    });
    await waitFor(() => expect(observed).toContain("resume"));

    act(() => ioCallback?.([{ isIntersecting: true, target: resume }]));
    expect(active).toBe("resume");
  });

  it("does not observe the same element twice", async () => {
    vi.stubGlobal("IntersectionObserver", IO);
    addSection("about");
    render(<Probe onValue={() => {}} />);
    act(() => {
      addSection("unrelated");
    });
    await new Promise((r) => setTimeout(r, 20));
    expect(observed.filter((id) => id === "about")).toHaveLength(1);
  });
});
