/**
 * Link-rot check for the portfolio's project links. Run with `npm run check:links` (also weekly in CI).
 *
 *  - every liveUrl must answer 200, and — where the host serves a real <title> — that title must match the
 *    project (this is what catches a link that quietly points at a *different* app);
 *  - every repositoryUrl must be publicly reachable (a repo that went private or was renamed away 404s).
 *
 * Exits 1 on any failure so a scheduled run notifies the owner.
 */
import { projects } from "../src/data/portfolio";
import { canCheckTitle, extractTitle, isStreamlitHost, titleMatchesProject } from "../src/lib/linkCheck";

const TIMEOUT_MS = 30_000;

const get = async (url: string) => {
  const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS), headers: { "user-agent": "portfolio-link-check" } });
  return { status: res.status, body: await res.text() };
};

let failures = 0;
const report = (ok: boolean, label: string, detail: string) => {
  if (!ok) failures++;
  console.log(`${ok ? "ok  " : "FAIL"}  ${label.padEnd(34)} ${detail}`);
};

for (const p of projects) {
  if (p.liveUrl && isStreamlitHost(p.liveUrl)) {
    // Streamlit answers a cookie-less client with an endless auth-redirect loop and may be asleep, so a
    // plain fetch can't judge it. Accept "it responds" (200, or the first redirect) — don't follow the loop.
    try {
      const res = await fetch(p.liveUrl, { redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS) });
      report(res.status === 200 || (res.status >= 300 && res.status < 400), `${p.id} live`, `responds, HTTP ${res.status} (Streamlit; may be asleep) ${p.liveUrl}`);
    } catch (err) {
      report(false, `${p.id} live`, `${err instanceof Error ? err.message : err} ${p.liveUrl}`);
    }
  } else if (p.liveUrl) {
    try {
      const { status, body } = await get(p.liveUrl);
      if (status !== 200) report(false, `${p.id} live`, `HTTP ${status} ${p.liveUrl}`);
      else if (!canCheckTitle(p.liveUrl)) report(true, `${p.id} live`, `200 (title not checkable) ${p.liveUrl}`);
      else {
        const title = extractTitle(body);
        report(titleMatchesProject(title, p), `${p.id} live`, `"${title ?? "no title"}" ${p.liveUrl}`);
      }
    } catch (err) {
      report(false, `${p.id} live`, `${err instanceof Error ? err.message : err} ${p.liveUrl}`);
    }
  }
  if (p.repositoryUrl) {
    try {
      const { status } = await get(p.repositoryUrl);
      report(status === 200, `${p.id} repo`, `HTTP ${status} ${p.repositoryUrl}`);
    } catch (err) {
      report(false, `${p.id} repo`, `${err instanceof Error ? err.message : err} ${p.repositoryUrl}`);
    }
  }
}

console.log(failures ? `\n${failures} link problem(s).` : "\nAll project links healthy.");
process.exit(failures ? 1 : 0);
