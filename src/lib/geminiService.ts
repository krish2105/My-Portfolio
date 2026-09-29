import { profile, projects, journey } from "../data/portfolio";
import type { ViewMode } from "./viewMode";

const STORAGE_KEY = "portfolio_gemini_api_key";

export function getGeminiApiKey(): string {
  if (typeof window === "undefined") return "";
  const envKey = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 0) return envKey.trim();
  return localStorage.getItem(STORAGE_KEY)?.trim() || "";
}

export function setGeminiApiKey(key: string): void {
  if (typeof window === "undefined") return;
  if (!key.trim()) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
}

export function isGeminiConfigured(): boolean {
  return getGeminiApiKey().length > 0;
}

function buildSystemInstruction(mode: ViewMode): string {
  const verifiedProjects = projects.map(p => `- ${p.title} (${p.category}): ${p.description}`).join("\n");
  const verifiedMilestones = journey.map(j => `- ${j.title} at ${j.institution} (${j.date}, ${j.location || "Dubai"}): ${j.description || ""}`).join("\n");

  return `You are the official AI Portfolio Assistant for Krishna Mathur.
Your audience perspective is currently set to: ${mode.toUpperCase()} VIEW.
(Recruiter: highlight business outcomes and roles; Technical: highlight architecture, GNNs, RAG, and evaluations; Business: highlight ROI, operational efficiency, and delivery).

GROUNDED VERIFIED FACTS ABOUT KRISHNA MATHUR:
Name: ${profile.name}
Title / Current Role: Master of AI in Business postgraduate student & Class Representative at SP Jain School of Global Management, Dubai.
Current Industry Experience: AI Intern at Learners University College (LUC) in Dubai (2026—Present), developing applied AI solutions, machine learning workflows, and generative AI edtech automations.
Past Industry Experience: Machine Learning Intern at Intelliza Solutions Pvt. Ltd. (Feb 2025—June 2025), building conversational NLP loan eligibility chatbots.
Undergraduate Degree: B.Tech in Computer Science Engineering (AI & ML Honors, 2021—2025) from Manipal University Jaipur.
Location: ${profile.location} (Secondary: ${profile.secondaryLocation}).
Availability: ${profile.availability} (Open to AI Engineer, Machine Learning Engineer, and GenAI positions).

VERIFIED PRODUCTION PROJECTS:
${verifiedProjects}

KEY MILESTONES:
${verifiedMilestones}

CORE TECH STACK:
Python, PyTorch, LangGraph, Multi-Agent Systems, FastAPI, PostgreSQL, pgvector, Hugging Face, OpenCV, Docker, Next.js, TypeScript, Google Gemini, NVIDIA.

STRICT INSTRUCTIONS:
1. Answer directly and concisely (2 to 4 sentences).
2. ONLY state facts that are verified in the context above. Never invent companies, credentials, or metrics.
3. If asked questions unrelated to Krishna's background, engineering projects, or hiring, politely guide the user back to Krishna's AI work.
4. Maintain a polished, professional, and humble yet confident tone.`;
}

export async function generateGeminiResponse(
  query: string,
  mode: ViewMode = "recruiter"
): Promise<string | null> {
  const key = getGeminiApiKey();
  if (!key) return null;

  try {
    const systemPrompt = buildSystemInstruction(mode);
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
      key
    )}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: query }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 350,
          topP: 0.85
        }
      })
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn("[Gemini API] Request returned non-200:", res.status);
      return null;
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidate ? candidate.trim() : null;
  } catch (err) {
    console.warn("[Gemini API] Failed to generate response, falling back:", err);
    return null;
  }
}
