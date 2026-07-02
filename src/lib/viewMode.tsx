/* eslint-disable react-refresh/only-export-components --
   This module intentionally co-exports the ViewModeProvider component and the
   useViewMode() hook (same pattern as theme.tsx / sound.tsx). */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

/**
 * Audience routing for the "command center" concept — lets a visitor tell
 * the site who they are so sections can bias which depth/copy they lead
 * with. Persisted so a recruiter who picks "Recruiter" once doesn't have to
 * re-pick on every visit.
 */
export type ViewMode = "recruiter" | "technical" | "business";

export const VIEW_MODES: { id: ViewMode; label: string }[] = [
  { id: "recruiter", label: "Recruiter" },
  { id: "technical", label: "Technical" },
  { id: "business", label: "Business" },
];

interface ViewModeCtx {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}

const Ctx = createContext<ViewModeCtx>({ mode: "recruiter", setMode: () => {} });

export const useViewMode = () => useContext(Ctx);

const STORAGE_KEY = "view-mode";

const readInitial = (): ViewMode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "recruiter" || stored === "technical" || stored === "business") return stored;
  } catch {
    /* ignore */
  }
  return "recruiter";
};

export const ViewModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ViewMode>(readInitial);

  const setMode = (next: ViewMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return <Ctx.Provider value={{ mode, setMode }}>{children}</Ctx.Provider>;
};
