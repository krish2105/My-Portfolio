/**
 * Vercel serverless function (Edge runtime) that sends the contact-form
 * message via the Resend API. The Resend API key stays server-side and is
 * never exposed to the browser.
 *
 * Required env var (set in your Vercel project settings):
 *   RESEND_API_KEY        — your Resend API key (re_...)
 * Optional:
 *   CONTACT_TO_EMAIL      — where messages are delivered (defaults below)
 *   CONTACT_FROM_EMAIL    — a verified Resend sender, e.g. "Portfolio <hello@yourdomain.com>"
 *                           (defaults to Resend's shared onboarding sender)
 */
export const config = { runtime: "edge" };

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

const ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = (s: string): string => s.replace(/[&<>"']/g, (c) => ESCAPE[c]);

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ error: "Email service is not configured." }, 503);

  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !message) return json({ error: "Name and message are required." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: "A valid email is required." }, 400);

  const to = process.env.CONTACT_TO_EMAIL ?? "krishnamathur008@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: subject ? `Portfolio — ${subject}` : `Portfolio message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject || "(none)")}</p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text();
    return json({ error: "Failed to send message.", detail }, 502);
  }

  return json({ ok: true });
}
