import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { useSound } from "../lib/sound";

/** Toggles the command palette on ⌘K / Ctrl-K (and "/" when not typing in a field). */
export const useCommandPalette = () => {
  const [open, setOpen] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        if (!open) {
          track("command_palette_opened", { trigger: "shortcut" });
          play("tick");
        }
        setOpen(!open);
        return;
      }
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el as HTMLElement)?.isContentEditable;
      if (k === "/" && !typing && !open) {
        e.preventDefault();
        track("command_palette_opened", { trigger: "slash" });
        play("tick");
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, play]);

  return { open, setOpen };
};
