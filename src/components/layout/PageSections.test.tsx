import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import PageSections from "./PageSections";
import { ViewModeProvider, useViewMode } from "../../lib/viewMode";

// Heavy sections are replaced by markers — this test is about *composition*, not the sections themselves.
// (Factories are inline because vi.mock is hoisted above any helper defined in this file.)
vi.mock("../hero/HeroSection", () => ({ default: () => <section id="home" data-testid="home" /> }));
vi.mock("../sections/ProjectsSection", () => ({
  default: ({ variant }: { variant?: string }) => <section id="projects" data-testid="projects" data-variant={variant} />,
}));
vi.mock("../sections/BentoSection", () => ({ default: () => <section id="snapshot" data-testid="snapshot" /> }));
vi.mock("../sections/TechnologyMarquee", () => ({ default: () => <section id="marquee" data-testid="marquee" /> }));
vi.mock("../sections/AboutSection", () => ({ default: () => <section id="about" data-testid="about" /> }));
vi.mock("../sections/JourneySection", () => ({ default: () => <section id="journey" data-testid="journey" /> }));
vi.mock("../sections/CapabilitiesSection", () => ({ default: () => <section id="skills" data-testid="skills" /> }));
vi.mock("../sections/GitHubActivity", () => ({ default: () => <section id="github" data-testid="github" /> }));
vi.mock("../sections/LiveDemo", () => ({ default: () => <section id="demo" data-testid="demo" /> }));
vi.mock("../sections/credentials/CredentialsSection", () => ({ default: () => <section id="credentials" data-testid="credentials" /> }));
vi.mock("../sections/ResumeSection", () => ({ default: () => <section id="resume" data-testid="resume" /> }));
vi.mock("../sections/ContactSection", () => ({ default: () => <section id="contact" data-testid="contact" /> }));
vi.mock("../assistant/Assistant", () => ({ default: () => <div data-testid="assistant" /> }));

/** A real control inside the provider, so the test switches audience the way a visitor does. */
const ModeButtons = () => {
  const { setMode } = useViewMode();
  return (
    <button type="button" onClick={() => setMode("technical")}>
      switch-to-technical
    </button>
  );
};
const wrap = (children: ReactNode) => (
  <ViewModeProvider>
    <ModeButtons />
    {children}
  </ViewModeProvider>
);

/** Lazy sections (credentials / github / demo / résumé) resolve a tick after the eager ones — wait for them first. */
const renderedIds = async (...lazyIds: string[]) => {
  await Promise.all(lazyIds.map((id) => screen.findByTestId(id)));
  return [...document.querySelectorAll("main > section[id]")].map((s) => s.id);
};

describe("PageSections", () => {
  afterEach(() => localStorage.clear());

  it("recruiter (the default): the short, proof-first page — and the strip variant of Work", async () => {
    render(wrap(<PageSections />));
    expect(await renderedIds("credentials")).toEqual(["home", "projects", "journey", "skills", "credentials", "contact"]);
    expect(screen.getByTestId("projects")).toHaveAttribute("data-variant", "strip");
  });

  it("technical: the full page, in the layout table's order, with the full gallery", async () => {
    localStorage.setItem("view-mode", "technical");
    render(wrap(<PageSections />));
    expect(await renderedIds("github", "demo", "credentials", "resume")).toEqual([
      "home", "projects", "snapshot", "marquee", "about", "journey", "skills", "github", "demo", "credentials", "resume", "contact",
    ]);
    expect(screen.getByTestId("projects")).toHaveAttribute("data-variant", "gallery");
  });

  it("is the <main> landmark and keeps the assistant reachable inside it", async () => {
    render(wrap(<PageSections />));
    await screen.findByTestId("contact");
    const main = document.querySelector("main#main-content");
    expect(main).not.toBeNull();
    expect(main!.contains(screen.getByTestId("assistant"))).toBe(true);
  });

  it("switching audience re-renders the page for that audience and scrolls to the top (the content below just changed)", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(wrap(<PageSections />));
    await screen.findByTestId("contact");
    expect(scrollTo).not.toHaveBeenCalled(); // not on first render

    fireEvent.click(screen.getByRole("button", { name: "switch-to-technical" }));
    await screen.findByTestId("resume");
    expect(document.getElementById("about")).not.toBeNull();
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    scrollTo.mockRestore();
  });
});
