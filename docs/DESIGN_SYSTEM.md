# Design System — "AI Command Center"

This documents the visual/interaction language that already exists in the
codebase (`src/index.css`, `Reveal.tsx`, `MagneticButton.tsx`, etc.). It's a
reference for staying consistent when adding new sections, not a spec for a
redesign.

## Brand concept

**"AI Command Center"**: a dark AI-lab aesthetic — near-black surfaces, one
neon signal accent, data-as-texture (grain, aurora, telemetry-style mono
labels). The site should feel like an instrumented system a visitor can
*query* (command palette, Copilot, view modes), not a static brochure.

## Color tokens

Defined as CSS custom properties in `src/index.css`, themed via
`[data-theme="dark"|"light"]` on `<html>`, with a `prefers-contrast: high`
override layer.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#050505` | `#f5f7fa` | Page background |
| `--bg-2` | `#0a0a0a` | `#eef2f6` | Secondary background |
| `--panel` / `--panel-2` | `#0a0a0a` / `#0c0c0f` | `#ffffff` / `#eef2f6` | Cards, modals |
| `--text` | `#edf5fa` | `#0c1218` | Primary text |
| `--text-2` | `#a0adba` | `#46535f` | Secondary text |
| `--text-3` | `#7e8c9a` | `#5f6c78` | Tertiary/meta text |
| `--accent` | `#00ff94` | `#007a48` | Signal color — CTAs, active states, key metrics |
| `--accent-dim` / `--accent-bright` | `#00b368` / `#6bffc0` | `#006238` / — | Accent variants |
| `--border` / `--border-strong` | translucent `rgba(215,226,234,…)` | translucent `rgba(12,18,24,…)` | Hairlines, card borders |

**Rule: accent = signal, use sparingly.** `--accent` marks the thing that
matters most on screen (a live metric, the active nav item, a CTA) — it is
not a general highlight color. Most UI stays in the text/border greyscale.

**Contrast**: dark-mode `--accent` (`#00FF94`) is bright enough for large
text/icons on `--bg`, but body-sized accent text is avoided; light mode uses
a darker `#007a48` for the same role specifically to clear ~5.1:1 contrast
for small text (see the comment above `--accent` in `index.css`). The
`prefers-contrast: high` media query further flattens everything to
near-pure black/white.

## Typography

- **Display**: `Kanit` (900 weight) for hero/section headlines — bold,
  condensed, high-impact. `Archivo Variable` (`--font-kinetic`) for
  variable-weight "kinetic" hero name animation.
- **Body**: `Inter`, self-hosted.
- **Mono**: `JetBrains Mono` — used exclusively for "telemetry" language:
  kickers (`.kicker`), status badges, metric labels, command-palette hints.
  Mono = "this is data/system output," never body copy.
- All three are self-hosted (`public/fonts/`) and preloaded in `index.html`
  — no third-party font requests.

## Spacing & layout

- Horizontal rhythm: `px-6 md:px-[8vw]` on every section — a consistent
  gutter that scales with viewport instead of a fixed max-width container.
- Vertical rhythm: sections use `py-20`–`py-40` depending on content density;
  flagship sections (Hero, Projects) break this for full-bleed treatment.
- Cards/bento tiles sit on a shared `gap-px` + `bg-[var(--border)]` grid
  trick (hairline borders form from the gap, not individual card borders) —
  see `CapabilitiesSection`, `ProjectModal`'s telemetry/metrics grids.

## Motion

- **Signature ease**: `--ease: cubic-bezier(0.16, 1, 0.3, 1)` — used on
  nearly every Motion `transition`. Don't introduce a second easing curve
  without a reason.
- **Reveal patterns**: `Reveal.tsx` exports `RevealText` (masked word/line
  reveal) and `Rise` (fade + translate-y on scroll into view via
  `whileInView`). Use these instead of ad-hoc `motion.div` fade-ins for
  consistency.
- **Scroll-scrubbed vs. reveal-once**: `CapabilitiesSection` and
  `ProjectsSection`'s horizontal gallery are continuously driven by
  `useScroll`/`useTransform` (progress-linked, not a one-shot trigger);
  most other sections use `whileInView` (`Rise`) for a simpler one-shot
  entrance. Pick scroll-scrubbing only when the scroll position itself is
  meaningful (pinned galleries, capability cards staggering in sequence).
- **Reduced motion**: every custom animation (constellation, hover previews,
  cursor, marquee) checks `useMediaQuery("(prefers-reduced-motion: reduce)")`
  and either skips the animation or substitutes an instant/static state —
  never just "make it faster." A global `prefers-reduced-motion` media query
  in `index.css` also disables the WebGL hero, grain and aurora entirely.

## Interaction patterns

- **Magnetic buttons** (`MagneticButton.tsx`) — primary CTAs pull toward the
  cursor within a small radius; disabled under reduced motion.
- **Spotlight cards** — `ProjectCard`'s pointer-tracked radial gradient
  (CSS custom properties `--mx`/`--my` set on pointermove, no React
  re-render) — reuse this CSS-var pattern for any future hover-glow, it's
  the cheapest way to do pointer-reactive visuals.
- **Cursor states** — `data-cursor="View"|"Drag"|"Copy"|...` attributes
  drive the custom cursor's label; add one whenever a custom interaction
  needs a hint beyond the default pointer.
- **Command palette / Copilot / view-mode toggle** — the three "intelligent
  system" primitives. Any new global action should register as a command
  palette entry (`CommandPalette.tsx`) so the site stays fully
  keyboard/search-driven, not just mouse-driven.
- **Real-node interactive maps** (`SkillConstellation`, `ProjectSystemMap`)
  — plain HTML buttons + a decorative `aria-hidden` SVG for connector lines,
  not canvas/WebGL. Every node is independently focusable/keyboard-operable;
  the SVG never carries information a screen reader needs.

## Accessibility

- `.focus-visible-ring` utility for consistent keyboard focus rings — apply
  to every custom interactive element that isn't a native `button`/`a` with
  a browser-default outline already fine.
- Modals (`ProjectModal`, `CommandPalette`, `Assistant` panel) implement
  focus trap + `Escape`-to-close + body scroll lock + focus restoration on
  close — copy this pattern for any new modal rather than re-deriving it.
- Every pointer-only interaction (drag galleries, hover previews, magnetic
  buttons) has a keyboard/touch equivalent (arrow-key-free but tabbable
  controls, long-press on touch instead of hover, native scroll-snap
  fallback for swipe galleries).
- axe runs in CI against home, `/work/:slug`, and `/uses` — 0 violations is
  the bar; don't ship a new interactive section without checking it locally
  first (`npm run test` covers logic; axe covers markup/contrast/ARIA).

## Component style

- **Cards**: `rounded-2xl border border-[var(--border)] bg-[var(--panel)]`,
  hover state brightens the border to `border-[#00FF94]/30–50` rather than
  changing the fill — keeps the palette restrained.
- **Chips/pills**: `rounded-full border px-3 py-1 text-xs`, active/selected
  state = accent border + `bg-[#00FF94]/10` tint, never a solid accent fill
  except on primary CTA buttons.
- **Telemetry grids** (`ProjectTelemetry`, metrics `<dl>`): `grid gap-px
  bg-[var(--border)]` with each cell `bg-[var(--panel)] p-4` — mono
  uppercase label (`dt`) over a larger value (`dd`).
- **Modals**: `rounded-2xl` panel, `ring-1 ring-[#00FF94]/10` for a subtle
  glow, `shadow-[0_40px_120px_-24px_rgba(0,0,0,0.9)]` for depth.

## Empty-state design

Honesty is a design constraint, not just a data rule (see the project's
"fabricate nothing" principle). Empty states are never blank or apologetic:

- **Trust & Thinking placeholders** (`TrustCards`/`WritingCards`): dashed
  border (`border-dashed border-[var(--border-strong)]`), a muted icon, a
  specific label ("Pending verified recommendation," not "Coming soon"),
  and a real CTA (mailto/LinkedIn link) — styled as an intentional "slot,"
  not a broken card.
- **Generated project covers** (`ProjectCover`): a deterministic,
  on-brand "concept card" (category icon + tech chips + faint grid) instead
  of a grey placeholder box, for the 5 projects without real screenshots.
  Once a real screenshot lands, it fully replaces the generated cover — no
  side-by-side "concept vs real" labeling needed.

## Screenshot / card art direction

- Real screenshots: framed edge-to-edge in the card/gallery, `object-cover
  object-top` (crops from the top, since dashboards put key info near the
  top).
- Generated covers: the honest interim (see above) — restrained, not a
  cheap-looking placeholder.
- OG images (`public/og/<id>.png`): currently branded generated cards for
  all 8 projects (title + accent treatment), not screenshots — swap to
  screenshot-based OG once a project has a real screenshot (tracked in
  `docs/CONTENT_TODO.md`).

## Mobile rules (375px baseline)

- Swipe galleries use native CSS scroll-snap (`snap-x snap-mandatory`), not
  a gesture library — robust and accessible by default.
- The Copilot renders as a bottom-sheet-style panel (`fixed bottom-20
  right-3 ... max-w-sm`) rather than a full-screen takeover.
- Desktop-only enhancements (`SkillConstellation`) use `hidden lg:block` —
  mobile always gets the complete, accessible fallback content (the full
  skills grid), never a stripped-down mobile-only view.
- Touch targets stay ≥44px; long-press replaces hover for the project-card
  preview on touch devices.

## Command-center visual language

- Mono, uppercase, letter-spaced labels (`.kicker`, telemetry `dt`, status
  badges) signal "this is instrumented/live data."
- Status dots (`h-2 w-2 rounded-full bg-[#00FF94] animate-pulse` — see the
  "Open to opportunities" badge) for anything representing current state.
- Section kickers are numbered (`(01)`, `(02)`, …) like a dashboard's
  panel index, not decorative — keep new sections in this numbering scheme
  (see the map in `App.tsx`'s section order) when inserting a new section.
- Subtle grid/scanline motifs (`ProjectCover`'s faint grid overlay,
  `.grain` film-grain texture) are the closest thing to a literal
  "command-center" texture — reuse sparingly, they're meant to be felt more
  than seen.
