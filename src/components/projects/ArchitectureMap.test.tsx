import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArchitectureMap from "./ArchitectureMap";

const STEPS = [
  { label: "Ingest", detail: "Pulls in raw data." },
  { label: "Score", detail: "Runs the model." },
  { label: "Serve", detail: undefined },
];

describe("ArchitectureMap", () => {
  it("shows a hint and no detail panel content until a stage is selected", () => {
    render(<ArchitectureMap steps={STEPS} />);
    expect(screen.getByText(/select a stage above/i)).toBeInTheDocument();
    expect(screen.queryByText("Pulls in raw data.")).not.toBeInTheDocument();
  });

  it("reveals a stage's real detail on click, and toggles it off on a second click", async () => {
    const user = userEvent.setup();
    render(<ArchitectureMap steps={STEPS} />);

    await user.click(screen.getByRole("button", { name: /ingest/i }));
    expect(await screen.findByText("Pulls in raw data.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ingest/i }));
    await waitFor(() => {
      expect(screen.queryByText("Pulls in raw data.")).not.toBeInTheDocument();
    });
  });

  it("disables the button for a stage with no detail, rather than showing an empty panel", () => {
    render(<ArchitectureMap steps={STEPS} />);
    expect(screen.getByRole("button", { name: /serve/i })).toBeDisabled();
  });
});
