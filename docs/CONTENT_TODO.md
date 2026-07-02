# Content TODO — real assets Krishna needs to supply

Nothing on the live site is fabricated. Every item below is either shown
honestly as "not yet supplied" (screenshots → generated covers, testimonials
→ labelled placeholders, writing → a "planned" slot) or omitted entirely
(e.g. missing live links). This file is the checklist for replacing those
honest placeholders with the real thing — and the ready-to-send request
templates for the human-sourced ones.

## 1. Screenshots (real UI, WebP, ≥1600px wide)

Missing for: **SmartLoanBot, WaselX, Flower Classifier, TalkToData, Electric
Production**. Add to `public/projects/<id>/` and reference in
`Project.images` in `src/data/portfolio.ts` — `ProjectCard`/`ProjectModal`
automatically prefer real images over the generated `ProjectCover`.

## 2. Demo videos / GIFs (≤15s)

For the 4 flagships: FraudShield, MediFlow, Lulu Sales Intelligence,
TalkToData. No `demoVideo` field exists yet — add one to the `Project` type
when the first clip is ready, rather than speculatively now.

## 3. Metrics

Only add numbers that are real and reproducible. MediFlow already has real
metrics (Jain's index, utilisation, wait time). For the others, either
supply a real number or leave the "what was measured" honesty framing
already in `impact[]`/`limitations[]` as-is.

## 4. Project links

Still missing a `liveUrl` or public repo for: SmartLoanBot, WaselX, Flower
Classifier, TalkToData, Electric Production. Each already carries an honest
`note` ("code available on request" / "private repository" / "in
development"). Replace the note with a real `liveUrl`/`repositoryUrl` as
soon as one exists.

## 5. Résumé

Confirm `RESUME_DRIVE_FILE_ID` in `src/data/portfolio.ts` still points at
the current PDF. Not yet done: an ATS-plain-text variant and an inline PDF
preview on `ResumeSection` (currently a direct-download link only).

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
screenshot-based OG cards once real screenshots exist for a project (see §1).

## 9. README preview image

Done — `public/preview.png` exists and is referenced in `README.md`.

## 10. Custom domain

Decision: Vercel subdomain renamed to `portfolio-krishna.vercel.app`
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
