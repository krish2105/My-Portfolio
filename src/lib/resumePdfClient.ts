import type { TargetRoleId } from "./resumeRoles";

type WorkerReply = { id: number; bytes?: Uint8Array; error?: string };

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, { resolve: (b: Uint8Array) => void; reject: (e: Error) => void }>();

const failAll = (reason: string) => {
  for (const { reject } of pending.values()) reject(new Error(reason));
  pending.clear();
  worker?.terminate();
  worker = null;
};

const getWorker = (): Worker => {
  if (worker) return worker;
  const w = new Worker(new URL("./resumePdf.worker.ts", import.meta.url), { type: "module" });
  w.onmessage = (e: MessageEvent<WorkerReply>) => {
    const { id, bytes, error } = e.data;
    const entry = pending.get(id);
    if (!entry) return;
    pending.delete(id);
    if (bytes) entry.resolve(bytes);
    else entry.reject(new Error(error ?? "PDF worker failed"));
  };
  w.onerror = () => failAll("PDF worker crashed");
  worker = w;
  return w;
};

const viaWorker = (role: TargetRoleId) =>
  new Promise<Uint8Array>((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, role });
  });

/**
 * Builds the role-tailored résumé PDF in a Web Worker so neither loading pdf-lib nor synthesising the
 * document touches the main thread. Falls back to generating on the main thread if Workers are
 * unavailable or the worker fails, so the feature never disappears.
 */
export const buildResumePdf = async (role: TargetRoleId): Promise<Uint8Array> => {
  if (typeof Worker !== "undefined") {
    try {
      return await viaWorker(role);
    } catch {
      /* fall through to the main-thread path */
    }
  }
  const { generateTailoredResumePdf } = await import("./pdfGenerator");
  return generateTailoredResumePdf(role);
};
