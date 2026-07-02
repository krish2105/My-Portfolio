/**
 * Knowledge base for the on-site assistant. Pure client-side intent matching —
 * no API, no cost. Every answer is grounded in real portfolio content
 * (see profile / projects / journey in portfolio.ts). Keep answers honest.
 */
export interface AssistantAction {
  label: string;
  /** "scroll" → in-page section id (without #); "link" → external/mailto url; "project" → opens /work/:slug case study. */
  type: "scroll" | "link" | "project";
  target: string;
}

export interface AssistantIntent {
  id: string;
  patterns: string[];
  answer: string;
  actions?: AssistantAction[];
}

export const ASSISTANT_INTENTS: AssistantIntent[] = [
  {
    id: "who",
    patterns: ["who", "about", "yourself", "krishna", "bio", "tell me"],
    answer:
      "Krishna Mathur is an AI Developer, Data Analyst and GenAI Builder pursuing a Master of AI in Business at SP Jain (Dubai), after a B.Tech in CSE (AI & ML). He builds practical AI systems, analytics dashboards and GenAI workflows.",
    actions: [{ label: "Read the full About", type: "scroll", target: "about" }],
  },
  {
    id: "projects",
    patterns: ["project", "work", "built", "build", "made", "portfolio", "show me"],
    answer:
      "Eight projects span deep learning, RL, NLP and data engineering — highlights: FraudShield AI (LSTM/RNN fraud detection), MediFlow AI (RL hospital resource allocation) and a real-time Lulu sales-intelligence dashboard. Each card opens a full case study.",
    actions: [{ label: "View projects", type: "scroll", target: "projects" }],
  },
  {
    id: "best-project",
    patterns: ["best", "strongest", "favourite", "favorite", "impressive", "proud", "top project"],
    answer:
      "Two standouts: MediFlow AI — an RL (Q-Learning) ED simulator hitting 67% resource utilisation at a 0.859 Jain's fairness index — and FraudShield AI, a sequence-based LSTM/RNN fraud detector with a FastAPI + React dashboard.",
    actions: [{ label: "See the case studies", type: "scroll", target: "projects" }],
  },
  {
    id: "skills",
    patterns: ["skill", "tech", "stack", "tools", "languages", "know", "capabilities", "expertise"],
    answer:
      "Core strengths: Python, machine learning, deep learning (TensorFlow/Keras), NLP, data analytics (pandas/SQL/Power BI/Tableau), and GenAI workflows — plus FastAPI, Streamlit, Docker and React on the engineering side.",
    actions: [{ label: "Browse capabilities", type: "scroll", target: "skills" }],
  },
  {
    id: "genai",
    patterns: ["genai", "generative", "llm", "gpt", "transformer", "nlp", "language model", "chatbot"],
    answer:
      "GenAI/NLP work includes a human-in-the-loop NL2SQL system (TalkToData), a conversational loan-advisory assistant (SmartLoanBot), and transformer/prompt-engineering exploration. He focuses on safe, reviewable AI rather than black-box automation.",
    actions: [{ label: "See GenAI projects", type: "scroll", target: "projects" }],
  },
  {
    id: "experience",
    patterns: ["experience", "intern", "internship", "job", "career", "journey", "worked"],
    answer:
      "He completed a Machine Learning internship at Intelliza Solutions (built an AI loan-advisory chatbot) and is currently a Class Representative in his Master of AI in Business cohort.",
    actions: [{ label: "See the journey", type: "scroll", target: "journey" }],
  },
  {
    id: "education",
    patterns: ["education", "study", "studying", "degree", "university", "college", "masters", "btech"],
    answer:
      "Master of AI in Business at SP Jain School of Global Management, Dubai (in progress), and a B.Tech in Computer Science & Engineering specialising in AI & ML from Manipal University Jaipur.",
    actions: [{ label: "See the journey", type: "scroll", target: "journey" }],
  },
  {
    id: "availability",
    patterns: ["available", "hiring", "hire", "open to", "opportunit", "looking", "freelance", "internship role"],
    answer:
      "Yes — he's open to AI / Data / GenAI roles, internships and collaborations, in Dubai, India or remote. The fastest way to reach him is the contact form or email.",
    actions: [
      { label: "Contact Krishna", type: "scroll", target: "contact" },
      { label: "Download résumé", type: "scroll", target: "resume" },
    ],
  },
  {
    id: "location",
    patterns: ["location", "where", "based", "city", "country", "dubai", "india", "relocate"],
    answer: "He's based in Dubai, UAE, with roots in Jaipur, India — and open to remote work.",
  },
  {
    id: "contact",
    patterns: ["contact", "reach", "email", "message", "talk", "connect", "get in touch"],
    answer: "You can use the contact form (it sends straight to his inbox) or email krishnamathur008@gmail.com.",
    actions: [{ label: "Go to contact", type: "scroll", target: "contact" }],
  },
  {
    id: "resume",
    patterns: ["resume", "cv", "curriculum", "download"],
    answer: "His résumé is one click away — grab the PDF below.",
    actions: [{ label: "Open résumé section", type: "scroll", target: "resume" }],
  },
];

/**
 * Suggested prompts, biased by the site-wide view mode (see lib/viewMode.tsx)
 * so the Copilot leads with what that audience actually asks — "modes-lite":
 * every prompt still routes through the same real intents/answers below,
 * just phrased and prioritised per audience. Full mode-aware ranking of the
 * semantic search path is a later phase.
 */
export const ASSISTANT_SUGGESTIONS_BY_MODE = {
  recruiter: [
    "What has Krishna built?",
    "What's his strongest project?",
    "Is he available for work?",
    "What are his skills?",
  ],
  technical: [
    "What's his strongest project?",
    "What GenAI or NLP work has he done?",
    "What's his experience?",
    "What are his skills?",
  ],
  business: [
    "What has Krishna built?",
    "Is he available for work?",
    "What's his experience?",
    "How can I get in touch?",
  ],
} as const;

/** Back-compat default (used only if a caller doesn't pass a mode). */
export const ASSISTANT_SUGGESTIONS = ASSISTANT_SUGGESTIONS_BY_MODE.recruiter;

export const ASSISTANT_GREETING =
  "Hi, I'm Krishna's Portfolio Copilot. I can help you explore his AI projects, compare case studies, summarize his strengths for hiring, or find the most relevant work for your role.";

export const ASSISTANT_FALLBACK =
  "I can answer questions about Krishna's projects, skills, experience, availability and contact details. Try one of these:";
