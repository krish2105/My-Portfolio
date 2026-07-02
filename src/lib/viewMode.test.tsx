import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ViewModeProvider, useViewMode } from "./viewMode";

const Probe = () => {
  const { mode, setMode } = useViewMode();
  return (
    <div>
      <span data-testid="probe">{mode}</span>
      <button onClick={() => setMode("technical")}>technical</button>
      <button onClick={() => setMode("business")}>business</button>
      <button onClick={() => setMode("recruiter")}>recruiter</button>
    </div>
  );
};

describe("ViewModeProvider / useViewMode", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to recruiter when nothing is persisted", () => {
    render(
      <ViewModeProvider>
        <Probe />
      </ViewModeProvider>
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("recruiter");
  });

  it("reads a persisted valid mode from localStorage on mount", () => {
    localStorage.setItem("view-mode", "technical");
    render(
      <ViewModeProvider>
        <Probe />
      </ViewModeProvider>
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("technical");
  });

  it("ignores a corrupt/invalid persisted value and falls back to recruiter", () => {
    localStorage.setItem("view-mode", "not-a-real-mode");
    render(
      <ViewModeProvider>
        <Probe />
      </ViewModeProvider>
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("recruiter");
  });

  it("setMode updates state and persists to localStorage", () => {
    render(
      <ViewModeProvider>
        <Probe />
      </ViewModeProvider>
    );
    fireEvent.click(screen.getByText("business"));

    expect(screen.getByTestId("probe")).toHaveTextContent("business");
    expect(localStorage.getItem("view-mode")).toBe("business");
  });
});
