import { afterEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { ViewModeProvider } from "../lib/viewMode";
import { usePageLayout, useSectionNumber } from "./usePageLayout";

const wrapper = ({ children }: { children: ReactNode }) => <ViewModeProvider>{children}</ViewModeProvider>;

describe("usePageLayout", () => {
  afterEach(() => localStorage.clear());

  it("defaults to the recruiter layout", () => {
    const { result } = renderHook(() => usePageLayout(), { wrapper });
    expect(result.current.mode).toBe("recruiter");
    expect(result.current.sections[0]).toBe("home");
    expect(result.current.sections).not.toContain("about");
    expect(result.current.nav.map((n) => n.id)).toContain("projects");
  });

  it("follows a persisted audience choice (full page for Technical)", () => {
    localStorage.setItem("view-mode", "technical");
    const { result } = renderHook(() => usePageLayout(), { wrapper });
    expect(result.current.sections).toContain("about");
    expect(result.current.sections).toContain("resume");
  });

  it("useSectionNumber formats the nav position as (0N) and is empty for un-numbered sections", () => {
    const { result: work } = renderHook(() => useSectionNumber("projects"), { wrapper });
    expect(work.current).toBe("(01)");
    const { result: gh } = renderHook(() => useSectionNumber("github"), { wrapper });
    expect(gh.current).toBe("");
  });
});
