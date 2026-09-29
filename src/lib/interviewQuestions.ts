import type { Project } from "../types/portfolio";

/**
 * Templated "questions an interviewer could ask" — derived entirely from a
 * project's own real `decisions`/`limitations`/`nextSteps`/`approach`, never
 * fabricated claims or generic filler. Each question is honest because it's
 * built from something Krishna already documented about the project.
 */
export const buildInterviewQuestions = (p: Project): string[] => {
  const questions: string[] = [];

  (p.decisions ?? []).forEach((d) => questions.push(`Why did you choose "${d.choice}" for ${p.shortTitle}?`));

  if (p.limitations?.[0]) questions.push(`How would you address this limitation: "${p.limitations[0]}"?`);

  if (p.nextSteps?.[0]) questions.push(`You listed "${p.nextSteps[0]}" as a next step for ${p.shortTitle} — why is that the priority?`);

  if (questions.length < 3 && p.approach?.[0]) {
    questions.push(`Walk me through this part of your approach: "${p.approach[0]}"`);
  }

  return questions.slice(0, 4);
};
