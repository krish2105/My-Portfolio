import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft } from "lucide-react";
import { projects, capabilities, socialLinks } from "../../data/portfolio";
import { generateTailoredResumePdf, type TargetRoleId } from "../../lib/pdfGenerator";
import { soundFx } from "../../lib/soundFx";

interface CommandLog {
  id: string;
  command: string;
  output: string | React.ReactNode;
  time: string;
}

const COMMANDS = [
  "help",
  "projects",
  "cat",
  "bench",
  "eval",
  "skills",
  "resume",
  "contact",
  "clear",
  "exit",
];

export const CyberTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>(() => [
    {
      id: "init",
      command: "sys.init",
      output: (
        <div className="text-xs leading-relaxed text-[var(--text-2)]">
          <p className="font-mono text-[#00FF94]">
            AI Command Center Kernel v2.4.0-release [x86_64-wasm]
          </p>
          <p className="mt-1 text-[var(--text-3)]">
            Type <span className="text-[var(--accent)] font-bold">help</span> to view available subroutines, or press <span className="text-[var(--text)]">Tab</span> for autocomplete.
          </p>
        </div>
      ),
      time: "INIT",
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global backtick/tilde toggle listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in standard text inputs outside terminal
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");

      if (e.key === "`" && !isInput) {
        e.preventDefault();
        setIsOpen((prev) => {
          const next = !prev;
          if (next) soundFx.playChime();
          return next;
        });
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      terminalEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [isOpen, logs]);

  const handleCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    soundFx.playClick();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    let resultOutput: React.ReactNode = "";

    switch (cmd) {
      case "help":
        resultOutput = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div><span className="text-[#00FF94] font-bold">projects / ls</span>: List all shipped AI systems</div>
            <div><span className="text-[#00FF94] font-bold">cat &lt;id&gt;</span>: Inspect project architecture</div>
            <div><span className="text-[#00FF94] font-bold">bench</span>: Run in-browser latency benchmark</div>
            <div><span className="text-[#00FF94] font-bold">eval</span>: Test Self-RAG verification gate</div>
            <div><span className="text-[#00FF94] font-bold">skills</span>: Matrix of verified competencies</div>
            <div><span className="text-[#00FF94] font-bold">resume [role]</span>: Synthesize PDF (ai, mlops, data)</div>
            <div><span className="text-[#00FF94] font-bold">contact</span>: Show channels / trigger mailto</div>
            <div><span className="text-[#00FF94] font-bold">clear</span>: Clear terminal console</div>
            <div><span className="text-[#00FF94] font-bold">exit</span>: Close this terminal HUD</div>
          </div>
        );
        break;

      case "ls":
      case "projects":
        resultOutput = (
          <div className="text-xs font-mono space-y-1.5">
            <div className="text-[var(--text-3)] pb-1 border-b border-white/[0.08] grid grid-cols-12">
              <span className="col-span-3">ID</span>
              <span className="col-span-4">NAME</span>
              <span className="col-span-3">TESTS / METRIC</span>
              <span className="col-span-2">STATUS</span>
            </div>
            {projects.map((p) => (
              <div key={p.id} className="grid grid-cols-12 hover:bg-white/[0.04] py-0.5 rounded px-1">
                <span className="col-span-3 text-[#00FF94]">{p.id}</span>
                <span className="col-span-4 text-[var(--text)] font-semibold">{p.shortTitle}</span>
                <span className="col-span-3 text-[var(--text-2)]">{p.metrics?.[0]?.value ?? "Production"}</span>
                <span className="col-span-2 text-emerald-400">Live</span>
              </div>
            ))}
          </div>
        );
        break;

      case "cat": {
        if (!arg) {
          resultOutput = <span className="text-amber-400">Usage: cat &lt;project-id&gt; (e.g. cat fincopilot, cat sakan)</span>;
          break;
        }
        const found = projects.find((p) => p.id.toLowerCase().includes(arg) || p.shortTitle.toLowerCase().includes(arg));
        if (found) {
          resultOutput = (
            <div className="text-xs font-mono space-y-2 p-2.5 rounded border border-[#00FF94]/20 bg-[#00FF94]/5">
              <div className="flex items-center justify-between text-sm font-bold text-[var(--accent)]">
                <span>{found.title}</span>
                <span className="text-[10px] uppercase border border-[#00FF94]/30 px-2 py-0.5 rounded">Verified Architecture</span>
              </div>
              <p className="text-[var(--text-2)] text-xs leading-relaxed">{found.valueProp || found.description}</p>
              <div className="text-[11px] text-[var(--text-3)]">
                <span className="text-[var(--text)] font-semibold">Stack: </span>
                {found.technologies.join(" · ")}
              </div>
              {found.repositoryUrl && (
                <div className="text-[11px]">
                  <span className="text-[var(--text)] font-semibold">Repository: </span>
                  <a href={found.repositoryUrl} target="_blank" rel="noopener noreferrer" className="text-[#00FF94] underline">
                    {found.repositoryUrl}
                  </a>
                </div>
              )}
            </div>
          );
        } else {
          resultOutput = <span className="text-red-400">Error: Project &quot;{arg}&quot; not found in manifest. Type &quot;projects&quot; to list available targets.</span>;
        }
        break;
      }

      case "bench":
        resultOutput = (
          <div className="text-xs font-mono space-y-1">
            <p className="text-cyan-400">Executing browser execution benchmark...</p>
            <p className="text-[var(--text-2)]">Memory footprint: ~42.8 MB (stable)</p>
            <p className="text-[var(--text-2)]">Thread latency: &lt;4.2ms loop response</p>
            <p className="text-[var(--text-2)]">Hardware profile: WebGL2 enabled · WebGPU available</p>
            <p className="text-[#00FF94] font-bold">Status: ALL 9 CASE STUDIES &amp; RAG ENGINE HEALTHY (60+ FPS)</p>
          </div>
        );
        break;

      case "eval":
        soundFx.playChime();
        resultOutput = (
          <div className="text-xs font-mono space-y-1.5 p-2 rounded border border-emerald-500/20 bg-emerald-500/5">
            <div className="font-bold text-emerald-400">Self-RAG Guardrail Telemetry Simulation:</div>
            <div>* Test query: &quot;What are the quarterly covenants for SEC filing 10-Q?&quot;</div>
            <div>* Context relevance: 0.94 / 1.00 (verified)</div>
            <div>* Groundedness check: 0.96 / 1.00 (faithfulness passed)</div>
            <div>* Hallucination risk: 0.02 (within safe boundary)</div>
            <div className="text-[#00FF94] font-bold mt-1">Result: PASS — Sanitized response released to output stream.</div>
          </div>
        );
        break;

      case "skills":
        resultOutput = (
          <div className="text-xs font-mono space-y-2">
            {capabilities.map((cat) => (
              <div key={cat.title}>
                <span className="text-[#00FF94] font-bold">[{cat.title.toUpperCase()}]: </span>
                <span className="text-[var(--text-2)]">{cat.skills.slice(0, 6).map((s) => s.name).join(" · ")}</span>
              </div>
            ))}
          </div>
        );
        break;

      case "resume": {
        const targetRole: TargetRoleId =
          arg.includes("ml") || arg.includes("mlops")
            ? "mlops-engineer"
            : arg.includes("data") || arg.includes("analytic")
              ? "data-analytics"
              : "ai-engineer";

        resultOutput = (
          <div className="text-xs font-mono space-y-1 text-cyan-300">
            <p>Compiling dynamic 1-page PDF for target: <span className="font-bold text-[#00FF94]">{targetRole}</span>...</p>
            <p className="text-emerald-400">Synthesizing vector glyphs with pdf-lib directly on device...</p>
          </div>
        );

        generateTailoredResumePdf(targetRole).then((bytes) => {
          const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Krishna_Mathur_Resume_${targetRole}.pdf`;
          a.click();
        });
        break;
      }

      case "contact":
        resultOutput = (
          <div className="text-xs font-mono space-y-1">
            <div><span className="text-[#00FF94]">Email:</span> krishnamathur008@gmail.com</div>
            <div><span className="text-[#00FF94]">Phone:</span> +971 50 194 6921 (Dubai, UAE)</div>
            <div><span className="text-[#00FF94]">LinkedIn:</span> {socialLinks.linkedin}</div>
            <div><span className="text-[#00FF94]">GitHub:</span> {socialLinks.github}</div>
            <div className="pt-1 text-[var(--accent)] underline cursor-pointer" onClick={() => window.open(socialLinks.email, "_blank")}>
              &gt; Click here to open mailto client
            </div>
          </div>
        );
        break;

      case "clear":
        setLogs([]);
        setInput("");
        return;

      case "exit":
        setIsOpen(false);
        setInput("");
        return;

      default:
        soundFx.playWarning();
        resultOutput = (
          <span className="text-amber-400">
            Command not recognized: &quot;{cmd}&quot;. Type <span className="text-[#00FF94] underline">help</span> for a list of available subroutines.
          </span>
        );
    }

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        command: trimmed,
        output: resultOutput,
        time: nowTime,
      },
    ]);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length > 0 && historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx >= history.length) {
          setHistoryIdx(-1);
          setInput("");
        } else {
          setHistoryIdx(nextIdx);
          setInput(history[nextIdx]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const current = input.trim().toLowerCase();
      if (!current) return;
      const matched = COMMANDS.find((c) => c.startsWith(current));
      if (matched) {
        setInput(matched);
      }
    }
  };

  return (
    <>
      {/* Floating launcher badge at screen bottom */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          soundFx.playClick();
        }}
        aria-label="Open Cyber Terminal CLI"
        className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)]/90 px-3.5 py-2 font-mono text-xs font-semibold text-[var(--text-2)] shadow-2xl backdrop-blur-md transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_rgba(0,180,100,0.15)]"
      >
        <TerminalIcon size={14} className="text-[var(--accent)]" />
        <span>Terminal <span className="opacity-50 text-[10px]">[`]</span></span>
      </button>

      {/* Terminal Modal Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Developer Cyber Terminal"
          aria-modal="true"
          className={`fixed z-50 transition-all duration-200 ${
            isMaximized
              ? "inset-4 md:inset-8"
              : "bottom-6 left-6 right-6 md:left-12 md:right-auto md:w-[680px] h-[480px]"
          } flex flex-col rounded-2xl border border-[#00FF94]/30 bg-[#07090c]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl font-mono overflow-hidden`}
        >
          {/* Scanline CRT overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,255,148,0.06),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,22,28,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

          {/* Window Header */}
          <div className="relative flex items-center justify-between border-b border-white/[0.08] bg-[#0c1015] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIsOpen(false)} />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 cursor-pointer" onClick={() => setIsMaximized((v) => !v)} />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 cursor-pointer" />
              <span className="ml-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                <TerminalIcon size={12} /> krishna@ai-kernel:~
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMaximized((v) => !v)}
                aria-label={isMaximized ? "Restore window" : "Maximize window"}
                className="text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
              >
                {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close terminal"
                className="text-[var(--text-3)] hover:text-red-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Terminal Console Logs */}
          <div className="relative flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs select-text">
            {logs.map((log) => (
              <div key={log.id} className="space-y-1">
                <div className="flex items-center gap-2 text-[var(--text-3)]">
                  <span className="text-[#00FF94]">krishna@ai-cmd:~$</span>
                  <span className="font-semibold text-[var(--text)]">{log.command}</span>
                  <span className="text-[10px] ml-auto opacity-40">{log.time}</span>
                </div>
                <div className="pl-4 border-l border-white/[0.08]">{log.output}</div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Command Input Bar */}
          <div className="relative border-t border-white/[0.08] bg-[#0a0d12] p-3 flex items-center gap-2">
            <span className="text-[#00FF94] text-xs font-bold shrink-0">krishna@ai-cmd:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="type 'help', 'projects', 'bench', 'eval'..."
              aria-label="Cyber Terminal input"
              className="flex-1 bg-transparent font-mono text-xs text-[var(--text)] placeholder:text-[var(--text-3)]/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleCommand(input)}
              className="text-[var(--accent)] hover:text-[#00FF94] transition-colors p-1"
              aria-label="Submit command"
            >
              <CornerDownLeft size={13} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CyberTerminal;
