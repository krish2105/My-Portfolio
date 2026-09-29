import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { profile, PHONE_DISPLAY } from "../data/portfolio";

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

/** Helper to wrap text cleanly within a maxWidth */
function wrap(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length <= maxChars) {
      current = (current + " " + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Client-side dynamic PDF generator powered by pdf-lib.
 * Compiles a pixel-perfect, tailored 1-page A4 resume in <15ms directly in the user's browser.
 */
export async function generateTailoredResumePdf(roleId: TargetRoleId): Promise<Uint8Array> {
  const config = ROLE_CONFIGS[roleId] ?? ROLE_CONFIGS["ai-engineer"];
  const doc = await PDFDocument.create();

  // A4 dimensions: 595.28 x 841.89 points
  const page = doc.addPage([595.28, 841.89]);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await doc.embedFont(StandardFonts.CourierBold);

  // Palette: Dark executive slate & emerald accents
  const cBlack = rgb(0.06, 0.08, 0.1);
  const cDark = rgb(0.18, 0.22, 0.26);
  const cMuted = rgb(0.42, 0.48, 0.54);
  const cAccent = rgb(0.0, 0.7, 0.4);
  const cLightBg = rgb(0.96, 0.98, 0.97);
  const cBorder = rgb(0.85, 0.88, 0.9);

  let y = 805;
  const left = 45;
  const right = 550;

  // Header: Name & Contact
  page.drawText(profile.name.toUpperCase(), {
    x: left,
    y,
    size: 20,
    font: fontBold,
    color: cBlack,
  });

  // Role Badge (Top right)
  const badgeText = config.shortLabel.toUpperCase();
  const badgeW = fontMono.widthOfTextAtSize(badgeText, 8.5) + 16;
  page.drawRectangle({
    x: right - badgeW,
    y: y - 2,
    width: badgeW,
    height: 18,
    color: cLightBg,
    borderColor: cAccent,
    borderWidth: 1,
  });
  page.drawText(badgeText, {
    x: right - badgeW + 8,
    y: y + 3,
    size: 8.5,
    font: fontMono,
    color: cAccent,
  });

  y -= 16;
  const contactLine = `Dubai, UAE  |  krishnamathur008@gmail.com  |  ${PHONE_DISPLAY}  |  krishnamathur-ai.vercel.app  |  github.com/krish2105`;
  page.drawText(contactLine, {
    x: left,
    y,
    size: 8.5,
    font: fontRegular,
    color: cDark,
  });

  y -= 10;
  page.drawLine({
    start: { x: left, y },
    end: { x: right, y },
    thickness: 1.2,
    color: cAccent,
  });

  // Section helper
  const drawSectionTitle = (title: string) => {
    y -= 18;
    page.drawText(title.toUpperCase(), {
      x: left,
      y,
      size: 9.5,
      font: fontBold,
      color: cAccent,
    });
    y -= 4;
    page.drawLine({
      start: { x: left, y },
      end: { x: right, y },
      thickness: 0.6,
      color: cBorder,
    });
    y -= 10;
  };

  // 1. EXECUTIVE SUMMARY
  drawSectionTitle(`Executive Summary — ${config.label}`);
  const summaryLines = wrap(config.summary, 96);
  for (const line of summaryLines) {
    page.drawText(line, {
      x: left,
      y,
      size: 8.5,
      font: fontRegular,
      color: cDark,
      lineHeight: 11,
    });
    y -= 11.5;
  }

  // 2. CORE SKILLS & METHODOLOGIES
  y -= 2;
  drawSectionTitle("Technical Competencies & Prioritized Stack");
  const skillsText = config.topSkills.join("  *  ");
  const skillLines = wrap(skillsText, 94);
  for (const sline of skillLines) {
    page.drawText(sline, {
      x: left,
      y,
      size: 8.5,
      font: fontBold,
      color: cDark,
    });
    y -= 11.5;
  }

  // 3. RELEVANT EXPERIENCE
  y -= 2;
  drawSectionTitle("Professional Experience");
  
  // Job Title line
  page.drawText("Machine Learning Intern  —  Intelliza Solutions Pvt. Ltd.", {
    x: left,
    y,
    size: 9.5,
    font: fontBold,
    color: cBlack,
  });
  const dateStr = "Feb 2025 – Aug 2025  |  Mumbai, India";
  page.drawText(dateStr, {
    x: right - fontRegular.widthOfTextAtSize(dateStr, 8),
    y,
    size: 8,
    font: fontRegular,
    color: cMuted,
  });
  y -= 12;

  for (const b of config.experienceHighlights) {
    page.drawText("*", {
      x: left + 2,
      y,
      size: 8,
      font: fontBold,
      color: cAccent,
    });
    const blines = wrap(b, 90);
    for (let i = 0; i < blines.length; i++) {
      page.drawText(blines[i], {
        x: left + 14,
        y: y - i * 10.5,
        size: 8.2,
        font: fontRegular,
        color: cDark,
      });
    }
    y -= blines.length * 10.5 + 3;
  }

  // 4. FEATURED ARCHITECTURES & FLAGSHIP PROJECTS
  y -= 2;
  drawSectionTitle("Featured Architectures & Shipped Systems");

  for (const proj of config.featuredProjects) {
    page.drawText(proj.title, {
      x: left,
      y,
      size: 9,
      font: fontBold,
      color: cBlack,
    });

    const metricW = fontMono.widthOfTextAtSize(proj.metric, 7.5);
    page.drawText(proj.metric, {
      x: right - metricW,
      y,
      size: 7.5,
      font: fontMono,
      color: cAccent,
    });
    y -= 10.5;

    page.drawText(proj.tech, {
      x: left,
      y,
      size: 8,
      font: fontMono,
      color: cMuted,
    });
    y -= 9.5;

    const pLines = wrap(proj.blurb, 94);
    for (const pl of pLines) {
      page.drawText(pl, {
        x: left,
        y,
        size: 8,
        font: fontRegular,
        color: cDark,
      });
      y -= 9.5;
    }
    y -= 4;
  }

  // 5. EDUCATION & HONORS
  y -= 2;
  drawSectionTitle("Education & Honors");

  // Masters
  page.drawText("Master of Artificial Intelligence in Business (MAIB)", {
    x: left,
    y,
    size: 9,
    font: fontBold,
    color: cBlack,
  });
  const spDate = "2025 – Present";
  page.drawText(spDate, {
    x: right - fontRegular.widthOfTextAtSize(spDate, 8),
    y,
    size: 8,
    font: fontRegular,
    color: cMuted,
  });
  y -= 10;
  page.drawText("SP Jain School of Global Management, Dubai  |  USD 9,000 Merit Scholarship  |  Class Representative", {
    x: left,
    y,
    size: 8,
    font: fontRegular,
    color: cDark,
  });
  y -= 13;

  // Bachelors
  page.drawText("B.Tech, Computer Science Engineering (AI & ML)", {
    x: left,
    y,
    size: 9,
    font: fontBold,
    color: cBlack,
  });
  const btechDate = "2021 – 2025";
  page.drawText(btechDate, {
    x: right - fontRegular.widthOfTextAtSize(btechDate, 8),
    y,
    size: 8,
    font: fontRegular,
    color: cMuted,
  });
  y -= 10;
  page.drawText("Manipal University Jaipur  |  Student Excellence Award (Highest academic rank in AI & ML cohort)", {
    x: left,
    y,
    size: 8,
    font: fontRegular,
    color: cDark,
  });

  return await doc.save();
}
