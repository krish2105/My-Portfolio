import type { Project } from "../types/portfolio";

/** Scope confirmed with Krishna: the 4 independent flagships only — his
 * strongest, most current engineering judgment calls. */
export const TRADEOFF_PROJECT_IDS = ["fincopilot", "sakan-ai", "compliance-agent", "autovaluate"];

export interface TradeoffEntry {
  /** Stable id for shuffling/exclusion — projectId + index into that project's decisions[]. */
  id: string;
  projectId: string;
  projectTitle: string;
  choice: string;
  why: string;
}

export interface TradeoffQuestion {
  entry: TradeoffEntry;
  /** The real choice plus 2 real choices from other decisions, shuffled — never a fabricated option. */
  options: string[];
}

/** Every option shown is a REAL `choice` string lifted from real project data —
 * distractors are just a different project's real decision, not invented text. */
export const buildTradeoffPool = (projects: Project[]): TradeoffEntry[] =>
  projects
    .filter((p) => TRADEOFF_PROJECT_IDS.includes(p.id))
    .flatMap((p) =>
      (p.decisions ?? []).map((d, i) => ({
        id: `${p.id}-${i}`,
        projectId: p.id,
        projectTitle: p.shortTitle,
        choice: d.choice,
        why: d.why,
      }))
    );

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Builds one question: a real decision plus 2 real-but-wrong distractors
 * pulled from other entries in the pool, all shuffled together. */
export const pickTradeoffQuestion = (
  pool: TradeoffEntry[],
  exclude: string[] = []
): TradeoffQuestion | null => {
  const remaining = pool.filter((e) => !exclude.includes(e.id));
  const candidates = remaining.length > 0 ? remaining : pool;
  if (candidates.length === 0) return null;

  const entry = candidates[Math.floor(Math.random() * candidates.length)];
  const distractorPool = pool.filter((e) => e.id !== entry.id);
  const distractors = shuffle(distractorPool)
    .slice(0, Math.min(2, distractorPool.length))
    .map((e) => e.choice);

  return { entry, options: shuffle([entry.choice, ...distractors]) };
};
