import type { Browser, Page } from "puppeteer-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { gotoHome, hasChrome, launchBrowser, openPage, sleep, waitUntil } from "./helpers";

const DIALOG = '[role="dialog"][aria-label="Portfolio assistant"]';
const INPUT = '[aria-label="Ask the assistant a question"]';
const CHIPS = new Set(["What has Krishna built?", "Best project for a data analyst role", "Is he available for work?", "What are his skills?"]);

describe.skipIf(!hasChrome)("portfolio assistant", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  const openAssistant = async (page: Page) => {
    await page.evaluate(() => (document.querySelector('button[aria-label^="Open assistant"]') as HTMLElement).click());
    await page.waitForSelector(INPUT, { timeout: 5000 });
  };

  /** Sends `q` and returns the bot's reply text (everything after the user's message, minus the suggestion chips). */
  const ask = async (page: Page, q: string): Promise<string> => {
    await page.type(INPUT, q);
    await page.keyboard.press("Enter");
    const read = () =>
      page.evaluate(
        (sel, question) => {
          const lines = (document.querySelector(sel) as HTMLElement).innerText.split("\n").map((l) => l.trim()).filter(Boolean);
          const i = lines.lastIndexOf(question);
          return i < 0 ? [] : lines.slice(i + 1);
        },
        DIALOG,
        q
      );
    let last = "";
    return waitUntil(
      async () => {
        const reply = (await read()).filter((l) => !CHIPS.has(l)).join(" ⏎ ");
        if (reply.length > 15 && reply === last) return reply; // stable across two polls = finished typing
        last = reply;
        return "";
      },
      `a reply to "${q}"`,
      10_000,
      700
    );
  };

  it("answers structured, project-specific and fallback questions correctly", async () => {
    const { page, problems } = await openPage(browser);
    await gotoHome(page);
    await openAssistant(page);

    expect(await ask(page, "/compare FinCopilot vs Sakan")).toContain("FinCopilot vs Sakan AI");
    expect(await ask(page, "tell me about MediFlow")).toContain("MediFlow AI —");
    expect(await ask(page, "what is fraud shield")).toContain("FraudShield AI —");
    expect(await ask(page, "best project for a data analyst role")).toContain("Lulu Sales Intelligence");
    // "zxcv" used to match the résumé intent by raw substring ("cv"); it must fall through to the honest fallback.
    const nonsense = await ask(page, "asdf qwer zxcv");
    expect(nonsense).toContain("I can answer questions about Krishna's");
    expect(nonsense).not.toMatch(/résumé is one click away/i);
    expect(problems).toEqual([]);
    await page.close();
  });

  it("describes the internship as the résumé does (no credit-scoring / underwriting claims)", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await openAssistant(page);
    const reply = await ask(page, "tell me about his internship");
    expect(reply).toContain("Machine Learning Intern at Intelliza Solutions");
    expect(reply).not.toMatch(/credit scoring|underwriting/i);
    await page.close();
  });

  it("handles Arabic with the honest Arabic fallback, and never renders HTML from user input", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    await openAssistant(page);
    expect(await ask(page, "مرحبا")).toMatch(/[؀-ۿ]/);
    await ask(page, '<img src=x onerror="window.__xss=1">');
    await sleep(300);
    expect(await page.evaluate(() => !!document.querySelector('img[src="x"]') || !!(window as unknown as { __xss?: number }).__xss)).toBe(false);
    await page.close();
  });

  it("opens from the launcher, reports its state via aria-expanded, and closes on Escape", async () => {
    const { page } = await openPage(browser);
    await gotoHome(page);
    const expanded = () => page.evaluate(() => document.querySelector('button[aria-label$="assistant"], button[aria-label^="Open assistant"], button[aria-label="Close assistant"][aria-expanded]')?.getAttribute("aria-expanded"));
    expect(await expanded()).toBe("false");
    await openAssistant(page);
    expect(await waitUntil(async () => (await expanded()) === "true", "aria-expanded=true", 3000)).toBe(true);
    await page.keyboard.press("Escape");
    await waitUntil(async () => (await expanded()) === "false", "aria-expanded=false after Escape", 3000);
    await page.close();
  });
});
