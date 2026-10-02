import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import ProjectsSection from "./ProjectsSection";
import { ViewModeProvider } from "../../lib/viewMode";
import { projects } from "../../data/portfolio";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("ProjectsSection variants", () => {
  afterEach(() => {
    window.history.pushState({}, "", "/");
    localStorage.clear();
  });

  it("strip: shows the flagship proof strip, not the domain filters or the pinned gallery", () => {
    render(
      <ViewModeProvider>
        <ProjectsSection variant="strip" />
      </ViewModeProvider>
    );
    const section = document.getElementById("projects")!;
    expect(within(section).getByRole("list", { name: /also built/i })).toBeInTheDocument();
    expect(within(section).queryByRole("group", { name: /filter projects by domain/i })).not.toBeInTheDocument();
  });

  it("strip: a case-study button still opens the modal and keeps the /work/<slug> deep link in sync", () => {
    render(
      <ViewModeProvider>
        <ProjectsSection variant="strip" />
      </ViewModeProvider>
    );
    const flagship = projects.find((p) => p.status === "Independent Project")!;
    const card = screen.getByRole("heading", { level: 3, name: flagship.shortTitle }).closest("article") as HTMLElement;
    fireEvent.click(within(card).getByRole("button", { name: /case study/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(window.location.pathname).toBe(`/work/${flagship.id}`);
  });
});
