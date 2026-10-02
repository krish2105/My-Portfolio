# Recruiter-first restructure — implementation plan

> **For agentic workers:** executed inline in one session (the owner asked for end-to-end delivery). Steps use checkbox syntax. Spec:
> `docs/superpowers/specs/2026-10-02-recruiter-first-restructure-design.md`.

**Goal:** Make the site read as one clear role ("AI Engineer — GenAI, RAG & agents"), put proof first, and cut the page to ~6 sections
for recruiters while the full portfolio stays one toggle away.

**Architecture:** A pure layout table (`src/lib/pageLayout.ts`) maps view mode → ordered sections; `App.tsx` renders from it, and the nav,
section numbers, side rail, palette and scrollspy all read the same table. New data-driven Credentials replaces Awards + Trust. The Work
section gains a recruiter "strip" variant while still owning the `/work/:slug` modal.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, Motion, Vitest + RTL (unit), puppeteer-core e2e (`npm run e2e`).

## Global Constraints

- No new dependencies.
- Nothing invented: no testimonials, certifications, writing, availability date or metrics. `profile.availableFrom` stays unset.
- Visa wording is verbatim from the résumé: `UAE student visa (transferable)`.
- Section DOM ids stay `home projects about journey skills github demo credentials resume contact`; removed ids: `services recognition trust`.
- Test-first for every behavioural change; `npx tsc -b && npx eslint . && npx vitest run && npm run build && npm run e2e` stay green at every commit.
- Existing behaviour that must survive: `/work/:slug` deep links + Back, the assistant, Ctrl+K palette, the PDF worker, CSP, a11y 0 violations.

## File map

| File | Responsibility |
|---|---|
| `src/data/site.ts` (new) | `SITE_TITLE`, `SITE_DESCRIPTION` — one copy for App, ProjectsSection, page generator |
| `src/types/portfolio.ts` | `Profile`: drop `titles`; add `headline`, `targetRole`, `workAuthorization`, `availableFrom?`; add `Certification` |
| `src/data/portfolio.ts` | new profile fields; `certifications = []`; drop `trustPlaceholders`/`services`-only exports no longer used |
| `src/lib/credentials.ts` (new) | `credentialGroups()`, `hasCredentials()` — only real, verified/published items |
| `src/lib/pageLayout.ts` (new) | `sectionsFor / navFor / sectionIdsFor / sectionNumber / scrollFallback` |
| `src/hooks/usePageLayout.ts` (new) | mode-aware layout hook + `useSectionNumber(id)` |
| `src/components/sections/credentials/*` (new) | `CredentialsSection` + award/recommendation/certification/writing lists |
| `src/components/sections/FlagshipStrip.tsx` (new) | recruiter proof strip + "Also built" list |
| `src/components/common/FullPortfolioCue.tsx` (new) | recruiter → full-view cue |
| `HeroSection`, `HeroMetrics`, `ProfileCard` | headline, facts line, honest metrics, no duplicated name |
| `ProjectsSection`, `CapabilitiesSection`, `JourneySection`, `AboutSection`, `ContactSection`, `ResumeSection` | variant / grouped list / "Experience" / dynamic numbers / résumé tools |
| `App.tsx`, `Navbar`, `MobileMenu`, `ScrollTelemetryRail`, `CommandPalette`, `Assistant` | render + navigate from the layout table |
| deleted | `data/nav.ts`, `WhatIDoSection`, `SkillConstellation`, `RecognitionSection`, `trust/*` |

---

### Task 1: One positioning, one source of truth

**Files:** create `src/data/site.ts`, `src/data/site.test.ts`; modify `src/types/portfolio.ts`, `src/data/portfolio.ts`,
`src/lib/hiringSummary.ts`, `src/data/knowledgeBase.ts`, `src/App.tsx`, `src/components/sections/ProjectsSection.tsx`,
`index.html`, `scripts/generate-project-pages.ts`, `scripts/resume-content.ts`, `src/components/layout/Footer.tsx`,
`src/data/assistant.ts`, `src/lib/copilotCommands.ts`, `README.md`.

- [ ] **Step 1: failing test** (`src/data/site.test.ts`): asserts `SITE_TITLE`/`SITE_DESCRIPTION` appear in `index.html` (title, og, twitter,
  description), JSON-LD `jobTitle` equals `profile.targetRole`, `resumeTargetRole === profile.targetRole`, `profile.workAuthorization` equals the
  tail of `resumeLocationLine`, no user-facing source still says "AI Developer", and `profile.availableFrom` is undefined.
- [ ] **Step 2:** run → FAIL (no `site.ts`, fields missing).
- [ ] **Step 3: implement** — `site.ts`:
  ```ts
  export const SITE_TITLE = "Krishna Mathur — AI Engineer · GenAI, RAG & Agents | Dubai";
  export const SITE_DESCRIPTION = "Krishna Mathur is an AI Engineer in Dubai building cited agentic RAG copilots, multi-agent systems and explainable ML — shipped live with real tests and public demos. Master of AI in Business, SP Jain.";
  ```
  `Profile` gets `headline`, `targetRole`, `workAuthorization`, `availableFrom?`; `profile.headline = "AI Engineer — GenAI, RAG & agents"`,
  `targetRole = "AI Engineer"`, `workAuthorization = "UAE student visa (transferable)"`. Replace `profile.titles[0]` uses with `headline`;
  swap the four hard-coded titles for the constant; update index.html strings and JSON-LD; `resumeTargetRole = "AI Engineer"`; reword
  footer/assistant/brief/README/about to "AI Engineer".
- [ ] **Step 4:** tests + `tsc` pass. **Step 5:** `npm run resume:build`, commit PDF + sources.

### Task 2: The layout engine and the credentials source

**Files:** create `src/lib/pageLayout.ts`, `src/lib/pageLayout.test.ts`, `src/lib/credentials.ts`, `src/lib/credentials.test.ts`,
`src/hooks/usePageLayout.ts`; modify `src/types/portfolio.ts` (`Certification`), `src/data/portfolio.ts` (`certifications = []`).

**Interfaces — produces:**
```ts
export type SectionKey = "home"|"projects"|"snapshot"|"marquee"|"about"|"journey"|"skills"|"github"|"demo"|"credentials"|"resume"|"contact";
export interface NavItem { id: string; label: string }
export interface LayoutOptions { hasCredentials: boolean }
export const sectionsFor: (mode: ViewMode, o: LayoutOptions) => SectionKey[];
export const navFor: (mode: ViewMode, o: LayoutOptions) => NavItem[];
export const sectionIdsFor: (mode: ViewMode, o: LayoutOptions) => string[];          // ["home", ...nav ids]
export const sectionNumber: (mode: ViewMode, id: string, o: LayoutOptions) => number | null; // 1-based index in nav
export const scrollFallback: (id: string) => { type: "scroll"; target: string } | { type: "link"; target: string };
// credentials
export interface CredentialGroups { awards: RecognitionItem[]; recommendations: Testimonial[]; certifications: Certification[]; writing: WritingItem[] }
export const credentialGroups: (src?: Partial<CredentialSources>) => CredentialGroups;
export const hasCredentials: (g?: CredentialGroups) => boolean;
// hooks
export const usePageLayout: () => { mode; sections; nav; sectionIds; numberOf: (id: string) => number | null };
export const useSectionNumber: (id: string) => string; // "(03)" or ""
```
- [ ] Tests first: recruiter = `home projects journey skills credentials contact`; technical/business = full order; credentials dropped when
  `hasCredentials:false` (and from nav); nav labels (`projects→Work`, `journey→Experience`); numbers = nav index; github/demo/snapshot/marquee
  have no number; `credentialGroups` keeps only `status:"verified"` testimonials and `status:"published"` writing; empty everything → `false`.
- [ ] Implement; run; commit.

### Task 3: Credentials section replaces Awards + Trust & Thinking

**Files:** create `src/components/sections/credentials/{CredentialsSection,AwardCards,RecommendationCards,CertificationList,WritingList}.tsx`
+ `CredentialsSection.test.tsx`; delete `RecognitionSection.tsx`, `trust/*`; modify `src/data/portfolio.ts` (remove `trustPlaceholders`),
`src/types/portfolio.ts` (remove `TrustPlaceholder`).

- [ ] Tests first (replace the placeholder tests — the requirement changed): with real awards only → renders Awards, no "coming soon"/"pending"
  text, no Recommendations/Writing headings; with a verified testimonial → Recommendations appear with the quote; a `pending` testimonial and an
  unpublished post never render; a certification renders name + issuer + year; with **nothing** → renders null.
- [ ] Implement (reuse award card markup and the real testimonial/writing row markup); commit.

### Task 4: Hero — headline, facts line, honest metrics, no duplicated name

**Files:** modify `HeroSection.tsx`, `HeroMetrics.tsx`, `ProfileCard.tsx`, `HeroSection.test.tsx`; create `HeroFacts.tsx` (+ test).

- [ ] Tests first: hero shows `profile.headline`; facts line shows location, `workAuthorization`, availability, and **no date text unless
  `availableFrom` is set**; metrics = `{independent live systems} + {total projects} + {top MediFlow-free proof}` derived from data (labels
  "independent systems, live", "projects incl. academic"); the old rotator text is gone.
- [ ] Implement; the profile card header shows the role (`heading`/`subheading` props, defaulting to name/title) instead of repeating the name.

### Task 5: Work section — recruiter strip and full gallery

**Files:** create `FlagshipStrip.tsx` (+ test); modify `ProjectsSection.tsx`.

- [ ] Tests first: strip renders exactly the projects with `status === "Independent Project"`; each card shows `metrics[0]` value+label, a link to
  `liveUrl`, a "Case study" button that calls `onOpen(project)`, a repo link only when `repositoryUrl` exists; "Also built" lists every other
  project and opens the modal; no card for a project without a metric invents one.
- [ ] `ProjectsSection({ variant })`: `strip` renders `FlagshipStrip` + `FullPortfolioCue`, `gallery` renders today's layout; modal + deep link unchanged.

### Task 6: Skills list, Experience label, numbers, résumé tools, deletions

**Files:** modify `CapabilitiesSection.tsx`, `JourneySection.tsx`, `AboutSection.tsx`, `ContactSection.tsx`, `ResumeSection.tsx`,
`ProjectsSection.tsx`; delete `WhatIDoSection.tsx`, `SkillConstellation.tsx`; create `SectionHeader.tsx`.

- [ ] Tests first for `SectionHeader` (renders `(0N)` from the layout for the current mode, and nothing for unnumbered sections).
- [ ] Skills = grouped chips (no constellation, no scroll-scrub); Journey kicker "Experience"; Résumé → "Résumé tools" (drop the timeline and the
  skills/flagship snapshot; keep download+preview, JD matcher, hiring summary); numbers from `useSectionNumber`.

### Task 7: Compose from the layout; navigate from the layout

**Files:** modify `App.tsx`, `Navbar.tsx`, `MobileMenu.tsx`, `ScrollTelemetryRail.tsx`, `CommandPalette.tsx`, `Assistant.tsx`; create
`FullPortfolioCue.tsx` (+ test); delete `src/data/nav.ts`.

- [ ] Tests first: `FullPortfolioCue` buttons call `setMode("technical" | "business")`; Assistant `runAction` falls back (`about` → top,
  `resume` → PDF) when the target is absent.
- [ ] `App` maps `sections` to elements (lazy ones keep their `Suspense`); mode change scrolls to top; rail loses the FPS pill.

### Task 8: Visual polish

**Files:** modify `src/index.css`, `Navbar.tsx`, section wrappers.

- [ ] Override `--tracking-tighter/-tight`, `whitespace-nowrap` on nav links, `py-28 md:py-40` → `py-20 md:py-28`, hero top padding so the eyebrow clears
  the nav. Verify with before/after screenshots (desktop 1440 and mobile 390, both modes).

### Task 9: End-to-end, docs, ship

**Files:** modify `e2e/*.e2e.ts` (nav ids/labels per mode), create `e2e/layout.e2e.ts`; docs (`docs/CONTENT_TODO.md`, README).

- [ ] e2e: recruiter default renders exactly the recruiter sections and no "coming soon"; switching to Technical renders the full list and the nav
  changes; headline + facts line present; mobile menu lists the mode's nav; credentials hidden when empty (data-driven unit) and present now.
- [ ] Full gate (`tsc`, `eslint`, `vitest`, `build`, `e2e`), Lighthouse before/after, screenshots; commit in logical groups; push; verify CI + live.

## Self-review

- **Spec coverage:** decisions 1–2 → T1, T4; 3 → T2, T7; 4 → T2, T7; 5 → T5; 6 → T6; 7 → T2, T3; 8, 9 → T6; 10 → T5, T7; 11 → T4, T7, T8;
  12 → T7. Nothing without a task.
- **Placeholders:** none; where code is long it is specified by tests that pin the behaviour.
- **Type consistency:** `SectionKey` ids = DOM ids; `NavItem` shape unchanged from `data/nav.ts` so `MobileMenu` props stay valid.
