# Portfolio Roadmap — Further Enhancements

> Status: Phases **A–E complete** (modern UX, interactions, credibility, perf/PWA, shareable routes, **dark/light theme**). Lint clean, build green, deployed at https://portolio-krishna.vercel.app/. This document captures the *next* layer — optional upgrades that push from "top 1%" to "best in class," each scoped and honest (no fabricated content).

---

## Tier 1 — High impact, needs your content
These are built/quick once you provide real material; they stay hidden until then (honesty gate).

### 1. Writing / Insights section
- **Why:** "thinking in public" is a strong signal for AI roles.
- **Do:** add `writing: WritingItem[]` to `src/data/portfolio.ts` (title, blurb, date, external link) + `WritingSection.tsx`. Render only if non-empty; add to nav + ⌘K.
- **You provide:** 2–5 post links (Medium / LinkedIn / Dev.to).

### 2. Testimonials / recommendations
- **Why:** third-party proof beats self-description.
- **Do:** `testimonials: Testimonial[]` + `Testimonials.tsx` (quote, author, role, source link). Render only if provided.
- **You provide:** real LinkedIn recommendations / mentor quotes (+ author, role, link).

---

## Tier 2 — Differentiators (no extra content needed)

### 3. Real GenAI assistant (upgrade the scripted one)
- **Now:** client-side intent matcher (zero cost).
- **Upgrade:** a Vercel serverless function calling the **Claude API** with a RAG context built from `portfolio.ts` → answers any recruiter question in natural language. Keep the scripted matcher as the no-key fallback.
- **Cost:** small per-message; gate behind an env key so it degrades to scripted if unset.

### 4. Dynamic per-project OG images + true per-page SEO
- **Why:** `/work/:slug` links currently share the site-wide OG card; SPA has no per-route crawlable meta.
- **Do:** `@vercel/og` serverless route → branded OG card per project (title + accent + screenshot). Add **prerendering** (`vite-react-ssg` or a prerender plugin) so each `/work/:slug` ships static HTML with unique `<title>`/meta/OG.
- **Payoff:** rich, distinct link previews + indexable project pages.

### 5. Analytics & insight
- Add **Vercel Analytics** (page views) alongside the existing Speed Insights (CWV).
- Track key events: CTA clicks, résumé downloads, assistant opens, ⌘K usage — to learn what recruiters do.

### 6. Light-mode hero polish
- Tune the **R3F neural-graph line color** and aurora opacity per theme (currently shared) so the WebGL hero is equally striking on light.
- Optional: a subtle theme-crossfade via the **View Transitions API**.

---

## Tier 3 — Performance & platform

### 7. AVIF + responsive `srcset`
- Generate AVIF + 2–3 widths for screenshots/avatar; serve via `<picture>`/`srcset`. Marginal over current WebP (~50–120 KB) but squeezes the last bytes for slow mobile networks.

### 8. Self-hosted variable fonts
- Self-host Inter / Kanit / JetBrains Mono (`@font-face` + `preload`), removing the render-blocking Google Fonts request and improving privacy + CLS. Optionally a **variable** display font animating weight on scroll (Tier 0 kinetic-type idea).

### 9. Quality CI
- GitHub Action running `npm run lint` + `npm run build` + **Lighthouse CI** (perf/a11y/SEO budgets) on every PR, so the bar never slips.
- An **axe** accessibility pass (automated) to catch regressions.

---

## Tier 4 — Reach & polish (optional)

### 10. Booking / scheduling
- A **Cal.com** embed in the contact section so recruiters can book a call directly.

### 11. Internationalisation
- Given Dubai, an **Arabic (RTL)** locale toggle would stand out for the regional market. Sizeable (RTL layout + translations) — only if targeting GCC employers.

### 12. Résumé experience
- Inline **PDF preview** (Drive embed) behind a "Preview" disclosure alongside the download; consider an ATS-plain-text variant.

### 13. Signature flourishes
- Optional **UI sound design** (tiny ticks on ⌘K / assistant / CTA) with a mute control, off by default.
- A `/uses` or `/stack` page; a subtle **easter egg** in the command palette.

---

## Suggested sequencing
1. **Content** (you): writing links + testimonials → unlocks Tier 1 immediately.
2. **SEO depth:** dynamic OG + prerendered `/work/:slug` (Tier 2 #4) — biggest sharing/SEO win.
3. **Analytics** (#5) — start learning from real traffic.
4. **Real GenAI assistant** (#3) — the flagship "wow" once you're ready for the small API cost.
5. **Perf/CI** (Tier 3) — lock the quality bar.
6. Tier 4 as desired.

## Guardrails (unchanged)
- Never break `npm run lint` / `npm run build`; verify each feature.
- No fabricated metrics/testimonials/employers — gate on real data.
- Keep the perf budget (lazy/code-split heavy work; respect reduced-motion; pause offscreen).
- Preserve the dark identity; the light theme is a tasteful companion, not a replacement.
