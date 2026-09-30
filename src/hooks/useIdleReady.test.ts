import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useIdleReady } from "./useIdleReady";

describe("useIdleReady", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("is false on first render and becomes true once the browser is idle", () => {
    vi.useFakeTimers();
    let idleCb: (() => void) | null = null;
    vi.stubGlobal("requestIdleCallback", (cb: () => void) => {
      idleCb = cb;
      return 1;
    });
    vi.stubGlobal("cancelIdleCallback", () => {});
    const { result } = renderHook(() => useIdleReady());
    expect(result.current).toBe(false);
    act(() => idleCb?.());
    expect(result.current).toBe(true);
  });

  it("falls back to a short timeout where requestIdleCallback doesn't exist (Safari)", () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestIdleCallback", undefined);
    const { result } = renderHook(() => useIdleReady());
    expect(result.current).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current).toBe(true);
  });
});
