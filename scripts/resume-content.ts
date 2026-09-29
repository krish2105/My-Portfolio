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
  "Dubai, UAE · Indian National · UAE Student Visa (Transferable)";

export const resumeSummary =
  "MAIB (AI in Business) candidate at SP Jain School of Global Management, Dubai, with a B.Tech in Computer Science Engineering (AI & ML). Seven months of production machine-learning experience on an NLP loan-advisory system for a North America lending client, delivered inside a five-person team. Independently designed and shipped four agentic AI platforms — spanning financial research, real estate, compliance, and vehicle valuation — plus a 913,000-row retail analytics platform that faculty validated. Works comfortably across model development, SQL, and the requirements documentation non-technical stakeholders actually read.";

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
      "Took a loan-advisory chatbot from Tkinter prototype to a production service on a North America client's POS platform — measured by live operation across the full loan lifecycle — by rebuilding the intent-classification and response layer in Python with Flask, spaCy and NLTK behind a REST API.",
      "Cut how often the assistant failed on unfamiliar borrower questions, checked against a fixed benchmark set before every release, by relabelling the training data, engineering features from raw query text, and adding fallback handling for out-of-scope intents.",
      "Shipped a location-aware branch and lender discovery feature that reached production users and passed client sign-off at rollout, after connecting the intent parser to live geolocation data and a SQL lender table so borrowers no longer searched by hand.",
      "Made deployments repeatable for a five-person team, evidenced by the shift from manual handoffs to a documented build-and-rollback runbook the team used for every release afterwards.",
      "Kept a seven-month engagement on schedule, tracked in a shared Excel delivery sheet, by turning model behaviour into written acceptance criteria non-technical stakeholders could sign off against.",
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
      "Present cohort-level academic and operational issues directly to faculty and programme leadership on behalf of 28 students across multiple nationalities, then carry decisions back to the cohort in a form they can act on — the only point of contact between the two.",
      "Anchored live academic and cohort events for audiences above 1,000 without a script, drawing on trained public-speaking and event-anchoring experience.",
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
