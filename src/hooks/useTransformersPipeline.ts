import { useCallback, useRef, useState } from "react";
import { configureLocalModels } from "../lib/transformersEnv";

export type PipelineStatus = "idle" | "loading" | "ready" | "error";

type PipeFn = (input: string, options?: Record<string, unknown>) => Promise<unknown>;

/**
 * Lazily loads a transformers.js pipeline IN THE BROWSER (no backend).
 * The heavy library + model download only happen on first `run()` — gated by
 * user intent — so nothing affects initial page load. Falls back gracefully:
 * on any failure `status` becomes "error" and `run` returns null.
 */
export const useTransformersPipeline = (task: string, model: string) => {
  const [status, setStatus] = useState<PipelineStatus>("idle");
  const [progress, setProgress] = useState(0);
  const pipeRef = useRef<PipeFn | null>(null);

  const ensureLoaded = useCallback(async (): Promise<boolean> => {
    if (pipeRef.current) return true;
    setStatus("loading");
    setProgress(0);
    try {
      const mod = await import("@huggingface/transformers");
      await configureLocalModels();
      const create = mod.pipeline as unknown as (
        t: string,
        m: string,
        o?: Record<string, unknown>
      ) => Promise<PipeFn>;
      // No progress_callback: transformers.js's streaming reader re-allocates
      // its whole buffer on every chunk when Content-Length is absent (common
      // for on-the-fly-compressed same-origin static responses), which is slow
      // and can fail outright on constrained networks. Without a callback it
      // takes the plain `response.arrayBuffer()` fast path instead — reliable,
      // at the cost of a numeric progress percentage.
      pipeRef.current = await create(task, model);
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
      return pipeRef.current(input, options);
    },
    [ensureLoaded]
  );

  return { status, progress, run };
};
