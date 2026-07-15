import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Assistant from "./Assistant";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("Assistant — Arabic query routing", () => {
  it("answers a basic Arabic question ('who is Krishna') from the small Arabic intent subset", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    await user.click(screen.getByLabelText("Open assistant — ask about Krishna"));
    const input = screen.getByPlaceholderText("Ask a question…");
    await user.type(input, "من هو كريشنا");
    await user.click(screen.getByLabelText("Send"));

    expect(await screen.findByText(/مطوّر ذكاء اصطناعي/, {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it("falls back to the honest Arabic limitation message for an uncovered Arabic question", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    await user.click(screen.getByLabelText("Open assistant — ask about Krishna"));
    const input = screen.getByPlaceholderText("Ask a question…");
    await user.type(input, "ما هي أفضل وصفة للطبخ");
    await user.click(screen.getByLabelText("Send"));

    expect(
      await screen.findByText(/أستطيع الإجابة بالعربية على الأسئلة الأساسية/, {}, { timeout: 3000 })
    ).toBeInTheDocument();
  });
});
