/**
 * Regenerates the self-hosted résumé PDF at public/resume/Krishna_Mathur_Resume.pdf.
 *
 * Run via `npm run resume:build`. This is the ONLY supported way to update
 * the résumé — never hand-edit the PDF in another tool, or it will silently
 * drift from portfolio.ts again (see docs/LAUNCH_CHECKLIST.md "Before every
 * deploy").
 *
 * Architecture: project facts (titles, tech, links, metrics, status) are
 * pulled live from src/data/portfolio.ts — the repo's single source of
 * truth — so adding/editing a project there and re-running this script is
 * enough to keep the résumé in sync. Résumé-only framing (target role,
 * visa line, internship/leadership bullets, curated project blurbs,
 * skills groupings) lives in scripts/resume-content.ts. Styling (colors,
 * fonts) mirrors docs/DESIGN_SYSTEM.md's dark "AI Command Center" tokens.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { profile, recognition, projects, PHONE_DISPLAY } from "../src/data/portfolio";
import {
  resumeTargetRole,
  resumeLocationLine,
  resumeSummary,
  resumeExperience,
  resumeLeadership,
  resumeEducation,
  resumeSkillGroups,
  resumePursuing,
  resumeProjectBlurb,
} from "./resume-content";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_PATH = resolve(ROOT, "public/resume/Krishna_Mathur_Resume.pdf");
const SITE = "https://krishnamathur-ai.vercel.app";
const EMAIL = "krishnamathur008@gmail.com";
const LINKEDIN = "linkedin.com/in/krishnamathurmay";
const GITHUB = "github.com/krish2105";

/* ── Design tokens (docs/DESIGN_SYSTEM.md, dark theme) ───────────────── */
const hex = (h: string) => {
  const n = parseInt(h.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};
const COLOR = {
  bg: hex("#050505"),
  panel: hex("#0c0c0f"),
  text: hex("#edf5fa"),
  text2: hex("#a0adba"),
  text3: hex("#7e8c9a"),
  accent: hex("#00ff94"),
  border: hex("#2a2f35"),
};

const PAGE = { width: 595.28, height: 841.89 }; // A4
const MARGIN = { top: 54, bottom: 44, left: 50, right: 50 };
const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;

async function loadFonts(doc: PDFDocument) {
  doc.registerFontkit(fontkit);
  // scripts/resume-fonts/*.ttf are prebuilt from public/fonts/*.woff2: instantiated to a
  // single static weight and stripped of GSUB/GPOS/GDEF. Embedding the raw variable woff2
  // files directly triggers a pdf-lib/fontkit bug where certain glyphs (parens, "fi"/"ffi"
  // pairs, "@") silently disappear — confirmed by rendering test PDFs with pymupdf. If the
  // site's source fonts in public/fonts/ ever change, regenerate these with:
  //   python3 -c "from fontTools.ttLib import TTFont; from fontTools.varLib.instancer import instantiateVariableFont; ..."
  // (strip GSUB/GPOS/GDEF/morx/feat after instantiating each weight — see git history of
  // this file for the exact one-off script used).
  const read = (p: string) => readFileSync(resolve(ROOT, "scripts/resume-fonts", p));
  return {
    display: await doc.embedFont(read("kanit-900.ttf")), // Kanit-Black — name/hero
    heading: await doc.embedFont(read("kanit-700.ttf")), // Kanit-Bold — section/project titles
    body: await doc.embedFont(read("inter-regular.ttf")), // Inter — body copy
    mono: await doc.embedFont(read("jetbrains-mono-regular.ttf")), // JetBrains Mono — kickers/meta
  };
}
type Fonts = Awaited<ReturnType<typeof loadFonts>>;

/** Greedy word-wrap using real glyph measurement, not a character-count guess. */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Page/cursor manager: fills each new page with the dark background,
 * tracks the write cursor, and starts a fresh page when content overflows
 * rather than silently clipping. */
class Layout {
  doc: PDFDocument;
  fonts: Fonts;
  page!: PDFPage;
  y = 0;
  pageNum = 0;

  constructor(doc: PDFDocument, fonts: Fonts) {
    this.doc = doc;
    this.fonts = fonts;
  }

  newPage() {
    this.page = this.doc.addPage([PAGE.width, PAGE.height]);
    this.page.drawRectangle({ x: 0, y: 0, width: PAGE.width, height: PAGE.height, color: COLOR.bg });
    this.y = PAGE.height - MARGIN.top;
    this.pageNum += 1;
    if (this.pageNum > 1) {
      this.page.drawText("KRISHNA MATHUR — RÉSUMÉ", {
        x: MARGIN.left,
        y: PAGE.height - 30,
        size: 7.5,
        font: this.fonts.mono,
        color: COLOR.text3,
      });
    }
    this.page.drawText(String(this.pageNum), {
      x: PAGE.width - MARGIN.right - this.fonts.mono.widthOfTextAtSize(String(this.pageNum), 8),
      y: MARGIN.bottom - 20,
      size: 8,
      font: this.fonts.mono,
      color: COLOR.text3,
    });
  }

  ensureSpace(height: number) {
    if (this.y - height < MARGIN.bottom) this.newPage();
  }

  text(str: string, opts: { x?: number; size: number; font: PDFFont; color: ReturnType<typeof rgb>; gap?: number }) {
    const x = opts.x ?? MARGIN.left;
    this.ensureSpace(opts.size);
    this.page.drawText(str, { x, y: this.y - opts.size, size: opts.size, font: opts.font, color: opts.color });
    this.y -= opts.size + (opts.gap ?? 0);
  }

  paragraph(str: string, opts: { x?: number; width?: number; size: number; font: PDFFont; color: ReturnType<typeof rgb>; lineHeight: number; gap?: number }) {
    const x = opts.x ?? MARGIN.left;
    const width = opts.width ?? CONTENT_WIDTH;
    const lines = wrapText(str, opts.font, opts.size, width);
    for (const line of lines) {
      this.ensureSpace(opts.lineHeight);
      this.page.drawText(line, { x, y: this.y - opts.size, size: opts.size, font: opts.font, color: opts.color });
      this.y -= opts.lineHeight;
    }
    this.y -= opts.gap ?? 0;
  }

  bullet(str: string, opts: { size: number; font: PDFFont; color: ReturnType<typeof rgb>; lineHeight: number }) {
    const indent = 12;
    const width = CONTENT_WIDTH - indent;
    const lines = wrapText(str, opts.font, opts.size, width);
    lines.forEach((line, i) => {
      this.ensureSpace(opts.lineHeight);
      if (i === 0) {
        this.page.drawText("–", { x: MARGIN.left, y: this.y - opts.size, size: opts.size, font: opts.font, color: COLOR.accent });
      }
      this.page.drawText(line, { x: MARGIN.left + indent, y: this.y - opts.size, size: opts.size, font: opts.font, color: opts.color });
      this.y -= opts.lineHeight;
    });
  }

  rule(gapBefore = 0, gapAfter = 10, color = COLOR.border, thickness = 0.75) {
    this.y -= gapBefore;
    this.ensureSpace(thickness);
    this.page.drawLine({
      start: { x: MARGIN.left, y: this.y },
      end: { x: PAGE.width - MARGIN.right, y: this.y },
      thickness,
      color,
    });
    this.y -= gapAfter;
  }

  kicker(label: string) {
    this.ensureSpace(20);
    this.y -= 6;
    this.text(label.toUpperCase(), { size: 9.5, font: this.fonts.mono, color: COLOR.accent, gap: 8 });
  }
}

function formatMetric(m?: { label: string; value: string }) {
  return m ? ` (${m.value})` : "";
}

async function main() {
  const doc = await PDFDocument.create();
  doc.setTitle(`${profile.name} — Résumé`);
  doc.setAuthor(profile.name);
  doc.setSubject(resumeTargetRole);
  const fonts = await loadFonts(doc);
  const L = new Layout(doc, fonts);
  L.newPage();

  /* ── Header ── */
  L.text(profile.name.toUpperCase(), { size: 27, font: fonts.display, color: COLOR.text, gap: 4 });
  L.text(`${resumeTargetRole} — ${resumeLocationLine}`, { size: 10.5, font: fonts.body, color: COLOR.text2, gap: 6 });
  const contactLine = [EMAIL, PHONE_DISPLAY, LINKEDIN, GITHUB, SITE.replace("https://", "")].join("   ·   ");
  L.paragraph(contactLine, { size: 8, font: fonts.mono, color: COLOR.accent, lineHeight: 11, gap: 4 });
  L.rule(6, 14, COLOR.accent, 1);

  /* ── Summary ── */
  L.kicker("Summary");
  L.paragraph(resumeSummary, { size: 9.5, font: fonts.body, color: COLOR.text2, lineHeight: 13, gap: 10 });

  /* ── Experience ── */
  L.kicker("Experience");
  for (const entry of resumeExperience) {
    L.text(entry.title, { size: 11.5, font: fonts.heading, color: COLOR.text, gap: 2 });
    L.text(`${entry.org} — ${entry.location} · ${entry.date}`, { size: 8.5, font: fonts.mono, color: COLOR.text3, gap: 5 });
    for (const b of entry.bullets) L.bullet(b, { size: 9, font: fonts.body, color: COLOR.text2, lineHeight: 12.5 });
    L.y -= 8;
  }

  /* ── Leadership ── */
  L.kicker("Leadership");
  for (const entry of resumeLeadership) {
    L.text(entry.title, { size: 11.5, font: fonts.heading, color: COLOR.text, gap: 2 });
    L.text(`${entry.org} — ${entry.location} · ${entry.date}`, { size: 8.5, font: fonts.mono, color: COLOR.text3, gap: 5 });
    for (const b of entry.bullets) L.bullet(b, { size: 9, font: fonts.body, color: COLOR.text2, lineHeight: 12.5 });
    L.y -= 8;
  }

  /* ── Key Projects ── */
  L.kicker("Key Projects");
  const flagshipProjects = projects.filter((p) => p.status === "Independent Project");
  for (const p of flagshipProjects) {
    const blurb = resumeProjectBlurb[p.id];
    if (!blurb) {
      console.warn(
        `[generate-resume] No curated blurb for "${p.id}" in scripts/resume-content.ts — falling back to an auto-generated sentence. Add one for better résumé prose.`,
      );
    }
    const fallback = `${p.valueProp ?? p.description}${formatMetric(p.metrics?.[0])}`;
    L.text(p.shortTitle, { size: 11.5, font: fonts.heading, color: COLOR.accent, gap: 2 });
    L.text(p.category, { size: 8, font: fonts.mono, color: COLOR.text3, gap: 5 });
    L.bullet(blurb ?? fallback, { size: 9, font: fonts.body, color: COLOR.text2, lineHeight: 12.5 });
    L.y -= 8;
  }

  /* ── Additional Projects (one-liners, data-driven) ── */
  const otherProjects = projects.filter((p) => p.status !== "Independent Project");
  if (otherProjects.length > 0) {
    L.kicker("Additional Projects");
    for (const p of otherProjects) {
      const line = `${p.shortTitle} — ${p.valueProp ?? p.description}${formatMetric(p.metrics?.[0])}`;
      L.bullet(line, { size: 9, font: fonts.body, color: COLOR.text2, lineHeight: 12.5 });
    }
    L.y -= 8;
  }

  /* ── Education ── */
  L.kicker("Education");
  for (const entry of resumeEducation) {
    L.text(entry.title, { size: 11.5, font: fonts.heading, color: COLOR.text, gap: 2 });
    L.text(`${entry.org} · ${entry.date}`, { size: 8.5, font: fonts.mono, color: COLOR.text3, gap: 5 });
    L.paragraph(entry.detail, { size: 9, font: fonts.body, color: COLOR.text2, lineHeight: 12.5, gap: 8 });
  }

  /* ── Technical Skills ── */
  L.kicker("Technical Skills");
  for (const group of resumeSkillGroups) {
    L.text(group.label, { size: 9.5, font: fonts.heading, color: COLOR.text, gap: 3 });
    L.paragraph(group.items.join("  ·  "), { size: 8.75, font: fonts.body, color: COLOR.text2, lineHeight: 12, gap: 8 });
  }

  /* ── Currently Pursuing ── */
  L.kicker("Currently Pursuing");
  L.paragraph(resumePursuing.join("  ·  "), { size: 9, font: fonts.body, color: COLOR.text2, lineHeight: 12.5, gap: 6 });

  /* ── Footer note (last page) ── */
  L.rule(10, 6);
  L.text(`Generated from ${SITE} · portfolio.ts — regenerate via \`npm run resume:build\`.`, {
    size: 7.5,
    font: fonts.mono,
    color: COLOR.text3,
  });

  /* Recognition, appended as a compact line if space allows on the last page. */
  if (recognition.length > 0) {
    L.y -= 4;
    const awards = recognition.map((r) => `${r.title} (${r.year})`).join("  ·  ");
    L.paragraph(`Awards: ${awards}`, { size: 7.5, font: fonts.mono, color: COLOR.text3, lineHeight: 10 });
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  const bytes = await doc.save();
  writeFileSync(OUT_PATH, bytes);
  console.log(`[generate-resume] Wrote ${OUT_PATH} (${doc.getPageCount()} page${doc.getPageCount() > 1 ? "s" : ""}, ${(bytes.length / 1024).toFixed(0)} KB)`);
  console.log(`[generate-resume] Flagship projects included: ${flagshipProjects.map((p) => p.shortTitle).join(", ")}`);
  console.log(`[generate-resume] Additional projects included: ${otherProjects.map((p) => p.shortTitle).join(", ")}`);
}

main().catch((err) => {
  console.error("[generate-resume] Failed:", err);
  process.exit(1);
});
