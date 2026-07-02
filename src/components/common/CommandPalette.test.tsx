import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommandPalette from "./CommandPalette";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("CommandPalette", () => {
  it("shows the /uses command by default, but not the secret easter egg", () => {
    render(<CommandPalette open onClose={vi.fn()} onOpenUses={vi.fn()} onEasterEgg={vi.fn()} />);
    expect(screen.getByText("What this site is built with")).toBeInTheDocument();
    expect(screen.queryByText("🎉")).not.toBeInTheDocument();
  });

  it("reveals the easter egg only on an exact match of the secret phrase", async () => {
    const user = userEvent.setup();
    render(<CommandPalette open onClose={vi.fn()} onOpenUses={vi.fn()} onEasterEgg={vi.fn()} />);
    const input = screen.getByPlaceholderText(/jump to a section/i);

    await user.type(input, "par");
    expect(screen.queryByText("🎉")).not.toBeInTheDocument();

    await user.type(input, "ty");
    expect(screen.getByText("🎉")).toBeInTheDocument();
    // Only the secret command should be visible once revealed — not the full list.
    expect(screen.queryByText("What this site is built with")).not.toBeInTheDocument();
  });

  it("running the easter egg command calls onEasterEgg and closes the palette", async () => {
    const user = userEvent.setup();
    const onEasterEgg = vi.fn();
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} onOpenUses={vi.fn()} onEasterEgg={onEasterEgg} />);
    const input = screen.getByPlaceholderText(/jump to a section/i);

    await user.type(input, "party");
    await user.click(screen.getByText("🎉"));

    expect(onEasterEgg).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clicking the /uses command calls onOpenUses and closes the palette", async () => {
    const onOpenUses = vi.fn();
    const onClose = vi.fn();
    render(<CommandPalette open onClose={onClose} onOpenUses={onOpenUses} onEasterEgg={vi.fn()} />);

    await userEvent.click(screen.getByText("What this site is built with"));

    expect(onOpenUses).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
