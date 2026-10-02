import { describe, expect, it } from "vitest";
import { resolveAction } from "./assistantActions";

const scroll = (target: string) => ({ label: "x", type: "scroll" as const, target });
const present = (...ids: string[]) => (id: string) => ids.includes(id);

describe("resolveAction — assistant chips must never silently do nothing", () => {
  it("leaves a scroll action alone when its section is on the page", () => {
    expect(resolveAction(scroll("projects"), present("projects"), "/r.pdf")).toEqual(scroll("projects"));
  });

  it("About (absent on the recruiter page) scrolls to the top instead", () => {
    expect(resolveAction(scroll("about"), present("home", "projects"), "/r.pdf")).toEqual({ label: "x", type: "scroll", target: "home" });
  });

  it("Résumé (absent on the recruiter page) opens the PDF instead", () => {
    expect(resolveAction(scroll("resume"), present("home"), "/r.pdf")).toEqual({ label: "x", type: "link", target: "/r.pdf" });
  });

  it("keeps the original label when it falls back", () => {
    expect(resolveAction({ label: "Open résumé section", type: "scroll", target: "resume" }, present(), "/r.pdf").label).toBe("Open résumé section");
  });

  it("does not touch link or project actions", () => {
    const link = { label: "l", type: "link" as const, target: "https://example.com" };
    const project = { label: "p", type: "project" as const, target: "fincopilot" };
    expect(resolveAction(link, present(), "/r.pdf")).toEqual(link);
    expect(resolveAction(project, present(), "/r.pdf")).toEqual(project);
  });

  it("leaves an unknown missing section as-is (nothing sensible to fall back to)", () => {
    expect(resolveAction(scroll("nope"), present("home"), "/r.pdf")).toEqual(scroll("nope"));
  });
});
