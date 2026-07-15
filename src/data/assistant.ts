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

/** A small, honestly-scoped Arabic variant — only the questions visitors are
 * most likely to actually ask in Arabic (who/what/available/where/contact),
 * not a full translation of every intent. See containsArabic() in Assistant.tsx. */
export interface AssistantIntentAr {
  patterns: string[];
  answer: string;
  actions?: AssistantAction[];
}

export interface AssistantIntent {
  id: string;
  patterns: string[];
  answer: string;
  actions?: AssistantAction[];
  ar?: AssistantIntentAr;
}

export const ASSISTANT_INTENTS: AssistantIntent[] = [
  {
    id: "who",
    patterns: ["who", "about", "yourself", "krishna", "bio", "tell me"],
    answer:
      "Krishna Mathur is an AI Developer, Data Analyst and GenAI Builder pursuing a Master of AI in Business at SP Jain (Dubai), after a B.Tech in CSE (AI & ML). He builds and ships production-grade agentic AI systems — RAG copilots, multi-agent pipelines and explainable ML — not just prototypes.",
    actions: [{ label: "Read the full About", type: "scroll", target: "about" }],
    ar: {
      patterns: ["من", "من هو", "كريشنا", "عن نفسه", "من انت"],
      answer:
        "كريشنا ماثور مطوّر ذكاء اصطناعي ومحلل بيانات وباني حلول GenAI، يدرس ماجستير في الذكاء الاصطناعي للأعمال في SP Jain بدبي. يبني أنظمة ذكاء اصطناعي حقيقية وقيد الإنتاج، وليست مجرد نماذج أولية.",
      actions: [{ label: "قسم النبذة الكاملة", type: "scroll", target: "about" }],
    },
  },
  {
    id: "projects",
    patterns: ["project", "work", "built", "build", "made", "portfolio", "show me"],
    answer:
      "Eight projects total. The four flagships are independent, production-grade systems: FinCopilot (cited financial RAG copilot), Sakan AI (multi-agent real-estate deal intelligence), ComplianceAgent (AML/KYC copilot with a from-scratch GNN) and AutoValuate Intelligence (on-device computer vision + explainable car valuation). Each card opens a full case study.",
    actions: [{ label: "View projects", type: "scroll", target: "projects" }],
    ar: {
      patterns: ["مشروع", "مشاريع", "اعمال", "بنى", "ماذا بنى"],
      answer:
        "ثمانية مشاريع إجمالاً. الأربعة الرئيسية أنظمة إنتاجية مستقلة: FinCopilot (مساعد بحث مالي موثّق)، Sakan AI (ذكاء صفقات عقارية متعدد الوكلاء)، ComplianceAgent (مساعد امتثال بشبكة عصبية بيانية مبنية من الصفر)، وAutoValuate Intelligence (تقييم سيارات بالرؤية الحاسوبية القابل للتفسير).",
      actions: [{ label: "عرض المشاريع", type: "scroll", target: "projects" }],
    },
  },
  {
    id: "best-project",
    patterns: ["best", "strongest", "favourite", "favorite", "impressive", "proud", "top project"],
    answer:
      "The four independent flagships are the standouts: FinCopilot (agentic RAG with a Self-RAG faithfulness gate, 205 tests), Sakan AI (5-stage LangGraph pipeline with live WebSocket reasoning), ComplianceAgent (from-scratch GNN + mandatory human-approval gate) and AutoValuate Intelligence (YOLOv8/ONNX on-device damage detection + SHAP-explained pricing).",
    actions: [{ label: "See the case studies", type: "scroll", target: "projects" }],
  },
  {
    id: "skills",
    patterns: ["skill", "tech", "stack", "tools", "languages", "know", "capabilities", "expertise"],
    answer:
      "Core strengths: Python, agentic AI (LangGraph, multi-agent orchestration), RAG and hybrid retrieval, deep learning (TensorFlow/Keras, GNNs), computer vision (YOLOv8/ONNX), explainable ML (SHAP, XGBoost) — plus FastAPI, Next.js and production hardening (RBAC, security, CI-gated evals).",
    actions: [{ label: "Browse capabilities", type: "scroll", target: "skills" }],
  },
  {
    id: "genai",
    patterns: ["genai", "generative", "llm", "gpt", "transformer", "nlp", "language model", "chatbot"],
    answer:
      "GenAI/agentic work includes FinCopilot (agentic RAG over real SEC filings with a Self-RAG faithfulness gate that refuses to answer without evidence), Sakan AI (a 5-stage LangGraph pipeline with live agent-reasoning traces) and ComplianceAgent (agentic case investigation with mandatory human sign-off). He focuses on safe, cited, reviewable AI rather than black-box automation.",
    actions: [{ label: "See GenAI projects", type: "scroll", target: "projects" }],
  },
  {
    id: "experience",
    patterns: ["experience", "intern", "internship", "job", "career", "journey", "worked"],
    answer:
      "Most recently, he's designed and built 4 independent, production-grade agentic AI systems end to end (live demos, real test suites, CI-gated evals). Before that: a Machine Learning internship at Intelliza Solutions (AI loan-advisory chatbot), and he's currently Class Representative in his Master of AI in Business cohort.",
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
    ar: {
      patterns: ["متاح", "توظيف", "فرصة", "عمل", "وظيفة"],
      answer: "نعم — هو متاح لأدوار الذكاء الاصطناعي والبيانات وGenAI، في دبي أو الهند أو عن بُعد. أسرع طريقة للتواصل هي نموذج الاتصال أو البريد الإلكتروني.",
      actions: [{ label: "التواصل مع كريشنا", type: "scroll", target: "contact" }],
    },
  },
  {
    id: "location",
    patterns: ["location", "where", "based", "city", "country", "dubai", "india", "relocate"],
    answer: "He's based in Dubai, UAE, with roots in Jaipur, India — and open to remote work.",
    ar: {
      patterns: ["اين", "دبي", "مكان", "يقيم"],
      answer: "يقيم في دبي، الإمارات العربية المتحدة، وأصوله من جايبور، الهند — ومنفتح على العمل عن بُعد.",
    },
  },
  {
    id: "contact",
    patterns: ["contact", "reach", "email", "message", "talk", "connect", "get in touch"],
    answer: "You can use the contact form (it sends straight to his inbox) or email krishnamathur008@gmail.com.",
    actions: [{ label: "Go to contact", type: "scroll", target: "contact" }],
    ar: {
      patterns: ["تواصل", "بريد", "ايميل", "رسالة"],
      answer: "يمكنك استخدام نموذج التواصل أو إرسال بريد إلكتروني إلى krishnamathur008@gmail.com.",
      actions: [{ label: "الذهاب لقسم التواصل", type: "scroll", target: "contact" }],
    },
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
    "Best project for a data analyst role",
    "Is he available for work?",
    "What are his skills?",
  ],
  technical: [
    "Compare FinCopilot vs Sakan AI",
    "Interview questions for AutoValuate",
    "What GenAI or agentic work has he done?",
    "What are his skills?",
  ],
  business: [
    "Best project for a healthcare product",
    "What has Krishna built?",
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

/** Shown when an Arabic question doesn't match one of the (small, honest) set of Arabic-covered intents. */
export const ASSISTANT_FALLBACK_AR =
  "أستطيع الإجابة بالعربية على الأسئلة الأساسية عن كريشنا (من هو، ماذا بنى، هل هو متاح للعمل، أين يقيم، وكيفية التواصل معه). لمزيد من التفاصيل، جرّب السؤال بالإنجليزية.";
