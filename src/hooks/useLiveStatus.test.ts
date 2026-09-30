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

  it("does not hit the network until enabled (so off-screen badges cost nothing at page load)", async () => {
    const fetchMock = vi.fn(() => Promise.resolve({} as Response));
    vi.stubGlobal("fetch", fetchMock);
    const { result, rerender } = renderHook(({ on }) => useLiveStatus("https://example.com", on), {
      initialProps: { on: false },
    });
    await new Promise((r) => setTimeout(r, 20));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current).toBe("checking");

    rerender({ on: true });
    await waitFor(() => expect(result.current).toBe("live"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  // History: a HEAD on the demo's *document* made Chrome act on that site's `Link: rel=preload` headers, which our
  // CSP blocked and logged as violations; probing /favicon.ico avoided that but logged 404s on hosts without one.
  // A plain GET of the page (which returns 200) with the body aborted once headers arrive has neither problem
  // and doesn't download the page.
  it("GETs the demo URL and aborts the body as soon as it responds (reachability only)", async () => {
    let signal: AbortSignal | undefined;
    const fetchMock = vi.fn<(input: string, init?: RequestInit) => Promise<Response>>((_url, init) => {
      signal = init?.signal ?? undefined;
      return Promise.resolve({} as Response);
    });
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useLiveStatus("https://demo.example.com/"));
    await waitFor(() => expect(result.current).toBe("live"));
    expect(fetchMock.mock.calls[0][0]).toBe("https://demo.example.com/");
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ mode: "no-cors", cache: "no-store" });
    expect(fetchMock.mock.calls[0][1]?.method ?? "GET").toBe("GET");
    expect(signal?.aborted).toBe(true);
  });

  it("reports 'unreachable' immediately when no url is given", () => {
    const { result } = renderHook(() => useLiveStatus(undefined));
    expect(result.current).toBe("unreachable");
  });
});
