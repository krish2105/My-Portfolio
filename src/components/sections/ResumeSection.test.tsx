import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ResumeSection from "./ResumeSection";

describe("ResumeSection (now 'Résumé tools')", () => {
  it("keeps the tools: role-tailored PDF, job-description matcher, hiring summary", () => {
    render(<ResumeSection />);
    expect(screen.getByRole("heading", { level: 2, name: /résumé tools/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /check match/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy hiring summary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /preview tailored pdf/i })).toBeInTheDocument();
  });

  it("no longer repeats the experience timeline or the skills / flagship snapshot (they live in their own sections)", () => {
    render(<ResumeSection />);
    expect(screen.queryByText(/Education & Experience/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Core competencies/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Flagship projects —/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /show all skills/i })).not.toBeInTheDocument();
  });
});
