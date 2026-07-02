import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme";

const Probe = () => {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} data-testid="probe">
      {theme}
    </button>
  );
};

describe("ThemeProvider / useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark when nothing is persisted and no attribute is preset", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("dark");
  });

  it("reads the initial theme from the pre-paint data-theme attribute (no-FOUC contract)", () => {
    // The real app sets this via an inline <script> in index.html before React
    // mounts, specifically to avoid a flash of the wrong theme.
    document.documentElement.setAttribute("data-theme", "light");
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("probe")).toHaveTextContent("light");
  });

  it("toggle() flips the theme, updates the DOM attribute, and persists to localStorage", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    const btn = screen.getByTestId("probe");
    expect(btn).toHaveTextContent("dark");

    fireEvent.click(btn);

    expect(btn).toHaveTextContent("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("toggling twice returns to the original theme", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    const btn = screen.getByTestId("probe");
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(btn).toHaveTextContent("dark");
  });
});
