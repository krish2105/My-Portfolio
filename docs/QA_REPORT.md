# QA Report

Real, dated findings from actually running the checks — not aspirational
numbers. Re-run and update this file whenever the Lighthouse gate or CI
pipeline changes materially.

## 2026-07-02 — Lighthouse gate change (Phase 8)

**What changed:** raised `categories:performance` from `warn ≥0.50` to
**`error ≥0.75`** (desktop, median of 3 runs) — a real, meaningful increase
over the old no-op gate, calibrated to actual measured headroom rather than
an aspirational number. Added a second, mobile-profile Lighthouse config
(`lighthouserc.mobile.json`) as a separate CI step: performance stays
`warn` there (see reasoning below), but accessibility/best-practices/SEO
are enforced at the same `≥0.90` bar as desktop.

**Why not enforce ≥0.90 outright, per the original plan target?** Local
measurement showed the headroom isn't there yet, and single-run scores were
noisy enough that a single-run ≥0.90 gate would be flaky:

| Run | Page | Profile | Runs | Performance |
|---|---|---|---|---|
| 1 | `/` | desktop, single run | 1 | 0.71 |
| 2 | `/work/fraudshield/` | desktop, single run | 1 | 0.98 |
| 3 | `/` | desktop, single run | 1 | 1.00 |
| 4 | `/` | default (mobile-like throttling), single run | 1 | 0.84 |

Three single-page-load desktop runs of essentially the same bundle scored
0.71, 0.98, and 1.00 — a huge spread, almost certainly environment noise
(shared/local sandbox CPU contention) rather than real regressions, since
LCP/CLS/Speed Index were consistently excellent across runs and only Total
Blocking Time varied. **Median-of-3 (`numberOfRuns: 3`, now set in
`lighthouserc.json`) is itself a real fix** — it's what made a meaningfully
higher, *enforced* gate viable without flaking CI on every run. `≥0.75`
was chosen as a real improvement over the old `≥0.50` warn-only gate while
keeping a safety margin under the noisy low end observed locally; GitHub
Actions' dedicated runners should be more consistent than this sandbox, but
that hasn't been independently verified yet.

**Mobile performance (`≥0.85` stretch target from the plan) is not yet
enforced** — only one single-run mobile-profile measurement exists (0.84),
which is too little data to set a reliable gate on, and mobile scores are
typically far more sensitive to CPU throttling than desktop. Mobile
performance stays `warn` until there's a few CI runs of real data to
calibrate against. Revisit this once `lighthouserc.mobile.json` has run in
CI a handful of times — tighten the gate then if the numbers hold up.

**Confirmed root cause of headroom being < 0.90, not something to "fix"
blindly:** Total Blocking Time was the main drag (~660ms in the worst
local run) despite `mainthread-work-breakdown` and `bootup-time` both
scoring perfectly — consistent with the known, already-documented bundle
weight (R3F hero ~882 KB, transformers.js ~550 KB, ONNX WASM ~23 MB), all
already lazy-loaded per the existing architecture. Further improvement
would mean actually code-splitting/deferring more of that (the build
output already warns about chunks >500 KB) — a real optimization project,
not a config change, and out of scope for this pass.

## Accessibility (axe-core)

All three CI-scanned pages pass with **0 violations** (2026-07-02, after
Phases 3–7 landed — Trust & Thinking, Skill Constellation, Project System
Map, expanded Copilot, and the résumé/live-demo changes are all covered
since they're on the home page or `/work/fraudshield`):

- `/` (home) — 0 violations
- `/work/fraudshield/` (representative static project page) — 0 violations
- `/uses` (added to the CI a11y scan in this pass — previously only
  smoke-tested manually) — 0 violations

As before: axe automated scanning catches an estimated 20–50% of real
accessibility issues — this is not a substitute for manual keyboard/screen
-reader passes, only a regression backstop.

## Cross-browser / network — manual pass status

**Not independently re-verified in this pass.** This environment only has
a Chromium-based preview available (no real Safari/Firefox/Slow-4G rig),
so claiming a cross-browser pass here would itself be a fabrication. What
*was* verified via the Chromium preview in this pass: dark mode, 1400px
desktop, and 375px mobile viewports for every new Phase 3–5 feature (Trust
& Thinking placeholders/real-content states, Skill Constellation
interaction, Project System Map toggle + domain filtering, résumé view-mode
snapshot switching, the NL→SQL live lab, and the three new Copilot
commands) — all functioned with 0 console errors.

**Outstanding, needs a real device/browser pass by Krishna:** Safari
(desktop + iOS), Firefox, and a genuine throttled-network test. Record
results here once done, following the same table format as this section.

## Test suite

64 Vitest/RTL tests passing (`npm run test`), up from 36 before Phases 3–5
(+9 for Trust & Thinking / NL2SQL / IntersectionObserver test-env fix,
+15 for the Copilot's comparison/best-for-role/interview-question logic).
`npm run lint` and `npm run build` are green.

## 2026-07-08 — Domain fix + proof/signal features (senior-designer audit follow-up)

**Domain correctness:** confirmed with Krishna that the live Vercel
subdomain is `krishnamathur-ai.vercel.app` (not `portfolio-krishna.vercel.app`,
which was hardcoded everywhere). Replaced across all 8 affected files
(`index.html`, `scripts/generate-project-pages.ts`, `public/robots.txt`,
`public/sitemap.xml`, `README.md`, and 3 docs files). `npm run build`
regenerates the static `/work/:slug` pages with the corrected canonical/OG/
JSON-LD URLs — confirmed `Generated 8/8 static case-study pages.` and zero
remaining `portfolio-krishna` references in the repo.

**New features added and manually verified in the Chromium preview**
(desktop 1440px, mobile 375px, dark + light theme, 0 console errors
throughout):

- Hero quantified-impact strip (`HeroMetrics.tsx`) — 8 shipped systems / 4
  flagships / 67% MediFlow utilisation, all derived live from `projects[]`
  so the numbers can't drift from the underlying data. Confirmed correct
  `<dl>`/`<dt>`/`<dd>` semantics via the accessibility tree.
- Profile card status pill now shows the real `profile.availabilityShort`
  ("Open to roles") instead of a hardcoded fake "Online".
- Contact section shows a static, honest response-time line ("Usually
  replies within 24–48h").
- Résumé section gained a click-to-expand inline PDF preview (Google Drive
  `/preview` iframe, lazy-loaded, with an "Open full PDF" fallback link) —
  confirmed the iframe loads the actual résumé content. CSP updated
  (`frame-src https://drive.google.com`) to permit it.
- GitHub activity section now shows "Last shipped: `<repo>` · `<relative
  time>`", computed from data already being fetched (no extra API call) —
  confirmed against the live GitHub API that `krish2105/krish2105` really
  was the most recently pushed repo at verification time.
- Added missing analytics events (`contact_submit_success`,
  `project_modal_open`) so the funnel is now fully observable.
- Project modal's Limitations/Next Steps sections got a distinct callout
  treatment (amber/green) instead of blending into routine case-study
  prose, per the audit's finding that this self-aware content was
  under-emphasized.

`npm run lint`, `npm run test` (64/64), and `npm run build` all green
after these changes.

**Cross-browser status unchanged from the 2026-07-02 entry above** — still
only Chromium-verified in this environment. Safari (desktop + iOS), Firefox,
and a real throttled-network pass remain outstanding and need Krishna to
run them on real devices/browsers.
