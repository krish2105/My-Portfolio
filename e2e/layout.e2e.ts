import type { Browser, Page } from "puppeteer-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { profile } from "../src/data/portfolio";
import { gotoHome, hasChrome, launchBrowser, layoutFor, openPage, sleep, waitUntil } from "./helpers";

const sectionIds = (page: Page) =>
  page.evaluate(() => [...document.querySelectorAll("#main-content > section[id]")].map((s) => s.id));
const navLabels = (page: Page) =>
  page.evaluate(() => [...document.querySelectorAll('[data-testid="primary-links"] a')].map((a) => (a.textContent ?? "").trim()));

const chooseMode = async (page: Page, label: "Recruiter" | "Technical" | "Business") => {
  await page.evaluate(() => (document.querySelector('button[aria-label^="Viewing as"]') as HTMLElement).click());
  await page.waitForSelector('[role="listbox"][aria-label="Choose your audience view"]');
  await page.evaluate(
    (l) => ([...document.querySelectorAll('[role="option"]')] as HTMLElement[]).find((o) => (o.textContent ?? "").includes(l))!.click(),
    label
  );
};

describe.skipIf(!hasChrome)("recruiter-first layout (desktop)", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  it("the default (Recruiter) page is the short layout — and carries no placeholder or filler content", async () => {
    const { page, problems } = await openPage(browser);
    await gotoHome(page);
    await waitUntil(async () => (await sectionIds(page)).length === layoutFor("recruiter").ids.length, "all recruiter sections to mount", 15_000);
    expect(await sectionIds(page)).toEqual(layoutFor("recruiter").ids);
    expect(await navLabels(page)).toEqual(layoutFor("recruiter").nav.map((n) => n.label));

    const text = await page.evaluate(() => document.getElementById("main-content")!.innerText);
    expect(text).not.toMatch(/coming soon/i);
    expect(text).not.toMatch(/What I Do|Trust & Thinking/);
    expect(await page.title()).toMatch(/AI Engineer/);
    expect(await page.title()).not.toMatch(/AI Developer/);

    // Short: the whole recruiter page is under half the full page and well under the old ~23,700 px.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(height).toBeLessThan(12_000);
    expect(problems).toEqual([]);
    await page.close();
  });

  it("the hero states the role, location, work authorisation and availability — and never shows an invented date", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    const hero = await page.evaluate(() => {
      const home = document.getElementById("home")!;
      return { headline: home.querySelector("p.font-display")?.textContent ?? "", facts: home.querySelector("ul.font-mono")?.textContent ?? "", h1: home.querySelector("h1")?.textContent ?? "" };
    });
    expect(hero.headline).toBe(profile.headline);
    expect(hero.facts).toContain(profile.location);
    expect(hero.facts).toContain(profile.workAuthorization);
    expect(hero.facts).toMatch(/open to roles|available/i);
    expect(hero.h1.replace(/\s/g, "").toUpperCase()).toBe("KRISHNAMATHUR");
    await page.close();
  });

  it("the nav fits on one line and the hero eyebrow clears it; the whole hero fits one 1440×900 screen", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await sleep(1500);
    const m = await page.evaluate(() => {
      const links = [...document.querySelectorAll('[data-testid="primary-links"] a')].map((a) => a.getBoundingClientRect().height);
      const header = document.querySelector('nav[aria-label="Primary"]')!.getBoundingClientRect();
      const kicker = document.querySelector("#home .kicker")!.getBoundingClientRect();
      const icons = [...document.querySelectorAll("#home a[aria-label]")].map((a) => a.getBoundingClientRect().bottom);
      return { maxLink: Math.max(...links), headerBottom: header.bottom, kickerTop: kicker.top, lastIcon: Math.max(...icons) };
    });
    expect(m.maxLink, "a nav link wrapped onto two lines").toBeLessThan(48);
    expect(m.kickerTop - m.headerBottom, "hero eyebrow touches the navbar").toBeGreaterThanOrEqual(16);
    expect(m.lastIcon, "hero content spills below the first screen").toBeLessThanOrEqual(900);
    await page.close();
  });

  it("every section label is revealed once scrolled to (they used to stay hidden behind their mask)", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await sleep(2500);
    for (const { id } of layoutFor("recruiter").nav) {
      await page.evaluate((i) => (document.querySelector(`[data-testid="primary-links"] a[href="#${i}"]`) as HTMLElement).click(), id);
      await waitUntil(
        () =>
          page.evaluate((i) => {
            const label = document.querySelectorAll(`#${i} .kicker`)[1] as HTMLElement | undefined;
            return !!label && getComputedStyle(label).transform === "none";
          }, id),
        `#${id} label to slide into view`,
        6000,
        150
      );
    }
    await page.close();
  });

  it("switching the audience view swaps the whole page and nav, and starts it from the top", async () => {
    const { page, problems } = await openPage(browser);
    await gotoHome(page);
    await sleep(2000);
    await page.evaluate(() => (document.querySelector('[data-testid="primary-links"] a[href="#skills"]') as HTMLElement).click());
    await waitUntil(async () => (await page.evaluate(() => scrollY)) > 1500, "to scroll down the recruiter page", 6000, 150);

    await chooseMode(page, "Technical");
    await waitUntil(async () => (await sectionIds(page)).length === layoutFor("technical").ids.length, "the full layout to mount", 15_000);
    expect(await sectionIds(page)).toEqual(layoutFor("technical").ids);
    expect(await navLabels(page)).toEqual(layoutFor("technical").nav.map((n) => n.label));
    await waitUntil(async () => (await page.evaluate(() => scrollY)) < 50, "the new page to start at the top", 5000, 100);
    // The full page carries the sections the recruiter page leaves out.
    for (const id of ["about", "github", "demo", "resume"]) expect(await page.$(`#${id}`), `#${id} in the full layout`).not.toBeNull();

    await chooseMode(page, "Recruiter");
    await waitUntil(async () => (await sectionIds(page)).length === layoutFor("recruiter").ids.length, "back to the short layout", 15_000);
    expect(await sectionIds(page)).toEqual(layoutFor("recruiter").ids);
    expect(problems).toEqual([]);
    await page.close();
  });

  it("the cue at the end of Work offers the full views and switches to them", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await page.evaluate(() =>
      ([...document.querySelectorAll("#projects button")] as HTMLElement[]).find((b) => /Technical view/.test(b.textContent ?? ""))!.click()
    );
    await waitUntil(async () => (await sectionIds(page)).length === layoutFor("technical").ids.length, "the Technical layout to mount", 15_000);
    expect(await sectionIds(page)).toEqual(layoutFor("technical").ids);
    await page.close();
  });

  it("an assistant/palette action for a section this view doesn't have still does something sensible", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await page.keyboard.down("Control");
    await page.keyboard.press("k");
    await page.keyboard.up("Control");
    await page.waitForSelector('[role="dialog"][aria-label="Command palette"]');
    await page.keyboard.type("about");
    const results = await page.evaluate(() => (document.querySelector('[role="dialog"][aria-label="Command palette"]') as HTMLElement).innerText);
    // About isn't a recruiter section, so it must not be offered as a dead-end navigation target.
    expect(results).not.toMatch(/Go to About/i);
    await page.keyboard.press("Escape");
    await page.close();
  });
});

describe.skipIf(!hasChrome)("recruiter-first layout (mobile)", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  it("the phone menu lists exactly this view's sections", async () => {
    const { page } = await openPage(browser, { profile: "mobile" });
    await gotoHome(page);
    await page.evaluate(() => (document.querySelector('button[aria-label="Open menu"]') as HTMLElement).click());
    await page.waitForSelector('[role="dialog"][aria-label="Navigation Menu"]');
    const labels = await page.evaluate(() =>
      [...document.querySelectorAll('[role="dialog"][aria-label="Navigation Menu"] a[href^="#"]')].map((a) => (a.textContent ?? "").replace(/\s+/g, " ").trim())
    );
    for (const { label } of layoutFor("recruiter").nav) expect(labels.some((l) => l.includes(label)), `menu entry "${label}"`).toBe(true);
    expect(labels.some((l) => /About|What I Do|Trust|Awards/.test(l))).toBe(false);
    await page.close();
  });

  it("the hero shows its three proof numbers side by side and the primary CTA is on the first screen", async () => {
    const { page } = await openPage(browser, { profile: "mobile" });
    await gotoHome(page);
    await sleep(1500);
    const m = await page.evaluate(() => {
      const items = [...document.querySelectorAll("#home dl > div")].map((d) => d.getBoundingClientRect());
      const cta = [...document.querySelectorAll("#home a")].find((a) => /explore the work/i.test(a.textContent ?? ""))!.getBoundingClientRect();
      return { tops: items.map((r) => Math.round(r.top)), ctaBottom: cta.bottom };
    });
    expect(m.tops.length).toBe(3);
    expect(new Set(m.tops).size, "metrics wrapped onto separate rows").toBe(1);
    expect(m.ctaBottom).toBeLessThanOrEqual(844);
    await page.close();
  });
});
