import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import JourneySection from "./JourneySection";
import { ViewModeProvider } from "../../lib/viewMode";
import { journey } from "../../data/portfolio";

describe("JourneySection (now the single 'Experience' timeline)", () => {
  afterEach(() => localStorage.clear());

  it("is labelled Experience — matching the nav — and numbered from the layout", () => {
    render(
      <ViewModeProvider>
        <JourneySection />
      </ViewModeProvider>
    );
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.queryByText("Journey")).not.toBeInTheDocument();
    expect(screen.getByText("(02)")).toBeInTheDocument(); // Work is (01) on the recruiter page
  });

  it("shows roles and education in one timeline, each with the résumé's wording", () => {
    render(
      <ViewModeProvider>
        <JourneySection />
      </ViewModeProvider>
    );
    for (const item of journey) expect(screen.getByRole("heading", { level: 3, name: item.title })).toBeInTheDocument();
  });
});
