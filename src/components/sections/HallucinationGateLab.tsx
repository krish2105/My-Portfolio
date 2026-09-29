import { useState } from "react";
import { ShieldCheck, ShieldAlert, Check, AlertTriangle } from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  domain: string;
  prompt: string;
  rawOutput: {
    text: string;
    hallucinationSnippet: string;
    hallucinationRisk: string;
  };
  guardrailedOutput: {
    groundedText: string;
    blockedSnippet: string;
    citations: { label: string; verified: boolean }[];
    faithfulnessScore: string;
    groundingRatio: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: "finance",
    name: "SEC 10-K Financial Grounding",
    domain: "FinTech · FinCopilot",
    prompt: "What were Microsoft's Cloud revenues and projected margins for next fiscal year?",
    rawOutput: {
      text: "Microsoft reported Intelligent Cloud revenue of $25.9B (+20% YoY). Next year's cloud margin is projected to surge to 78.4% with expected operating income reaching $35B in Q1 alone.",
      hallucinationSnippet: "projected to surge to 78.4% with expected operating income reaching $35B in Q1 alone (fabricated forward-looking guidance not present in official 10-K filing).",
      hallucinationRisk: "HIGH RISK — Ungrounded forward-looking estimates can trigger financial misallocation.",
    },
    guardrailedOutput: {
      groundedText: "Microsoft reported Intelligent Cloud revenue of $25.9B (+20% YoY, SEC Accession #0001193125-24-0012). Operating income was $10.7B.",
      blockedSnippet: "Forward-looking margin projection (78.4%) was blocked by Self-RAG gate: insufficient filing evidence.",
      citations: [
        { label: "SEC 10-K Item 7, p.42", verified: true },
        { label: "XBRL tag: us-gaap/CloudRevenue", verified: true },
        { label: "Filing Accession: #0001193125", verified: true },
      ],
      faithfulnessScore: "99.8%",
      groundingRatio: "100% cited",
    },
  },
  {
    id: "compliance",
    name: "AML Transaction Laundering Triage",
    domain: "RegTech · ComplianceAgent",
    prompt: "Assess transfer sequence for Account #9821 showing 4 rapid deposits under $10,000 threshold.",
    rawOutput: {
      text: "Account #9821 deposited $9,500 four times. This is completely standard retail merchant behavior and can be automatically cleared without further regulatory escalation.",
      hallucinationSnippet: "Unchecked LLM auto-cleared transaction without cross-referencing FATF Smurfing / Structuring typologies or sanctions registries.",
      hallucinationRisk: "CRITICAL FAILURE — Automated false clearance violates anti-structuring compliance.",
    },
    guardrailedOutput: {
      groundedText: "Account #9821 exhibited 4 consecutive transactions ($9,500 each) within 36 hours. Flagged as SAML-D Typology #04 (Structuring / Smurfing). Mandatory Human MLRO review assigned.",
      blockedSnippet: "Auto-clearance attempt blocked: Graph Convolutional Network flagged structuring risk score of 0.89.",
      citations: [
        { label: "FATF Rec. 10 §4.2", verified: true },
        { label: "CBUAE AML Rulebook 2024", verified: true },
        { label: "GNN Risk Score: 0.89", verified: true },
      ],
      faithfulnessScore: "100%",
      groundingRatio: "Human Gate Enforced",
    },
  },
];

export const HallucinationGateLab = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [guardrailActive, setGuardrailActive] = useState(true);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-[#00FF94]/30 bg-[#00FF94]/10 px-2.5 py-0.5 font-mono text-[11px] text-[var(--accent)]">
              <ShieldCheck size={12} aria-hidden /> Self-RAG Guardrail Lab
            </span>
            <span className="font-mono text-xs text-[var(--text-3)]">{selectedScenario.domain}</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-[var(--text)] md:text-2xl">
            Watch Hallucination Suppression in Real-Time
          </h3>
        </div>

        {/* Guardrail Toggle */}
        <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--panel-2)] p-1">
          <button
            type="button"
            onClick={() => setGuardrailActive(false)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              !guardrailActive
                ? "border border-red-500/30 bg-red-500/15 text-red-400"
                : "text-[var(--text-3)] hover:text-[var(--text)]"
            }`}
          >
            <ShieldAlert size={12} aria-hidden />
            <span>Unchecked LLM</span>
          </button>
          <button
            type="button"
            onClick={() => setGuardrailActive(true)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              guardrailActive
                ? "border border-[#00FF94]/30 bg-[#00FF94]/15 text-[var(--accent)]"
                : "text-[var(--text-3)] hover:text-[var(--text)]"
            }`}
          >
            <ShieldCheck size={12} aria-hidden />
            <span>Self-RAG Guardrail (Active)</span>
          </button>
        </div>
      </div>

      {/* Scenario Tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelectedScenario(s)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              s.id === selectedScenario.id
                ? "border-[#00FF94] bg-[#00FF94]/10 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)]"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Query box */}
      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-3)]">
          Evaluation Prompt
        </span>
        <p className="mt-1 text-sm font-medium text-[var(--text)]">{selectedScenario.prompt}</p>
      </div>

      {/* Output Comparison Panel */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Guardrail Output view */}
        <div
          className={`relative rounded-xl border p-4 transition-all duration-300 ${
            guardrailActive
              ? "border-[#00FF94]/40 bg-[var(--panel-2)] shadow-[0_0_24px_rgba(0,255,148,0.06)]"
              : "border-[var(--border)] bg-[var(--panel-2)]/60 opacity-60"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-xs font-semibold text-[#00FF94]">
              <ShieldCheck size={14} /> Self-RAG Verified Response
            </span>
            {guardrailActive && (
              <span className="rounded-full bg-[#00FF94]/15 px-2 py-0.5 font-mono text-[10px] text-[var(--accent)]">
                {selectedScenario.guardrailedOutput.faithfulnessScore} Faithful
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-[var(--text)]">
            {selectedScenario.guardrailedOutput.groundedText}
          </p>

          <div className="mt-3 rounded-lg border border-[#00FF94]/20 bg-[#00FF94]/5 p-2.5">
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#00FF94]">
              <Check size={11} /> Provenance Verified Citations:
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {selectedScenario.guardrailedOutput.citations.map((c) => (
                <span
                  key={c.label}
                  className="rounded-full border border-[#00FF94]/30 bg-[#00FF94]/10 px-2 py-0.5 font-mono text-[10px] text-[var(--text)]"
                >
                  {c.label}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-2.5 font-mono text-[11px] text-[var(--text-3)]">
            🛡️ {selectedScenario.guardrailedOutput.blockedSnippet}
          </p>
        </div>

        {/* Unchecked view */}
        <div
          className={`relative rounded-xl border p-4 transition-all duration-300 ${
            !guardrailActive
              ? "border-red-500/50 bg-[var(--panel-2)] shadow-[0_0_24px_rgba(239,68,68,0.08)]"
              : "border-[var(--border)] bg-[var(--panel-2)]/60 opacity-60"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-xs font-semibold text-red-400">
              <ShieldAlert size={14} /> Unchecked Standard Model
            </span>
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-mono text-[10px] text-red-400">
              Unverified Output
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[var(--text)]">
            {selectedScenario.rawOutput.text}
          </p>

          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5">
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-red-400">
              <AlertTriangle size={11} /> Detected Hallucination Pattern:
            </span>
            <p className="mt-1 text-xs text-red-300/90 leading-snug">
              {selectedScenario.rawOutput.hallucinationSnippet}
            </p>
          </div>

          <p className="mt-2.5 font-mono text-[11px] text-red-400">
            ⚠️ {selectedScenario.rawOutput.hallucinationRisk}
          </p>
        </div>
      </div>
    </div>
  );
};
export default HallucinationGateLab;
