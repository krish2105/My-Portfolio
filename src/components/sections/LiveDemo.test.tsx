import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LiveDemo from "./LiveDemo";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("LiveDemo — trade-off simulator tab", () => {
  it("switches to the trade-off simulator and reveals real reasoning on answer", async () => {
    const user = userEvent.setup();
    render(<LiveDemo />);

    await user.click(screen.getByRole("button", { name: "Trade-off simulator" }));
    expect(screen.getByText(/which trade-off would/i)).toBeInTheDocument();

    // Pick whichever option renders first — the real reasoning panel should
    // appear regardless of whether the pick was right or wrong.
    const options = await screen.findAllByRole("button", { name: /.+/ });
    const optionButtons = options.filter((b) => b.className.includes("items-start"));
    expect(optionButtons.length).toBeGreaterThanOrEqual(2);

    await user.click(optionButtons[0]);
    expect(await screen.findByText(/why he chose this/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next trade-off/i })).toBeInTheDocument();
  });
});
