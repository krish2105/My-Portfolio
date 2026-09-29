import { describe, it, expect, beforeEach } from "vitest";
import { soundFx } from "./soundFx";

describe("soundFx", () => {
  beforeEach(() => {
    soundFx.setEnabled(false);
  });

  it("defaults to disabled or respects stored preference", () => {
    expect(soundFx.isEnabled()).toBe(false);
  });

  it("toggles enabled state and persists", () => {
    const next = soundFx.toggle();
    expect(next).toBe(true);
    expect(soundFx.isEnabled()).toBe(true);
    expect(localStorage.getItem("portfolio_sound_enabled")).toBe("true");

    const off = soundFx.toggle();
    expect(off).toBe(false);
    expect(soundFx.isEnabled()).toBe(false);
    expect(localStorage.getItem("portfolio_sound_enabled")).toBe("false");
  });

  it("safely handles playClick, playHover, playChime without throwing in headless environments", () => {
    soundFx.setEnabled(true);
    expect(() => {
      soundFx.playClick();
      soundFx.playHover();
      soundFx.playChime();
      soundFx.playWarning();
    }).not.toThrow();
  });
});
