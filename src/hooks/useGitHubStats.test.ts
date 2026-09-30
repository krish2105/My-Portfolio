import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGitHubStats } from "./useGitHubStats";

describe("useGitHubStats", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it("does not call the GitHub API while disabled (section not yet near the viewport)", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response("[]", { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useGitHubStats("someone", false));
    await new Promise((r) => setTimeout(r, 20));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(true);
  });

  it("fetches once enabled", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response("[]", { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);
    const { rerender } = renderHook(({ on }) => useGitHubStats("someone", on), { initialProps: { on: false } });
    rerender({ on: true });
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });
});
