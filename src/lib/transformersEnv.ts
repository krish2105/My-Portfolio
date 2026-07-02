/**
 * Configures transformers.js to load models ONLY from this site's own origin
 * (public/models/), never from the Hugging Face Hub / its CDN at runtime.
 *
 * Why: Hugging Face's CDN redirects to different regional edge domains
 * depending on the visitor's location, and a static CSP connect-src allowlist
 * can't reliably cover every one of them — which caused real "couldn't load
 * the model" failures for visitors whose traffic landed on an edge domain we
 * hadn't guessed. Self-hosting the (small, quantized) model files removes the
 * cross-origin dependency entirely: every visitor gets the exact same
 * same-origin request, with no external CDN or geography involved.
 */
let configured = false;

/**
 * Retries a flaky async op a couple of times with a short backoff. Loading a
 * ~20-60MB same-origin model file is usually reliable, but transient blips
 * (a dropped connection, a browser disk-cache write conflict) shouldn't
 * permanently fail the feature — one retry recovers almost all of these.
 */
export const withRetry = async <T>(fn: () => Promise<T>, attempts = 3, delayMs = 400): Promise<T> => {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
};

export const configureLocalModels = async () => {
  if (configured) return;
  const { env } = await import("@huggingface/transformers");
  env.allowLocalModels = true;
  env.allowRemoteModels = false;
  env.localModelPath = "/models/";
  // The onnxruntime-web WASM runtime otherwise fetches from a hardcoded
  // jsDelivr CDN URL at runtime (not the Vite-bundled copy) — self-host it
  // too so the whole pipeline is same-origin, with no external dependency.
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.wasmPaths = "/ort/";
  }
  configured = true;
};
