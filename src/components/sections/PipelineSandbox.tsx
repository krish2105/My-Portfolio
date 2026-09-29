import { useState } from "react";
import { Play, Sparkles, ShieldCheck, Zap, Database, Cpu, CheckCircle2, AlertOctagon } from "lucide-react";
import { soundFx } from "../../lib/soundFx";

interface StageOption {
  id: string;
  name: string;
  latencyMs: number;
  faithfulnessBoost: number;
  costPerK: number;
  desc: string;
}

const STAGES = {
  embedding: [
    { id: "minilm", name: "MiniLM-L6-v2 (384d)", latencyMs: 8, faithfulnessBoost: 0.78, costPerK: 0.001, desc: "On-device, ultra-fast vector extraction" },
    { id: "text-emb-3", name: "OpenAI text-emb-3 (1536d)", latencyMs: 65, faithfulnessBoost: 0.88, costPerK: 0.02, desc: "High-dimensional cloud semantic density" },
    { id: "bge-m3", name: "BGE-M3 Multi-lingual (1024d)", latencyMs: 22, faithfulnessBoost: 0.85, costPerK: 0.008, desc: "Hybrid dense-sparse enterprise embeddings" },
  ] as StageOption[],
  vectorDb: [
    { id: "pgvector-hnsw", name: "pgvector (HNSW Index)", latencyMs: 4, faithfulnessBoost: 0.05, costPerK: 0.005, desc: "Sub-5ms relational vector search with ACID" },
    { id: "qdrant", name: "Qdrant In-Memory", latencyMs: 3, faithfulnessBoost: 0.06, costPerK: 0.01, desc: "High-throughput pure vector clustering" },
    { id: "ivfflat", name: "Naive IVFFlat Index", latencyMs: 18, faithfulnessBoost: 0.0, costPerK: 0.002, desc: "Partition-based index with lower recall" },
  ] as StageOption[],
  reranker: [
    { id: "cohere-v3", name: "Cohere Rerank v3", latencyMs: 45, faithfulnessBoost: 0.12, costPerK: 0.04, desc: "Cross-attention semantic reordering" },
    { id: "cross-enc", name: "Local Cross-Encoder", latencyMs: 30, faithfulnessBoost: 0.08, costPerK: 0.005, desc: "Transformer pair-scoring on GPU" },
    { id: "none", name: "Pass-Through (No Rerank)", latencyMs: 0, faithfulnessBoost: 0.0, costPerK: 0.0, desc: "Skips second-stage semantic ranking" },
  ] as StageOption[],
  llm: [
    { id: "speculative", name: "Speculative Draft Model (Fast)", latencyMs: 110, faithfulnessBoost: 0.0, costPerK: 0.05, desc: "45 tokens/sec with fast first-token response" },
    { id: "deep-reason", name: "Deep Reasoning 70B (Full)", latencyMs: 460, faithfulnessBoost: 0.08, costPerK: 0.25, desc: "18 tokens/sec deep multi-step verification" },
  ] as StageOption[],
  guardrail: [
    { id: "self-rag", name: "Self-RAG Guardrail & Citation Gate", latencyMs: 35, faithfulnessBoost: 0.15, costPerK: 0.01, desc: "Blocks ungrounded hallucinated tokens" },
    { id: "raw", name: "Raw Unverified Stream", latencyMs: 0, faithfulnessBoost: -0.12, costPerK: 0.0, desc: "Zero-latency output with no truth check" },
  ] as StageOption[],
};

export const PipelineSandbox = () => {
  const [selected, setSelected] = useState({
    embedding: STAGES.embedding[0].id,
    vectorDb: STAGES.vectorDb[0].id,
    reranker: STAGES.reranker[0].id,
    llm: STAGES.llm[0].id,
    guardrail: STAGES.guardrail[0].id,
  });

  const [simulating, setSimulating] = useState(false);
  const [activeStageIdx, setActiveStageIdx] = useState<number | null>(null);

  const embChoice = STAGES.embedding.find((o) => o.id === selected.embedding)!;
  const vecChoice = STAGES.vectorDb.find((o) => o.id === selected.vectorDb)!;
  const rerankChoice = STAGES.reranker.find((o) => o.id === selected.reranker)!;
  const llmChoice = STAGES.llm.find((o) => o.id === selected.llm)!;
  const guardChoice = STAGES.guardrail.find((o) => o.id === selected.guardrail)!;

  const totalLatency = embChoice.latencyMs + vecChoice.latencyMs + rerankChoice.latencyMs + llmChoice.latencyMs + guardChoice.latencyMs;
  const rawFaithfulness = embChoice.faithfulnessBoost + vecChoice.faithfulnessBoost + rerankChoice.faithfulnessBoost + llmChoice.faithfulnessBoost + guardChoice.faithfulnessBoost;
  const faithfulness = Math.min(0.99, Math.max(0.65, Math.round(rawFaithfulness * 100) / 100));
  const totalCost = Math.round((embChoice.costPerK + vecChoice.costPerK + rerankChoice.costPerK + llmChoice.costPerK + guardChoice.costPerK) * 1000) / 1000;

  const isProductionCompliant = totalLatency < 350 && faithfulness >= 0.90;

  const runSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    soundFx.playClick();

    const stages = [0, 1, 2, 3, 4];
    stages.forEach((stg, i) => {
      setTimeout(() => {
        setActiveStageIdx(stg);
        soundFx.playHover();
      }, i * 220);
    });

    setTimeout(() => {
      setActiveStageIdx(null);
      setSimulating(false);
      if (isProductionCompliant) {
        soundFx.playChime();
      } else {
        soundFx.playWarning();
      }
    }, stages.length * 220 + 200);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--panel)] p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-[var(--accent)]" />
            <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text)] md:text-2xl">
              Interactive AI Pipeline Architecture Sandbox
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--text-3)] md:text-sm">
            Configure each subsystem of an enterprise Agentic RAG pipeline to test live latency budgets, citation faithfulness, and compute costs.
          </p>
        </div>

        <button
          type="button"
          onClick={runSimulation}
          disabled={simulating}
          className="inline-flex items-center gap-2 rounded-full bg-[#00FF94] px-5 py-2.5 font-mono text-xs font-bold text-[#050505] transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] disabled:opacity-50"
        >
          {simulating ? <Sparkles size={14} className="animate-spin" /> : <Play size={14} />}
          <span>{simulating ? "Simulating Query Stream..." : "Run Test Query"}</span>
        </button>
      </div>

      {/* Interactive Node Graph */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Stage 1: Embeddings */}
        <div className={`p-4 rounded-xl border transition-all ${activeStageIdx === 0 ? "border-[#00FF94] bg-[#00FF94]/10 shadow-[0_0_20px_rgba(0,255,148,0.25)]" : "border-white/[0.08] bg-[var(--panel-2)]"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] flex items-center gap-1">
              <Zap size={11} /> 1. Embeddings
            </span>
            <span className="font-mono text-[10px] text-[var(--text-3)]">+{embChoice.latencyMs}ms</span>
          </div>
          <select
            value={selected.embedding}
            onChange={(e) => setSelected({ ...selected, embedding: e.target.value })}
            className="w-full bg-[var(--panel)] border border-white/[0.1] rounded-lg p-2 text-xs text-[var(--text)] font-mono focus:border-[#00FF94] focus:outline-none"
          >
            {STAGES.embedding.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <p className="mt-2 text-[10px] text-[var(--text-3)] leading-tight">{embChoice.desc}</p>
        </div>

        {/* Stage 2: Vector DB */}
        <div className={`p-4 rounded-xl border transition-all ${activeStageIdx === 1 ? "border-[#00FF94] bg-[#00FF94]/10 shadow-[0_0_20px_rgba(0,255,148,0.25)]" : "border-white/[0.08] bg-[var(--panel-2)]"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] flex items-center gap-1">
              <Database size={11} /> 2. Vector Index
            </span>
            <span className="font-mono text-[10px] text-[var(--text-3)]">+{vecChoice.latencyMs}ms</span>
          </div>
          <select
            value={selected.vectorDb}
            onChange={(e) => setSelected({ ...selected, vectorDb: e.target.value })}
            className="w-full bg-[var(--panel)] border border-white/[0.1] rounded-lg p-2 text-xs text-[var(--text)] font-mono focus:border-[#00FF94] focus:outline-none"
          >
            {STAGES.vectorDb.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <p className="mt-2 text-[10px] text-[var(--text-3)] leading-tight">{vecChoice.desc}</p>
        </div>

        {/* Stage 3: Reranker */}
        <div className={`p-4 rounded-xl border transition-all ${activeStageIdx === 2 ? "border-[#00FF94] bg-[#00FF94]/10 shadow-[0_0_20px_rgba(0,255,148,0.25)]" : "border-white/[0.08] bg-[var(--panel-2)]"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] flex items-center gap-1">
              <Cpu size={11} /> 3. Reranker
            </span>
            <span className="font-mono text-[10px] text-[var(--text-3)]">+{rerankChoice.latencyMs}ms</span>
          </div>
          <select
            value={selected.reranker}
            onChange={(e) => setSelected({ ...selected, reranker: e.target.value })}
            className="w-full bg-[var(--panel)] border border-white/[0.1] rounded-lg p-2 text-xs text-[var(--text)] font-mono focus:border-[#00FF94] focus:outline-none"
          >
            {STAGES.reranker.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <p className="mt-2 text-[10px] text-[var(--text-3)] leading-tight">{rerankChoice.desc}</p>
        </div>

        {/* Stage 4: LLM Reasoning */}
        <div className={`p-4 rounded-xl border transition-all ${activeStageIdx === 3 ? "border-[#00FF94] bg-[#00FF94]/10 shadow-[0_0_20px_rgba(0,255,148,0.25)]" : "border-white/[0.08] bg-[var(--panel-2)]"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] flex items-center gap-1">
              <Sparkles size={11} /> 4. LLM Generation
            </span>
            <span className="font-mono text-[10px] text-[var(--text-3)]">+{llmChoice.latencyMs}ms</span>
          </div>
          <select
            value={selected.llm}
            onChange={(e) => setSelected({ ...selected, llm: e.target.value })}
            className="w-full bg-[var(--panel)] border border-white/[0.1] rounded-lg p-2 text-xs text-[var(--text)] font-mono focus:border-[#00FF94] focus:outline-none"
          >
            {STAGES.llm.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <p className="mt-2 text-[10px] text-[var(--text-3)] leading-tight">{llmChoice.desc}</p>
        </div>

        {/* Stage 5: Guardrail Gate */}
        <div className={`p-4 rounded-xl border transition-all ${activeStageIdx === 4 ? "border-[#00FF94] bg-[#00FF94]/10 shadow-[0_0_20px_rgba(0,255,148,0.25)]" : "border-white/[0.08] bg-[var(--panel-2)]"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] flex items-center gap-1">
              <ShieldCheck size={11} /> 5. Verification Gate
            </span>
            <span className="font-mono text-[10px] text-[var(--text-3)]">+{guardChoice.latencyMs}ms</span>
          </div>
          <select
            value={selected.guardrail}
            onChange={(e) => setSelected({ ...selected, guardrail: e.target.value })}
            className="w-full bg-[var(--panel)] border border-white/[0.1] rounded-lg p-2 text-xs text-[var(--text)] font-mono focus:border-[#00FF94] focus:outline-none"
          >
            {STAGES.guardrail.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
          <p className="mt-2 text-[10px] text-[var(--text-3)] leading-tight">{guardChoice.desc}</p>
        </div>
      </div>

      {/* Live Telemetry Scorecard */}
      <div className="mt-6 rounded-xl border border-white/[0.08] bg-[var(--panel-2)]/60 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <span className="block font-mono text-[10px] uppercase text-[var(--text-3)] tracking-wider">End-to-End Latency</span>
            <span className={`font-mono text-lg font-bold ${totalLatency < 350 ? "text-[#00FF94]" : "text-amber-400"}`}>
              {totalLatency}ms
            </span>
            <span className="block text-[10px] text-[var(--text-3)]">{totalLatency < 200 ? "⚡ Ultra-Fast" : totalLatency < 400 ? "✓ Production SLA" : "⚠️ High Latency"}</span>
          </div>

          <div>
            <span className="block font-mono text-[10px] uppercase text-[var(--text-3)] tracking-wider">Faithfulness / Grounding</span>
            <span className={`font-mono text-lg font-bold ${faithfulness >= 0.90 ? "text-[#00FF94]" : "text-amber-400"}`}>
              {(faithfulness * 100).toFixed(0)}%
            </span>
            <span className="block text-[10px] text-[var(--text-3)]">{faithfulness >= 0.90 ? "Verified Citations" : "Hallucination Risk"}</span>
          </div>

          <div>
            <span className="block font-mono text-[10px] uppercase text-[var(--text-3)] tracking-wider">Est. Cost / 1k Queries</span>
            <span className="font-mono text-lg font-bold text-[var(--text)]">
              ${totalCost.toFixed(3)}
            </span>
            <span className="block text-[10px] text-[var(--text-3)]">Optimized Compute</span>
          </div>

          <div>
            <span className="block font-mono text-[10px] uppercase text-[var(--text-3)] tracking-wider">Compliance Status</span>
            <div className="mt-1 flex items-center justify-center gap-1 font-mono text-xs font-bold">
              {isProductionCompliant ? (
                <span className="text-[#00FF94] flex items-center gap-1">
                  <CheckCircle2 size={13} /> Production Ready
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertOctagon size={13} /> Review SLA
                </span>
              )}
            </div>
            <span className="block text-[10px] text-[var(--text-3)]">
              {isProductionCompliant ? "Meets &lt;350ms &amp; &gt;90% standards" : "Exceeds latency or risk thresholds"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineSandbox;
