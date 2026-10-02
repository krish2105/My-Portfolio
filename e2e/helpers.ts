import fs from "node:fs";
import path from "node:path";
import puppeteer, { type Browser, type HTTPRequest, type Page } from "puppeteer-core";
import { hasCredentials } from "../src/lib/credentials";
import { navFor, sectionsFor, type SectionKey } from "../src/lib/pageLayout";
import type { ViewMode } from "../src/lib/viewModeTypes";

/* ── Browser discovery ──────────────────────────────────────────────────────────── */
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/opt/google/chrome/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter((p): p is string => !!p);

export const chromePath = (): string | undefined => CHROME_CANDIDATES.find((p) => fs.existsSync(p));
/** Suites skip (rather than fail) on a machine with no Chrome installed. */
export const hasChrome = !!chromePath();

export const baseUrl = (): string => {
  const url = process.env.E2E_BASE_URL;
  if (!url) throw new Error("E2E_BASE_URL is not set (global setup did not run)");
  return url.replace(/\/$/, "");
};

export const launchBrowser = (): Promise<Browser> =>
  puppeteer.launch({ executablePath: chromePath(), headless: true, args: ["--no-sandbox"] });

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Polls `fn` until it returns a truthy value, or throws with `what` after `timeout` ms. */
export async function waitUntil<T>(fn: () => Promise<T> | T, what: string, timeout = 10_000, interval = 100): Promise<NonNullable<T>> {
  const start = Date.now();
  for (;;) {
    const v = await fn();
    if (v) return v as NonNullable<T>;
    if (Date.now() - start > timeout) throw new Error(`Timed out after ${timeout}ms waiting for: ${what}`);
    await sleep(interval);
  }
}

/* ── Hermetic page ─────────────────────────────────────────────────────────────────
 * Every cross-origin request is stubbed so results never depend on third-party sites, rate limits or
 * network weather: the GitHub API returns a fixed fixture, demo hosts answer 200, Vercel analytics is empty.  */
export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
} as const;
export type Profile = keyof typeof VIEWPORTS;

const GH_USER = { login: "krish2105", public_repos: 12, followers: 3, html_url: "https://github.com/krish2105" };
const GH_REPOS = [
  { name: "FinCopilot", html_url: "https://github.com/krish2105/FinCopilot", pushed_at: "2026-09-20T10:00:00Z", stargazers_count: 2, language: "Python", fork: false },
  { name: "SakanAgenticAi", html_url: "https://github.com/krish2105/SakanAgenticAi", pushed_at: "2026-09-18T10:00:00Z", stargazers_count: 1, language: "Python", fork: false },
  { name: "AutoValuate-Intelligence", html_url: "https://github.com/krish2105/AutoValuate-Intelligence", pushed_at: "2026-09-10T10:00:00Z", stargazers_count: 0, language: "TypeScript", fork: false },
];
const CORS = { "access-control-allow-origin": "*" };

/** The document-level headers vercel.json would add in production, for `csp: true` pages. */
function vercelHeadersFor(pathname: string): Record<string, string> {
  const config = JSON.parse(fs.readFileSync(path.resolve("vercel.json"), "utf8")) as {
    headers: { source: string; headers: { key: string; value: string }[] }[];
  };
  const out: Record<string, string> = {};
  for (const rule of config.headers) {
    if (new RegExp(`^${rule.source}$`).test(pathname)) {
      for (const h of rule.headers) if (h.key !== "Cache-Control") out[h.key.toLowerCase()] = h.value;
    }
  }
  return out;
}

/** What the page should render for an audience mode — straight from the same table the app uses. */
export const layoutFor = (mode: ViewMode) => {
  const o = { hasCredentials: hasCredentials() };
  const sections = sectionsFor(mode, o);
  // snapshot and marquee are sections without DOM ids; every other key is also the element id.
  const ids = sections.filter((k: SectionKey) => k !== "snapshot" && k !== "marquee");
  return { sections, ids, nav: navFor(mode, o) };
};

export interface OpenOptions {
  profile?: Profile;
  /** Audience mode to open in (default: recruiter, the site default). */
  mode?: ViewMode;
  /** Let the first-visit intro play (default: skipped, so tests don't wait on it). */
  intro?: boolean;
  /** Serve the document with the production CSP/headers from vercel.json. */
  csp?: boolean;
  /** How the stubbed /api/contact answers. */
  contact?: "ok" | "503";
}

export interface Opened {
  page: Page;
  /** Anything that should never happen on a healthy page: console errors, uncaught exceptions, failed same-origin requests. */
  problems: string[];
  contactCalls: Record<string, unknown>[];
}

export async function openPage(browser: Browser, opts: OpenOptions = {}): Promise<Opened> {
  const { profile = "desktop", mode = "recruiter", intro = false, csp = false, contact = "ok" } = opts;
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS[profile]);
  const problems: string[] = [];
  const contactCalls: Record<string, unknown>[] = [];
  const origin = new URL(baseUrl()).origin;

  await page.evaluateOnNewDocument((playIntro: boolean, viewMode: string) => {
    try {
      localStorage.setItem("theme", "dark");
      localStorage.setItem("view-mode", viewMode);
      if (!playIntro) sessionStorage.setItem("intro-seen", "1");
    } catch {
      /* storage blocked */
    }
    const w = window as unknown as { __csp: string[]; __workers: string[] };
    w.__csp = [];
    w.__workers = [];
    document.addEventListener("securitypolicyviolation", (e) => w.__csp.push(`${e.violatedDirective} → ${e.blockedURI || "inline"}`));
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        w.__workers.push(String(url));
      }
    };
  }, intro, mode);

  await page.setRequestInterception(true);
  page.on("request", async (req: HTTPRequest) => {
    const url = new URL(req.url());
    const sameOrigin = url.origin === origin;

    if (sameOrigin && url.pathname === "/api/contact") {
      contactCalls.push(JSON.parse(req.postData() || "{}"));
      return req.respond({ status: contact === "ok" ? 200 : 503, headers: CORS, contentType: "application/json", body: contact === "ok" ? '{"ok":true}' : '{"error":"x"}' });
    }
    if (sameOrigin && url.pathname === "/api/log-error") return req.respond({ status: 204 });
    if (sameOrigin && url.pathname.startsWith("/_vercel/")) return req.respond({ status: 200, contentType: "text/javascript", body: "" });

    if (sameOrigin) {
      if (csp && req.resourceType() === "document") {
        const upstream = await fetch(req.url());
        return req.respond({
          status: upstream.status,
          headers: { "content-type": upstream.headers.get("content-type") ?? "text/html", ...vercelHeadersFor(url.pathname) },
          body: Buffer.from(await upstream.arrayBuffer()),
        });
      }
      return req.continue();
    }

    if (url.host === "api.github.com") {
      const body = url.pathname.endsWith("/repos") ? GH_REPOS : GH_USER;
      return req.respond({ status: 200, headers: CORS, contentType: "application/json", body: JSON.stringify(body) });
    }
    // Everything else cross-origin (demo hosts, Google, analytics): a harmless empty 200.
    return req.respond({ status: 200, headers: CORS, contentType: "text/plain", body: "" });
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console.error: ${msg.text().slice(0, 300)}`);
  });
  page.on("pageerror", (e) => problems.push(`pageerror: ${String((e as Error).message).slice(0, 300)}`));
  page.on("requestfailed", (r) => {
    const failure = r.failure()?.errorText ?? "";
    if (new URL(r.url()).origin === origin && !/ERR_ABORTED|ERR_INTERNET_DISCONNECTED/.test(failure)) problems.push(`requestfailed: ${r.url()} ${failure}`);
  });
  page.on("response", (r) => {
    if (new URL(r.url()).origin === origin && r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`);
  });

  return { page, problems, contactCalls };
}

/** Navigate home and wait for the app shell to be interactive. */
export async function gotoHome(page: Page, path = "/"): Promise<void> {
  await page.goto(baseUrl() + path, { waitUntil: "networkidle2", timeout: 60_000 });
  await page.waitForSelector("#main-content", { timeout: 20_000 });
}

/** Scrolls through the whole page in steps so every lazy section mounts. */
export async function walkPage(page: Page, step = 600): Promise<void> {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(70);
  }
  await sleep(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
}

export const sectionTop = (page: Page, id: string) =>
  page.evaluate((i) => Math.round(document.getElementById(i)?.getBoundingClientRect().top ?? NaN), id);

export const cspViolations = (page: Page) => page.evaluate(() => (window as unknown as { __csp: string[] }).__csp.slice());
export const workersCreated = (page: Page) => page.evaluate(() => (window as unknown as { __workers: string[] }).__workers.slice());

/** True when the file is an unfetched Git LFS pointer (CI checks out without LFS). */
export const isLfsPointer = (relPath: string): boolean => {
  try {
    return fs.readFileSync(path.resolve(relPath)).subarray(0, 40).toString("utf8").startsWith("version https://git-lfs");
  } catch {
    return true;
  }
};
