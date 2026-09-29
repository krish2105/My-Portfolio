import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactTerminal } from "./ContactSection";

const fillRequiredFields = () => {
  fireEvent.change(screen.getByPlaceholderText("Your name"), { target: { value: "Ada Lovelace" } });
  fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByPlaceholderText("Tell me about your project or idea…"), {
    target: { value: "Hello there" },
  });
};

describe("ContactTerminal (honeypot + timing guard, submit flow)", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders a honeypot field that is hidden from sighted/keyboard users", () => {
    render(<ContactTerminal />);
    const honeypot = document.getElementById("company-website") as HTMLInputElement;
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("blocks submission and shows errors when required fields are empty", async () => {
    render(<ContactTerminal />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Message is required.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("flags an invalid email without blocking on the other fields", async () => {
    render(<ContactTerminal />);
    fillRequiredFields();
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "not-an-email" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("That doesn't look like a valid email.")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits the honeypot value and elapsed time alongside the real fields", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    render(<ContactTerminal />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({ name: "Ada Lovelace", email: "ada@example.com", company: "" });
    expect(typeof body.elapsedMs).toBe("number");
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });

  it("falls back to mailto when the API call fails (offline / not configured)", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("network down"));
    delete (window as unknown as { location?: unknown }).location;
    (window as unknown as { location: { href: string } }).location = { href: "" };

    render(<ContactTerminal />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(window.location.href).toContain("mailto:"));
    expect(await screen.findByText(/opening your mail client/i)).toBeInTheDocument();
  });
});
