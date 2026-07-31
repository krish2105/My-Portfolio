import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProjectModal from "./ProjectModal";
import type { Project } from "../../types/portfolio";

const project: Project = {
  id: "demo",
  number: "01",
  title: "Demo Project",
  shortTitle: "Demo",
  category: "Testing",
  status: "AI Prototype",
  description: "A fixture project for tests.",
  technologies: ["Vitest"],
  images: [],
  repositoryUrl: "https://github.com/example/demo",
};

describe("ProjectModal (focus trap, ESC-close, scroll-lock)", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    sessionStorage.clear();
    // useGitHubStats fetches on mount — stub it so tests never hit the real
    // network, and default to an empty-but-successful response so the "last
    // updated" signal simply doesn't render unless a test wants it to.
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve(
              url.includes("/repos") ? [] : { public_repos: 0, followers: 0, html_url: "https://github.com/krish2105" }
            ),
        } as Response)
      )
    );
  });
  afterEach(() => {
    document.body.style.overflow = "";
    vi.unstubAllGlobals();
  });

  it("renders nothing when project is null", () => {
    render(<ProjectModal project={null} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders a labelled dialog and locks body scroll when a project is passed", () => {
    render(<ProjectModal project={project} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Demo Project")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("calls onClose on Escape", () => {
    const onClose = vi.fn();
    render(<ProjectModal project={project} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop (but not the panel) is clicked", () => {
    const onClose = vi.fn();
    render(<ProjectModal project={project} onClose={onClose} />);
    fireEvent.click(screen.getByRole("dialog").parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    fireEvent.click(screen.getByText("Demo Project"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("restores body scroll after the project is cleared", () => {
    const { rerender } = render(<ProjectModal project={project} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<ProjectModal project={null} onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("Tab wraps focus from the last focusable element back to the first (focus trap)", () => {
    render(<ProjectModal project={project} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    const focusables = dialog.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("shows a real 'last updated' signal for a krish2105-owned repo, sourced from the GitHub API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve(
              url.includes("/repos")
                ? [{ name: "demo", html_url: "https://github.com/krish2105/demo", pushed_at: new Date().toISOString(), stargazers_count: 0, language: "TypeScript", fork: false }]
                : { public_repos: 1, followers: 0, html_url: "https://github.com/krish2105" }
            ),
        } as Response)
      )
    );
    render(<ProjectModal project={{ ...project, repositoryUrl: "https://github.com/krish2105/demo" }} onClose={vi.fn()} />);
    expect(await screen.findByText(/last updated on github: today/i)).toBeInTheDocument();
  });

  it("shows no 'last updated' signal for a repo outside the krish2105 account", async () => {
    render(<ProjectModal project={project} onClose={vi.fn()} />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.queryByText(/last updated on github/i)).not.toBeInTheDocument();
  });
});
