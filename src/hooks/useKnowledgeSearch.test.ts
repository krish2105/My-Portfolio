import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useKnowledgeSearch } from "./useKnowledgeSearch";

// Fixed, deterministic 2D "embeddings" keyed by input text, so cosine-
// similarity ranking is fully predictable without loading a real model.
const VECTORS: Record<string, number[]> = {
  "about apple pie": [1, 0],
  "about banana bread": [0.9, 0.1],
  "about cars": [0, 1],
  "fruit question": [1, 0],
};

const pipelineMock = vi.fn(async () => {
  return (input: string | string[]) => {
    const list = Array.isArray(input) ? input : [input];
    return Promise.resolve({ tolist: () => list.map((s) => VECTORS[s] ?? [0, 0]) });
  };
});

vi.mock("../data/knowledgeBase", () => ({
  buildKnowledgeBase: () => [
    { id: "apple", text: "about apple pie" },
    { id: "banana", text: "about banana bread" },
    { id: "car", text: "about cars" },
  ],
}));

vi.mock("../lib/transformersEnv", () => ({
  configureLocalModels: vi.fn(async () => undefined),
  // Passthrough (no actual retrying) — retry behavior itself isn't this test's concern.
  withRetry: async (fn: () => unknown) => fn(),
}));

vi.mock("@huggingface/transformers", () => ({
  pipeline: pipelineMock,
}));

describe("useKnowledgeSearch", () => {
  beforeEach(() => {
    sessionStorage.clear();
    pipelineMock.mockClear();
  });

  it("ranks chunks by cosine similarity to the query, closest first", async () => {
    const { result } = renderHook(() => useKnowledgeSearch());

    await act(async () => {
      const ok = await result.current.enable();
      expect(ok).toBe(true);
    });
    expect(result.current.status).toBe("ready");

    let matches: Awaited<ReturnType<typeof result.current.search>> = [];
    await act(async () => {
      matches = await result.current.search("fruit question", 2);
    });

    expect(matches.map((m) => m.chunk.id)).toEqual(["apple", "banana"]);
    expect(matches[0].score).toBeGreaterThan(matches[1].score);
  });

  it("caches embeddings in sessionStorage so a second enable() skips the model", async () => {
    const first = renderHook(() => useKnowledgeSearch());
    await act(async () => {
      await first.result.current.enable();
    });
    expect(pipelineMock).toHaveBeenCalledTimes(1);

    const second = renderHook(() => useKnowledgeSearch());
    await act(async () => {
      await second.result.current.enable();
    });
    // A fresh hook instance with a matching sessionStorage fingerprint should
    // NOT re-invoke the (expensive) pipeline() loader a second time.
    expect(pipelineMock).toHaveBeenCalledTimes(1);
    expect(second.result.current.status).toBe("ready");
  });

  it("returns an error status if the model fails to load, without throwing", async () => {
    pipelineMock.mockRejectedValueOnce(new Error("model load failed"));
    const { result } = renderHook(() => useKnowledgeSearch());

    await act(async () => {
      const ok = await result.current.enable();
      expect(ok).toBe(false);
    });
    expect(result.current.status).toBe("error");
  });
});
