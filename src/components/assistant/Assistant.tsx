import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { track } from "@vercel/analytics";
import { Sparkles, X, ArrowUp, Zap, Loader2 } from "lucide-react";
import {
  ASSISTANT_INTENTS,
  ASSISTANT_SUGGESTIONS_BY_MODE,
  ASSISTANT_GREETING,
  ASSISTANT_FALLBACK,
  ASSISTANT_FALLBACK_AR,
  type AssistantAction,
} from "../../data/assistant";
import { useSmoothScroll, scrollTo } from "../../lib/SmoothScroll";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useKnowledgeSearch } from "../../hooks/useKnowledgeSearch";
import { useViewMode, VIEW_MODES } from "../../lib/viewMode";
import { projects } from "../../data/portfolio";
import { specialCommandReply, MODE_TAG_BIAS, type Msg } from "../../lib/copilotCommands";

/** A match is only trusted if it clears this cosine-similarity bar; otherwise fall back to keyword matching. */
const SEMANTIC_THRESHOLD = 0.35;

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

/** Arabic script range — used to route a query to the small, honest Arabic
 * intent subset instead of the (English-only) keyword patterns. */
const containsArabic = (s: string) => /[؀-ۿ]/.test(s);

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

/** Same scoring, over the small Arabic-covered intent subset only. */
const matchArabic = (query: string) => {
  let best: { score: number; intent: (typeof ASSISTANT_INTENTS)[number] } | null = null;
  for (const intent of ASSISTANT_INTENTS) {
    if (!intent.ar) continue;
    let score = 0;
    for (const p of intent.ar.patterns) if (query.includes(p)) score += p.length;
    if (score > 0 && (!best || score > best.score)) best = { score, intent };
  }
  return best?.intent ?? null;
};

const Assistant = () => {
  const { lenis } = useSmoothScroll();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { status: smartStatus, enable: enableSmart, search } = useKnowledgeSearch();
  const { mode } = useViewMode();
  const suggestions = ASSISTANT_SUGGESTIONS_BY_MODE[mode];
  const modeLabel = VIEW_MODES.find((m) => m.id === mode)?.label ?? "Recruiter";
  const [open, setOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: ASSISTANT_GREETING }]);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");

  const toggleSmart = async () => {
    if (smartStatus === "ready" || smartStatus === "loading") return;
    track("assistant_smart_answers_enabled");
    const ok = await enableSmart();
    setMessages((m) => [
      ...m,
      {
        role: "bot",
        text: ok
          ? "Smart answers are on — a real sentence-embedding model now runs in your browser to semantically match your questions against Krishna's actual project data. Ask in your own words."
          : "Couldn't load the semantic model (likely a network block). Falling back to the standard matcher — it still covers the same topics.",
      },
    ]);
  };

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

  // Lets other UI (the command palette's "Ask Copilot…" action) open the
  // assistant without lifting its open state into a shared context.
  useEffect(() => {
    const onOpenRequest = () => setOpen(true);
    window.addEventListener("open-portfolio-assistant", onOpenRequest);
    return () => window.removeEventListener("open-portfolio-assistant", onOpenRequest);
  }, []);

  const keywordReply = (q: string): Msg => {
    const intent = match(q);
    return intent ? { role: "bot", text: intent.answer, actions: intent.actions } : { role: "bot", text: ASSISTANT_FALLBACK };
  };

  /** Small, honest Arabic path: only the intents that carry an `ar` variant
   * are covered — everything else gets an honest "try English" fallback
   * rather than a mistranslated or fabricated answer. */
  const arabicReply = (q: string): Msg => {
    const intent = matchArabic(q);
    return intent?.ar
      ? { role: "bot", text: intent.ar.answer, actions: intent.ar.actions }
      : { role: "bot", text: ASSISTANT_FALLBACK_AR };
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setDraft("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setThinking(true);

    // Arabic queries skip special commands/semantic search entirely — both
    // are English-pattern/English-corpus only, so neither would produce a
    // meaningful match anyway.
    if (containsArabic(q)) {
      const delay = reduced ? 0 : 480;
      setTimeout(() => {
        setThinking(false);
        setMessages((m) => [...m, arabicReply(q)]);
      }, delay);
      return;
    }

    let reply: Msg | null = specialCommandReply(q);

    if (!reply && smartStatus === "ready") {
      const results = await search(q, 3);
      // Mode-biased ranking: nudge (don't override) semantic results toward
      // projects tagged for the current audience before picking the top match.
      const biasTags = MODE_TAG_BIAS[mode];
      const reranked =
        biasTags.length > 0
          ? [...results].sort((x, y) => {
              const projFor = (id: string) => projects.find((p) => `project-${p.id}` === id);
              const bx = projFor(x.chunk.id)?.tags?.some((t) => biasTags.includes(t)) ? 0.05 : 0;
              const by = projFor(y.chunk.id)?.tags?.some((t) => biasTags.includes(t)) ? 0.05 : 0;
              return y.score + by - (x.score + bx);
            })
          : results;
      const top = reranked[0];
      reply =
        top && top.score >= SEMANTIC_THRESHOLD
          ? {
              role: "bot",
              text: top.chunk.answer,
              actions: top.chunk.action ? [top.chunk.action] : undefined,
              semantic: true,
            }
          : keywordReply(q);
    } else if (!reply) {
      reply = keywordReply(q);
    }

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
    } else if (a.type === "project") {
      setOpen(false);
      window.history.pushState({}, "", `/work/${a.target}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      window.open(a.target, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => {
          if (!open) track("assistant_opened");
          setOpen(!open);
        }}
        data-cursor="Ask"
        aria-label={open ? "Close assistant" : "Open assistant — ask about Krishna"}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        className="fixed bottom-5 right-5 z-[115] inline-flex items-center gap-2 rounded-full border border-[#00FF94]/40 bg-[var(--panel)]/90 px-4 py-3 text-sm font-semibold text-[var(--text)] shadow-[0_10px_40px_-8px_rgba(0,0,0,0.8)] backdrop-blur transition-colors hover:border-[#00FF94] md:bottom-7 md:right-7"
      >
        <Sparkles size={16} className="text-[var(--accent)]" aria-hidden />
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
            className="fixed bottom-20 right-3 z-[116] flex h-[60vh] max-h-[560px] w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--panel-2)]/97 shadow-[0_40px_120px_-24px_rgba(0,0,0,0.9)] ring-1 ring-[#00FF94]/10 backdrop-blur-md md:bottom-24 md:right-7"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#00FF94]/15 text-[var(--accent)]">
                  <Sparkles size={14} aria-hidden />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-[var(--text)]">Portfolio Copilot</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-3)]">
                    {modeLabel} view · change in navbar
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleSmart}
                  disabled={smartStatus === "loading"}
                  aria-pressed={smartStatus === "ready"}
                  aria-label={
                    smartStatus === "ready"
                      ? "Smart answers enabled (semantic search)"
                      : "Enable smart answers (downloads a small AI model to your browser)"
                  }
                  title={
                    smartStatus === "ready"
                      ? "Smart answers on — semantic search"
                      : "Enable smart answers (in-browser AI model)"
                  }
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors disabled:opacity-60 ${
                    smartStatus === "ready"
                      ? "border-[#00FF94]/50 bg-[#00FF94]/10 text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-2)] hover:border-[#00FF94]/40 hover:text-[var(--text)]"
                  }`}
                >
                  {smartStatus === "loading" ? (
                    <Loader2 size={12} className="animate-spin" aria-hidden />
                  ) : (
                    <Zap size={12} aria-hidden />
                  )}
                  {smartStatus === "loading" ? "Loading…" : smartStatus === "ready" ? "Smart: On" : "Smart answers"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                  className="grid h-8 w-8 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:text-[var(--accent)]"
                >
                  <X size={16} aria-hidden />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollBoxRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#00FF94] text-[#050505]"
                        : "border border-[var(--border)] bg-[var(--panel)] text-[var(--text)]"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.semantic && (
                      <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-[var(--accent)]">
                        <Zap size={10} aria-hidden /> Semantic match — in-browser embedding search
                      </p>
                    )}
                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {m.actions.map((a) => (
                          <button
                            key={a.label}
                            onClick={() => runAction(a)}
                            className="rounded-full border border-[#00FF94]/40 px-3 py-1 text-xs font-medium text-[var(--accent)] transition-colors hover:bg-[#00FF94]/10"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {m.role === "bot" && m.text === ASSISTANT_FALLBACK && (
                      <div className="mt-2.5 flex flex-col gap-1.5">
                        {suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-left text-xs text-[var(--text-2)] transition-colors hover:border-[#00FF94]/40 hover:text-[var(--text)]"
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
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3">
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
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-left text-xs text-[var(--text-2)] transition-colors hover:border-[#00FF94]/40 hover:text-[var(--text)]"
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
                className="w-full rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] focus:border-[#00FF94]/50 focus:outline-none"
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
