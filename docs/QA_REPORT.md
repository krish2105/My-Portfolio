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

## 2026-07-15 — Post-project-swap content/IA realignment + mobile gate enforced

**Content/IA changes:** after replacing 4 weak academic projects with 4
independent production systems (FinCopilot, Sakan AI, ComplianceAgent,
AutoValuate — see `docs/CONTENT_TODO.md`), realigned every piece of copy
that still referenced the old project set (hero subhead, `BentoSection`
view-mode headlines, `now`/`services`/`capabilities`/`journey` in
`portfolio.ts`) and fixed a real dead reference: `services` still said "see
TalkToData" for a project that no longer exists. Also reordered
`src/App.tsx`: `BentoSection` moved to right after the hero (was
duplicating `AboutSection`'s "about me" beat), and `GitHubActivity`/
`LiveDemo` moved to after `ProjectsSection` (were previously showing demos
before the case studies they reinforce). Section kicker numbers cascaded:
Trust & Thinking `(06B)→(07)`, Resume `(07)→(08)`, Contact `(08)→(09)`.

**Real accessibility bug found and fixed by this pass's own axe-core run**
(not pre-existing/known — `docs/QA_REPORT.md`'s last scan predates this):
`HeroMetrics.tsx`'s `<dl>` wrapped `<dt>`+`<dd>`+a stray `<span>` per stat,
violating the HTML5 definition-list content model (a `<div>` inside `<dl>`
must contain only `dt`/`dd`). Axe's `definition-list` rule caught it on the
home page (`/`). Fixed by nesting the visible label inside the `<dd>`
instead of as a sibling. Re-ran axe against `/`, `/work/fraudshield/`,
`/uses`, and the new `/work/fincopilot/` — **0 violations on all four.**

**Suspense fallbacks:** the 5 lazy sections (`GitHubActivity`, `LiveDemo`,
`RecognitionSection`, `TrustAndThinkingSection`, `ResumeSection`) previously
used `<Suspense fallback={null}>`, popping in abruptly with no reserved
space. Added a shared `SectionSkeleton` component (`motion-safe:animate-pulse`,
so it already no-ops under reduced-motion) wired into all 5.

**`vite.config.ts` `manualChunks` added** as a safety net for the two heavy
vendor trees (`three`/`@react-three/fiber` → `r3f-vendor`,
`@huggingface/transformers` → `transformers-vendor`), so a future accidental
eager import can't silently re-inline them into the main chunk. This
required updating the PWA `workbox.globIgnores` patterns to match the new
chunk names (`r3f-vendor*.js`/`transformers-vendor*.js` instead of
`NeuralGraphR3F*.js`/`transformers*.js`) — the old patterns matched on the
pre-split filenames and would have silently started precaching the 890 KB
r3f-vendor chunk otherwise. Confirmed precache stayed flat (850.69 KiB → 850.77 KiB) after the fix.

**Mobile Lighthouse gate — re-measured, now enforced.** Old gate
(`warn ≥0.50`) was backed by a single stale local run. Ran
`npx lhci autorun --config=lighthouserc.mobile.json` fresh (3 runs) against
this change:

| Run | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| 1 | 0.54 | 1.00 | 0.96 | 1.00 |
| 2 | 0.66 | 1.00 | 0.96 | 1.00 |
| 3 | 0.66 | 1.00 | 0.96 | 1.00 |

Median performance 0.66, comfortably clearing 0.50 across all 3 runs (the
0.54–0.66 spread is the same environment-noise pattern documented in the
desktop gate change above, not a regression). Raised
`categories:performance` from `warn` to **`error ≥0.50`** — the same
threshold, now actually enforced instead of advisory-only. Did **not** jump
straight to a desktop-style `≥0.75`: mobile's Lighthouse CPU/network
throttling profile is inherently harsher, and only 3 runs of data exist —
raise further once more CI runs accumulate. Accessibility/best-practices/SEO
were already comfortably above their existing `≥0.90` error gates.

**Test suite:** 70 Vitest/RTL tests passing (up from 64), lint/build/tsc
all clean. New tests: `Preloader.test.tsx` (reduced-motion path calls
`onDone` immediately), `HeroSection.test.tsx` (renders real profile data,
subhead no longer references retired project names), `SectionSkeleton.test.tsx`.
Also added a `ResizeObserver` stub to `src/test/setup.ts` (same category of
jsdom gap as the existing `IntersectionObserver`/`matchMedia` stubs) —
needed once `HeroSection`'s tree (via `MagneticButton`/`ProfileCard`) was
actually exercised in a test for the first time.

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

## 2026-07-31 — Résumé rearchitecture, audit fixes, mobile pass, feature cuts

Full pass per the "Portfolio v3" master prompt. Five phases, each committed
separately on `main` (`774020e`, `15e9d6f`, `d3645c4`, `1944480`, `cd48b84`).
STOP-checkpoint answers from Krishna: ComplianceAgent ≠ "Muraqib AI" —
ClaimGuard AI is a real, separate project, held for a future pass pending
Krishna supplying its data (see `docs/CONTENT_TODO.md`); StockWise AI stays
out (no live evidence, matches this repo's own bar).

### Phase A — Résumé architecture

The résumé was a stale, hand-uploaded Google Drive PDF predating the
FinCopilot/Sakan AI/ComplianceAgent/AutoValuate flagship set, with zero
quantified metrics. Rebuilt the *architecture*, not just the content:

- `scripts/generate-resume.ts` (`npm run resume:build`) regenerates
  `public/resume/Krishna_Mathur_Resume.pdf` from `scripts/resume-content.ts`
  + the live `projects`/`profile`/`recognition` in `portfolio.ts`, via
  pdf-lib + fontkit, styled to `docs/DESIGN_SYSTEM.md`'s dark tokens.
  "Key Projects" pulls every `status === "Independent Project"` entry live
  — a future 5th flagship (e.g. ClaimGuard AI once added) appears
  automatically, with a console warning if it has no curated
  `resumeProjectBlurb` yet, so it can never silently vanish from the résumé.
- **Real bug found and fixed while building this**: embedding the site's
  actual variable woff2 fonts (Kanit/Inter/JetBrains Mono) directly via
  pdf-lib + `@pdf-lib/fontkit` silently dropped specific glyphs — parens,
  "fi"/"ffi" letter pairs, "@" — with no error, confirmed by rendering test
  PDFs with pymupdf before/after. Root cause: pdf-lib/fontkit chokes on
  GSUB/GPOS/GDEF tables in these font files. Fix: `scripts/resume-fonts/`
  holds prebuilt, GSUB/GPOS-stripped static instances (via `fonttools`,
  documented in `generate-resume.ts`'s comments) — every glyph now renders
  correctly, confirmed by re-rendering and reading the output.
- `ResumeSection`/`ResumeButton`/`portfolio.ts` now serve the local PDF
  directly (download + inline iframe preview); `RESUME_DRIVE_FILE_ID` and
  the Drive CSP `frame-src` allowance are gone. Retired the stale root
  `Krishna_Mathur_Dubai_Executive_Resume.pdf`.
- Reconciled résumé content against `portfolio.ts` per the master prompt's
  own tie-breaker rule: the master prompt's drafted "Retail IQ" project
  (913,000-row dataset, faculty endorsement, hypermarket stakeholder
  interest) doesn't match anything in `portfolio.ts` — the real project is
  "Lulu Sales Intelligence Dashboard" (10 stores/3 regions, no faculty/
  stakeholder claims in the source of truth). Used the real project's real
  numbers instead of the unverifiable draft. Similarly, "CrediShield" and
  "Project Wafa" (named in the master prompt's source content) don't exist
  anywhere in `portfolio.ts` or the repo — left off the résumé rather than
  added on the master prompt's word alone; **flagged to Krishna** — if
  real, add them to `portfolio.ts` first (this repo's actual source of
  truth) and they'll flow into the résumé on the next `resume:build`.
- `docs/LAUNCH_CHECKLIST.md`: added "re-run `npm run resume:build`" to the
  before-every-deploy list.

### Phase B — Audited flaws

- **B1 SEO indexing**: not a code task — Krishna needs to submit the
  sitemap in Google Search Console directly (`robots.txt`/`sitemap.xml`
  are already correct).
- **B2 copy calibration**: re-checked `portfolio.ts` and `index.html` for
  seniority-inflating language (titles like "Leader"/"Chief"/"Strategy").
  **None found** — the handful of "leadership"/"strategy" hits are all
  either skill-category labels, other people's roles (a client's
  "leadership" team as a project's audience), or an honestly-tiered
  "Academic Experience" skill entry, never an inflated claim about
  Krishna's own seniority.
- **B3 Git LFS**: prepared the migration for `public/models` (89 MB) and
  `public/ort` (23 MB) — `.gitattributes` tracking `*.onnx`/`*.wasm`,
  converted the existing blobs to LFS pointers, verified locally (`git lfs
  status`, working-tree files stay intact). **Could not push the actual
  LFS objects from this sandboxed session** — GitHub's LFS object-storage
  endpoint (`lfs.github.com`) returned 403 on `verify`, a session/proxy
  routing gap distinct from the normal git-over-HTTP path that worked fine
  for every other commit. Reverted the local commit rather than leave an
  unpushable, unverifiable half-state. **Krishna or a future session with
  real GitHub LFS credentials can complete this in ~2 minutes**:
  ```
  git lfs install
  git lfs track "public/models/**/*.onnx" "public/ort/**/*.wasm"
  git add .gitattributes public/models public/ort
  git commit -m "chore: migrate ONNX/WASM assets to Git LFS"
  git push origin main
  ```
  Then enable "Git LFS Support" in Vercel Project Settings → Git and
  redeploy (off by default; Vercel won't fetch LFS objects otherwise —
  confirmed via Vercel's own docs before recommending this).
- **B4 cross-browser defensive audit**:
  - `backdrop-filter`: already correctly `-webkit-`-prefixed everywhere,
    confirmed in the actual `dist/assets/*.css` output (Vite's CSS
    pipeline autoprefixes it), not just guessed from source.
  - **Real gap found and fixed**: the R3F hero's WebGL context-loss
    handling only covered "no WebGL at all" (checked once on mount) and
    React-render-time errors (ErrorBoundary) — a genuine mid-session
    `webglcontextlost` event (a documented Safari/iOS failure mode) fires
    as an async DOM event neither path catches, so the canvas would just
    go blank/frozen. `NeuralGraphR3F` now listens for it and falls back to
    the same `NameNeurons` Canvas 2D path. Still needs a human on a real
    device/GPU to trigger a genuine context loss and confirm end-to-end —
    jsdom/this environment has no real WebGL to exercise it against.
  - `IntersectionObserver`/`ResizeObserver`: not Chromium-only APIs (broad
    Safari support since 2019/2020); every usage in this repo re-reads
    `getBoundingClientRect()` rather than relying on
    `ResizeObserverEntry`'s shape, avoiding the one real cross-engine
    inconsistency that API has. No changes needed.

### Phase C — Mobile-friendliness deep pass

Fresh `npx lhci autorun --config=lighthouserc.mobile.json` (3 runs each,
this sandbox's Chromium, `--no-sandbox` required for a root container —
not representative of GitHub Actions' runners, which should be more
consistent, same caveat as the 2026-07-02 desktop-gate entry above):

| Pass | Run 1 | Run 2 | Run 3 | Median |
|---|---|---|---|---|
| Before the eager-fetch fix below | 0.45 | 0.53 | 0.52 | 0.52 |
| After the eager-fetch fix below | 0.65 | 0.61 | 0.62 | 0.62 |

Accessibility/best-practices/SEO stayed at 1.00/0.96/1.00 throughout,
comfortably clear of their `≥0.90` gates. The `≥0.50` performance gate
passed in both passes, but the median dropped from the 2026-07-15 entry's
0.66 to 0.52 before investigating — worth being honest that some of that
gap may be this sandbox's CPU (4 cores, shared) rather than a real site
regression, but the eager-fetch bug below was real and independently
confirmed via network trace, not just inferred from the score movement.

**Real bug found and fixed (the significant one this pass):** despite the
R3F hero and transformers.js/ONNX being wired up as `lazy()`/dynamic
`import()`, `vite.config.ts`'s `manualChunks` — added in an earlier pass
specifically as a "safety net" against eager-loading — was itself causing
Rollup to emit a **static** `import ... from "./r3f-vendor-*.js"` at the
top of the main entry chunk. Confirmed with a live CDP network trace: every
mobile page load fetched ~890 KB + ~553 KB immediately on page load,
regardless of `useWebGLSupport` or any click gate — even though the 2D
Canvas fallback was the only thing actually rendered (verified: the
rendered `<canvas>`'s className matched `NameNeurons`, not the R3F scene).
Fix: removed `manualChunks` (Rollup's automatic splitting already isolates
both chunks correctly, since each is exclusively reached via a dynamic
import — confirmed no static import remains, network trace shows zero
heavy-chunk requests on mobile page load post-fix), added
`hoistTransitiveImports: false` and a `build.modulePreload.
resolveDependencies` filter as defence in depth, updated the PWA
`globIgnores` patterns to match Rollup's natural chunk names (precache
count/size confirmed back to ~883 KB / 31–32 entries, matching the
pre-existing baseline instead of the 2,292 KB / 34 entries a naive
manualChunks removal would have caused by losing the exclusion match).

**Touch targets** (375px viewport, scripted DOM sweep of every `button`/
`a[href]`/`input`, not eyeballing): found and fixed 4 real sub-44px
elements — `SoundToggle`/`ThemeToggle` (36px icon buttons, hit area
expanded to 44px via `::before -inset-1` without changing the visible
icon size, verified the expanded zone is actually clickable via a
hit-test 2px outside the visible box, and verified `ThemeToggle`'s actual
toggle behavior fires from that expanded zone), the Assistant "Ask AI"
launcher (40px height → `min-h-11`), and the `ProjectModal`/`UsesModal`
close buttons (40px → 44px). A handful of other small measurements (tech
marquee logo clones, the scroll-to-top FAB at rest) turned out to be
`aria-hidden` duplicates and scale-transition artifacts respectively, not
real bugs — verified each before treating it as a finding.

**Responsive fallback claim corrected**: README said the desktop
horizontal project gallery "falls back to a vertical stack on mobile" —
it doesn't, and isn't meant to. Mobile gets its own native swipe gallery
(CSS scroll-snap, no gesture library) per `ProjectsSection.tsx`'s own
`SwipeGallery` component and comments — confirmed in a real 375px
viewport screenshot. Fixed the README wording, not the code, since the
actual behavior is the more intentional, better design.

**iOS safe-area insets**: none existed anywhere. Added
`env(safe-area-inset-*)` to the fixed navbar, mobile-menu close button,
scroll-to-top FAB, and Assistant launcher/panel — via CSS custom
properties, not raw inline `style.bottom`/`.left` (which would have
silently overridden the existing `md:bottom-7`/`md:left-7` responsive
classes regardless of breakpoint — caught and fixed before committing).
**Not verified on a real notched device** — `env(safe-area-inset-*)`
correctly evaluates to `0` in this non-notched test environment, so the
change is confirmed non-regressive here but its actual effect can only be
confirmed on real hardware.

**Heavy client-side ML on mobile**: already lazy (only loads on
`useTransformersPipeline`'s first `run()` call); now also gated behind an
explicit "Try it" click at the section level too (see Phase D). The
"~90 MB one-time download" warning is shown both before and after that
click.

**Axe-core at 375px** (not just desktop): `/` and `/uses`, real mobile
viewport + touch emulation — **0 violations**, both before and after this
pass's fixes.

### Phase D — RAG/sentiment opt-in, per-project "last updated", cold-start states

- `LiveDemo` (sentiment model + NL→SQL + trade-off simulator) collapses
  behind an explicit "Try it" click by default — confirmed with Krishna
  before implementing. The heaviest bundle weight was already click-gated
  (see Phase C's eager-fetch fix), but the section's own JS/motion/state
  previously still mounted for every visitor who scrolled past it; now
  that's gated too. New test coverage for the collapsed-by-default state.
- The RAG assistant (`Assistant.tsx`) was **already** gated behind its
  floating "Ask AI" button (closed by default), with its heavier semantic
  search model behind a further "smart answers" toggle inside the open
  panel — already matched the intended pattern from an earlier pass, no
  changes needed.
- Added a real per-project "last updated" signal to `ProjectModal`,
  reusing the same GitHub API call `GitHubActivity` already makes
  (session-cached, 6h TTL — no new API call, per the master prompt's own
  instruction). Only resolves for the 6 of 8 projects whose repo is under
  the `krish2105` account — `lulu-sales` (a teammate's repo) and `waselx`
  (private repo, no `repositoryUrl`) show nothing rather than a guessed
  date.
- **"Waking up..." cold-start states for FinCopilot/Sakan AI/
  ComplianceAgent/AutoValuate**: already fully implemented from an earlier
  pass (`LiveStatusBadge`/`useLiveStatus`, gated to exactly those 4 project
  IDs) — confirmed working via a live preview screenshot (correctly shows
  "Currently unreachable" in this sandboxed environment, which genuinely
  can't reach the real external Vercel/Render URLs). No changes needed;
  this item in the master prompt was already closed before this session.

Bundle-size verification: confirmed via build output that `LiveDemo`'s own
chunk size is essentially unchanged (the collapse is a render-gating
change, not a code-elimination one) — the real win is reduced main-thread
mount/render work for the majority of visitors who never click "Try it",
compounding with Phase C's much larger eager-fetch fix.

### Final verification (this session)

`npm run lint` / `npm run test` (97 passing, up from 94 at session start) /
`npm run build` all green after every phase — see each phase's commit
message for the specific verification run at that point.

### Outstanding for Krishna

1. **Answer the ClaimGuard AI question** (if not already, via this
   session) — live URL, repo, problem/approach/impact/metrics, screenshot
   — to add it as a 9th case study and have it flow into the résumé
   automatically.
2. **Submit the sitemap in Google Search Console** (Phase B1) — zero pages
   indexed is a submission gap, not a config gap.
3. **Complete the Git LFS push** (Phase B3) — the exact commands are above;
   this session's sandbox couldn't reach GitHub's LFS object-storage
   endpoint. Enable Vercel's "Git LFS Support" project setting afterward.
4. **Real-device verification** for two items this session could only
   fix in code, not confirm end-to-end: the WebGL context-loss fallback
   (Phase B4) and iOS safe-area insets on a real notched device (Phase C).
5. **Cross-browser/Slow-4G manual pass** — still outstanding from every
   prior QA_REPORT entry; unchanged this session.
6. **Testimonials/writing content** — per `docs/CONTENT_TODO.md`, still
   the single biggest remaining trust gap and the top non-code priority.
