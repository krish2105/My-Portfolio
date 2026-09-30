import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { useNearViewport } from "./useNearViewport";

type IoCallback = (entries: { isIntersecting: boolean }[]) => void;
let trigger: IoCallback | null = null;
const disconnect = vi.fn();

const Probe = ({ onValue }: { onValue: (v: boolean) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  onValue(useNearViewport(ref, "100px"));
  return <div ref={ref} />;
};

describe("useNearViewport", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    trigger = null;
    disconnect.mockClear();
  });

  it("stays false until the element intersects, then latches true and disconnects", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IoCallback) {
          trigger = cb;
        }
        observe() {}
        disconnect = disconnect;
      }
    );
    let value = true;
    render(<Probe onValue={(v) => (value = v)} />);
    expect(value).toBe(false);

    act(() => trigger?.([{ isIntersecting: false }]));
    expect(value).toBe(false);

    act(() => trigger?.([{ isIntersecting: true }]));
    expect(value).toBe(true);
    expect(disconnect).toHaveBeenCalled();
  });

  it("falls back to true when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    let value = false;
    render(<Probe onValue={(v) => (value = v)} />);
    expect(value).toBe(true);
  });
});
