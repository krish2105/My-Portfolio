import axe from "axe-core";
import type { Browser, Page } from "puppeteer-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { projects } from "../src/data/portfolio";
import { cspViolations, gotoHome, hasChrome, launchBrowser, openPage, sleep, waitUntil, walkPage } from "./helpers";

describe.skipIf(!hasChrome)("quality gates", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  const violations = async (page: Page) => {
    await page.evaluate(axe.source);
    return page.evaluate(async () => {
      const r = await (window as unknown as { axe: typeof axe }).axe.run(document);
      return r.violations.map((v) => `${v.impact} ${v.id} ×${v.nodes.length} e.g. ${v.nodes[0].target.join(" ").slice(0, 80)}`);
    });
  };

  it.each([
    ["desktop", "/"],
    ["desktop", "/work/fraudshield/"],
    ["mobile", "/"],
  ] as const)("axe finds no accessibility violations (%s %s)", async (profile, path) => {
    const { page } = await openPage(browser, { profile });
    await gotoHome(page, path);
    await walkPage(page);
    expect(await violations(page)).toEqual([]);
    await page.close();
  });

  it("the production CSP blocks nothing the app needs (full tour: every section, project modals, résumé PDF worker + preview, live demo, assistant)", async () => {
    const { page, problems } = await openPage(browser, { csp: true });
    await gotoHome(page);
    await walkPage(page);

    for (const p of projects.slice(0, 4)) {
      await page.evaluate((t) => ([...document.querySelectorAll('#projects button[aria-label^="Open case study"]')] as HTMLElement[]).find((b) => b.getAttribute("aria-label") === `Open case study: ${t}`)!.click(), p.title);
      await sleep(350);
      await page.keyboard.press("Escape");
      await sleep(250);
    }
    await page.evaluate(() => ([...document.querySelectorAll("#resume button")] as HTMLElement[]).find((b) => /preview tailored pdf/i.test(b.innerText))!.click());
    await waitUntil(() => page.evaluate(() => !!document.querySelector("#resume iframe")), "résumé preview iframe", 15_000);
    await page.evaluate(() => ([...document.querySelectorAll("#demo button")] as HTMLElement[]).find((b) => /try it/i.test(b.innerText))?.click());
    await sleep(1200);
    await page.evaluate(() => (document.querySelector('button[aria-label^="Open assistant"]') as HTMLElement).click());
    await sleep(600);

    expect(await cspViolations(page)).toEqual([]);
    expect(problems).toEqual([]);
    await page.close();
  });

  it("registers a service worker and still renders the app shell offline", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    const scope = await waitUntil(() => page.evaluate(async () => (await navigator.serviceWorker.ready).active?.state === "activated"), "service worker to activate", 15_000);
    expect(scope).toBe(true);
    await sleep(1500);
    await page.setOfflineMode(true);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 20_000 });
    await sleep(1500);
    expect(await page.evaluate(() => document.body.innerText.length)).toBeGreaterThan(200);
    await page.setOfflineMode(false);
    await page.close();
  });
});
