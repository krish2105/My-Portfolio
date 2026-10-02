import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FullPortfolioCue from "./FullPortfolioCue";
import { ViewModeProvider, useViewMode } from "../../lib/viewMode";

const Probe = () => <output data-testid="mode">{useViewMode().mode}</output>;

describe("FullPortfolioCue", () => {
  afterEach(() => localStorage.clear());

  it("tells a recruiter this is the short view and offers the full Technical or Business page", () => {
    render(
      <ViewModeProvider>
        <FullPortfolioCue />
        <Probe />
      </ViewModeProvider>
    );
    expect(screen.getByText(/short recruiter view/i)).toBeInTheDocument();
    expect(screen.getByTestId("mode")).toHaveTextContent("recruiter");

    fireEvent.click(screen.getByRole("button", { name: /technical/i }));
    expect(screen.getByTestId("mode")).toHaveTextContent("technical");
    expect(localStorage.getItem("view-mode")).toBe("technical");
  });

  it("the Business button switches to the Business view", () => {
    render(
      <ViewModeProvider>
        <FullPortfolioCue />
        <Probe />
      </ViewModeProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /business/i }));
    expect(screen.getByTestId("mode")).toHaveTextContent("business");
  });

  it("renders nothing outside the recruiter view (the full page is already showing)", () => {
    localStorage.setItem("view-mode", "technical");
    const { container } = render(
      <ViewModeProvider>
        <FullPortfolioCue />
      </ViewModeProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
