import { useCallback, useRef, useState } from "react";
import { configureLocalModels, withRetry } from "../lib/transformersEnv";

export type PipelineStatus = "idle" | "loading" | "ready" | "error";

export interface InferenceTelemetry {
  latencyMs: number;
  device: "webgpu" | "wasm";
  quantization: "int8";
  throughput: number; // tokens or items processed / sec
  memoryEstimateMb?: number;
}

type PipeFn = (input: string, options?: Record<string, unknown>) => Promise<unknown>;

const checkWebGPUSupport = async (): Promise<boolean> => {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
  try {
    const adapter = await (navigator as unknown as { gpu: { requestAdapter: () => Promise<unknown> } }).gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
};

/**
 * Lazily loads a transformers.js pipeline IN THE BROWSER (no backend).
 * The heavy library + model download only happen on first `run()` — gated by
 * user intent — so nothing affects initial page load. Falls back gracefully:
 * on any failure `status` becomes "error" and `run` returns null.
 */
export const useTransformersPipeline = (task: string, model: string) => {
  const [status, setStatus] = useState<PipelineStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [telemetry, setTelemetry] = useState<InferenceTelemetry | null>(null);
  const [device, setDevice] = useState<"webgpu" | "wasm">("wasm");
  const pipeRef = useRef<PipeFn | null>(null);

  const ensureLoaded = useCallback(async (): Promise<boolean> => {
    if (pipeRef.current) return true;
    setStatus("loading");
    setProgress(0);
    try {
      const isWebGPUAvailable = await checkWebGPUSupport();
      const chosenDevice = isWebGPUAvailable ? "webgpu" : "wasm";
      setDevice(chosenDevice);

      const mod = await import("@huggingface/transformers");
      await configureLocalModels();
      const create = mod.pipeline as unknown as (
        t: string,
        m: string,
        o?: Record<string, unknown>
      ) => Promise<PipeFn>;

      pipeRef.current = await withRetry(() =>
        create(task, model, {
          // Only the quantized weights (onnx/model_quantized.onnx) are self-hosted. transformers.js
          // otherwise defaults to fp32 "model.onnx" on WebGPU, which 404s → "protobuf parsing failed".
          dtype: "q8",
          device: chosenDevice === "webgpu" ? "webgpu" : undefined,
        })
      );
      setStatus("ready");
      return true;
    } catch (err) {
      console.error("[useTransformersPipeline] failed to load the model", err);
      setStatus("error");
      return false;
    }
  }, [task, model]);

  const run = useCallback(
    async (input: string, options?: Record<string, unknown>): Promise<unknown> => {
      const ok = pipeRef.current ? true : await ensureLoaded();
      if (!ok || !pipeRef.current) return null;

      const t0 = performance.now();
      const result = await pipeRef.current(input, options);
      const elapsed = Math.max(1, Math.round(performance.now() - t0));

      const wordCount = Math.max(1, input.trim().split(/\s+/).length);
      const estTokens = Math.round(wordCount * 1.3);
      const estThroughput = Math.round((estTokens / (elapsed / 1000)) * 10) / 10;

      setTelemetry({
        latencyMs: elapsed,
        device,
        quantization: "int8",
        throughput: estThroughput,
        memoryEstimateMb: device === "webgpu" ? 38 : 65,
      });

      return result;
    },
    [ensureLoaded, device]
  );

  return { status, progress, telemetry, device, run };
};
