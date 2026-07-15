import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLiveStatus } from "./useLiveStatus";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("useLiveStatus", () => {
  it("reports 'live' once the fetch resolves quickly", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({} as Response)));
    const { result } = renderHook(() => useLiveStatus("https://example.com"));
    expect(result.current).toBe("checking");
    await waitFor(() => expect(result.current).toBe("live"));
  });

  it("reports 'unreachable' when the fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("network error"))));
    const { result } = renderHook(() => useLiveStatus("https://example.com"));
    await waitFor(() => expect(result.current).toBe("unreachable"));
  });

  it("reports 'unreachable' immediately when no url is given", () => {
    const { result } = renderHook(() => useLiveStatus(undefined));
    expect(result.current).toBe("unreachable");
  });
});
