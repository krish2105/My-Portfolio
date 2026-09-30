import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_GEMINI_MODEL, generateGeminiResponse, getGeminiModel, setGeminiApiKey } from "./geminiService";

const okResponse = (text: string) =>
  new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }), { status: 200 });

describe("geminiService model selection", () => {
  beforeEach(() => {
    setGeminiApiKey("test-key-not-real");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    setGeminiApiKey("");
  });

  it("defaults to a current (non-retired) model, never the shut-down gemini-1.5-flash", () => {
    expect(getGeminiModel()).toBe(DEFAULT_GEMINI_MODEL);
    expect(DEFAULT_GEMINI_MODEL).not.toMatch(/1\.5/);
  });

  it("lets VITE_GEMINI_MODEL override the model", () => {
    vi.stubEnv("VITE_GEMINI_MODEL", "  gemini-custom-flash  ");
    expect(getGeminiModel()).toBe("gemini-custom-flash");
  });

  it("calls the configured model's generateContent endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse("hello"));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VITE_GEMINI_MODEL", "gemini-custom-flash");

    await expect(generateGeminiResponse("hi")).resolves.toBe("hello");
    expect(fetchMock.mock.calls[0][0]).toContain("/models/gemini-custom-flash:generateContent");
  });

  it("returns null (so the assistant falls back locally) and names the model when the API responds 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 404 })));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(generateGeminiResponse("hi")).resolves.toBeNull();
    expect(warn.mock.calls.flat().join(" ")).toContain(DEFAULT_GEMINI_MODEL);
    warn.mockRestore();
  });
});
