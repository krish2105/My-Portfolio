import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionHeader from "./SectionHeader";
import { ViewModeProvider } from "../../lib/viewMode";

const renderHeader = (id: string, label: string) =>
  render(
    <ViewModeProvider>
      <SectionHeader id={id} label={label} />
    </ViewModeProvider>
  );

describe("SectionHeader", () => {
  afterEach(() => localStorage.clear());

  it("shows the section's number for the current mode, taken from the one layout table", () => {
    renderHeader("projects", "Selected Work");
    expect(screen.getByText("(01)")).toBeInTheDocument();
    expect(screen.getByText("Selected Work")).toBeInTheDocument();
  });

  it("the same section gets a different number in the full layout", () => {
    localStorage.setItem("view-mode", "technical");
    renderHeader("resume", "Résumé tools");
    expect(screen.getByText("(06)")).toBeInTheDocument();
  });

  it("shows no number for a section that isn't a nav destination", () => {
    renderHeader("github", "Open-source activity");
    expect(screen.queryByText(/^\(\d\d\)$/)).not.toBeInTheDocument();
    expect(screen.getByText("Open-source activity")).toBeInTheDocument();
  });
});
