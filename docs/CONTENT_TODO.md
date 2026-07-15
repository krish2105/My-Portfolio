# Content TODO — real assets Krishna needs to supply

Nothing on the live site is fabricated. Every item below is either shown
honestly as "not yet supplied" (screenshots → generated covers, testimonials
→ labelled placeholders, writing → a "planned" slot) or omitted entirely
(e.g. missing live links). This file is the checklist for replacing those
honest placeholders with the real thing — and the ready-to-send request
templates for the human-sourced ones.

**2026-07-15 update:** the project lineup changed — TalkToData, SmartLoanBot,
Flower Classifier and Electric Production Forecasting were removed (weak
evidence, no live demo/repo) and replaced with 4 independent, production-grade
flagships: **FinCopilot, Sakan AI, ComplianceAgent, AutoValuate Intelligence**
— each already has real screenshots captured live from its deployed app. The
items below are reconciled against the *current* project set.

## 1. Screenshots (real UI, WebP, ≥1600px wide)

Missing for: **WaselX** (`images: []`, private team repo). All other projects
— including the 4 new flagships — already have real screenshots.
Add to `public/projects/<id>/` and reference in `Project.images` in
`src/data/portfolio.ts` — `ProjectCard`/`ProjectModal` automatically prefer
real images over the generated `ProjectCover`.

## 2. Demo videos / GIFs (≤15s)

For the 4 current flagships: FinCopilot, Sakan AI, ComplianceAgent,
AutoValuate Intelligence. No `demoVideo` field exists yet — add one to the
`Project` type when the first clip is ready, rather than speculatively now.

## 3. Metrics

Only add numbers that are real and reproducible. MediFlow already has real
metrics (Jain's index, utilisation, wait time). For the others, either
supply a real number or leave the "what was measured" honesty framing
already in `impact[]`/`limitations[]` as-is.

## 4. Project links

Still missing a `liveUrl`/public repo for: **WaselX** (team repo is private,
"source available on request"). All other projects — including the 4 new
flagships — carry both a real `repositoryUrl` and `liveUrl`.

**Link-check result (2026-07-02, pre-swap):** all 8 then-existing
GitHub/Colab/Kaggle links resolved (HTTP 200). MediFlow's Streamlit
`liveUrl` redirects to Streamlit's "wake the app up" auth flow when the
free-tier app has gone to sleep from inactivity — not broken, but a cold
visitor can land on a sleep screen instead of the dashboard.

**2026-07-15:** the 4 new flagships (FinCopilot, Sakan AI, ComplianceAgent,
AutoValuate) are all hosted on free-tier Vercel/Render — Render cold-starts
after inactivity (documented in each project's own `limitations[]`). Worth
a periodic visit to keep them warm before a recruiter clicks through.

## 5. Résumé

**Done (2026-07-08):** inline PDF preview shipped on `ResumeSection`
(click-to-expand Google Drive `/preview` iframe, with an "Open full PDF"
fallback link). **Not yet done:** an ATS-plain-text variant — deferred by
choice, resurface only if wanted.

**Higher-priority finding, now worse (2026-07-08 recruiter audit, project
lineup changed 2026-07-15):** the actual résumé PDF
(`Krishna_Mathur_Dubai_Executive_Resume.pdf`) predates the project swap
entirely — it doesn't mention FraudShield/MediFlow/Lulu (the old flagships
it was already missing) *or* the 4 new flagships (FinCopilot, Sakan AI,
ComplianceAgent, AutoValuate) that now lead the site, and has zero
quantified numbers in any bullet. Since recruiters forward the PDF
internally (not the portfolio link), the strongest work on the site
currently never reaches a hiring manager via the résumé.

**Action — drafted bullet copy ready to paste in:**
- *FinCopilot* — "Built an agentic RAG financial-research copilot (LangGraph, FastAPI, Next.js) with XBRL-grounded citations and a Self-RAG faithfulness gate; 205 backend tests, CI-gated evals, $0/month hosting."
- *Sakan AI* — "Designed a 5-stage multi-agent real-estate deal-intelligence pipeline (LangGraph, FastAPI, Next.js) with live WebSocket reasoning traces, Stripe billing and Arabic localisation; 85 passing tests."
- *ComplianceAgent* — "Built an AML/KYC investigation copilot with a from-scratch NumPy graph convolutional network for risk scoring and a mandatory human-approval gate; 80 tests (76% coverage), red-team suite 6/6 blocked."
- *AutoValuate Intelligence* — "Shipped a damage-aware car-valuation app with an on-device YOLOv8/ONNX detector (0.732 mAP@0.5) and SHAP-explained XGBoost pricing; zero WCAG 2.1 AA violations."

Add these (or a tightened version) to the résumé, then re-upload to the
same `RESUME_DRIVE_FILE_ID` (`src/data/portfolio.ts:50`) so the existing
link and inline preview keep working with no code change.

## 6. Testimonials / recommendations

Real, permissioned quotes only — add to `testimonials` in
`src/data/portfolio.ts` shaped like:

```ts
{
  id: "t-01",
  quote: "...",
  author: "Full Name",
  role: "Title, Company",
  sourceUrl: "https://linkedin.com/...",
  type: "linkedin", // "linkedin" | "faculty" | "internship"
  status: "verified",
  permission: true,
}
```

The matching placeholder in `TrustAndThinkingSection` disappears
automatically once an entry of that `type` has `status: "verified"`.

### Request template — LinkedIn recommendation

> Subject: Quick favour — a LinkedIn recommendation?
>
> Hi [Name], I'm putting together a portfolio of my AI/ML work and would
> really value a short LinkedIn recommendation from you, covering [the
> project/context you worked on together]. A few sentences is plenty —
> happy to write a draft for you to edit if that's easier. Thank you!

### Request template — mentor/faculty quote

> Subject: A short quote for my portfolio (with your permission)
>
> Hi Professor [Name], I'm building a portfolio site and would love to
> include a short, attributed quote from you about [specific
> project/coursework], if you're comfortable with that. I'll only publish it
> with your explicit go-ahead and your name/title exactly as you'd like them
> shown — happy to send the exact wording for approval first.

### Request template — internship feedback (Intelliza Solutions)

> Subject: Permission to share a short quote about my internship
>
> Hi [Name], I completed my ML internship with Intelliza Solutions working
> on the AI loan-advisory chatbot, and I'm building a portfolio site. Would
> you (or someone else on the team) be open to a short, attributed quote
> about the work? I understand if client-confidentiality means this isn't
> possible — no pressure either way, and I'd only publish it with explicit
> permission and sign-off on the exact wording.

## 7. Blog / article content

The "Writing & Insights" slot on the Trust & Thinking section shows a single
honest "planned" placeholder until `writing` in `src/data/portfolio.ts` has
a real, published entry:

```ts
{ id: "w-01", title: "...", blurb: "...", date: "2026-01", url: "https://...", status: "published" }
```

## 8. OG images

Current `/og/<id>.png` cards are branded, generated cards (not screenshots)
— an honest interim, not a placeholder that needs a disclaimer. Swap to
screenshot-based OG cards once real screenshots exist for a project (see
§1) — now only outstanding for **WaselX**.

## 9. README preview image

Done — `public/preview.png` exists and is referenced in `README.md`.

## 10. Custom domain

Decision: Vercel subdomain renamed to `krishnamathur-ai.vercel.app`
(code already points at this everywhere). Revisit only if a real custom
domain (e.g. `krishnamathur.dev`) is purchased later — see
`docs/LAUNCH_CHECKLIST.md` for the cutover steps.

## How to add real content — quick reference

1. Add the real fields (screenshot path, quote object, writing object, link)
   to the relevant array/object in `src/data/portfolio.ts`.
2. Nothing else needs to change — `ProjectCard`, `ProjectModal`,
   `TrustAndThinkingSection`, the sitemap/OG generator, and the Copilot's
   knowledge base all read from this single file.
3. Run `npm run lint && npm run test && npm run build` and spot-check the
   affected section in the browser before shipping.
