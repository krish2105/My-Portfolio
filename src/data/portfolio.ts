import type {
  Profile,
  SocialLinks,
  JourneyItem,
  CapabilityGroup,
  Project,
  RecognitionItem,
  ServiceItem,
  NowItem,
  Testimonial,
  WritingItem,
  TrustPlaceholder,
} from "../types/portfolio";

export const profile: Profile = {
  name: "Krishna Mathur",
  titles: [
    "Agentic AI Engineer",
    "Machine Learning Developer",
    "AI Product Builder",
    "GenAI & RAG Systems Builder",
    "Deep Learning Practitioner",
    "Creative Technologist",
  ],
  location: "Dubai, UAE",
  secondaryLocation: "Jaipur, India",
  availability: "Open to opportunities and collaborations in AI, data, GenAI and intelligent software.",
  availabilityShort: "Open to roles",
  responseTime: "Usually replies within 24–48h.",
  tagline: "I build AI that turns messy data, language and business workflows into decisions.",
  aboutStatements: [
    "I am Krishna Mathur, an AI developer, data analyst and GenAI builder currently pursuing a Master of AI in Business at SP Jain School of Global Management in Dubai. I completed my B.Tech in Computer Science and Engineering with a specialisation in Artificial Intelligence and Machine Learning from Manipal University Jaipur.",
    "My work focuses on shipping real, live AI systems — agentic RAG pipelines, multi-agent orchestration, explainable ML and computer vision — not just prototypes. Recent independent builds run in production with real test suites, CI-gated evaluations and public live demos, spanning fintech, real estate, compliance and automotive valuation.",
    "I enjoy developing end-to-end systems that combine rigorous engineering — grounded retrieval, human-approval gates, honest evaluation metrics — with a clear understanding of users, decisions and business requirements.",
  ],
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  RESUME — Google Drive direct download
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Upload your resume PDF to Google Drive.
 *  2. Right-click → Share → "Anyone with the link" (Viewer).
 *  3. Copy the share link. It looks like:
 *       https://drive.google.com/file/d/1AbCDeFgHiJkLmNoPqRsTuVwXyZ/view?usp=sharing
 *  4. Paste ONLY the id part (the value between /d/ and /view) below.
 *  The site turns it into a forced-download link automatically, so clicking
 *  "Download Resume" downloads the file immediately instead of opening a viewer.
 */
export const RESUME_DRIVE_FILE_ID: string = "1upvjDh5j7JxcwLfmwb-MPkB3urDhzfuw";

const resumeDownloadUrl =
  RESUME_DRIVE_FILE_ID && RESUME_DRIVE_FILE_ID !== "REPLACE_WITH_YOUR_DRIVE_FILE_ID"
    ? `https://drive.google.com/uc?export=download&id=${RESUME_DRIVE_FILE_ID}`
    : "";

/** Full international format (no spaces/dashes) — single source for both
 * the tel: and wa.me links below, so they can never drift apart. */
const PHONE_E164 = "+971501946921";
/** Human-readable version of the same number, for visible display. */
export const PHONE_DISPLAY = "+971 50 194 6921";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SOCIAL LINKS — replace the placeholder usernames with your real profiles.
 *  Leave a value as "" to hide that link entirely.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const socialLinks: SocialLinks = {
  email: "mailto:krishnamathur008@gmail.com",
  github: "https://github.com/krish2105",
  linkedin: "https://www.linkedin.com/in/krishnamathurmay/",
  // Hidden (not fake placeholders) until real profiles are supplied — a
  // "your-username" link that 404s is worse than no icon at all.
  instagram: "",
  kaggle: "https://www.kaggle.com/krishna21052003",
  twitter: "",
  resume: resumeDownloadUrl,
  website: "",
  phone: `tel:${PHONE_E164}`,
  whatsapp: `https://wa.me/${PHONE_E164.replace("+", "")}`,
};

/**
 * "Now" — what I'm focused on at the moment. Keep this fresh; it signals
 * momentum to recruiters. Update the values as things change.
 */
export const now: NowItem[] = [
  {
    id: "studying",
    label: "Studying",
    value: "Master of AI in Business at SP Jain Global, Dubai — Term 3.",
  },
  {
    id: "building",
    label: "Building",
    value: "Independent agentic AI systems — cited RAG copilots, multi-agent pipelines and explainable ML, shipped live.",
  },
  {
    id: "exploring",
    label: "Exploring",
    value: "LangGraph orchestration, graph neural networks, and on-device computer vision.",
  },
  {
    id: "open-to",
    label: "Open to",
    value: "AI / Data roles, internships and collaborations — in Dubai, India or remote.",
  },
];

export const services: ServiceItem[] = [
  {
    id: "agentic-rag",
    title: "AGENTIC AI & RAG SYSTEMS",
    description: "Cited, grounded copilots that refuse to guess — hybrid retrieval, faithfulness gates and adaptive agent routing — see FinCopilot.",
  },
  {
    id: "multi-agent-intelligence",
    title: "MULTI-AGENT DEAL INTELLIGENCE",
    description: "Multi-stage LangGraph pipelines with live reasoning traces, turning a plain-English question into a defensible decision — see Sakan AI.",
  },
  {
    id: "regulated-ai-copilots",
    title: "REGULATED-DOMAIN AI COPILOTS",
    description: "Human-approval-gated agents for compliance and risk, with from-scratch models and red-team-tested safety — see ComplianceAgent.",
  },
  {
    id: "explainable-ml-cv",
    title: "EXPLAINABLE ML & COMPUTER VISION",
    description: "On-device computer vision and SHAP-attributed pricing that shows its work instead of a black-box number — see AutoValuate.",
  },
];

export const journey: JourneyItem[] = [
  {
    id: "independent-ai-systems",
    title: "Independent AI Systems Engineer",
    institution: "Self-directed",
    // NOTE: placeholder date range — confirm the real start date before shipping.
    date: "2026—Present",
    description: "Designed and built 4 independent, production-grade agentic AI systems end to end: FinCopilot (cited financial RAG copilot), Sakan AI (multi-agent Dubai real-estate deal intelligence), ComplianceAgent (AML/KYC investigation copilot with a from-scratch graph neural network) and AutoValuate Intelligence (on-device computer vision + explainable car valuation). Each ships with a live public demo, automated test suites (205, 85 and 80 tests respectively) and CI-gated evaluation metrics.",
  },
  {
    id: "class-rep",
    title: "Class Representative",
    institution: "Master of AI in Business cohort",
    date: "October 2025—Present",
    description: "Supported communication, coordination and collaborative academic activities within the Master of AI in Business cohort.",
  },
  {
    id: "masters",
    title: "Master of AI in Business",
    institution: "SP Jain School of Global Management, Dubai",
    date: "September 2025—Present",
    description: "Developing expertise at the intersection of artificial intelligence, business analytics, databases, marketing, corporate finance, operations, decision-making and intelligent software development.",
  },
  {
    id: "internship",
    title: "Machine Learning Intern",
    institution: "Intelliza Solutions Pvt. Ltd.",
    date: "February 2025—June 2025",
    description: "Worked on an AI-powered loan advisory chatbot that combined conversational workflows, natural-language processing, loan guidance and location-based assistance. Built during an internship at Intelliza Solutions Pvt. Ltd.; confidential client details are not disclosed.",
  },
  {
    id: "btech",
    title: "B.Tech CSE — Artificial Intelligence and Machine Learning",
    institution: "Manipal University Jaipur",
    date: "2021—2025",
    description: "Built a strong foundation in programming, artificial intelligence, machine learning, deep learning, natural language processing, computer vision, data structures, algorithms, databases and software development through academic study and practical projects.",
  },
];

export const capabilities: CapabilityGroup[] = [
  {
    id: "ai-ml",
    title: "Artificial Intelligence and Machine Learning",
    description: "Core intelligence and predictive systems",
    skills: [
      { name: "Artificial Intelligence", level: "Core" },
      { name: "Machine Learning", level: "Core" },
      { name: "Predictive Modelling", level: "Core" },
      { name: "Classification", level: "Core" },
      { name: "Regression", level: "Core" },
      { name: "Clustering", level: "Working Knowledge" },
      { name: "Feature Engineering", level: "Core" },
      { name: "Model Evaluation", level: "Core" },
      { name: "Ensemble Learning", level: "Working Knowledge" },
      { name: "Support Vector Machines", level: "Academic Experience" },
      { name: "Decision Trees", level: "Core" },
      { name: "Naive Bayes", level: "Academic Experience" },
      { name: "K-Means", level: "Academic Experience" },
      { name: "Apriori", level: "Academic Experience" },
      { name: "PCA", level: "Academic Experience" },
    ],
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    description: "Neural networks and advanced models",
    skills: [
      { name: "Neural Networks", level: "Core" },
      { name: "TensorFlow", level: "Working Knowledge" },
      { name: "Keras", level: "Working Knowledge" },
      { name: "CNN", level: "Academic Experience" },
      { name: "SimpleRNN", level: "Academic Experience" },
      { name: "LSTM", level: "Academic Experience" },
      { name: "Image Classification", level: "Academic Experience" },
      { name: "Time-Series Forecasting", level: "Academic Experience" },
      { name: "Data Augmentation", level: "Working Knowledge" },
      { name: "Hyperparameter Tuning", level: "Working Knowledge" },
      { name: "Graph Neural Networks", level: "Working Knowledge" },
      { name: "Computer Vision (YOLOv8, ONNX)", level: "Working Knowledge" },
    ],
  },
  {
    id: "nlp-genai",
    title: "Generative AI and Agentic Systems",
    description: "Language processing, agentic pipelines and grounded RAG",
    skills: [
      { name: "Natural Language Processing", level: "Core" },
      { name: "Generative AI", level: "Core" },
      { name: "Agentic RAG", level: "Working Knowledge" },
      { name: "LangGraph", level: "Working Knowledge" },
      { name: "Multi-Agent Orchestration", level: "Working Knowledge" },
      { name: "Hybrid Retrieval (BM25 + Dense + Reranking)", level: "Working Knowledge" },
      { name: "Self-RAG / Faithfulness Evaluation", level: "Working Knowledge" },
      { name: "Prompt Engineering", level: "Core" },
      { name: "Conversational AI", level: "Academic Experience" },
      { name: "TF-IDF", level: "Core" },
      { name: "N-Gram Models", level: "Core" },
      { name: "Tokenisation", level: "Core" },
      { name: "POS Tagging", level: "Core" },
      { name: "Parsing", level: "Academic Experience" },
      { name: "Text Classification", level: "Working Knowledge" },
      { name: "NLTK", level: "Working Knowledge" },
      { name: "spaCy", level: "Working Knowledge" },
    ],
  },
  {
    id: "data-bi",
    title: "Data and Business Intelligence",
    description: "Analytics and decision support",
    skills: [
      { name: "Data Analytics", level: "Core" },
      { name: "Business Intelligence", level: "Working Knowledge" },
      { name: "Data Visualisation", level: "Core" },
      { name: "Pandas", level: "Core" },
      { name: "NumPy", level: "Core" },
      { name: "Matplotlib", level: "Core" },
      { name: "Excel", level: "Core" },
      { name: "Power BI", level: "Academic Experience" },
      { name: "Tableau", level: "Academic Experience" },
      { name: "Marketing Analytics", level: "Academic Experience" },
      { name: "Finance Analytics", level: "Academic Experience" },
      { name: "Business Decision Support", level: "Working Knowledge" },
      { name: "XGBoost", level: "Working Knowledge" },
      { name: "SHAP / Explainable ML", level: "Working Knowledge" },
    ],
  },
  {
    id: "db-dev",
    title: "Databases and Development",
    description: "Software engineering and data storage",
    skills: [
      { name: "Python", level: "Core" },
      { name: "SQL", level: "Core" },
      { name: "MySQL", level: "Working Knowledge" },
      { name: "HTML", level: "Working Knowledge" },
      { name: "CSS", level: "Working Knowledge" },
      { name: "JavaScript", level: "Working Knowledge" },
      { name: "TypeScript", level: "Working Knowledge" },
      { name: "FastAPI", level: "Working Knowledge" },
      { name: "Next.js", level: "Working Knowledge" },
      { name: "Streamlit", level: "Working Knowledge" },
      { name: "Tkinter", level: "Academic Experience" },
      { name: "Git", level: "Working Knowledge" },
      { name: "GitHub", level: "Working Knowledge" },
      { name: "Jupyter Notebook", level: "Core" },
      { name: "Google Colab", level: "Core" },
      { name: "VS Code", level: "Core" },
      { name: "RBAC / Multi-Tenancy", level: "Working Knowledge" },
      { name: "WebSocket Streaming", level: "Working Knowledge" },
      { name: "Stripe Billing Integration", level: "Working Knowledge" },
      { name: "Security Hardening", level: "Working Knowledge" },
    ],
  },
  {
    id: "business-strategy",
    title: "Business and Strategy",
    description: "Connecting AI with business value",
    skills: [
      { name: "AI for Business", level: "Core" },
      { name: "Business Problem Framing", level: "Core" },
      { name: "Marketing Management", level: "Academic Experience" },
      { name: "Corporate Finance", level: "Academic Experience" },
      { name: "Operations", level: "Academic Experience" },
      { name: "Optimisation", level: "Academic Experience" },
      { name: "Decision-Making", level: "Core" },
      { name: "AI Product Thinking", level: "Working Knowledge" },
      { name: "Team Collaboration", level: "Core" },
      { name: "Academic Leadership", level: "Academic Experience" },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "fincopilot",
    number: "01",
    title: "FinCopilot — Cited Financial Research Copilot",
    shortTitle: "FinCopilot",
    category: "Generative AI · Agentic RAG · FinTech",
    status: "Independent Project",
    description:
      "An AI financial-research copilot that answers investment questions over real SEC filings with exact, cited figures — routing simple lookups cheaply and multi-hop reasoning through an agentic pipeline, and refusing to answer when the evidence is insufficient.",
    features: [
      "Cited Q&A over real 10-K/10-Q filings",
      "XBRL exact-figure lookup tied to SEC accession numbers",
      "Adaptive routing from simple lookups to multi-hop agentic reasoning",
      "Self-RAG faithfulness gate that blocks ungrounded claims",
      "DCF valuation calculator with editable assumptions",
      "Screener, market maps and watchlists",
      "Risk analysis: YoY risk diffs, red-flag detection, portfolio overlap",
    ],
    technologies: ["Python", "FastAPI", "LangGraph", "PostgreSQL", "pgvector", "Next.js", "TypeScript", "Tailwind CSS", "Gemini", "Groq"],
    tags: ["GenAI", "AI/ML"],
    images: ["/projects/fincopilot/01_landing.webp", "/projects/fincopilot/02_dashboard.webp"],
    repositoryUrl: "https://github.com/krish2105/FinCopilot-",
    liveUrl: "https://fin-copilot-six.vercel.app",
    note: "Independent build, hosted entirely on free tiers (Vercel, Render, Supabase) — 205 backend tests and CI-gated evaluation metrics guard every deploy.",
    problem:
      "Financial LLM answers routinely hallucinate numbers that sound plausible but don't trace to a real filing — a dangerous failure mode for investment research.",
    approach: [
      "Ingested real SEC 10-K/10-Q filings and indexed them with hybrid search (BM25 + dense embeddings) plus an ONNX int8 cross-encoder reranker.",
      "Pulled exact figures from XBRL tags rather than asking the LLM to read them off a rendered table.",
      "Built adaptive routing so simple lookups stay cheap and only multi-hop questions pay for full agentic reasoning (LangGraph).",
      "Added a Self-RAG faithfulness gate that checks every claim against retrieved evidence and blocks the answer if it isn't grounded.",
    ],
    role: "Designed and built the full stack solo — retrieval pipeline, XBRL grounding, LangGraph agent routing, evaluation harness and the Next.js frontend.",
    impact: [
      "Every answer either cites its source (filing, page, item number) or explicitly says 'insufficient evidence' — no silent hallucination.",
      "205 backend tests and PR-blocking evaluation gates catch regressions before they ship.",
      "Runs entirely on free-tier infrastructure end to end — $0/month.",
    ],
    metrics: [
      { label: "Backend tests", value: "205 passing" },
      { label: "Hosting cost", value: "$0/month" },
      { label: "Retrieval", value: "Hybrid BM25 + dense + reranker" },
    ],
    decisions: [
      {
        choice: "XBRL exact lookup instead of LLM-read tables",
        why: "Financial figures are exact-or-wrong — pulling from structured XBRL data eliminates the single biggest source of hallucinated numbers.",
      },
      {
        choice: "Adaptive routing (cheap path vs. agentic path)",
        why: "Most questions are simple lookups; reserving full multi-hop LangGraph reasoning for genuinely complex questions keeps cost and latency down without sacrificing depth when it's needed.",
      },
      {
        choice: "Self-RAG faithfulness gate that can refuse to answer",
        why: "A financial copilot that occasionally says 'I don't have enough evidence' is far more trustworthy than one that always sounds confident.",
      },
    ],
    valueProp: "Financial Q&A that shows its work — cited, XBRL-grounded answers that refuse to guess.",
    audience: "Investment research teams and fintech products evaluating trustworthy LLM-backed analysis.",
    architecture: [
      { label: "SEC 10-K/10-Q filings + XBRL" },
      { label: "Hybrid retrieval (BM25 + dense + reranker)" },
      { label: "LangGraph adaptive agent routing" },
      { label: "Self-RAG faithfulness gate" },
      { label: "Cited answer + Next.js dashboard" },
    ],
    limitations: [
      "Free-tier hosting (Render) cold-starts after inactivity — first request can take a few seconds.",
      "Coverage is limited to the companies and filings that have been ingested, not the full market.",
    ],
    nextSteps: [
      "Expand filing coverage beyond the current ticker set.",
      "Add portfolio-level monitoring that alerts on new risk-factor language across held positions.",
    ],
    flagship: true,
  },
  {
    id: "sakan-ai",
    number: "02",
    title: "Sakan AI — Agentic Real-Estate Deal Intelligence",
    shortTitle: "Sakan AI",
    category: "Agentic AI · Real Estate · Dubai Market",
    status: "Independent Project",
    description:
      "An agentic deal-intelligence platform for Dubai real estate: a five-stage LangGraph pipeline that takes a plain-English deal question and returns comparable transactions, a defensible valuation, a RERA compliance check and a ready-to-send memo — with the agent's reasoning streamed live over WebSocket.",
    features: [
      "Five-stage agent pipeline: query classification → comps search → valuation → compliance RAG → memo generation",
      "Live agent-trace streaming over WebSocket",
      "Deterministic fallback paths — full pipeline runs at $0 without an API key",
      "Compliance RAG grounded in a regulatory corpus with citation provenance",
      "Arabic localisation with RTL layout",
      "Stripe billing across three tiers, WhatsApp query intake, Chrome extension for inline listing valuations",
    ],
    technologies: ["Python", "FastAPI", "LangGraph", "PostgreSQL", "Qdrant", "Next.js", "TypeScript", "Tailwind CSS", "Claude", "Gemini", "Docker"],
    tags: ["GenAI", "AI/ML", "Data"],
    images: ["/projects/sakan/01_landing.webp"],
    repositoryUrl: "https://github.com/krish2105/SakanAgenticAi",
    liveUrl: "https://sakan-agentic-ai.vercel.app",
    note: "Independent build — all 11 phases in the project's own architecture spec are implemented and covered by 85 passing tests.",
    problem:
      "Dubai property deals require cross-referencing comparable transactions, a fair valuation and RERA regulatory compliance — normally three separate manual lookups before an agent can move on a deal.",
    approach: [
      "Built a 5-node LangGraph pipeline: classify the question, pull comparable transactions, compute a valuation, check regulatory compliance via RAG, then assemble a memo.",
      "Streamed each agent's reasoning step live over WebSocket so the user watches the pipeline think, not just wait for a final answer.",
      "Grounded compliance checks in a regulatory document corpus with citation provenance, so every compliance claim traces to a real clause.",
      "Added a deterministic fallback at every agent step so the full pipeline is exercisable with zero API cost before wiring in a real LLM key.",
    ],
    role: "Designed and built the full system solo — the agent pipeline, the compliance RAG corpus, the API, and all five frontend pages.",
    impact: [
      "Full 11-phase architecture (dataset generation, regulatory corpus, agent pipeline, API, five frontend pages) implemented and verified.",
      "85 passing unit tests across agents, auth, billing, RAG ingestion and data adapters.",
      "PII retention enforcement (180-day purge) automated via scheduled GitHub Actions.",
    ],
    metrics: [
      { label: "Tests", value: "85 passing" },
      { label: "Pipeline stages", value: "5-node LangGraph" },
      { label: "Synthetic dataset", value: "~600 transactions" },
    ],
    decisions: [
      {
        choice: "Deterministic fallback at every agent node",
        why: "A demo that only works with a paid API key is a demo few people will actually try — zero-cost fallback paths let anyone exercise the real pipeline end to end.",
      },
      {
        choice: "Stream agent reasoning live over WebSocket",
        why: "Deal intelligence needs to be auditable, not a black box — showing the trace as it happens builds the same trust the compliance-citation approach does.",
      },
      {
        choice: "Authenticated deal-pipeline endpoints from day one",
        why: "An early build had a guessable-ID data leak on deal queries — real user accounts and access control became a hard requirement once that was found.",
      },
    ],
    valueProp: "Agentic real-estate deal intelligence — comps, valuation, compliance and memo, from one plain-English question.",
    audience: "Dubai real-estate brokers, agencies and proptech teams.",
    architecture: [
      { label: "Plain-English deal question" },
      { label: "Query classification agent" },
      { label: "Comps search + valuation agents" },
      { label: "Compliance RAG (RERA corpus)" },
      { label: "Memo generation + live WebSocket trace" },
    ],
    limitations: [
      "Runs on a synthetic ~600-transaction dataset with adapters for real Dubai Land Department data, not a live DLD feed.",
      "Full LLM-backed reasoning requires a Claude or Gemini API key — the zero-cost path uses deterministic fallbacks instead.",
    ],
    nextSteps: [
      "Wire in a real Dubai Land Department data adapter.",
      "Expand the regulatory corpus beyond the current synthetic compliance documents.",
    ],
    flagship: true,
  },
  {
    id: "compliance-agent",
    number: "03",
    title: "ComplianceAgent — AML/KYC Investigation Copilot",
    shortTitle: "ComplianceAgent",
    category: "Agentic AI · RegTech · AML/KYC",
    status: "Independent Project",
    description:
      "A multi-agent AML/KYC investigation copilot that pre-screens flagged transactions, scores accounts with a from-scratch graph convolutional network, drafts Enhanced Due Diligence reports with cited evidence, and enforces mandatory human approval before any case is finalised.",
    features: [
      "Agentic pipeline: evidence retrieval → sanctions/PEP screening → GNN risk scoring → typology matching → regulatory RAG → narrative drafting → verification",
      "Graph Convolutional Network built from scratch in NumPy for account risk scoring",
      "28 SAML-D suspicious-activity typology classification",
      "Backend-enforced human approval gate — no auto-clearance",
      "Multi-tenant RBAC (analyst/MLRO/admin), full audit trail",
      "CI-gated evaluation: faithfulness, citation validity, zero-hallucination and typology-accuracy gates",
    ],
    technologies: ["Python", "FastAPI", "LangGraph", "NumPy", "DuckDB", "ChromaDB", "NetworkX", "React", "TypeScript", "Vite", "Tailwind CSS"],
    tags: ["GenAI", "AI/ML", "Deep Learning"],
    images: ["/projects/complianceagent/01_case_queue.webp"],
    repositoryUrl: "https://github.com/krish2105/Compilance-Agent-",
    liveUrl: "https://frontend-three-pi-15.vercel.app",
    note: "Independent build — 80 unit tests (76% coverage), a red-team jailbreak suite (6/6 blocked), and a documented model card and data sheet.",
    problem:
      "AML/KYC teams drown in flagged transactions that need consistent triage, evidence-backed documentation and a defensible audit trail — but automating that risks either missing real risk or over-trusting an opaque model.",
    approach: [
      "Built a chain of specialised agents: an Evidence Agent that queries transaction networks and KYC profiles, a Screening Agent for sanctions/PEP matching, a GNN Detector for graph-based risk scoring, a Typology-Match Agent, a Regulatory-Context Agent, and a Narrative Agent that drafts the case report.",
      "Wrote the graph convolutional network from scratch in NumPy rather than pulling in a deep-learning framework, to score accounts on transaction-network structure.",
      "Added a Verifier agent that re-checks every factual claim and citation in the draft narrative against the actual underlying data before it reaches a human.",
      "Enforced a backend-level human-approval gate — the system can draft and recommend, but never auto-clears a case.",
    ],
    role: "Designed and built the entire agentic pipeline solo, including the from-scratch GNN, the verification layer and the production hardening (RBAC, multi-tenancy, rate limiting).",
    impact: [
      "80 unit tests at 76% coverage plus Playwright end-to-end tests across desktop and mobile.",
      "Six-gate safety evaluation (typology accuracy, context recall, faithfulness, citation validity, zero hallucination, verifier catch rate) blocks regressions in CI.",
      "Red-team jailbreak suite: 6/6 attempts blocked.",
      "Ships at $0/month with pluggable LLM providers (Gemini, Groq, or a fully offline deterministic fallback).",
    ],
    metrics: [
      { label: "Tests", value: "80 (76% coverage)" },
      { label: "Red-team suite", value: "6/6 blocked" },
      { label: "Typologies covered", value: "28 (SAML-D)" },
    ],
    decisions: [
      {
        choice: "Graph convolutional network written from scratch in NumPy",
        why: "A regulated-domain risk model benefits from being fully inspectable — no framework black box between the account-network structure and the risk score.",
      },
      {
        choice: "Mandatory human approval gate enforced server-side",
        why: "AML/KYC decisions carry real regulatory and reputational weight — the backend, not just the UI, must guarantee a human signs off before a case closes.",
      },
      {
        choice: "A dedicated Verifier agent re-checking every citation",
        why: "Narrative-drafting agents can misattribute evidence even when the underlying retrieval was correct — a second, adversarial check catches that before a human reviewer has to.",
      },
    ],
    valueProp: "An AML/KYC copilot that drafts evidence-cited investigations — and never clears a case without a human.",
    audience: "Compliance, MLRO and risk teams at banks and fintechs evaluating agentic AI for regulated workflows.",
    architecture: [
      { label: "Flagged transaction" },
      { label: "Evidence + sanctions/PEP screening agents" },
      { label: "From-scratch GNN risk scoring" },
      { label: "Typology match + regulatory RAG" },
      { label: "Verified narrative → human approval gate" },
    ],
    limitations: [
      "Trained and evaluated on synthetic transaction data, not a live financial-institution feed.",
      "The deterministic typology matcher occasionally swaps adjacent top-1 typologies — documented candidly in the project's own model card.",
    ],
    nextSteps: [
      "Validate the GNN risk model against a real (anonymised) transaction-network dataset.",
      "Extend typology coverage beyond the current 28 SAML-D categories.",
    ],
    flagship: true,
  },
  {
    id: "autovaluate",
    number: "04",
    title: "AutoValuate Intelligence — Damage-Aware Car Valuation",
    shortTitle: "AutoValuate",
    category: "Computer Vision · Explainable ML · FinTech",
    status: "Independent Project",
    description:
      "A damage-aware used-car valuation system for the UAE market that runs an on-device damage detector, prices the vehicle with an explainable quantile-regression model, and grounds every claim in real listings and a verified report.",
    features: [
      "On-device damage detection (YOLOv8-small, ONNX) — photos never leave the browser",
      "Explainable pricing via XGBoost quantile regression with SHAP price-driver breakdowns",
      "Hybrid RAG retrieval (embeddings + BM25) over real Dubizzle listings",
      "Repair-cost estimator with worth-fixing verdicts",
      "Bulk dealer valuation via CSV upload",
      "Grounded chat assistant with citation-checked responses",
      "PDF export, shareable links, installable PWA with offline support",
    ],
    technologies: ["Next.js", "TypeScript", "FastAPI", "LangGraph", "YOLOv8", "ONNX", "XGBoost", "SHAP", "Python", "Supabase"],
    tags: ["AI/ML", "Deep Learning", "Data"],
    images: ["/projects/autovaluate/01_landing.webp"],
    repositoryUrl: "https://github.com/krish2105/AutoValuate-Intelligence",
    liveUrl: "https://auto-valuate-intelligence.vercel.app",
    note: "Independent build — full accessibility audit at zero WCAG 2.1 AA violations, responsive from 320px to 1440px.",
    problem:
      "Used-car pricing in the UAE hides real value destruction in visible damage — buyers and sellers need a valuation that explains itself, not a black-box number.",
    approach: [
      "Trained a YOLOv8-small damage detector (18k training images, mAP@0.5 = 0.732) and exported it to ONNX so it runs entirely client-side.",
      "Fed detected damage into an XGBoost quantile-regression pricing model, with SHAP attribution breaking down exactly which factors moved the price.",
      "Built hybrid RAG retrieval (embeddings + BM25) over real Dubizzle listings so every comparable cited is a real, verifiable listing.",
      "Added a report-verification pass ensuring every number in the final valuation traces to an actual computed value, not a generated guess.",
    ],
    role: "Designed and built the full stack solo — the CV damage model, the explainable pricing model, the RAG retrieval layer and the Next.js PWA frontend.",
    impact: [
      "Damage detector reaches 0.732 mAP@0.5 across 18k training images, running fully on-device for user privacy.",
      "Every price driver is SHAP-attributed and every comparable is a real, cited listing.",
      "Zero WCAG 2.1 AA violations across a fully responsive 320–1440px layout.",
    ],
    metrics: [
      { label: "Damage detection", value: "0.732 mAP@0.5" },
      { label: "Training images", value: "18k" },
      { label: "Accessibility", value: "0 WCAG 2.1 AA violations" },
    ],
    decisions: [
      {
        choice: "On-device damage detection via ONNX instead of a server call",
        why: "Users are uploading photos of their own car — keeping inference client-side means images never leave the device, which matters for a valuation tool handling personal vehicle data.",
      },
      {
        choice: "SHAP-attributed quantile regression instead of a single point estimate",
        why: "A single price number invites distrust; showing the price range and exactly which damage/features moved it lets a buyer or seller argue with the model on its own terms.",
      },
      {
        choice: "Hybrid RAG over real Dubizzle listings, not synthetic comps",
        why: "Explainability only matters if the comparables are real and checkable — grounding retrieval in live listings keeps every citation honest.",
      },
    ],
    valueProp: "Damage-aware car valuation that explains every price driver and cites real listings — computed on-device.",
    audience: "UAE car marketplaces, dealers and buyers wanting transparent, explainable pricing.",
    architecture: [
      { label: "Uploaded car photos (on-device)" },
      { label: "YOLOv8/ONNX damage detection" },
      { label: "XGBoost quantile regression + SHAP" },
      { label: "Hybrid RAG over real listings" },
      { label: "Verified valuation report (PDF/PWA)" },
    ],
    limitations: [
      "Damage detection is tuned to the UAE listing-photo distribution it was trained on — accuracy on very different photo conditions is unverified.",
      "Free-tier API hosting (Render) can cold-start after inactivity.",
    ],
    nextSteps: [
      "Expand the damage-detection training set to cover more vehicle types and photo conditions.",
      "Add a dealer-facing bulk-valuation API for marketplace integrations.",
    ],
    flagship: true,
  },
  {
    id: "mediflow",
    number: "05",
    title: "MediFlow AI — Hospital Emergency Resource Allocation",
    shortTitle: "MediFlow AI",
    category: "Reinforcement Learning · Healthcare · Optimisation",
    status: "Academic Lab Project",
    description:
      "A hospital emergency-department simulator that uses Reinforcement Learning (Q-Learning) and constraint-based optimisation to allocate limited resources — beds, staff and equipment — to patients under uncertainty, balancing urgency, fairness and efficiency.",
    features: [
      "Stochastic patient-arrival simulation",
      "Q-Learning allocation policy",
      "Constraint-based optimisation baseline",
      "RL vs. rule-based strategy comparison",
      "Fairness vs. efficiency sensitivity analysis",
      "Interactive Streamlit dashboard",
    ],
    technologies: ["Python", "Reinforcement Learning", "Q-Learning", "NumPy", "Pandas", "Streamlit"],
    tags: ["AI/ML"],
    images: ["/projects/mediflow/dashboard.webp"],
    repositoryUrl: "https://github.com/krish2105/mediflow-ai-rdmu-final",
    liveUrl: "https://mediflow-ai-rdmu-final-vyj96f9xwbtezqmelhjq6c.streamlit.app/",
    caseStudyUrl:
      "https://colab.research.google.com/drive/1LjqDNOLf4z481r_s1NxHATEMKN2ynbZO",
    note: "Master of AI in Business — Reasoning & Decision Making under Uncertainty (DSC 103). The live Streamlit demo is on a free tier and may take ~30s to wake up if it's been idle.",
    problem:
      "Emergency departments must allocate limited beds, staff and equipment to patients of varying urgency under stochastic arrivals — constantly trading fairness against efficiency.",
    approach: [
      "Built a simulator of ED patient arrivals and resource constraints.",
      "Learned an allocation policy with Q-Learning (reinforcement learning).",
      "Benchmarked the RL policy against a constraint-based optimisation baseline.",
      "Ran fairness-vs-efficiency sensitivity analysis to expose the trade-off explicitly.",
    ],
    role: "Designed the simulator, the Q-Learning policy and the Streamlit executive dashboard.",
    impact: [
      "RL policy reaches 67% resource utilisation while holding a 0.859 Jain's fairness index.",
      "Simulates 500 patients across beds, doctors and nurses at a 49.3-min average wait.",
      "Fully reproducible via a live Streamlit dashboard and a public Colab notebook.",
    ],
    metrics: [
      { label: "Fairness (Jain's)", value: "0.859" },
      { label: "Resource utilisation", value: "67%" },
      { label: "Avg wait time", value: "49.3 min" },
      { label: "Patients simulated", value: "500" },
    ],
    decisions: [
      {
        choice: "Reinforcement learning (Q-Learning) with a constraint-based baseline",
        why: "Benchmarking the learned policy against a rule-based optimiser shows whether RL actually earns its complexity, rather than assuming it.",
      },
      {
        choice: "Report Jain's fairness index alongside utilisation",
        why: "Allocation is a fairness-vs-efficiency trade-off; a single fairness number makes that trade-off explicit and defensible.",
      },
      {
        choice: "Streamlit dashboard + public Colab notebook",
        why: "Reproducibility first — anyone can run the exact experiment, which matters more than a polished black box for an academic prototype.",
      },
    ],
    valueProp: "RL that allocates ER beds, staff and equipment under uncertainty — balancing fairness and efficiency.",
    audience: "Healthcare operations and hospital administration teams.",
    architecture: [
      { label: "Stochastic patient arrivals" },
      { label: "Q-Learning allocation policy" },
      { label: "Constraint-based baseline" },
      { label: "Fairness vs. efficiency analysis" },
      { label: "Streamlit dashboard" },
    ],
    limitations: [
      "Runs on a simulated environment (500 patients) — not deployed against a live hospital census.",
      "The Q-Learning policy hasn't been tested under real, non-stationary demand shocks.",
    ],
    nextSteps: [
      "Scale the simulation to larger, multi-department scenarios.",
      "Compare against a deep-RL policy (e.g. DQN) as a stronger baseline.",
    ],
    flagship: true,
  },
  {
    id: "fraudshield",
    number: "06",
    title: "FraudShield AI — Payment Fraud Sequence Detection",
    shortTitle: "FraudShield AI",
    category: "Deep Learning · FinTech · LSTM/RNN",
    status: "Academic Team Project",
    description:
      "A deep-learning fraud-detection system that analyses a customer's sequence of transactions with an LSTM/RNN model to produce a fraud-risk score and a recommended business action, served through a premium React dashboard (FastAPI backend) with a Streamlit alternative UI.",
    features: [
      "Sequence-based LSTM/RNN fraud model",
      "Real-time fraud risk scoring",
      "Recommended business action per alert",
      "Sequence analyzer and pattern insights",
      "Model performance and explainability views",
      "FastAPI backend with React dashboard",
      "Streamlit alternative UI and C-level deck",
    ],
    technologies: ["Python", "TensorFlow", "LSTM", "RNN", "FastAPI", "React", "Streamlit", "Docker"],
    tags: ["AI/ML", "Deep Learning"],
    images: [
      "/projects/fraudshield/01_executive_overview.webp",
      "/projects/fraudshield/03_fraud_risk_scoring.webp",
      "/projects/fraudshield/04_sequence_analyzer.webp",
      "/projects/fraudshield/06_model_performance.webp",
      "/projects/fraudshield/07_explainability.webp",
      "/projects/fraudshield/09_business_impact.webp",
    ],
    repositoryUrl: "https://github.com/krish2105/FraudShield-AI-Deep-Learning-",
    note: "Master of AI in Business (Term 3) team project — built with Yash Petkar and Atharva Soundankar. Ships with synthetic sample data; designed to retrain on the full PaySim dataset.",
    problem:
      "Payment fraud hides in the sequence of a customer's transactions, not in any single one. Static rule engines miss evolving patterns and overwhelm analysts with false positives.",
    approach: [
      "Framed fraud as a sequence-classification problem over each customer's transaction history.",
      "Trained an LSTM/RNN to output a calibrated fraud-risk score per sequence.",
      "Served the model through a FastAPI backend with a premium React dashboard (and a Streamlit alternative UI).",
      "Translated every score into a recommended business action, with sequence-analyzer and explainability views so analysts can trust each alert.",
    ],
    role: "Built the sequence model, the FastAPI scoring service, and the dashboard's fraud-scoring + explainability views.",
    impact: [
      "End-to-end pipeline: raw transactions → risk score → recommended action.",
      "Explainability views designed to make each alert auditable for analysts.",
      "Architected to retrain on the full 6.3M-row PaySim dataset; honest evaluation notes shipped in the repo.",
    ],
    metrics: [
      { label: "Model", value: "LSTM / RNN" },
      { label: "Serving", value: "FastAPI + React" },
      { label: "Team", value: "3 contributors" },
    ],
    decisions: [
      {
        choice: "Sequence model (LSTM/RNN) over a per-transaction classifier",
        why: "Fraud is a temporal pattern across a customer's history — modelling the sequence captures behaviour a single-row classifier misses.",
      },
      {
        choice: "FastAPI + React dashboard, not Streamlit-only",
        why: "A real serving layer + analyst UI is closer to how this would ship in production; Streamlit is kept as a quick alternative UI.",
      },
      {
        choice: "Ship with synthetic data and an explicit honesty note",
        why: "Perfect scores on a tiny test set are an artifact, not evidence — the repo states this and is built to retrain on the full 6.3M-row PaySim set.",
      },
    ],
    valueProp: "Sequence-aware fraud scoring that flags evolving patterns a rule engine misses.",
    audience: "Fintech and risk teams evaluating transaction-monitoring systems.",
    architecture: [
      { label: "Transaction sequence" },
      { label: "LSTM/RNN scoring model" },
      { label: "FastAPI scoring service" },
      { label: "Risk score + recommended action" },
      { label: "React analyst dashboard" },
    ],
    limitations: [
      "Trained and evaluated on synthetic, PaySim-style sample data — not a live production transaction stream.",
      "Not yet validated against a real fraud-ops workflow or calibrated on real loss data.",
    ],
    nextSteps: [
      "Retrain on the full 6.3M-row PaySim dataset.",
      "Add calibration curves and threshold tuning for the recommended-action logic.",
    ],
    flagship: false,
  },
  {
    id: "lulu-sales",
    number: "07",
    title: "Lulu Sales Intelligence Dashboard",
    shortTitle: "Lulu Sales Intelligence",
    category: "Data Engineering · Real-Time Analytics · BI",
    status: "Academic Team Project",
    description:
      "An enterprise-grade, real-time sales-analytics platform for a large UAE retailer, featuring live streaming data, AI-powered insights, role-based access control and cross-store operations management — built on a Next.js frontend with a FastAPI, PostgreSQL and Redis backend.",
    features: [
      "Real-time sales streaming and dashboards",
      "AI-powered insights and anomaly detection",
      "Role-based access control and governance",
      "Cross-store inventory visibility",
      "Dockerised, CI-backed deployment",
    ],
    technologies: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Redis", "Docker", "Python"],
    tags: ["Data"],
    images: ["/projects/lulu/dashboard.webp"],
    repositoryUrl: "https://github.com/mercydeez/lulu-sales-intelligence-dashboard",
    note: "Team project — enterprise retail analytics platform.",
    problem:
      "Large retailers generate millions of transactions daily across stores. Leadership lacks real-time visibility, and sensitive financial data needs strict role-based governance.",
    approach: [
      "Streamed live sales data into a real-time analytics dashboard.",
      "Layered AI-powered insights and anomaly detection on top of the stream.",
      "Enforced role-based access control across regions and stores.",
      "Containerised the platform with Docker + CI for reproducible deploys.",
    ],
    role: "Contributed to the analytics dashboard and backend services.",
    impact: [
      "Real-time, multi-store visibility across 10 stores in 3 regions.",
      "Role-based governance over sensitive financial data.",
      "Enterprise architecture: Next.js + FastAPI + PostgreSQL + Redis, Docker-orchestrated.",
    ],
    metrics: [
      { label: "Coverage", value: "10 stores · 3 regions" },
      { label: "Frontend", value: "Next.js + TS" },
      { label: "Data layer", value: "PostgreSQL + Redis" },
    ],
    decisions: [
      {
        choice: "Redis alongside PostgreSQL",
        why: "Live dashboards need sub-second reads on hot data; Redis serves the stream while PostgreSQL stays the durable source of truth.",
      },
      {
        choice: "Role-based access control from the start",
        why: "The platform exposes sensitive financial data across stores — governance had to be a first-class feature, not an afterthought.",
      },
      {
        choice: "Dockerised with CI",
        why: "Reproducible, reviewable deploys across a multi-service stack (Next.js + FastAPI + PostgreSQL + Redis) — production hygiene over a one-off demo.",
      },
    ],
    valueProp: "Real-time, governed sales analytics across stores — streaming data to decisions.",
    audience: "Retail leadership and store operations teams.",
    architecture: [
      { label: "Store POS / sales streams" },
      { label: "Redis hot-path cache" },
      { label: "PostgreSQL system of record" },
      { label: "FastAPI analytics service" },
      { label: "Next.js dashboard (RBAC)" },
    ],
    limitations: [
      "Team project — Krishna's specific contribution was the analytics dashboard and backend services, not the full platform.",
      "No public live deployment; the architecture was verified in a Dockerised dev/staging environment.",
    ],
    nextSteps: [
      "Publish a live demo deployment.",
      "Add anomaly-detection alerting to the dashboard.",
    ],
    flagship: false,
  },
  {
    id: "waselx",
    number: "08",
    title: "WaselX Express — Last-Mile Delivery Optimisation",
    shortTitle: "WaselX Express",
    category: "Algorithms · Logistics · Decision Systems",
    status: "Academic Team Project",
    description: "A logistics optimisation project that models delivery networks and applies graph algorithms to support route planning and operational decision-making.",
    features: [
      "Delivery-network modelling",
      "Shortest-path analysis",
      "Route comparison",
      "Minimum spanning tree analysis",
      "Visual representation of delivery networks",
      "Algorithmic decision support",
    ],
    technologies: ["Python", "NetworkX", "Dijkstra’s Algorithm", "Bellman-Ford Algorithm", "Minimum Spanning Tree", "Graph Theory", "Data Structures", "Route Visualisation"],
    tags: ["Data"],
    images: [],
    metrics: [
      { label: "Network modelled", value: "15 nodes / 24 roads" },
      { label: "Algorithms & data structures", value: "16" },
      { label: "Team size", value: "3" },
    ],
    note: "Team project code repository is private; source available on request.",
    problem:
      "Last-mile delivery networks need fast, defensible routing decisions across many nodes and constraints.",
    approach: [
      "Modelled the delivery network as a weighted graph in NetworkX.",
      "Applied shortest-path (Dijkstra, Bellman-Ford) and minimum-spanning-tree analysis.",
      "Visualised and compared candidate routes to support operational decisions.",
    ],
    role: "Co-built the graph models and routing/visualisation logic.",
    impact: [
      "Turned routing into an explainable, algorithm-backed decision-support tool.",
      "Compared multiple routing strategies on the same network.",
    ],
    valueProp: "Graph-based routing that turns last-mile delivery decisions into explainable, algorithm-backed comparisons.",
    audience: "Logistics and operations teams evaluating routing strategies.",
    limitations: [
      "Academic exercise on a modelled delivery network, not a live logistics operation.",
      "Team repository is private — source available on request.",
    ],
    flagship: false,
  },
];

export const recognition: RecognitionItem[] = [
  {
    id: "rec-01",
    title: "Student Excellence Award",
    year: "2025",
    context: "Awarded on graduating from the B.Tech CSE (AI & ML) programme at Manipal University Jaipur — recognising sustained academic performance across four years of AI/ML coursework and projects.",
  },
  {
    id: "rec-02",
    title: "Brilliant Student Award",
    year: "2025",
    context: "A second merit recognition from Manipal University Jaipur for consistently strong results across the AI & ML specialisation.",
  },
  {
    id: "rec-03",
    title: "Class Representative — Master of AI in Business",
    year: "2025 — Present",
    context: "Elected by the SP Jain (Dubai) cohort to lead communication and coordination between students and faculty — a trust-and-leadership role alongside a demanding AI/business curriculum.",
  },
];

/**
 * Testimonials — real LinkedIn recommendations, faculty/mentor quotes, or
 * internship feedback only. Left empty on purpose (honesty gate): the Trust
 * & Thinking section renders an honest "pending" placeholder per category
 * until this has real, permissioned entries. Add objects shaped like:
 *   { id: "t-01", quote: "...", author: "Full Name", role: "Title, Company",
 *     sourceUrl: "https://...", type: "linkedin", status: "verified", permission: true }
 */
export const testimonials: Testimonial[] = [];

/**
 * Writing / insights — real published posts only (Medium, LinkedIn, Dev.to,
 * a personal blog). Left empty on purpose (honesty gate): the Trust &
 * Thinking section renders an honest "planned" placeholder until this has
 * real entries. Add objects shaped like:
 *   { id: "w-01", title: "...", blurb: "...", date: "2026-01", url: "https://...", status: "published" }
 */
export const writing: WritingItem[] = [];

/**
 * Describes each empty Trust & Thinking "slot" honestly — the category and
 * how a visitor (or Krishna) can help fill it. Never fake content; each
 * placeholder disappears automatically once `testimonials`/`writing` above
 * has a real entry of that category (see TrustCards/WritingCards).
 */
export const trustPlaceholders: TrustPlaceholder[] = [
  {
    id: "linkedin",
    category: "linkedin",
    label: "LinkedIn Recommendations",
    emptyStateCopy: "Pending verified recommendation — real ones will appear here once requested and confirmed.",
    ctaLabel: "Request a recommendation",
    ctaHref: socialLinks.linkedin || "mailto:krishnamathur008@gmail.com?subject=LinkedIn%20recommendation%20request",
  },
  {
    id: "faculty",
    category: "faculty",
    label: "Mentor & Faculty Feedback",
    emptyStateCopy: "Awaiting verified academic feedback — quotes are only added with the faculty member's permission and attribution.",
    ctaLabel: "Request a quote",
    ctaHref: "mailto:krishnamathur008@gmail.com?subject=Faculty%20feedback%20request",
  },
  {
    id: "internship",
    category: "internship",
    label: "Internship & Collaboration",
    emptyStateCopy: "Permission-based feedback coming soon — from the Intelliza Solutions internship, pending sign-off.",
    ctaLabel: "Request feedback",
    ctaHref: "mailto:krishnamathur008@gmail.com?subject=Internship%20feedback%20request",
  },
  {
    id: "writing",
    category: "writing",
    label: "Writing & Insights",
    emptyStateCopy: "Planned article — coming soon. These slots fill with real, published posts only.",
    ctaLabel: "Notify me when published",
    ctaHref: "mailto:krishnamathur008@gmail.com?subject=Notify%20me%20when%20Krishna%20publishes",
  },
];
