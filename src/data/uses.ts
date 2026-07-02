export interface UsesItem {
  name: string;
  note: string;
}
export interface UsesGroup {
  id: string;
  title: string;
  items: UsesItem[];
}

/** What this site itself is actually built with — kept honest and current. */
export const usesGroups: UsesGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    items: [
      { name: "React 19 + TypeScript", note: "Component model + strict typing." },
      { name: "Vite", note: "Dev server and build tool." },
      { name: "Tailwind CSS v4", note: "Utility-first styling, CSS-first config." },
      { name: "Motion", note: "The kinetic-editorial animation throughout the site." },
      { name: "Lenis", note: "Momentum-based smooth scrolling." },
      { name: "Three.js / React Three Fiber", note: "The hero's neural-constellation WebGL scene." },
    ],
  },
  {
    id: "ai",
    title: "In-browser AI",
    items: [
      { name: "transformers.js", note: "Runs the RAG assistant + sentiment demo entirely client-side." },
      { name: "Self-hosted ONNX runtime", note: "Same-origin model weights — no third-party CDN dependency." },
    ],
  },
  {
    id: "infra",
    title: "Infrastructure",
    items: [
      { name: "Vercel", note: "Hosting, edge functions, analytics, speed insights." },
      { name: "Resend", note: "Transactional email for the contact form." },
      { name: "GitHub Actions", note: "CI: lint, unit tests, build, axe, Lighthouse — on every PR." },
      { name: "Vitest + React Testing Library", note: "Unit tests for the risky interactive pieces." },
    ],
  },
  {
    id: "tools",
    title: "Daily tools",
    items: [
      { name: "VS Code", note: "Primary editor." },
      { name: "Cursor", note: "AI-assisted development." },
      { name: "Figma", note: "Quick layout/type exploration before building." },
      { name: "Jupyter / Google Colab", note: "ML experimentation for the project work this site showcases." },
    ],
  },
];
