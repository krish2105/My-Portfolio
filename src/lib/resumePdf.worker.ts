/// <reference lib="webworker" />
import { generateTailoredResumePdf } from "./pdfGenerator";
import type { TargetRoleId } from "./resumeRoles";

/**
 * Builds the tailored résumé PDF off the main thread. pdf-lib's module evaluation plus the synthesis
 * itself were a 100–200 ms main-thread stall (on a throttled phone) that landed mid-scroll as the
 * Résumé section approached.
 */
self.onmessage = async (event: MessageEvent<{ id: number; role: TargetRoleId }>) => {
  const { id, role } = event.data;
  try {
    const bytes = await generateTailoredResumePdf(role);
    (self as unknown as Worker).postMessage({ id, bytes }, [bytes.buffer]);
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: err instanceof Error ? err.message : String(err) });
  }
};
