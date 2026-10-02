import type { Browser, Page } from "puppeteer-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { projects } from "../src/data/portfolio";
import { gotoHome, hasChrome, launchBrowser, openPage, sleep, waitUntil, walkPage } from "./helpers";

const CARD = '#projects button[aria-label^="Open case study"]';
const MODAL = '[role="dialog"][aria-modal="true"]';
const norm = (u: string) => new URL(u).href.replace(/\/$/, "");

describe.skipIf(!hasChrome)("projects", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  /** Opens the case-study modal for `title` via a DOM click (the cards live in a scroll-pinned horizontal track). */
  const openModal = async (page: Page, id: string) => {
    const title = projects.find((p) => p.id === id)!.title;
    await page.evaluate(
      (t, sel) => (([...document.querySelectorAll(sel)] as HTMLElement[]).find((b) => b.getAttribute("aria-label") === `Open case study: ${t}`) as HTMLElement).click(),
      title,
      CARD
    );
    await page.waitForSelector(MODAL, { timeout: 5000 });
    await sleep(250);
  };
  const closeModal = async (page: Page) => {
    await page.keyboard.press("Escape");
    await waitUntil(async () => !(await page.$(MODAL)), "modal to close on Escape", 4000);
  };

  it("shows a card for every project", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    expect(await page.$$eval(CARD, (b) => b.length)).toBe(projects.length);
    await page.close();
  });

  it("every case-study modal opens with real content, moves focus inside, and closes on Escape", async () => {
    const { page, problems } = await openPage(browser);
    await gotoHome(page);
    for (const p of projects) {
      await openModal(page, p.id);
      const info = await page.evaluate((m) => {
        const d = document.querySelector(m)!;
        return { chars: (d as HTMLElement).innerText.length, focusInside: d.contains(document.activeElement) };
      }, MODAL);
      expect(info.chars, `${p.id} modal content`).toBeGreaterThan(200);
      expect(info.focusInside, `${p.id} focus trap`).toBe(true);
      await closeModal(page);
    }
    expect(problems).toEqual([]);
    await page.close();
  });

  // Regression: ComplianceAgent's Live demo linked to a different app, and Lulu linked to a repo that went private.
  it("each modal links to exactly the live demo / repo the data says (and never to a private repo)", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    for (const p of projects) {
      await openModal(page, p.id);
      const hrefs = (await page.$$eval(`${MODAL} a[href]`, (as) => as.map((a) => (a as HTMLAnchorElement).href))).map(norm);
      if (p.liveUrl) expect(hrefs, `${p.id} live link`).toContain(norm(p.liveUrl));
      if (p.repositoryUrl) expect(hrefs, `${p.id} repo link`).toContain(norm(p.repositoryUrl));
      expect(hrefs.join(" "), `${p.id}`).not.toMatch(/mercydeez|frontend-three-pi-15|Compilance/);
      await closeModal(page);
    }
    await page.close();
  });

  it("the domain filters show exactly the projects carrying that tag", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    const clickFilter = (label: string) =>
      page.evaluate(
        (l) => ([...document.querySelectorAll('#projects [role="group"][aria-label="Filter projects by domain"] button')] as HTMLElement[]).find((b) => b.innerText.trim() === l)!.click(),
        label
      );
    for (const f of ["AI/ML", "Deep Learning", "GenAI", "Data", "All"]) {
      await clickFilter(f);
      const expected = f === "All" ? projects.length : projects.filter((p) => p.tags?.includes(f as never)).length;
      await waitUntil(async () => (await page.$$eval(CARD, (b) => b.length)) === expected, `${f}: ${expected} cards`, 4000);
    }
    await page.close();
  });

  it("the scroll-pinned track brings every card fully into view at some scroll position", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    const geo = await page.evaluate((sel) => {
      let el: HTMLElement | null = document.querySelector(sel);
      while (el && getComputedStyle(el).position !== "sticky") el = el.parentElement;
      const r = el!.parentElement!.getBoundingClientRect();
      return { top: r.top + scrollY, h: r.height, vh: innerHeight };
    }, CARD);
    const seen = new Set<number>();
    for (let y = geo.top; y <= geo.top + geo.h - geo.vh + 1; y += 120) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(50);
      const visible = await page.evaluate(
        (sel) => ([...document.querySelectorAll(sel)] as HTMLElement[]).map((b, i) => (b.getBoundingClientRect().left >= 0 && b.getBoundingClientRect().right <= innerWidth ? i : -1)).filter((i) => i >= 0),
        CARD
      );
      visible.forEach((i) => seen.add(i));
    }
    expect(seen.size).toBe(projects.length);
    await page.close();
  });

  it("deep link /work/<slug> opens the modal; closing resets the URL; Back closes a modal opened from the page", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page, "/work/fraudshield");
    await page.waitForSelector(MODAL, { timeout: 8000 });
    await closeModal(page);
    expect(await page.evaluate(() => location.pathname)).toBe("/");

    await walkPage(page);
    await openModal(page, "mediflow");
    expect(await page.evaluate(() => location.pathname)).toBe("/work/mediflow");
    await page.goBack();
    await waitUntil(async () => !(await page.$(MODAL)), "Back to close the modal", 4000);
    await page.close();
  });
});
