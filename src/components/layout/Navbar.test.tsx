import { afterEach, describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import Navbar from "./Navbar";
import { ViewModeProvider } from "../../lib/viewMode";

const desktopNav = () => within(screen.getByRole("navigation", { name: "Primary" }));

describe("Navbar follows the layout for the current audience", () => {
  afterEach(() => localStorage.clear());

  it("recruiter: Work, Experience, Skills, Credentials, Contact — no About, no Résumé, no 'What I Do'", () => {
    render(
      <ViewModeProvider>
        <Navbar />
      </ViewModeProvider>
    );
    const nav = desktopNav();
    for (const label of ["Work", "Experience", "Skills", "Credentials", "Contact"]) expect(nav.getByRole("link", { name: label })).toBeInTheDocument();
    for (const label of ["About", "Résumé", "What I Do", "Awards", "Trust & Thinking"]) expect(nav.queryByRole("link", { name: label })).not.toBeInTheDocument();
  });

  it("technical: adds About and Résumé", () => {
    localStorage.setItem("view-mode", "technical");
    render(
      <ViewModeProvider>
        <Navbar />
      </ViewModeProvider>
    );
    const nav = desktopNav();
    expect(nav.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(nav.getByRole("link", { name: "Résumé" })).toBeInTheDocument();
  });

  it("nav links never wrap onto two lines", () => {
    render(
      <ViewModeProvider>
        <Navbar />
      </ViewModeProvider>
    );
    expect(desktopNav().getByRole("link", { name: "Experience" })).toHaveClass("whitespace-nowrap");
  });
});
