export interface UsesItem {
  name: string;
  note: string;
}
export interface UsesGroup {
  id: string;
  title: string;
  items: UsesItem[];
}

export interface SiteMetric {
  value: string;
  label: string;
}

/** This portfolio is a case study too — real, measured facts about the site
 * itself, in the same honest "no fabrication" spirit as the project case
 * studies. Update the numbers here when they materially change. */
export const SITE_CASE_STUDY = {
  intro:
    "Built with the same standards as the systems it showcases: real tests, CI-gated quality bars, and code-split performance budgets — not just a static page.",
  metrics: [
    { value: "89", label: "automated tests (Vitest + RTL)" },
    { value: "0", label: "axe-core a11y violations across 4 scanned routes" },
    { value: "≥0.75 / ≥0.50", label: "CI-enforced Lighthouse performance gate (desktop / mobile)" },
    { value: "8/8", label: "project case studies prerendered with real per-page SEO/OG" },
  ] as SiteMetric[],
  decisions: [
    {
      choice: "manualChunks split for the R3F hero and transformers.js",
      why: "Neither the ~890KB WebGL scene nor the ~550KB in-browser ML runtime should ever touch the initial page load — both are deferred and explicitly chunked so a future accidental eager import can't silently re-inline them.",
    },
    {
      choice: "Honest empty states instead of placeholder content",
      why: "Testimonials and writing sections show a real, labelled 'not yet supplied' state rather than an invented quote or article — the same rule the project case studies follow for metrics.",
    },
    {
      choice: "CI gate raised only after real measurement, never aspirationally",
      why: "The Lighthouse performance thresholds were set from 3 fresh runs each time, not a target number picked in advance — see docs/QA_REPORT.md for the actual data behind each change.",
    },
  ],
} as const;

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
