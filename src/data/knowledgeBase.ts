import { profile, projects, journey, capabilities, now } from "./portfolio";
import type { AssistantAction } from "./assistant";

/**
 * A retrieval knowledge base built entirely from real portfolio data.
 * `text` is what gets embedded (rich, keyword-dense); `answer` is what the
 * assistant displays. Used by the client-side RAG path (semantic search).
 */
export interface KBChunk {
  id: string;
  text: string;
  answer: string;
  action?: AssistantAction;
}

export const buildKnowledgeBase = (): KBChunk[] => {
  const chunks: KBChunk[] = [];

  chunks.push({
    id: "about",
    text: `${profile.name} ${profile.titles.join(" ")} ${profile.aboutStatements.join(" ")}`,
    answer: profile.aboutStatements[0],
    action: { label: "Read the full About", type: "scroll", target: "about" },
  });

  chunks.push({
    id: "availability",
    text: `availability open to opportunities hiring roles internships collaboration remote ${profile.availability} ${profile.location} ${profile.secondaryLocation}`,
    answer: `${profile.availability} He's based in ${profile.location} (also ${profile.secondaryLocation}) and open to remote.`,
    action: { label: "Contact Krishna", type: "scroll", target: "contact" },
  });

  projects.forEach((p) => {
    const text = [
      p.title,
      p.category,
      p.description,
      p.problem,
      (p.approach || []).join(" "),
      (p.impact || []).join(" "),
      (p.technologies || []).join(" "),
      (p.metrics || []).map((m) => `${m.label} ${m.value}`).join(" "),
    ]
      .filter(Boolean)
      .join(" ");
    const metricStr = (p.metrics || [])
      .slice(0, 2)
      .map((m) => `${m.label}: ${m.value}`)
      .join(", ");
    const answer = `${p.title} — ${p.description}${metricStr ? ` (${metricStr})` : ""}`;
    chunks.push({
      id: `project-${p.id}`,
      text,
      answer,
      action: { label: "Open case study", type: "project", target: p.id },
    });
  });

  journey.forEach((j) =>
    chunks.push({
      id: `journey-${j.id}`,
      text: `experience ${j.title} ${j.institution} ${j.date} ${j.description || ""}`,
      answer: `${j.title} — ${j.institution} (${j.date}).${j.description ? " " + j.description : ""}`,
      action: { label: "See the journey", type: "scroll", target: "journey" },
    })
  );

  capabilities.forEach((c) =>
    chunks.push({
      id: `cap-${c.id}`,
      text: `skills ${c.title} ${c.description} ${c.skills.map((s) => s.name).join(" ")}`,
      answer: `${c.title}: ${c.skills.slice(0, 8).map((s) => s.name).join(", ")}.`,
      action: { label: "Browse capabilities", type: "scroll", target: "skills" },
    })
  );

  now.forEach((n) =>
    chunks.push({
      id: `now-${n.id}`,
      text: `currently ${n.label} ${n.value}`,
      answer: `${n.label}: ${n.value}`,
    })
  );

  chunks.push({
    id: "contact",
    text: "contact email reach out get in touch message hire connect",
    answer: "You can use the contact form (it sends straight to his inbox) or email krishnamathur008@gmail.com.",
    action: { label: "Go to contact", type: "scroll", target: "contact" },
  });

  return chunks;
};
