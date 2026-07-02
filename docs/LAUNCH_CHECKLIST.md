# Launch Checklist — "AI Command Center" master plan

Tracks the full 10-phase roadmap (`~/.claude/plans/fully-brainstorm-the-
project-lexical-otter.md`). Check off what's genuinely verified, not just
implemented — "done" means it was actually run/tested, per this repo's own
verification discipline.

## Phase status

- [x] **Phase 0 — Emergency polish.** Domain typo fixed everywhere
      (`portfolio-krishna.vercel.app`), all project links audited, real
      `public/preview.png` added, sitemap/robots/OG regenerated.
- [x] **Phase 1 — Brand & content upgrade.** New hero/about/services/SEO
      copy, Recruiter/Technical/Business view-mode toggle, "Copy hiring
      summary," Copilot modes-lite, command-palette additions.
- [x] **Phase 2 — Project case-study upgrade.** `valueProp`/`audience`/
      `architecture`/`limitations`/`nextSteps`/`flagship` added to all 8
      projects; `ProjectTelemetry` + `ArchitectureMap` components; System
      Flow/Limitations/Next Steps sections in the case-study modal.
- [x] **Phase 3 — Trust & Thinking.** Honest two-mode testimonials/writing
      section (real content or a labelled, CTA'd placeholder per slot —
      never fabricated); `docs/CONTENT_TODO.md` with the master checklist
      and ready-to-send request templates.
- [x] **Phase 4 — Interaction layer.** Skill Constellation (radial capability
      map), Project System Map (domain↔project bipartite map), résumé
      view-mode filtering + expandable skills, a second honest live lab
      (rule-based NL→SQL demo).
- [x] **Phase 5 — Copilot full upgrade.** Project comparison, best-project-
      for-role matching, interview-question generation, mode-biased
      semantic ranking — all deterministic, all from real `portfolio.ts`
      data.
- [x] **Phase 6 — Design-system polish.** `docs/DESIGN_SYSTEM.md` documents
      the existing tokens/motion/a11y/component conventions.
- [x] **Phase 7 — SEO & sharing.** `/uses` added to `sitemap.xml`; JSON-LD
      enriched with `valueProp`-based abstracts and tag+tech keywords; every
      real project link verified live (HTTP 200); MediFlow's Streamlit
      cold-start behavior documented.
- [x] **Phase 8 — Perf, a11y & QA.** Lighthouse gate raised from a no-op
      `warn ≥0.50` to a measured, real `error ≥0.75` (desktop, median of 3);
      mobile profile added (perf `warn`, a11y/BP/SEO `error ≥0.90`); `/uses`
      added to the CI axe scan; `docs/QA_REPORT.md` records actual numbers.
- [x] **Phase 9 — Launch checklist.** This file.

## Before every deploy

- [ ] `npm run lint` clean
- [ ] `npm run test` green (64 tests as of this pass)
- [ ] `npm run build` succeeds, including the `postbuild` static-page
      generator (`Generated 8/8 static case-study pages.`)
- [ ] `grep -ri portolio .` (excluding `node_modules`/`dist`) returns nothing
- [ ] Spot-check the deployed site in a real browser: dark + light theme,
      375px mobile, and `prefers-reduced-motion` — no console errors

## Known open items (not blockers, tracked honestly)

- **Vercel subdomain rename.** The code already points every canonical/OG/
  sitemap/JSON-LD URL at `portfolio-krishna.vercel.app`. Krishna needs to
  rename the actual Vercel project subdomain (Project Settings → Domains)
  to match — until that happens, the *live* URL and the URLs baked into
  meta tags won't agree, which will 404 shared links. Do this rename
  **before or together with** the next deploy, not after.
- **Custom domain.** Not yet decided/purchased. `SITE` in
  `scripts/generate-project-pages.ts` is the one line to change if/when a
  real domain (e.g. `krishnamathur.dev`) is added — see Section 11 of the
  master plan.
- **Content gaps.** Full list + request templates in
  `docs/CONTENT_TODO.md`: 5 missing project screenshots, 4 demo videos,
  résumé ATS/plain-text variant + inline preview, all testimonials/writing
  (currently honest placeholders, by design).
- **Cross-browser/Slow-4G manual pass.** Not independently verified in this
  environment (Chromium-only preview available) — see `docs/QA_REPORT.md`
  for exactly what *was* checked. Needs a real pass on Safari (desktop +
  iOS), Firefox, and a throttled connection before calling launch fully
  QA'd.
- **Mobile Lighthouse gate.** Currently `warn`-only (see `docs/QA_REPORT.md`
  for why) — revisit once `lighthouserc.mobile.json` has run in CI a
  handful of times and the numbers are stable enough to gate on.
- **Bundle size.** R3F hero (~882 KB) + transformers.js (~550 KB) + ONNX
  WASM (~23 MB) chunks remain large but lazy-loaded; further reduction
  would require an actual code-splitting project, not a config change —
  out of scope for this pass, flagged as the main lever if the desktop
  Lighthouse gate needs to go higher later.

## Rollback

Every phase in this pass landed as its own commit on `main` (see `git log`)
— if something regresses, `git revert` the specific phase commit rather
than a broader reset.
