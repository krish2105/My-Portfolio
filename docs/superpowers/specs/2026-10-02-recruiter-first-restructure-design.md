# Recruiter-first restructure (A + C) — design

Approved by the owner on 2026-10-02 ("approved, go ahead with the restructure e2e"). Approach **A + C**: a recruiter-first
information architecture, with the existing audience toggle (Recruiter / Technical / Business) deciding how much of it shows.

## Problem (measured, not assumed)

The strict recruiter/portfolio audit scored the site **6.7 / 10 as a recruiter funnel** vs 8.4 as an engineering artifact. The gaps were
content and structure, not craft:

- Positioning 5.5/10 — the hero rotated four titles, `<title>` said "AI Developer", the résumé said "AI/ML Analyst"; no availability or
  visa line above the fold.
- Social proof 2/10 — the "Trust & Thinking" section was a full screen of empty "coming soon" cards.
- Time to signal 5.5/10 — a ~22,000 px page of 12 sections (including filler: "What I Do", an 80-tag skills constellation, skills
  repeated again in the Résumé section, education/experience shown twice).
- Visual sloppiness — letters collided in the display type (`tracking-tighter` on a heavy face), the nav wrapped to two lines at 1440 px,
  the hero eyebrow touched the nav bar, the hero name appeared twice, a "60 FPS" gimmick, large dead gaps.

## Decisions

1. **One role label: "AI Engineer — GenAI, RAG & agents."** Source of truth is `profile.headline` / `profile.targetRole`. It drives the
   hero, `<title>`, meta/OG/Twitter, JSON-LD `jobTitle`, footer, assistant copy and the résumé's target role. The rotating `titles` go away.
2. **Facts line under the headline:** location · work authorisation (`profile.workAuthorization`, text taken verbatim from the
   résumé: "UAE student visa (transferable)") · availability. `profile.availableFrom` is optional and **omitted until the owner supplies a
   date** — nothing is invented.
3. **A single layout table decides what renders** (`src/lib/pageLayout.ts`): which sections appear, in what order, per mode. The same table
   produces the nav, the section kicker numbers "(0N)", the side-rail index and the command palette — so they cannot disagree.
4. **Recruiter (default): 6 sections** — Hero → Work (flagship proof strip) → Experience → Skills → Credentials → Contact.
   **Technical & Business: the full page** — Hero → Work (full gallery) → Snapshot → Marquee → About → Experience → Skills → GitHub → Labs →
   Credentials → Résumé tools → Contact.
5. **Work / proof strip (recruiter):** the four *independent* flagships, each with one outcome number from its own `metrics[0]`, a live
   demo link (with the live-status badge), a case-study button and a code link where public. The other five projects appear as a compact
   "Also built" list that opens the same case-study modal. `ProjectsSection` stays the owner of the `/work/:slug` deep-link + modal logic.
6. **Experience:** the Journey section is the one timeline (roles + education), relabelled "Experience"; the Résumé section no longer
   repeats it.
7. **Credentials (replaces Awards + Trust & Thinking):** driven by data — awards (`recognition`), verified recommendations
   (`testimonials`), `certifications` (new, empty), published `writing`. **A group renders only if it has real items; the whole section and
   its nav entry disappear if none do.** No placeholder cards.
8. **Skills:** one grouped list (capability groups with chips, "Core" highlighted) for every mode; the constellation and scroll-scrubbed
   cards go.
9. **Cut:** "What I Do". The Résumé section becomes "Résumé tools" (role-tailored PDF + preview, job-description matcher, hiring-summary
   copy) and appears in the full modes only; the PDF stays one click away in the hero and Contact in every mode.
10. **Recruiter mode is discoverable, not a dead end:** a cue at the end of the Work section offers the Technical / Business full views;
    changing mode scrolls to the top (the page below it changes).
11. **Visual fixes:** global tracking override for the display face, `whitespace-nowrap` nav links, tighter section padding, hero top
    spacing so the eyebrow clears the nav, no duplicated name in the profile card, the "60 FPS" pill removed (progress bar and dots stay).
12. **Assistant/palette degrade gracefully:** an action that targets a section absent in the current mode falls back (`about` → top,
    `resume` → the PDF download) instead of silently doing nothing.

## Non-goals

No new libraries; no changes to the Journey data model; no invented testimonials, certifications, writing, dates or metrics; the GitHub
profile bio and LinkedIn are the owner's (called out, not changed); the grain overlay and backdrop blurs stay (unproven cost).

## Quality gates

Every behavioural change is test-first (unit for the pure layout/credentials logic, component tests for the new sections, e2e for the
mode switching and nav). Existing gates stay green: types, lint, unit, build, the e2e suite, axe, CSP, the Lighthouse CI thresholds.
Before/after screenshots and Lighthouse numbers are captured for the report.
