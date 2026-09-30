import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Assistant from "./Assistant";
import { ASSISTANT_FALLBACK, ASSISTANT_INTENTS } from "../../data/assistant";

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

describe("Assistant — English keyword matching", () => {
  const ask = async (q: string) => {
    const user = userEvent.setup();
    render(<Assistant />);
    await user.click(screen.getByLabelText("Open assistant — ask about Krishna"));
    await user.type(screen.getByPlaceholderText("Ask a question…"), q);
    await user.click(screen.getByLabelText("Send"));
  };

  it("does not match a short pattern buried inside an unrelated word ('cv' in 'zxcv')", async () => {
    await ask("asdf qwer zxcv");
    expect(await screen.findByText(ASSISTANT_FALLBACK, {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.queryByText(/résumé is one click away/i)).not.toBeInTheDocument();
  });

  it("still matches a pattern at the start of a word ('tools' → 'tool')", async () => {
    await ask("what tools does he know");
    const skills = ASSISTANT_INTENTS.find((i) => i.id === "skills")!;
    expect(await screen.findByText(skills.answer.slice(0, 40), { exact: false }, { timeout: 3000 })).toBeInTheDocument();
  });

  it("still routes 'chatgpt' to the GenAI intent", async () => {
    await ask("does he use chatgpt");
    const genai = ASSISTANT_INTENTS.find((i) => i.id === "genai")!;
    expect(await screen.findByText(genai.answer.slice(0, 40), { exact: false }, { timeout: 3000 })).toBeInTheDocument();
  });
});
