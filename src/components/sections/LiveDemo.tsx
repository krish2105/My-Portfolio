import { useState } from "react";
import { motion } from "motion/react";
import { track } from "@vercel/analytics";
import { Sparkles, ShieldCheck, Loader2, Database } from "lucide-react";
import { useTransformersPipeline } from "../../hooks/useTransformersPipeline";
import { RevealText, Rise } from "../common/Reveal";
import { matchNL2SQL, NL2SQL_EXAMPLES, TOY_SCHEMA } from "../../lib/nl2sqlDemo";

const MODEL = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";

interface SentimentResult {
  label: string;
  score: number;
}

const EXAMPLES = [
  "This portfolio is genuinely impressive and fast.",
  "The deployment kept failing and the docs were confusing.",
  "A clean, well-engineered project with thoughtful trade-offs.",
];

/**
 * Second, honest in-browser lab: the same rule-based NL→SQL technique
 * TalkToData currently ships (see `lib/nl2sqlDemo.ts`) — not a transformer
 * model, and clearly labelled as illustrative (no real database is queried).
 */
const NL2SQLLab = () => {
  const [question, setQuestion] = useState(NL2SQL_EXAMPLES[0]);
  const match = matchNL2SQL(question);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
      <div>
        <h2 className="font-display text-3xl font-black leading-[1.1] tracking-tight text-[var(--text)] md:text-5xl">
          Rule-based NL→SQL, <span className="text-gradient">the same way TalkToData works today.</span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-2)]">
          Type a business question and a small pattern-matcher (not a transformer model) maps it to a SQL query
          against a toy schema — illustrating TalkToData's current rule-based stage honestly. No real database is
          queried; transformer-backed generation is a planned next step, not this demo.
        </p>
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-medium text-[var(--text-3)]">
            <Database size={13} className="text-[var(--accent)]" aria-hidden /> Toy schema
          </p>
          {TOY_SCHEMA.map((t) => (
            <p key={t.table} className="font-mono text-[11px] text-[var(--text-2)]">
              {t.table} ({t.columns.join(", ")})
            </p>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {NL2SQL_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setQuestion(ex)}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] text-[var(--text-2)] transition-colors hover:border-[#00FF94]/40 hover:text-[var(--text)]"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--panel)] p-5 md:p-6">
        <label htmlFor="nl2sql-input" className="kicker mb-2 block">
          Your question
        </label>
        <textarea
          id="nl2sql-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] focus:border-[#00FF94]/50 focus:outline-none"
          placeholder="Ask a business question…"
        />

        <motion.div
          key={match ? match.sql : "no-match"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4"
        >
          {match ? (
            <>
              <p className="mb-2 text-[11px] uppercase tracking-wider text-[var(--accent)]">Candidate SQL</p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--text)]">
                {match.sql}
              </pre>
              <p className="mt-3 border-t border-[var(--border)] pt-3 text-xs leading-relaxed text-[var(--text-3)]">
                {match.explanation} A real deployment would still require human review before this runs — the
                core idea behind TalkToData.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-[var(--text-2)]">
              No confident match for that question yet — this is a small, honest rule-based demo, not a general
              model. Try one of the example questions.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const LiveDemo = () => {
  const { status, run } = useTransformersPipeline("text-classification", MODEL);
  const [text, setText] = useState(EXAMPLES[0]);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [lab, setLab] = useState<"sentiment" | "nl2sql">("sentiment");

  const analyze = async () => {
    if (!text.trim()) return;
    track("live_demo_run");
    setBusy(true);
    setResult(null);
    const out = await run(text.trim());
    const r = Array.isArray(out) ? out[0] : out;
    if (r && typeof r === "object" && "label" in r && "score" in r) {
      setResult(r as SentimentResult);
    }
    setBusy(false);
  };

  const positive = result?.label?.toUpperCase() === "POSITIVE";

  return (
    <section id="demo" className="relative border-t border-[var(--border)] px-6 py-24 md:px-[8vw] md:py-32">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="kicker">/ Live</span>
          <RevealText className="kicker">Try the AI</RevealText>
        </div>
        <div className="flex gap-2" role="group" aria-label="Choose a live demo">
          <button
            type="button"
            onClick={() => setLab("sentiment")}
            aria-pressed={lab === "sentiment"}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              lab === "sentiment"
                ? "border-[#00FF94] bg-[#00FF94]/10 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)]"
            }`}
          >
            Sentiment model
          </button>
          <button
            type="button"
            onClick={() => setLab("nl2sql")}
            aria-pressed={lab === "nl2sql"}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              lab === "nl2sql"
                ? "border-[#00FF94] bg-[#00FF94]/10 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)]"
            }`}
          >
            NL→SQL (rule-based)
          </button>
        </div>
      </div>

      {lab === "nl2sql" ? (
        <Rise>
          <NL2SQLLab />
        </Rise>
      ) : (
      <Rise>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <div>
            <h2 className="font-display text-3xl font-black leading-[1.1] tracking-tight text-[var(--text)] md:text-5xl">
              A real ML model, <span className="text-gradient">running in your browser.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-2)]">
              Type anything below and a sentiment model classifies it on-device — no server, no API.
              It downloads once (first run) and then runs entirely on your machine.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-3)]">
              <ShieldCheck size={14} className="text-[var(--accent)]" aria-hidden />
              Runs in your browser — your text never leaves your device.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setText(ex)}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] text-[var(--text-2)] transition-colors hover:border-[#00FF94]/40 hover:text-[var(--text)]"
                >
                  {ex.length > 32 ? ex.slice(0, 32) + "…" : ex}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--panel)] p-5 md:p-6">
            <label htmlFor="demo-input" className="kicker mb-2 block">
              Your text
            </label>
            <textarea
              id="demo-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] focus:border-[#00FF94]/50 focus:outline-none"
              placeholder="Type a sentence…"
            />

            <button
              onClick={analyze}
              disabled={busy || status === "loading" || !text.trim()}
              data-cursor="Run"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00FF94] px-6 py-3 font-bold text-[#050505] transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  Downloading model…
                </>
              ) : busy ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden /> Analysing…
                </>
              ) : (
                <>
                  <Sparkles size={16} aria-hidden /> Analyse sentiment
                </>
              )}
            </button>

            {status === "loading" && (
              <p className="mt-2 text-center text-[11px] text-[var(--text-3)]">
                One-time ~25 MB download, then cached.
              </p>
            )}

            {status === "error" && (
              <p className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-3 text-sm text-[var(--text-2)]">
                Couldn't load the model (likely a network block). The rest of the site is unaffected — try again on a normal connection.
              </p>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-display text-lg font-black ${
                      positive ? "text-[var(--accent)]" : "text-[#ff6b6b]"
                    }`}
                  >
                    {positive ? "Positive" : "Negative"}
                  </span>
                  <span className="font-mono text-sm text-[var(--text-2)]">
                    {(result.score * 100).toFixed(1)}% confidence
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${positive ? "bg-[#00FF94]" : "bg-[#ff6b6b]"}`}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </Rise>
      )}
    </section>
  );
};

export default LiveDemo;
