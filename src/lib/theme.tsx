/* eslint-disable react-refresh/only-export-components --
   This module intentionally co-exports the ThemeProvider component and the
   useTheme() hook (standard theme-context pattern). */
import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import type { ReactNode } from "react";

export type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

export const useTheme = () => useContext(Ctx);

const readInitial = (): Theme => {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
  }
  return "dark";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(readInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore */
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f5f7fa" : "#050505");
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduced) {
      setTheme(next);
      return;
    }
    // flushSync forces the state update (and the effect that sets data-theme)
    // to commit synchronously inside the callback, so the API can correctly
    // snapshot the before/after states for the cross-fade.
    document.startViewTransition(() => flushSync(() => setTheme(next)));
  };

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
};
