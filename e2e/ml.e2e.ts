import type { Browser } from "puppeteer-core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { gotoHome, hasChrome, isLfsPointer, launchBrowser, openPage, sleep, waitUntil, walkPage } from "./helpers";

// CI checks the repo out without Git LFS, so the on-device models are pointer files there. Run these locally
// (or wherever the real files are present) — the file checks below make the skip explicit rather than silent.
const REAL_ASSETS =
  !isLfsPointer("public/ort/ort-wasm-simd-threaded.asyncify.wasm") &&
  !isLfsPointer("public/models/Xenova/all-MiniLM-L6-v2/onnx/model_quantized.onnx") &&
  !isLfsPointer("public/models/Xenova/distilbert-base-uncased-finetuned-sst-2-english/onnx/model_quantized.onnx");

describe.skipIf(!hasChrome || !REAL_ASSETS)("on-device ML (needs the real LFS model files)", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launchBrowser();
  });
  afterAll(async () => {
    await browser.close();
  });

  it("'Smart answers' downloads the embedding model and switches on", async () => {
    const { page, problems } = await openPage(browser, { mode: "technical" });
    await gotoHome(page);
    await page.evaluate(() => (document.querySelector('button[aria-label^="Open assistant"]') as HTMLElement).click());
    await page.waitForSelector('[aria-label="Ask the assistant a question"]');
    await page.evaluate(() => ([...document.querySelectorAll('[role="dialog"] button')] as HTMLElement[]).find((b) => /Enable smart answers/i.test(b.getAttribute("aria-label") ?? ""))!.click());
    await waitUntil(
      () => page.evaluate(() => /Smart answers are on/.test((document.querySelector('[role="dialog"][aria-label="Portfolio assistant"]') as HTMLElement).innerText)),
      "semantic model to load",
      60_000,
      500
    );

    // With the semantic index on, answers come from the same data the site renders — so the dates must be the résumé's.
    await page.type('[aria-label="Ask the assistant a question"]', "what did he do for a bank loan chatbot");
    await page.keyboard.press("Enter");
    const reply = await waitUntil(
      () => page.evaluate(() => {
        const t = (document.querySelector('[role="dialog"][aria-label="Portfolio assistant"]') as HTMLElement).innerText;
        return /Intelliza/.test(t.split("bank loan chatbot").pop() ?? "") ? t.split("bank loan chatbot").pop() : "";
      }),
      "an answer about the Intelliza internship",
      15_000,
      500
    );
    expect(reply).toMatch(/February 2025.{0,3}August 2025/);
    expect(reply).not.toMatch(/credit scoring|underwriting/i);
    expect(problems).toEqual([]);
    await page.close();
  });

  it("the Live Demo runs the real sentiment model (not the heuristic fallback)", async () => {
    const { page, problems } = await openPage(browser, { mode: "technical" });
    await gotoHome(page);
    await walkPage(page);
    await page.evaluate(() => document.getElementById("demo")!.scrollIntoView());
    await sleep(500);
    await page.evaluate(() => ([...document.querySelectorAll("#demo button")] as HTMLElement[]).find((b) => /try it/i.test(b.innerText))!.click());
    await sleep(1500);
    await page.evaluate(() => ([...document.querySelectorAll("#demo button")] as HTMLElement[]).find((b) => /analyse sentiment/i.test(b.innerText))!.click());
    const text = await waitUntil(
      async () => {
        const t = await page.evaluate(() => (document.getElementById("demo") as HTMLElement).innerText);
        return /HARDWARE TELEMETRY/i.test(t) || /fallback active/i.test(t) ? t : "";
      },
      "sentiment result",
      60_000,
      500
    );
    expect(text).toMatch(/HARDWARE TELEMETRY/i);
    expect(text).not.toMatch(/fallback active/i);
    expect(problems).toEqual([]);
    await page.close();
  });
});
