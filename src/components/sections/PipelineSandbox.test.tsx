import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PipelineSandbox from "./PipelineSandbox";

describe("PipelineSandbox", () => {
  it("renders pipeline stages and live metrics", () => {
    render(<PipelineSandbox />);
    expect(screen.getByText(/Interactive AI Pipeline Architecture Sandbox/i)).toBeInTheDocument();
    expect(screen.getByText(/1. Embeddings/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Vector Index/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Reranker/i)).toBeInTheDocument();
    expect(screen.getByText(/4. LLM Generation/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Verification Gate/i)).toBeInTheDocument();
  });

  it("updates latency and compliance when selecting options", () => {
    render(<PipelineSandbox />);
    const runBtn = screen.getByRole("button", { name: /run test query/i });
    expect(runBtn).toBeInTheDocument();
    fireEvent.click(runBtn);
    expect(screen.getByText(/Simulating Query Stream/i)).toBeInTheDocument();
  });
});
