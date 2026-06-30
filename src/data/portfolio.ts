import type {
  Profile,
  SocialLinks,
  JourneyItem,
  CapabilityGroup,
  Project,
  RecognitionItem,
  ServiceItem,
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

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SOCIAL LINKS — replace the placeholder usernames with your real profiles.
 *  Leave a value as "" to hide that link entirely.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const socialLinks: SocialLinks = {
  email: "mailto:krishnamathur008@gmail.com",
  github: "https://github.com/krish2105",        // ← replace
  linkedin: "https://www.linkedin.com/in/krishnamathurmay/", // ← replace
  instagram: "https://instagram.com/your-username",  // ← replace
  kaggle: "https://www.kaggle.com/krishna21052003",         // ← replace
  twitter: "https://x.com/your-username",             // ← replace
  resume: resumeDownloadUrl,
  website: "",
};

export const services: ServiceItem[] = [
  {
    id: "ai-prototyping",
    title: "AI PROTOTYPING",
    description: "Designing and developing functional machine-learning and deep-learning prototypes for practical problems.",
  },
  {
    id: "genai-nlp",
    title: "GENAI AND NLP",
    description: "Building language-driven systems, conversational workflows, prompt-based solutions and human-in-the-loop AI experiences.",
  },
  {
    id: "data-decisions",
    title: "DATA AND DECISIONS",
    description: "Transforming structured and unstructured data into understandable insights, visualisations and decision support.",
  },
  {
    id: "business-aware",
    title: "BUSINESS-AWARE DEVELOPMENT",
    description: "Connecting technical implementation with business objectives, user requirements and operational constraints.",
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
      { name: "Transfer Learning concepts", level: "Concepts" },
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
      { name: "Hugging Face Transformers", level: "Exploring" },
      { name: "NL2SQL", level: "Exploring" },
      { name: "Human-in-the-Loop AI", level: "Concepts" },
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
      { name: "PostgreSQL concepts", level: "Concepts" },
      { name: "MongoDB concepts", level: "Concepts" },
      { name: "DynamoDB concepts", level: "Concepts" },
      { name: "AWS RDS concepts", level: "Concepts" },
      { name: "HTML", level: "Working Knowledge" },
      { name: "CSS", level: "Working Knowledge" },
      { name: "JavaScript", level: "Working Knowledge" },
      { name: "Streamlit", level: "Working Knowledge" },
      { name: "FastAPI", level: "Exploring" },
      { name: "Flask concepts", level: "Concepts" },
      { name: "Tkinter", level: "Academic Experience" },
      { name: "Git", level: "Working Knowledge" },
      { name: "GitHub", level: "Working Knowledge" },
      { name: "Docker", level: "Exploring" },
      { name: "Jupyter Notebook", level: "Core" },
      { name: "Google Colab", level: "Core" },
      { name: "VS Code", level: "Core" },
      { name: "Vercel", level: "Exploring" },
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
    images: [
      "/projects/fraudshield/01_executive_overview.png",
      "/projects/fraudshield/03_fraud_risk_scoring.png",
      "/projects/fraudshield/04_sequence_analyzer.png",
      "/projects/fraudshield/06_model_performance.png",
      "/projects/fraudshield/07_explainability.png",
      "/projects/fraudshield/09_business_impact.png",
    ],
    repositoryUrl: "https://github.com/krish2105/FraudShield-AI-Deep-Learning-",
    note: "Master of AI in Business (Term 3) team project — built with Yash Petkar and Atharva Soundankar. Ships with synthetic sample data; designed to retrain on the full PaySim dataset.",
    visualType: "fraudshield",
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
    images: ["/projects/mediflow/dashboard.png"],
    repositoryUrl: "https://github.com/krish2105/mediflow-ai-rdmu-final",
    liveUrl: "https://mediflow-ai-rdmu-final-vyj96f9xwbtezqmelhjq6c.streamlit.app/",
    caseStudyUrl:
      "https://colab.research.google.com/drive/1LjqDNOLf4z481r_s1NxHATEMKN2ynbZO",
    note: "Master of AI in Business — Reasoning & Decision Making under Uncertainty (DSC 103).",
    visualType: "mediflow",
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
    images: ["/projects/lulu/dashboard.png"],
    repositoryUrl: "https://github.com/mercydeez/lulu-sales-intelligence-dashboard",
    note: "Team project — enterprise retail analytics platform.",
    visualType: "lulu",
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
    images: [],
    note: "Built during an internship at Intelliza Solutions Pvt. Ltd.; confidential client details are not disclosed.",
    visualType: "smartloanbot",
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
    images: [],
    visualType: "waselx",
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
    images: [],
    visualType: "flower",
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
    images: [],
    visualType: "talktodata",
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
    images: [],
    visualType: "electric",
  },
];

export const recognition: RecognitionItem[] = [
  {
    id: "rec-01",
    title: "Student Excellence Award",
    year: "2025",
    context: "Recognised during the completion of the B.Tech Computer Science and Engineering programme with a specialisation in Artificial Intelligence and Machine Learning.",
  },
  {
    id: "rec-02",
    title: "Brilliant Student Award",
    year: "2025",
    context: "Recognised for strong academic performance in B.Tech Computer Science and Engineering with Artificial Intelligence.",
  },
  {
    id: "rec-03",
    title: "Class Representative",
    year: "2025 — Present",
    context: "Supported cohort communication, coordination and collaborative academic initiatives during the Master of AI in Business programme.",
  },
];
