/**
 * Résumé-only content — everything here is either not modeled in
 * `src/data/portfolio.ts` at all (target role framing, visa status,
 * internship/leadership bullet detail) or is a résumé-specific summary of
 * data that *is* in portfolio.ts.
 *
 * Project detail, dates, and metrics are pulled live from portfolio.ts by
 * `scripts/generate-resume.ts` — this file is intentionally NOT a full
 * duplicate of that data, so the two can't drift apart. Only add resume-only
 * framing here; if it's a project claim, it belongs in portfolio.ts.
 */

export const resumeTargetRole = "AI/ML Analyst";

export const resumeLocationLine =
  "Dubai, UAE · Indian · UAE Student Visa (Transferable)";

export const resumeSummary =
  "MAIB (AI in Business) candidate at SP Jain School of Global Management, Dubai, with a B.Tech in Computer Science Engineering (AI & ML) and hands-on experience shipping end-to-end AI systems. Independently designed, built, and deployed production agentic AI platforms — spanning financial research, real-estate deal intelligence, AML/KYC compliance, and explainable car valuation — each live, tested, and running on real infrastructure. Also contributed to Lulu Sales Intelligence, a real-time retail analytics platform for a large UAE retailer. Combines applied ML/NLP engineering with business analysis and stakeholder communication, sharpened through a Machine Learning internship and cohort leadership as Class Representative. Targeting AI/ML Analyst roles in Dubai/UAE.";

export interface ResumeExperienceEntry {
  title: string;
  org: string;
  location: string;
  date: string;
  bullets: string[];
}

export const resumeExperience: ResumeExperienceEntry[] = [
  {
    title: "Machine Learning Intern",
    org: "Intelliza Solutions Pvt. Ltd.",
    location: "Mumbai, India",
    date: "Feb 2025 – Aug 2025",
    bullets: [
      "Built a loan-advisory chatbot for a North America-based client — starting as an NLTK/spaCy + Tkinter prototype and evolving into a cloud-integrated system with a Flask backend and REST APIs, connected to a POS system covering loan request through collection management.",
      "Integrated location-based services for nearby branch and lender discovery, connecting NLP logic to a functional user experience.",
      "Reconciled task-tracking status across the team's workflow and documented AI/NLP functionality in business terms for non-technical stakeholders, supporting demo-readiness for internal reviews.",
    ],
  },
];

export const resumeLeadership: ResumeExperienceEntry[] = [
  {
    title: "Class Representative",
    org: "SP Jain School of Global Management (MAIB Cohort)",
    location: "Dubai, UAE",
    date: "Oct 2025 – Present",
    bullets: [
      "Serve as primary liaison between a global cohort of students, faculty, and administration on scheduling, attendance, assessments, and academic concerns.",
      "Apply public speaking and event-anchoring experience to host academic and cohort events in live, unscripted settings.",
    ],
  },
];

export interface ResumeEducationEntry {
  title: string;
  org: string;
  date: string;
  detail: string;
}

export const resumeEducation: ResumeEducationEntry[] = [
  {
    title: "Master of Artificial Intelligence in Business (MAIB)",
    org: "SP Jain School of Global Management, Dubai, UAE",
    date: "2025 – Present",
    detail:
      "USD 9,000 merit scholarship recipient; Class Representative. Coursework: Deep Learning, NLP & Language Models, Software Development for AI, Databases, Corporate Finance, Marketing Management.",
  },
  {
    title: "B.Tech, Computer Science Engineering (AI & ML)",
    org: "Manipal University Jaipur",
    date: "2021 – 2025",
    detail:
      "Student Excellence Award and Brilliant Student Award — highest academic performance in B.Tech CSE (AI & ML).",
  },
];

/** Curated for the résumé from `capabilities` (Core-level skills) and the
 * `technologies` actually used across shipped projects in portfolio.ts —
 * every entry here is independently verifiable against that file. */
export const resumeSkillGroups: { label: string; items: string[] }[] = [
  {
    label: "Machine Learning & Deep Learning",
    items: [
      "Machine Learning",
      "Deep Learning",
      "Predictive Modelling",
      "Feature Engineering",
      "Model Evaluation",
      "XGBoost",
      "TensorFlow",
      "Keras",
      "Neural Networks",
      "Graph Neural Networks",
      "Computer Vision (YOLOv8, ONNX)",
      "SHAP / Explainable ML",
    ],
  },
  {
    label: "NLP & Agentic AI",
    items: [
      "Natural Language Processing",
      "Generative AI",
      "Agentic RAG",
      "LangGraph Multi-Agent Orchestration",
      "Hybrid Retrieval (BM25 + Dense + Reranking, pgvector)",
      "Self-RAG / Faithfulness Evaluation",
      "Prompt Engineering",
      "NLTK",
      "spaCy",
    ],
  },
  {
    label: "Engineering & Data",
    items: [
      "Python",
      "SQL",
      "MySQL",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "Git / GitHub",
      "React / Next.js",
      "TypeScript",
      "Streamlit",
      "WebSocket Streaming",
      "Stripe Billing Integration",
      "RBAC / Multi-Tenancy",
    ],
  },
  {
    label: "Business & Communication",
    items: [
      "AI for Business",
      "Business Problem Framing",
      "Stakeholder Management",
      "Market Research",
      "Financial Modelling",
      "Executive Presentation",
      "Corporate Finance",
      "Marketing Management",
    ],
  },
];

export const resumePursuing = [
  "AWS Cloud Practitioner",
  "Power BI / Tableau",
  "GenAI Developer pathways",
];

/**
 * Hand-tuned one-sentence résumé blurbs for "Independent Project" status
 * projects, keyed by `Project.id` in portfolio.ts. If a project has that
 * status but no entry here, `generate-resume.ts` falls back to an
 * auto-generated sentence from `valueProp`/`metrics` and prints a warning —
 * so a newly-added flagship never silently vanishes from the résumé, it
 * just gets a rougher sentence until someone curates a real one here.
 */
export const resumeProjectBlurb: Record<string, string> = {
  fincopilot:
    "Built an agentic RAG financial-research copilot (LangGraph, FastAPI, Next.js) with XBRL-grounded citations and a Self-RAG faithfulness gate; 205 backend tests, CI-gated evals, $0/month hosting.",
  "sakan-ai":
    "Designed a 5-stage multi-agent real-estate deal-intelligence pipeline (LangGraph, FastAPI, Next.js) with live WebSocket reasoning traces, Stripe billing and Arabic localisation; 85 passing tests.",
  "compliance-agent":
    "Built an AML/KYC investigation copilot with a from-scratch NumPy graph convolutional network for risk scoring and a mandatory human-approval gate; 80 tests (76% coverage), red-team suite 6/6 blocked.",
  autovaluate:
    "Shipped a damage-aware car-valuation app with an on-device YOLOv8/ONNX detector (0.732 mAP@0.5) and SHAP-explained XGBoost pricing; zero WCAG 2.1 AA violations.",
};
