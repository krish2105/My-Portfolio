/**
 * Lightweight, zero-cost client-error beacon — reports uncaught errors,
 * unhandled promise rejections, and React render errors to `/api/log-error`
 * (which just console.errors server-side, visible in the Vercel dashboard).
 * No third-party service, no API key. Production-only: in dev the browser
 * console is already the source of truth.
 */
const MAX_REPORTS_PER_SESSION = 8;
let sent = 0;

const report = (source: string, message: string, stack?: string) => {
  if (!import.meta.env.PROD) return;
  if (sent >= MAX_REPORTS_PER_SESSION) return;
  sent++;

  const payload = JSON.stringify({
    source,
    message,
    stack: stack ?? "",
    url: window.location.href,
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/log-error", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/log-error", { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  } catch {
    /* best-effort only — never let error reporting itself throw */
  }
};

/** Call once, near app startup. */
export const initErrorReporting = () => {
  window.addEventListener("error", (e) => {
    report("window.onerror", e.message, e.error?.stack);
  });
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;
    report("unhandledrejection", message, stack);
  });
};

/** Call from ErrorBoundary.componentDidCatch. */
export const reportBoundaryError = (error: Error, componentStack?: string) => {
  report("react-error-boundary", error.message, error.stack ?? componentStack);
};
