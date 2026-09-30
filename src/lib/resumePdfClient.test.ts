import { afterEach, describe, expect, it, vi } from "vitest";
import { buildResumePdf } from "./resumePdfClient";

const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]; // "%PDF"

describe("buildResumePdf", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("falls back to generating on the main thread when Web Workers are unavailable (e.g. jsdom)", async () => {
    vi.stubGlobal("Worker", undefined);
    const bytes = await buildResumePdf("ai-engineer");
    expect(Array.from(bytes.slice(0, 4))).toEqual(PDF_MAGIC);
  });

  it("generates in a worker when available and resolves with the worker's bytes", async () => {
    const posted: unknown[] = [];
    class FakeWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      postMessage(msg: { id: number; role: string }) {
        posted.push(msg);
        queueMicrotask(() => this.onmessage?.({ data: { id: msg.id, bytes: new Uint8Array([1, 2, 3]) } } as MessageEvent));
      }
      terminate() {}
    }
    vi.stubGlobal("Worker", FakeWorker);
    vi.resetModules();
    const { buildResumePdf: fresh } = await import("./resumePdfClient");
    const bytes = await fresh("mlops-engineer");
    expect(Array.from(bytes)).toEqual([1, 2, 3]);
    expect(posted).toHaveLength(1);
    expect((posted[0] as { role: string }).role).toBe("mlops-engineer");
  });

  it("falls back to the main thread when the worker reports an error", async () => {
    class BrokenWorker {
      onmessage: ((e: MessageEvent) => void) | null = null;
      onerror: ((e: ErrorEvent) => void) | null = null;
      postMessage(msg: { id: number }) {
        queueMicrotask(() => this.onmessage?.({ data: { id: msg.id, error: "boom" } } as MessageEvent));
      }
      terminate() {}
    }
    vi.stubGlobal("Worker", BrokenWorker);
    vi.resetModules();
    const { buildResumePdf: fresh } = await import("./resumePdfClient");
    const bytes = await fresh("data-analytics");
    expect(Array.from(bytes.slice(0, 4))).toEqual(PDF_MAGIC);
  });
});
