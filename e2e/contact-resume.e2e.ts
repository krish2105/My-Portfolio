import type { Browser, Page } from "puppeteer-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { baseUrl, gotoHome, hasChrome, launchBrowser, openPage, sleep, waitUntil, walkPage, workersCreated } from "./helpers";

describe.skipIf(!hasChrome)("contact form", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  const errors = (page: Page) => page.$$eval("#contact form span.text-\\[\\#ff5f56\\]", (els) => els.map((e) => e.textContent ?? ""));
  const field = (label: string) => `#contact ${label}`;
  const submit = (page: Page) => page.evaluate(() => (document.querySelector('#contact button[type="submit"]') as HTMLElement).click());

  it("validates empty and malformed input, then sends a well-formed payload and clears the form", async () => {
    const { page, contactCalls, problems } = await openPage(browser);
    await gotoHome(page);
    await walkPage(page);
    await page.evaluate(() => document.querySelector("#contact form")!.scrollIntoView({ block: "center" }));
    await sleep(500);

    await submit(page);
    await waitUntil(async () => (await errors(page)).length === 3, "three required-field errors", 3000);

    await page.type(field('input[placeholder="Your name"]'), "Test User");
    await page.type(field('input[placeholder="you@example.com"]'), "not-an-email");
    await page.type(field("textarea"), "Hello from the e2e suite");
    await submit(page);
    await waitUntil(async () => (await errors(page)).some((e) => /valid email/i.test(e)), "invalid-email error", 3000);

    await page.click(field('input[placeholder="you@example.com"]'), { clickCount: 3 });
    await page.type(field('input[placeholder="you@example.com"]'), "test@example.com");
    await page.select(field("select"), "GitHub");
    await sleep(1600); // the form refuses sub-1.5s submissions as bot-like; a human takes longer
    await submit(page);
    await waitUntil(async () => /Message sent/.test(await page.$eval("#contact form", (f) => (f as HTMLElement).innerText)), "success message", 5000);

    expect(contactCalls).toHaveLength(1);
    expect(contactCalls[0]).toMatchObject({ name: "Test User", email: "test@example.com", referral: "GitHub", company: "" });
    expect(Number(contactCalls[0].elapsedMs)).toBeGreaterThan(1500);
    expect(await page.$eval(field('input[placeholder="Your name"]'), (i) => (i as HTMLInputElement).value)).toBe("");
    expect(problems).toEqual([]);
    await page.close();
  });

  it("falls back to the mail client when the API is unavailable (so no message is lost)", async () => {
    const { page } = await openPage(browser, { contact: "503" });
    await gotoHome(page);
    await walkPage(page);
    await page.evaluate(() => document.querySelector("#contact form")!.scrollIntoView({ block: "center" }));
    await page.type(field('input[placeholder="Your name"]'), "Test User");
    await page.type(field('input[placeholder="you@example.com"]'), "test@example.com");
    await page.type(field("textarea"), "Hello");
    await sleep(1600);
    await submit(page);
    await waitUntil(async () => /mail client/i.test(await page.$eval("#contact form", (f) => (f as HTMLElement).innerText)), "mailto fallback message", 5000);
    await page.close();
  });
});

describe.skipIf(!hasChrome)("résumé section", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  it("serves the self-hosted résumé PDF", async () => {
    const res = await fetch(`${baseUrl()}/resume/Krishna_Mathur_Resume.pdf`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/pdf/);
    expect(bytes.length).toBeGreaterThan(5000);
    expect(String.fromCharCode(...bytes.slice(0, 5))).toBe("%PDF-");
  });

  it("audience tabs, the job-description matcher and the hiring-summary copy all work", async () => {
    const { page, problems } = await openPage(browser);
    await gotoHome(page);
    await walkPage(page);
    await page.evaluate(() => document.getElementById("resume")!.scrollIntoView());
    await sleep(500);

    for (const tab of ["TECHNICAL", "BUSINESS", "RECRUITER"]) {
      const clicked = await page.evaluate((t) => {
        const b = ([...document.querySelectorAll("#resume button")] as HTMLElement[]).find((x) => x.innerText.trim() === t);
        b?.click();
        return !!b;
      }, tab);
      expect(clicked, `tab ${tab}`).toBe(true);
    }
    await page.type("#resume textarea", "We need an AI engineer with Python, RAG, LangGraph, FastAPI and SQL experience for a Dubai fintech.");
    await page.evaluate(() => ([...document.querySelectorAll("#resume button")] as HTMLElement[]).find((b) => /check match/i.test(b.innerText))!.click());
    await waitUntil(async () => /match|%|score/i.test(await page.$eval("#resume", (s) => (s as HTMLElement).innerText)), "JD match output", 4000);
    expect(problems).toEqual([]);
    await page.close();
  });

  it("builds the role-tailored PDF in a Web Worker once the card nears the viewport, and swaps the download to it", async () => {
    const { page, problems } = await openPage(browser);
    await gotoHome(page);
    expect(await workersCreated(page), "no PDF worker before the card is near").toEqual([]);

    await page.evaluate(() => ([...document.querySelectorAll("#resume button")] as HTMLElement[]).find((b) => /preview tailored pdf/i.test(b.innerText))!.scrollIntoView({ block: "center" }));
    await waitUntil(async () => (await workersCreated(page)).some((u) => /resumePdf\.worker/.test(u)), "résumé PDF worker to start", 10_000);
    await waitUntil(() => page.evaluate(() => (document.querySelector("#resume a[download]") as HTMLAnchorElement | null)?.href.startsWith("blob:")), "download link to become a generated blob", 15_000);

    // …and switching role regenerates it.
    const before = await page.evaluate(() => (document.querySelector("#resume a[download]") as HTMLAnchorElement).href);
    await page.evaluate(() => ([...document.querySelectorAll("#resume button")] as HTMLElement[]).find((b) => /MLOps/i.test(b.innerText))!.click());
    await waitUntil(() => page.evaluate((b) => (document.querySelector("#resume a[download]") as HTMLAnchorElement).href !== b, before), "role switch to rebuild the PDF", 15_000);
    expect(problems).toEqual([]);
    await page.close();
  });
});
