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
    "Machine Learning Developer",
    "AI Product Builder",
    "NLP Practitioner",
    "Deep Learning Practitioner",
    "Business Intelligence Enthusiast",
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
    "My work focuses on building practical AI solutions, analysing data, automating workflows and translating technical ideas into useful business applications. My interests include machine learning, natural language processing, deep learning, computer vision, business intelligence, databases and intelligent software development.",
    "I enjoy developing end-to-end prototypes that combine technical implementation with a clear understanding of users, decisions and business requirements.",
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
    value: "Deep-learning & GenAI projects — fraud detection (LSTM/RNN) and RL-driven resource allocation.",
  },
  {
    id: "exploring",
    label: "Exploring",
    value: "Transformers, human-in-the-loop NL2SQL and real-time data dashboards.",
  },
  {
    id: "open-to",
    label: "Open to",
    value: "AI / Data roles, internships and collaborations — in Dubai, India or remote.",
  },
];

export const services: ServiceItem[] = [
  {
    id: "fraud-risk",
    title: "FRAUD & RISK DETECTION",
    description: "Sequence-aware models that flag evolving fraud/risk patterns a static rule engine misses — see FraudShield AI.",
  },
  {
    id: "decision-optimisation",
    title: "DECISION & RESOURCE OPTIMISATION",
    description: "Reinforcement-learning and constraint-based systems that allocate limited resources under uncertainty — see MediFlow AI.",
  },
  {
    id: "nl-data-access",
    title: "NATURAL-LANGUAGE DATA ACCESS",
    description: "Human-in-the-loop NL-to-SQL and conversational workflows that keep a person reviewing every generated query — see TalkToData.",
  },
  {
    id: "analytics-bi",
    title: "ANALYTICS & BI DASHBOARDS",
    description: "Real-time, governed dashboards that turn streaming and structured data into decisions leadership can act on — see Lulu Sales Intelligence.",
  },
];

export const journey: JourneyItem[] = [
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
    ],
  },
  {
    id: "nlp-genai",
    title: "NLP and Generative AI",
    description: "Language processing and conversational AI",
    skills: [
      { name: "Natural Language Processing", level: "Core" },
      { name: "Generative AI", level: "Working Knowledge" },
      { name: "Prompt Engineering", level: "Working Knowledge" },
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
      { name: "Streamlit", level: "Working Knowledge" },
      { name: "Tkinter", level: "Academic Experience" },
      { name: "Git", level: "Working Knowledge" },
      { name: "GitHub", level: "Working Knowledge" },
      { name: "Jupyter Notebook", level: "Core" },
      { name: "Google Colab", level: "Core" },
      { name: "VS Code", level: "Core" },
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
    id: "fraudshield",
    number: "01",
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
    flagship: true,
  },
  {
    id: "mediflow",
    number: "02",
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
    id: "lulu-sales",
    number: "03",
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
    flagship: true,
  },
  {
    id: "smartloanbot",
    number: "04",
    title: "SmartLoanBot — AI Loan Advisory Assistant",
    shortTitle: "SmartLoanBot",
    category: "Conversational AI · NLP · FinTech",
    status: "Internship Project",
    description: "An AI-powered loan advisory chatbot designed to guide users through loan-related questions, basic eligibility workflows, loan information and location-based assistance.",
    features: [
      "Conversational user interaction",
      "Loan guidance workflow",
      "Natural-language processing",
      "Frequently asked question support",
      "Location-based assistance",
      "Desktop graphical interface",
      "Modular Python implementation",
    ],
    technologies: ["Python", "Tkinter", "NLTK", "spaCy", "Google Maps API", "Conversational AI"],
    tags: ["GenAI"],
    images: [],
    note: "Built during an internship at Intelliza Solutions Pvt. Ltd.; confidential client details are not disclosed.",
    problem:
      "First-time borrowers struggle to navigate loan eligibility and options, and human advisors don't scale to every routine question.",
    approach: [
      "Built a conversational flow over an NLP intent/FAQ layer (NLTK + spaCy).",
      "Added a loan-guidance workflow and location-based assistance via the Google Maps API.",
      "Shipped it as a modular desktop app with a Tkinter interface.",
    ],
    role: "Designed and built the chatbot end-to-end during the internship.",
    impact: [
      "Demonstrated an automated first-line loan-advisory experience.",
      "Modular Python design that separates NLP, workflow and UI concerns.",
    ],
    valueProp: "Conversational first-line loan guidance that scales past a human advisor's capacity.",
    audience: "FinTech and lending teams wanting automated first-line support.",
    limitations: [
      "Built as an internship deliverable — confidential client specifics are not disclosed.",
      "Ships as a desktop Tkinter interface, not a deployed web product.",
    ],
    flagship: false,
  },
  {
    id: "waselx",
    number: "05",
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
  {
    id: "flower-classifier",
    number: "06",
    title: "Flower Image Classification — CNN Prototype",
    shortTitle: "Flower Classifier",
    category: "Deep Learning · Computer Vision",
    status: "AI Prototype",
    description: "An end-to-end image-classification prototype that uses a convolutional neural network to identify flower categories and demonstrates a complete computer-vision workflow.",
    features: [
      "TensorFlow flower dataset",
      "Image preprocessing",
      "Training and validation pipelines",
      "Data augmentation",
      "CNN classification",
    ],
    plannedFeatures: [
      "Prediction interface",
      "Streamlit frontend",
      "FastAPI backend",
      "SQLite prediction history",
      "Docker-ready structure",
      "Optional S3 or MinIO image storage",
    ],
    technologies: ["Python", "TensorFlow", "Keras", "CNN", "Streamlit", "FastAPI", "SQLite", "Docker", "Computer Vision"],
    tags: ["Deep Learning", "AI/ML"],
    images: [],
    note: "Notebook/code available on request.",
    problem:
      "Image classification is the canonical computer-vision workflow — a clean place to prove an end-to-end CNN pipeline.",
    approach: [
      "Preprocessed and augmented the TensorFlow flowers dataset.",
      "Built training/validation pipelines for a convolutional neural network.",
      "Scoped a serving path (Streamlit + FastAPI + SQLite history, Docker-ready) as next steps.",
    ],
    role: "Built the data pipeline and CNN training/evaluation workflow.",
    impact: [
      "A complete, reproducible image-classification workflow from data to trained model.",
    ],
    valueProp: "A clean, reproducible CNN pipeline proving the end-to-end computer-vision workflow.",
    audience: "Learning/portfolio project — demonstrates CV fundamentals, not a shipped product.",
    limitations: [
      "Prototype stage — the prediction interface, API and storage layer are planned, not built.",
      "Trained on the standard TensorFlow flowers dataset, not a client-specific dataset.",
    ],
    flagship: false,
  },
  {
    id: "talktodata",
    number: "07",
    title: "TalkToData — Human-in-the-Loop NL2SQL System",
    shortTitle: "TalkToData",
    category: "Generative AI · NLP · Databases",
    status: "In Development",
    description: "An intelligent system designed to translate natural-language business questions into SQL while keeping a human involved in reviewing, selecting and approving the generated query.",
    currentFeatures: [
      "Rule-based natural-language processing",
      "Database schema awareness",
      "Dashboard-based user interface",
    ],
    plannedFeatures: [
      "Hugging Face transformer support",
      "Three candidate SQL queries",
      "Query comparison",
      "Human review and intervention",
      "Final SQL selection",
      "Query explanation",
      "Validation and safety checks",
      "SQL execution safeguards",
    ],
    technologies: ["Python", "SQL", "Hugging Face Transformers", "NLP", "Streamlit", "Human-in-the-Loop AI", "Database Systems"],
    tags: ["GenAI"],
    images: [],
    note: "Actively in development; repository not yet public — code available on request.",
    problem:
      "Natural-language-to-SQL is powerful but risky — a wrong generated query can return confidently incorrect answers or unsafe operations.",
    approach: [
      "Generate multiple candidate SQL queries from a business question, schema-aware.",
      "Keep a human in the loop to compare, review and approve the final query.",
      "Layer validation and execution safeguards before anything runs.",
    ],
    role: "Designing the human-in-the-loop NL2SQL workflow and safety layer.",
    impact: [
      "Prioritises trust and safety over fully-autonomous query generation.",
      "Active development — transformer-backed candidate generation is next.",
    ],
    valueProp: "Human-in-the-loop NL-to-SQL — safe natural-language access to business data.",
    audience: "Data analysts and ops teams who need safe self-serve queries.",
    architecture: [
      { label: "Business question (NL)" },
      { label: "Schema-aware candidate SQL generation" },
      { label: "Human review & comparison" },
      { label: "Validation & safety checks" },
      { label: "Approved query execution" },
    ],
    limitations: [
      "Candidate generation is currently rule-based; transformer-backed generation is planned, not yet built.",
      "Not yet tested against a production database or a real analyst workflow.",
    ],
    nextSteps: [
      "Integrate Hugging Face transformer models for candidate SQL generation.",
      "Add a query-explanation output alongside each candidate.",
    ],
    flagship: true,
  },
  {
    id: "electric-production",
    number: "08",
    title: "Electric Production Forecasting — SimpleRNN vs LSTM",
    shortTitle: "Electric Forecasting",
    category: "Deep Learning · Time-Series Forecasting",
    status: "Academic Lab Project",
    description: "A time-series forecasting project that compares SimpleRNN and LSTM models on electric-production data and studies how sequence-window length affects forecasting behaviour and model performance.",
    features: [
      "Cleaning electric-production CSV data",
      "Date parsing and chronological sorting",
      "Time-series scaling",
      "Sliding-window sequence generation",
      "SimpleRNN model",
      "LSTM model",
      "Window-length comparison",
      "Experiments using window values such as 6 and 60",
      "Training and validation analysis",
      "Forecast visualisation",
      "Model comparison",
    ],
    technologies: ["Python", "TensorFlow", "Keras", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "SimpleRNN", "LSTM", "Time-Series Forecasting", "Google Colab"],
    tags: ["Deep Learning"],
    images: [],
    note: "Colab notebook available on request.",
    problem:
      "Sequence-window length quietly drives time-series forecasting quality — but its effect on SimpleRNN vs LSTM is easy to hand-wave.",
    approach: [
      "Cleaned, sorted and scaled the electric-production time series.",
      "Generated sliding-window sequences and trained both SimpleRNN and LSTM models.",
      "Compared window lengths (e.g. 6 vs 60) and analysed training/validation behaviour.",
    ],
    role: "Ran the full experiment: data prep, modelling and comparison.",
    impact: [
      "Showed concretely how window length and architecture change forecast accuracy.",
    ],
    valueProp: "An honest, side-by-side study of how sequence-window length changes SimpleRNN vs LSTM forecasting.",
    audience: "Anyone evaluating RNN vs. LSTM trade-offs for time-series work.",
    limitations: [
      "Single dataset (electric production) — findings are illustrative, not universally generalised.",
      "Colab notebook, not a deployed forecasting service.",
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
