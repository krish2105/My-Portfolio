/**
 * Vercel serverless function (Edge runtime) that logs client-side JS errors
 * to the function's own logs (visible in the Vercel dashboard) — no
 * third-party error-tracking service, no API key, $0. Intentionally does
 * nothing beyond `console.error` server-side; it exists purely so a real
 * production failure is diagnosable instead of silently invisible.
 */
export const config = { runtime: "edge" };

interface ErrorPayload {
  message?: string;
  stack?: string;
  url?: string;
  source?: string;
}

const MAX_LEN = 2000;
const truncate = (s: string): string => (s.length > MAX_LEN ? s.slice(0, MAX_LEN) + "…" : s);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response(null, { status: 405 });

  let body: ErrorPayload;
  try {
    body = (await req.json()) as ErrorPayload;
  } catch {
    return new Response(null, { status: 204 });
  }

  console.error("[client-error]", {
    source: typeof body.source === "string" ? truncate(body.source) : "unknown",
    message: typeof body.message === "string" ? truncate(body.message) : "",
    stack: typeof body.stack === "string" ? truncate(body.stack) : "",
    url: typeof body.url === "string" ? truncate(body.url) : "",
  });

  // 204: the beacon doesn't need (and shouldn't wait for) a meaningful response.
  return new Response(null, { status: 204 });
}
