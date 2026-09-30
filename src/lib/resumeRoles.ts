/**
 * Static role-tailoring data for the generated résumé. Kept separate from pdfGenerator.ts so the UI can
 * read role labels/summaries without statically importing pdf-lib (≈410 KiB with its font + compression
 * deps), which is only needed when a PDF is actually generated.
 */

export type TargetRoleId = "ai-engineer" | "mlops-engineer" | "data-analytics";

export interface RoleConfig {
  id: TargetRoleId;
  label: string;
  badge: string;
  shortLabel: string;
  summary: string;
  topSkills: string[];
  featuredProjects: {
    title: string;
    tech: string;
    metric: string;
    blurb: string;
  }[];
  experienceHighlights: string[];
}

export const ROLE_CONFIGS: Record<TargetRoleId, RoleConfig> = {
  "ai-engineer": {
    id: "ai-engineer",
    label: "AI & GenAI Systems Engineer",
    badge: "TARGET ROLE: AI & GENAI SYSTEMS ENGINEER",
    shortLabel: "AI & GenAI",
    summary:
      "MAIB (AI in Business) candidate at SP Jain School of Global Management with a B.Tech in CSE (AI & ML). Specializes in production Agentic RAG, multi-agent LangGraph orchestration, Self-RAG hallucination guardrails, and real-time streaming LLM telemetry. Shipped 4 production-grade agent platforms with 205+ backend test suites, XBRL financial parsing, and sub-1.2s p95 latency.",
    topSkills: [
      "Agentic RAG",
      "LangGraph Multi-Agent Orchestration",
      "Self-RAG Faithfulness Evals",
      "Hybrid Search (BM25 + pgvector)",
      "FastAPI & WebSockets",
      "Python / PyTorch",
      "Docker & Microservices",
      "Prompt Engineering",
    ],
    featuredProjects: [
      {
        title: "FinCopilot — Agentic Financial Research Copilot",
        tech: "LangGraph · FastAPI · Next.js · pgvector · Self-RAG",
        metric: "205 tests · 0.94 faithfulness · <1.2s p95",
        blurb:
          "Autonomous RAG copilot with XBRL-grounded SEC filing analysis, citation verification, and human-in-the-loop audit gates.",
      },
      {
        title: "Sakan AI — Real Estate Deal Intelligence",
        tech: "LangGraph · FastAPI · Next.js · Stripe · Arabic NLP",
        metric: "85 tests · 5-agent pipeline · live WebSocket",
        blurb:
          "5-agent automated underwriting and market intelligence pipeline with live WebSocket reasoning traces and bilingual UI.",
      },
      {
        title: "ComplianceAgent — AML/KYC Graph Copilot",
        tech: "NumPy GCN · FastAPI · NetworkX · Human-in-the-loop",
        metric: "80 tests · 76% coverage · 6/6 red-team blocked",
        blurb:
          "AML transaction network investigation engine using a custom Graph Convolutional Network and mandatory sanction gates.",
      },
    ],
    experienceHighlights: [
      "Rebuilt the core intent-classification and response engine with spaCy and NLTK behind a scalable REST API on a North America client POS platform.",
      "Engineered automated fallback mechanisms and boundary validators for unfamiliar borrower queries, drastically reducing out-of-scope model errors.",
      "Connected real-time geolocation services with relational SQL lender repositories to automate borrower discovery.",
    ],
  },
  "mlops-engineer": {
    id: "mlops-engineer",
    label: "Applied Machine Learning & MLOps",
    badge: "TARGET ROLE: APPLIED MACHINE LEARNING & MLOPS",
    shortLabel: "ML & MLOps",
    summary:
      "Applied ML & MLOps practitioner with production experience across model evaluation, on-device edge deployment, CI-gated regression benchmarks, and automated rollback runbooks. Experienced in training, fine-tuning, and optimizing lightweight computer vision (YOLOv8/ONNX) and gradient-boosted ensembles (XGBoost with SHAP explainability).",
    topSkills: [
      "MLOps & CI/CD Pipelines",
      "Model Evaluation Benchmarks",
      "Edge Computer Vision (YOLOv8/ONNX)",
      "Gradient Boosting (XGBoost)",
      "SHAP Explainability",
      "Python / NumPy / Scikit-Learn",
      "Docker Containerization",
      "Regression Testing",
    ],
    featuredProjects: [
      {
        title: "AutoValuate — On-Device Computer Vision & Pricing",
        tech: "YOLOv8 · ONNX Runtime · XGBoost · SHAP · TypeScript",
        metric: "0.732 mAP@0.5 · 45ms inference · 0 WCAG AA bugs",
        blurb:
          "Damage-aware vehicle valuation running local on-device ONNX vision models paired with SHAP-explained pricing predictions.",
      },
      {
        title: "ComplianceAgent — Graph Neural Risk Classifier",
        tech: "NumPy GCN · Scikit-Learn · NetworkX · Synthetic Data",
        metric: "80 unit/integration tests · 6/6 adversarial blocks",
        blurb:
          "Constructed graph convolution layer from scratch in NumPy for transaction risk scoring with rigorous cross-validation.",
      },
      {
        title: "FinCopilot — Automated Eval & Regression Suite",
        tech: "LangGraph · Pytest · Synthetic Evals · Docker",
        metric: "205 backend test suites · CI eval gates",
        blurb:
          "Built end-to-end evaluation harness checking context relevance, answer groundedness, and latency budgets on every commit.",
      },
    ],
    experienceHighlights: [
      "Shipped automated build-and-rollback runbooks that transitioned a 5-person engineering team from manual handoffs to deterministic CI/CD releases.",
      "Established pre-release benchmark evaluation sets to continuously audit and validate model accuracy before client deployment.",
      "Integrated model telemetry to track latency and confidence score distributions during live production loan evaluations.",
    ],
  },
  "data-analytics": {
    id: "data-analytics",
    label: "Data & Analytics Solutions Lead",
    badge: "TARGET ROLE: DATA & ANALYTICS SOLUTIONS LEAD",
    shortLabel: "Data & Analytics",
    summary:
      "Data & Analytics specialist adept at bridging complex data pipelines, SQL transformations, predictive modeling, and executive stakeholder communication. Architected 913,000-row retail data pipelines, financial risk calculators, and rule-based Natural Language to SQL interfaces validated by academic and industry mentors.",
    topSkills: [
      "Advanced SQL & Data Modeling",
      "PostgreSQL / MySQL / DuckDB",
      "Predictive Analytics & Forecasting",
      "Business Intelligence & KPIs",
      "Stakeholder Communication",
      "Financial Modeling",
      "Python (Pandas / Polars)",
      "Data Validation & Governance",
    ],
    featuredProjects: [
      {
        title: "Retail Intelligence Platform — 913k Row Analytics",
        tech: "Python · Pandas · Streamlit · PostgreSQL · Plotly",
        metric: "913,000 transaction rows · faculty-validated",
        blurb:
          "End-to-end retail forecasting and customer churn intelligence engine processing nearly a million real transactions.",
      },
      {
        title: "TalkToData / NL2SQL — Rule-Based Data Querying",
        tech: "TypeScript · SQL Parser · Schema Mapping · AST",
        metric: "Zero hallucinations · deterministic queries",
        blurb:
          "Natural Language to SQL translator translating executive business questions into precise, auditable database queries.",
      },
      {
        title: "FinCopilot — SEC Financial Filing Data Extraction",
        tech: "XBRL Parser · Financial Metrics · LangGraph",
        metric: "10-K & 10-Q automated extraction · audit-ready",
        blurb:
          "Automated financial statement extraction extracting revenue, EBITDA, and balance sheet metrics directly from SEC filings.",
      },
    ],
    experienceHighlights: [
      "Mapped complex borrower attributes and live geolocation coordinates directly to relational SQL lender tables for instant query matching.",
      "Translated technical model predictions into plain-language acceptance criteria and business requirements for executive client sign-offs.",
      "Maintained multi-month project delivery roadmaps and milestone scorecards, ensuring on-time rollout for North America client operations.",
    ],
  },
};
