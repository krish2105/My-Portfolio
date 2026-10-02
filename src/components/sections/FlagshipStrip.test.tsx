import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import FlagshipStrip from "./FlagshipStrip";
import { projects } from "../../data/portfolio";
import type { Project } from "../../types/portfolio";

const independent = projects.filter((p) => p.status === "Independent Project");
const others = projects.filter((p) => p.status !== "Independent Project");

describe("FlagshipStrip", () => {
  it("shows exactly the independent systems as proof cards — not the academic projects", () => {
    render(<FlagshipStrip projects={projects} onOpen={() => {}} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(independent.length);
    for (const p of independent) expect(screen.getByRole("heading", { level: 3, name: p.shortTitle })).toBeInTheDocument();
    for (const p of others) expect(screen.queryByRole("heading", { level: 3, name: p.shortTitle })).not.toBeInTheDocument();
  });

  it("each card leads with one real outcome number from its own metrics", () => {
    render(<FlagshipStrip projects={projects} onOpen={() => {}} />);
    for (const p of independent) {
      const card = within(screen.getByRole("heading", { level: 3, name: p.shortTitle }).closest("article") as HTMLElement);
      expect(card.getByTestId("proof-metric").textContent).toContain(p.metrics![0].value);
      expect(card.getByText(p.metrics![0].label)).toBeInTheDocument();
    }
  });

  it("sets a parenthetical qualifier small beside the headline number, so long metrics don't break the card rhythm", () => {
    const withNote: Project = { ...independent[0], metrics: [{ value: "80 (76% coverage)", label: "Tests" }] };
    render(<FlagshipStrip projects={[withNote]} onOpen={() => {}} />);
    const metric = screen.getByTestId("proof-metric");
    expect(metric.textContent).toContain("80 (76% coverage)");
    expect(within(metric).getByText("(76% coverage)").tagName).toBe("SPAN");
    expect(within(metric).queryByText("80 (76% coverage)")).toBeNull();
  });

  it("links to the live demo, opens the case study, and links code only where the repo is public", () => {
    const onOpen = vi.fn();
    render(<FlagshipStrip projects={projects} onOpen={onOpen} />);
    for (const p of independent) {
      const card = within(screen.getByRole("heading", { level: 3, name: p.shortTitle }).closest("article") as HTMLElement);
      expect(card.getByRole("link", { name: new RegExp(`${p.shortTitle}.*live demo`, "i") })).toHaveAttribute("href", p.liveUrl);
      const code = card.queryByRole("link", { name: new RegExp(`${p.shortTitle}.*source code`, "i") });
      if (p.repositoryUrl) expect(code).toHaveAttribute("href", p.repositoryUrl);
      else expect(code).toBeNull();
      fireEvent.click(card.getByRole("button", { name: /case study/i }));
      expect(onOpen).toHaveBeenLastCalledWith(p);
    }
  });

  it("never invents a number for a project that has no metrics", () => {
    const bare: Project = { ...independent[0], id: "bare", shortTitle: "Bare Project", title: "Bare Project", metrics: undefined };
    render(<FlagshipStrip projects={[bare]} onOpen={() => {}} />);
    const card = within(screen.getByRole("heading", { level: 3, name: "Bare Project" }).closest("article") as HTMLElement);
    expect(card.queryByTestId("proof-metric")).toBeNull();
  });

  it("lists every other project under 'Also built' and opens its case study", () => {
    const onOpen = vi.fn();
    render(<FlagshipStrip projects={projects} onOpen={onOpen} />);
    const list = within(screen.getByRole("list", { name: /also built/i }));
    for (const p of others) expect(list.getByRole("button", { name: new RegExp(p.shortTitle, "i") })).toBeInTheDocument();
    fireEvent.click(list.getByRole("button", { name: new RegExp(others[0].shortTitle, "i") }));
    expect(onOpen).toHaveBeenCalledWith(others[0]);
  });
});
