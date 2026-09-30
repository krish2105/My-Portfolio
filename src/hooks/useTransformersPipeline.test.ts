import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTransformersPipeline } from "./useTransformersPipeline";

const pipelineMock = vi.fn<(...args: unknown[]) => Promise<() => Promise<unknown>>>(async () => async () => [
  { label: "POSITIVE", score: 0.99 },
]);

vi.mock("../lib/transformersEnv", () => ({
  configureLocalModels: vi.fn(async () => undefined),
  withRetry: async (fn: () => unknown) => fn(),
}));

vi.mock("@huggingface/transformers", () => ({
  pipeline: (...args: unknown[]) => pipelineMock(...args),
}));

const setGpu = (available: boolean) => {
  if (available) {
    Object.defineProperty(navigator, "gpu", { configurable: true, value: { requestAdapter: async () => ({}) } });
  } else {
    Reflect.deleteProperty(navigator, "gpu");
  }
};

describe("useTransformersPipeline", () => {
  beforeEach(() => pipelineMock.mockClear());
  afterEach(() => setGpu(false));

  // Only onnx/model_quantized.onnx is self-hosted under public/models. transformers.js defaults to the
  // fp32 "model.onnx" on the WebGPU device, which isn't hosted (the SPA fallback returns HTML and ORT
  // fails with "protobuf parsing failed"), so the quantized weights must be requested explicitly.
  it.each([
    ["WebGPU", true],
    ["WASM", false],
  ])("requests the self-hosted quantized (q8) weights on %s", async (_label, gpu) => {
    setGpu(gpu);
    const { result } = renderHook(() => useTransformersPipeline("sentiment-analysis", "Xenova/some-model"));

    await act(async () => {
      await result.current.run("great project");
    });

    expect(pipelineMock).toHaveBeenCalledTimes(1);
    const options = pipelineMock.mock.calls[0][2] as Record<string, unknown>;
    expect(options.dtype).toBe("q8");
    expect(options.device).toBe(gpu ? "webgpu" : undefined);
  });
});
