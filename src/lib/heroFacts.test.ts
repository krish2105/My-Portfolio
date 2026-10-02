import { describe, expect, it } from "vitest";
import { heroFacts } from "./heroFacts";

const base = { location: "Dubai, UAE", workAuthorization: "UAE student visa (transferable)", availabilityShort: "Open to roles" };

describe("heroFacts — the one line under the headline recruiters actually need", () => {
  it("shows location, work authorisation and availability, in that order", () => {
    expect(heroFacts(base)).toEqual(["Dubai, UAE", "UAE student visa (transferable)", "Open to roles"]);
  });

  it("states no start date unless a real one was supplied (never a guess)", () => {
    expect(heroFacts(base).join(" ")).not.toMatch(/available from/i);
  });

  it("formats a month-level start date", () => {
    expect(heroFacts({ ...base, availableFrom: "2026-11" })[2]).toBe("Available from Nov 2026");
  });

  it("formats a day-level start date", () => {
    expect(heroFacts({ ...base, availableFrom: "2026-11-15" })[2]).toBe("Available from 15 Nov 2026");
  });

  it("falls back to the short availability if the date is malformed rather than printing garbage", () => {
    expect(heroFacts({ ...base, availableFrom: "soon" })[2]).toBe("Open to roles");
  });
});
