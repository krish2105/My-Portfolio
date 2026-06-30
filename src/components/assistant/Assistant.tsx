import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, ArrowUp } from "lucide-react";
import {
  ASSISTANT_INTENTS,
  ASSISTANT_SUGGESTIONS,
  ASSISTANT_GREETING,
  ASSISTANT_FALLBACK,
  type AssistantAction,
} from "../../data/assistant";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";
import { useMediaQuery } from "../../hooks/useMediaQuery";

interface Msg {
  role: "user" | "bot";
  text: string;
  actions?: AssistantAction[];
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

/** Score each intent by how many of its patterns appear in the query; best wins. */
const match = (query: string) => {
  const q = normalize(query);
  let best: { score: number; intent: (typeof ASSISTANT_INTENTS)[number] } | null = null;
  for (const intent of ASSISTANT_INTENTS) {
    let score = 0;
    for (const p of intent.patterns) if (q.includes(p)) score += p.length;
    if (score > 0 && (!best || score > best.score)) best = { score, intent };
  }
  return best?.intent ?? null;
};

const Assistant = () => {
  const { lenis } = useSmoothScroll();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [open, setOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: ASSISTANT_GREETING }]);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    // Scroll only the messages container — never the page.
    const box = scrollBoxRef.current;
    if (box) box.scrollTo({ top: box.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, thinking, reduced]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setDraft("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    const intent = match(q);
    const reply: Msg = intent
      ? { role: "bot", text: intent.answer, actions: intent.actions }
      : { role: "bot", text: ASSISTANT_FALLBACK };
    setThinking(true);
    const delay = reduced ? 0 : 480;
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, reply]);
    }, delay);
  };

  const runAction = (a: AssistantAction) => {
    if (a.type === "scroll") {
      setOpen(false);
      setTimeout(() => scrollTo(`#${a.target}`, lenis), 80);
    } else {
      window.open(a.target, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        data-cursor="Ask"
        aria-label={open ? "Close assistant" : "Open assistant — ask about Krishna"}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        className="fixed bottom-5 right-5 z-[115] inline-flex items-center gap-2 rounded-full border border-[#00FF94]/40 bg-[#0a0a0a]/90 px-4 py-3 text-sm font-semibold text-[#EDF5FA] shadow-[0_10px_40px_-8px_rgba(0,0,0,0.8)] backdrop-blur transition-colors hover:border-[#00FF94] md:bottom-7 md:right-7"
      >
        <Sparkles size={16} className="text-[#00FF94]" aria-hidden />
        <span className="hidden sm:inline">Ask AI</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-3 z-[116] flex h-[60vh] max-h-[560px] w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[#0c0c0f]/97 shadow-[0_40px_120px_-24px_rgba(0,0,0,0.9)] ring-1 ring-[#00FF94]/10 backdrop-blur-md md:bottom-24 md:right-7"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#00FF94]/15 text-[#00FF94]">
                  <Sparkles size={14} aria-hidden />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-[#EDF5FA]">Portfolio Assistant</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#7e8c9a]">Ask about Krishna</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="grid h-8 w-8 place-items-center rounded-full text-[#A0ADBA] transition-colors hover:text-[#00FF94]"
              >
                <X size={16} aria-hidden />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollBoxRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#00FF94] text-[#050505]"
                        : "border border-[var(--border)] bg-[#0a0a0a] text-[#cdd6df]"
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {m.actions.map((a) => (
                          <button
                            key={a.label}
                            onClick={() => runAction(a)}
                            className="rounded-full border border-[#00FF94]/40 px-3 py-1 text-xs font-medium text-[#00FF94] transition-colors hover:bg-[#00FF94]/10"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {m.role === "bot" && m.text === ASSISTANT_FALLBACK && (
                      <div className="mt-2.5 flex flex-col gap-1.5">
                        {ASSISTANT_SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-left text-xs text-[#A0ADBA] transition-colors hover:border-[#00FF94]/40 hover:text-[#EDF5FA]"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-[var(--border)] bg-[#0a0a0a] px-4 py-3">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-[#00FF94]"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}

              {/* Starter suggestions (only before the user has asked anything) */}
              {messages.length === 1 && !thinking && (
                <div className="flex flex-col gap-1.5 pt-1">
                  {ASSISTANT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-left text-xs text-[#A0ADBA] transition-colors hover:border-[#00FF94]/40 hover:text-[#EDF5FA]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-center gap-2 border-t border-[var(--border)] p-3"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask a question…"
                aria-label="Ask the assistant a question"
                className="w-full rounded-full border border-[var(--border)] bg-[#070707] px-4 py-2.5 text-sm text-[#EDF5FA] placeholder:text-[#687686] focus:border-[#00FF94]/50 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!draft.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#00FF94] text-[#050505] transition-opacity disabled:opacity-40"
              >
                <ArrowUp size={18} aria-hidden />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Assistant;
