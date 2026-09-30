import { describe, expect, it } from "vitest";
import { INTRO_SEEN_KEY, markIntroPlayed, peekShouldPlayIntro, shouldPlayIntro } from "./intro";

const memoryStorage = (initial: Record<string, string> = {}) => {
  const data = { ...initial };
  return {
    data,
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, v: string) => void (data[k] = v),
  };
};

describe("shouldPlayIntro", () => {
  it("plays on the first visit of a session and records that it played", () => {
    const storage = memoryStorage();
    expect(shouldPlayIntro({ reducedMotion: false, storage })).toBe(true);
    expect(storage.data[INTRO_SEEN_KEY]).toBe("1");
  });

  it("skips it for the rest of the session (reloads, return navigation)", () => {
    const storage = memoryStorage({ [INTRO_SEEN_KEY]: "1" });
    expect(shouldPlayIntro({ reducedMotion: false, storage })).toBe(false);
  });

  it("never plays under prefers-reduced-motion, and doesn't burn the once-per-session flag", () => {
    const storage = memoryStorage();
    expect(shouldPlayIntro({ reducedMotion: true, storage })).toBe(false);
    expect(storage.data[INTRO_SEEN_KEY]).toBeUndefined();
  });

  it("still plays once when storage is unavailable or throws (private mode)", () => {
    expect(shouldPlayIntro({ reducedMotion: false, storage: null })).toBe(true);
    const throwing = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    };
    expect(shouldPlayIntro({ reducedMotion: false, storage: throwing })).toBe(true);
  });
});

describe("peekShouldPlayIntro / markIntroPlayed", () => {
  it("peeking has no side effects (safe to call during render, including StrictMode double-invocation)", () => {
    const storage = memoryStorage();
    expect(peekShouldPlayIntro({ reducedMotion: false, storage })).toBe(true);
    expect(peekShouldPlayIntro({ reducedMotion: false, storage })).toBe(true);
    expect(storage.data[INTRO_SEEN_KEY]).toBeUndefined();
    markIntroPlayed(storage);
    expect(peekShouldPlayIntro({ reducedMotion: false, storage })).toBe(false);
  });
});
