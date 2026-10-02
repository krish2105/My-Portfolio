import type { Browser } from "puppeteer-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { ViewMode } from "../src/lib/viewModeTypes";
import { baseUrl, gotoHome, hasChrome, launchBrowser, layoutFor, openPage, sleep, waitUntil, walkPage } from "./helpers";

const REMOVED = ["services", "recognition", "trust"]; // cut in the restructure — must never come back as ids

const CASES = (["desktop", "mobile"] as const).flatMap((profile) => (["recruiter", "technical"] as const).map((mode) => [profile, mode] as const));

describe.skipIf(!hasChrome).each(CASES)("smoke (%s, %s view)", (profile, mode: ViewMode) => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  it("renders exactly the sections this audience should see, with no console errors, exceptions or failed requests", async () => {
    const { page, problems } = await openPage(browser, { profile, mode });
    await gotoHome(page);
    expect(await page.title()).toContain("Krishna Mathur");
    await walkPage(page);

    const ids = await page.evaluate(() => [...document.querySelectorAll("main section[id]")].map((s) => s.id));
    expect(ids).toEqual(layoutFor(mode).ids);
    for (const gone of REMOVED) expect(ids).not.toContain(gone);
    expect(problems).toEqual([]);
    await page.close();
  });

  it("has no horizontal overflow, before or after loading every lazy section", async () => {
    const { page } = await openPage(browser, { profile, mode });
    await gotoHome(page);
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(await overflow()).toBeLessThanOrEqual(1);
    await walkPage(page);
    expect(await overflow()).toBeLessThanOrEqual(1);
    await page.close();
  });

  it("every in-page anchor has a target and every new-tab link is rel=noopener", async () => {
    const { page } = await openPage(browser, { profile, mode });
    await gotoHome(page);
    await walkPage(page);
    const report = await page.evaluate(() => {
      const missing = [...new Set([...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href")!))].filter((h) => h.length > 1 && !document.querySelector(h));
      const unsafe = [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/noopener/.test((a as HTMLAnchorElement).rel)).map((a) => (a as HTMLAnchorElement).href);
      return { missing, unsafe };
    });
    expect(report).toEqual({ missing: [], unsafe: [] });
    await page.close();
  });
});

describe.skipIf(!hasChrome)("intro animation", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  const overlay = (page: import("puppeteer-core").Page) => page.evaluate(() => !!document.querySelector('[role="status"][aria-label="Loading site"]'));

  it("plays on the first visit of a session (and finishes quickly), then is skipped on reload", async () => {
    const { page } = await openPage(browser, { intro: true });
    await page.goto(baseUrl(), { waitUntil: "domcontentloaded" });
    await waitUntil(() => overlay(page), "intro overlay to appear", 3000, 20);
    await waitUntil(async () => !(await overlay(page)), "intro overlay to disappear", 2500, 50);
    expect(await page.evaluate(() => sessionStorage.getItem("intro-seen"))).toBe("1");

    await page.reload({ waitUntil: "domcontentloaded" });
    const seen: boolean[] = [];
    for (let i = 0; i < 8; i++) {
      seen.push(await overlay(page));
      await sleep(40);
    }
    expect(seen.some(Boolean), "overlay must not flash on a repeat visit").toBe(false);
    await page.close();
  });
});
