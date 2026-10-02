import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ScrollTelemetryRail from "./ScrollTelemetryRail";
import { ViewModeProvider } from "../../lib/viewMode";

const realMatchMedia = window.matchMedia;

describe("ScrollTelemetryRail", () => {
  beforeEach(() => {
    // Pretend we're ≥1280px wide so the (desktop-only) rail renders.
    window.matchMedia = ((q: string) => ({ matches: true, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false })) as typeof window.matchMedia;
  });
  afterEach(() => {
    window.matchMedia = realMatchMedia;
    localStorage.clear();
  });

  it("has one jump dot per nav destination for the current audience, numbered like the page", () => {
    render(
      <ViewModeProvider>
        <ScrollTelemetryRail />
      </ViewModeProvider>
    );
    const dots = screen.getAllByRole("button", { name: /jump to section/i });
    expect(dots.map((d) => d.getAttribute("aria-label"))).toEqual([
      "Jump to section 01: Work",
      "Jump to section 02: Experience",
      "Jump to section 03: Skills",
      "Jump to section 04: Credentials",
      "Jump to section 05: Contact",
    ]);
    expect(screen.getByText("/ 05")).toBeInTheDocument();
  });

  it("no longer shows a frames-per-second counter", () => {
    render(
      <ViewModeProvider>
        <ScrollTelemetryRail />
      </ViewModeProvider>
    );
    expect(screen.queryByText(/fps/i)).not.toBeInTheDocument();
  });
});
