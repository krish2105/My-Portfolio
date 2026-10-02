import { describe, expect, it } from "vitest";
import { navFor, scrollFallback, sectionIdsFor, sectionNumber, sectionsFor } from "./pageLayout";

const withCreds = { hasCredentials: true };
const noCreds = { hasCredentials: false };

const FULL = ["home", "projects", "snapshot", "marquee", "about", "journey", "skills", "github", "demo", "credentials", "resume", "contact"];

describe("sectionsFor", () => {
  it("recruiter: a short, proof-first page of six sections", () => {
    expect(sectionsFor("recruiter", withCreds)).toEqual(["home", "projects", "journey", "skills", "credentials", "contact"]);
  });

  it("technical and business: the full page, in the same order", () => {
    expect(sectionsFor("technical", withCreds)).toEqual(FULL);
    expect(sectionsFor("business", withCreds)).toEqual(FULL);
  });

  it("drops Credentials entirely when there is nothing real to show", () => {
    expect(sectionsFor("recruiter", noCreds)).not.toContain("credentials");
    expect(sectionsFor("technical", noCreds)).not.toContain("credentials");
  });

  it("never lists a section the owner cut", () => {
    for (const mode of ["recruiter", "technical", "business"] as const) {
      expect(sectionsFor(mode, withCreds)).not.toEqual(expect.arrayContaining(["services"]));
    }
  });
});

describe("navFor", () => {
  it("recruiter nav: Work, Experience, Skills, Credentials, Contact", () => {
    expect(navFor("recruiter", withCreds)).toEqual([
      { id: "projects", label: "Work" },
      { id: "journey", label: "Experience" },
      { id: "skills", label: "Skills" },
      { id: "credentials", label: "Credentials" },
      { id: "contact", label: "Contact" },
    ]);
  });

  it("full nav adds About and Résumé, and only lists sections that render", () => {
    const ids = navFor("technical", withCreds).map((n) => n.id);
    expect(ids).toEqual(["projects", "about", "journey", "skills", "credentials", "resume", "contact"]);
    for (const id of ids) expect(sectionsFor("technical", withCreds)).toContain(id);
    // snapshot / marquee / github / demo are on the page but are not nav destinations.
    expect(ids).not.toEqual(expect.arrayContaining(["github"]));
  });

  it("omits Credentials from the nav when it is hidden", () => {
    expect(navFor("recruiter", noCreds).map((n) => n.id)).toEqual(["projects", "journey", "skills", "contact"]);
  });
});

describe("sectionIdsFor / sectionNumber", () => {
  it("scrollspy ids are home plus every nav destination", () => {
    expect(sectionIdsFor("recruiter", withCreds)).toEqual(["home", "projects", "journey", "skills", "credentials", "contact"]);
  });

  it("section numbers are the 1-based nav position, so kickers, nav and the side rail always agree", () => {
    expect(sectionNumber("recruiter", "projects", withCreds)).toBe(1);
    expect(sectionNumber("recruiter", "contact", withCreds)).toBe(5);
    expect(sectionNumber("technical", "contact", withCreds)).toBe(7);
    expect(sectionNumber("technical", "resume", withCreds)).toBe(6);
  });

  it("numbers shift when Credentials is hidden", () => {
    expect(sectionNumber("recruiter", "contact", noCreds)).toBe(4);
  });

  it("un-navigable sections have no number", () => {
    expect(sectionNumber("technical", "github", withCreds)).toBeNull();
    expect(sectionNumber("technical", "demo", withCreds)).toBeNull();
    expect(sectionNumber("recruiter", "about", withCreds)).toBeNull(); // not on the recruiter page at all
  });
});

describe("scrollFallback (an action that targets a section the current mode doesn't render)", () => {
  it("About falls back to the top of the page", () => {
    expect(scrollFallback("about", "/resume.pdf")).toEqual({ type: "scroll", target: "home" });
  });
  it("Résumé falls back to the PDF itself", () => {
    expect(scrollFallback("resume", "/resume.pdf")).toEqual({ type: "link", target: "/resume.pdf" });
  });
  it("anything else has no fallback", () => {
    expect(scrollFallback("projects", "/resume.pdf")).toBeNull();
  });
});
