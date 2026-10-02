import type { Browser } from "puppeteer-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { gotoHome, hasChrome, launchBrowser, layoutFor, openPage, sectionTop, sleep, waitUntil, walkPage } from "./helpers";

describe.skipIf(!hasChrome)("navigation (desktop)", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  const NAV_OFFSET = 90;
  const landed = async (page: import("puppeteer-core").Page, id: string) =>
    waitUntil(async () => Math.abs((await sectionTop(page, id)) - NAV_OFFSET) <= 8, `#${id} to settle under the navbar`, 6000, 150);

  it("each navbar link scrolls its section to just under the nav", async () => {
    const { page, problems } = await openPage(browser);
    await gotoHome(page);
    for (const { id } of layoutFor("recruiter").nav) {
      await page.evaluate((i) => (document.querySelector(`nav a[href="#${i}"]`) as HTMLElement).click(), id);
      await landed(page, id);
    }
    expect(problems).toEqual([]);
    await page.close();
  });

  // Regression: lazily-mounted sections (Awards → Contact) were never observed, so the highlight stuck on "Work".
  it("the active navbar link follows the section on screen, including lazy-loaded ones, and is exposed via aria-current", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await sleep(2500); // let the lazy sections mount
    for (const item of layoutFor("recruiter").nav) {
      await page.evaluate((i) => (document.querySelector(`nav a[href="#${i}"]`) as HTMLElement).click(), item.id);
      await landed(page, item.id);
      const active = await waitUntil(
        () => page.evaluate(() => document.querySelector('nav a[aria-current="location"]')?.textContent?.trim()),
        `active link for #${item.id}`,
        4000
      );
      expect(active, `active link at #${item.id}`).toBe(item.label);
    }
    await page.close();
  });

  it("the side rail's section number matches the page's own (0N) numbering", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await sleep(2500);
    await page.evaluate(() => (document.querySelector('nav a[href="#contact"]') as HTMLElement).click());
    await landed(page, "contact");
    const expected = String(layoutFor("recruiter").nav.findIndex((n) => n.id === "contact") + 1).padStart(2, "0");
    const shown = await waitUntil(
      () => page.evaluate(() => document.querySelector('nav[aria-label="Scroll progress and section index"]')?.textContent ?? ""),
      "side rail text",
      4000
    );
    expect(shown).toContain(`(${expected})`);
    await page.close();
  });

  it("Ctrl+K opens the command palette and a command navigates; Esc closes it", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await page.keyboard.down("Control");
    await page.keyboard.press("k");
    await page.keyboard.up("Control");
    await page.waitForSelector('[role="dialog"][aria-label="Command palette"]');
    await page.keyboard.type("contact");
    await page.keyboard.press("Enter");
    await landed(page, "contact");
    await waitUntil(async () => !(await page.$('[role="dialog"][aria-label="Command palette"]')), "palette to close", 4000);

    await page.keyboard.down("Control");
    await page.keyboard.press("k");
    await page.keyboard.up("Control");
    await page.waitForSelector('[role="dialog"][aria-label="Command palette"]');
    await page.keyboard.press("Escape");
    await waitUntil(async () => !(await page.$('[role="dialog"][aria-label="Command palette"]')), "palette to close on Esc", 4000);
    await page.close();
  });

  it("the page can be smooth-scrolled by wheel all the way down and back up to the top", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await page.mouse.move(700, 450);
    for (let i = 0; i < 60; i++) {
      await page.mouse.wheel({ deltaY: 300 });
      await sleep(25);
    }
    await sleep(1500);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(3000);
    await page.keyboard.press("Home");
    await waitUntil(async () => (await page.evaluate(() => scrollY)) < 5, "Home key to reach the top", 5000);
    await page.close();
  });
});

describe.skipIf(!hasChrome)("navigation (mobile)", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  it("the menu opens as a dialog, locks body scroll, and a link scrolls to its section", async () => {
    const { page } = await openPage(browser, { profile: "mobile" });
    await gotoHome(page);
    await page.evaluate(() => (document.querySelector('button[aria-label="Open menu"]') as HTMLElement).click());
    await page.waitForSelector('[role="dialog"][aria-label="Navigation Menu"]');
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");

    await page.evaluate(() => (document.querySelector('[role="dialog"][aria-label="Navigation Menu"] a[href="#projects"]') as HTMLElement).click());
    await waitUntil(async () => Math.abs(await sectionTop(page, "projects")) <= 120, "#projects to be in view", 6000, 150);
    await page.close();
  });

  it("a long scroll on a phone viewport still reaches every section", async () => {
    const { page, problems } = await openPage(browser, { profile: "mobile" });
    await gotoHome(page);
    await walkPage(page, 500);
    expect(problems).toEqual([]);
    await page.close();
  });
});
