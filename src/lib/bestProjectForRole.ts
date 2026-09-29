import type { Project } from "../types/portfolio";

/** Role/domain keywords mapped to the tags/category words that indicate real overlap. */
const ROLE_HINTS: { keywords: string[]; boosts: string[] }[] = [
  { keywords: ["fraud", "risk", "fintech", "payment", "banking"], boosts: ["fraud", "risk", "fintech", "payment"] },
  { keywords: ["health", "hospital", "medical", "clinical", "patient"], boosts: ["healthcare", "hospital", "medical", "patient"] },
  { keywords: ["data analyst", "analytics", "bi", "business intelligence", "dashboard"], boosts: ["analytics", "data", "dashboard", "bi"] },
  { keywords: ["nlp", "language", "chatbot", "genai", "generative", "llm", "conversational"], boosts: ["nlp", "genai", "language", "chatbot", "conversational"] },
  { keywords: ["logistics", "delivery", "routing", "supply chain", "operations"], boosts: ["logistics", "delivery", "routing", "graph"] },
  { keywords: ["computer vision", "image", "vision", "cnn"], boosts: ["vision", "image", "cnn"] },
  { keywords: ["forecast", "time series", "time-series", "prediction"], boosts: ["forecast", "time-series", "rnn", "lstm"] },
];

/**
 * Keyword-overlap match between a role description and each project's real
 * category/tags/technologies/title — no embeddings, fully deterministic.
 * Falls back to a flagship project (then the first project) if nothing
 * scores above zero, so the assistant always has something real to point to.
 */
export const bestProjectForRole = (role: string, projects: Project[]): Project | null => {
  if (projects.length === 0) return null;
  const q = role.toLowerCase();

  // Use only the single BEST-matching hint category (most keyword hits), not every
  // category that happens to share a substring — combining categories let unrelated
  // domains (e.g. "logistics") outscore the actually-relevant one on generic words.
  let bestHint: (typeof ROLE_HINTS)[number] | null = null;
  let bestHintHits = 0;
  for (const hint of ROLE_HINTS) {
    const hits = hint.keywords.filter((k) => q.includes(k)).length;
    if (hits > bestHintHits) {
      bestHintHits = hits;
      bestHint = hint;
    }
  }
  const hintBoosts = bestHint?.boosts ?? [];

  let best: Project | null = null;
  let bestScore = 0;
  for (const p of projects) {
    const haystack = [p.category, p.title, p.tags?.join(" "), p.technologies.join(" ")].join(" ").toLowerCase();
    let score = 0;
    for (const word of hintBoosts) if (haystack.includes(word)) score += 2;
    for (const word of q.split(/\s+/)) if (word.length > 3 && haystack.includes(word)) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }

  if (best) return best;
  return projects.find((p) => p.flagship) ?? projects[0];
};
