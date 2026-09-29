import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import CyberTerminal from "./CyberTerminal";

describe("CyberTerminal", () => {
  beforeEach(() => {
    // reset body
  });

  it("renders the floating launcher button", () => {
    render(<CyberTerminal />);
    expect(screen.getByRole("button", { name: /open cyber terminal cli/i })).toBeInTheDocument();
  });

  it("opens modal when clicking launcher button and responds to help command", async () => {
    render(<CyberTerminal />);
    const launcher = screen.getByRole("button", { name: /open cyber terminal cli/i });
    fireEvent.click(launcher);

    expect(screen.getByRole("dialog", { name: /developer cyber terminal/i })).toBeInTheDocument();

    const input = screen.getByLabelText(/cyber terminal input/i);
    expect(input).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(input, { target: { value: "help" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(screen.getByText(/projects \/ ls/i)).toBeInTheDocument();
  });

  it("executes projects command and displays real projects list", async () => {
    render(<CyberTerminal />);
    const launcher = screen.getByRole("button", { name: /open cyber terminal cli/i });
    fireEvent.click(launcher);

    const input = screen.getByLabelText(/cyber terminal input/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: "projects" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(screen.getAllByText(/fincopilot/i)[0]).toBeInTheDocument();
  });
});
