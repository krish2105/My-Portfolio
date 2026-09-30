import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { profile, PHONE_DISPLAY } from "../data/portfolio";
import { ROLE_CONFIGS, type RoleConfig, type TargetRoleId } from "./resumeRoles";

// Re-exported so existing importers (and tests) of the generator keep working.
export { ROLE_CONFIGS };
export type { RoleConfig, TargetRoleId };


/** Helper to wrap text cleanly within a maxWidth */
function wrap(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length <= maxChars) {
      current = (current + " " + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Client-side dynamic PDF generator powered by pdf-lib.
 * Compiles a pixel-perfect, tailored 1-page A4 resume in <15ms directly in the user's browser.
 */
export async function generateTailoredResumePdf(roleId: TargetRoleId): Promise<Uint8Array> {
  const config = ROLE_CONFIGS[roleId] ?? ROLE_CONFIGS["ai-engineer"];
  const doc = await PDFDocument.create();

  // A4 dimensions: 595.28 x 841.89 points
  const page = doc.addPage([595.28, 841.89]);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await doc.embedFont(StandardFonts.CourierBold);

  // Palette: Dark executive slate & emerald accents
  const cBlack = rgb(0.06, 0.08, 0.1);
  const cDark = rgb(0.18, 0.22, 0.26);
  const cMuted = rgb(0.42, 0.48, 0.54);
  const cAccent = rgb(0.0, 0.7, 0.4);
  const cLightBg = rgb(0.96, 0.98, 0.97);
  const cBorder = rgb(0.85, 0.88, 0.9);

  let y = 805;
  const left = 45;
  const right = 550;

  // Header: Name & Contact
  page.drawText(profile.name.toUpperCase(), {
    x: left,
    y,
    size: 20,
    font: fontBold,
    color: cBlack,
  });

  // Role Badge (Top right)
  const badgeText = config.shortLabel.toUpperCase();
  const badgeW = fontMono.widthOfTextAtSize(badgeText, 8.5) + 16;
  page.drawRectangle({
    x: right - badgeW,
    y: y - 2,
    width: badgeW,
    height: 18,
    color: cLightBg,
    borderColor: cAccent,
    borderWidth: 1,
  });
  page.drawText(badgeText, {
    x: right - badgeW + 8,
    y: y + 3,
    size: 8.5,
    font: fontMono,
    color: cAccent,
  });

  y -= 16;
  const contactLine = `Dubai, UAE  |  krishnamathur008@gmail.com  |  ${PHONE_DISPLAY}  |  krishnamathur-ai.vercel.app  |  github.com/krish2105`;
  page.drawText(contactLine, {
    x: left,
    y,
    size: 8.5,
    font: fontRegular,
    color: cDark,
  });

  y -= 10;
  page.drawLine({
    start: { x: left, y },
    end: { x: right, y },
    thickness: 1.2,
    color: cAccent,
  });

  // Section helper
  const drawSectionTitle = (title: string) => {
    y -= 18;
    page.drawText(title.toUpperCase(), {
      x: left,
      y,
      size: 9.5,
      font: fontBold,
      color: cAccent,
    });
    y -= 4;
    page.drawLine({
      start: { x: left, y },
      end: { x: right, y },
      thickness: 0.6,
      color: cBorder,
    });
    y -= 10;
  };

  // 1. EXECUTIVE SUMMARY
  drawSectionTitle(`Executive Summary — ${config.label}`);
  const summaryLines = wrap(config.summary, 96);
  for (const line of summaryLines) {
    page.drawText(line, {
      x: left,
      y,
      size: 8.5,
      font: fontRegular,
      color: cDark,
      lineHeight: 11,
    });
    y -= 11.5;
  }

  // 2. CORE SKILLS & METHODOLOGIES
  y -= 2;
  drawSectionTitle("Technical Competencies & Prioritized Stack");
  const skillsText = config.topSkills.join("  *  ");
  const skillLines = wrap(skillsText, 94);
  for (const sline of skillLines) {
    page.drawText(sline, {
      x: left,
      y,
      size: 8.5,
      font: fontBold,
      color: cDark,
    });
    y -= 11.5;
  }

  // 3. RELEVANT EXPERIENCE
  y -= 2;
  drawSectionTitle("Professional Experience");
  
  // Job Title line — Latest: Learners University College
  page.drawText("AI Intern  —  Learners University College (LUC)", {
    x: left,
    y,
    size: 9.5,
    font: fontBold,
    color: cBlack,
  });
  const lucDateStr = "2026 – Present  |  Dubai, UAE";
  page.drawText(lucDateStr, {
    x: right - fontRegular.widthOfTextAtSize(lucDateStr, 8),
    y,
    size: 8,
    font: fontRegular,
    color: cMuted,
  });
  y -= 11;

  page.drawText("Machine Learning Intern  —  Intelliza Solutions Pvt. Ltd.", {
    x: left,
    y,
    size: 8.5,
    font: fontBold,
    color: cDark,
  });
  const dateStr = "Feb 2025 – Aug 2025  |  Mumbai, India";
  page.drawText(dateStr, {
    x: right - fontRegular.widthOfTextAtSize(dateStr, 8),
    y,
    size: 8,
    font: fontRegular,
    color: cMuted,
  });
  y -= 11;

  for (const b of config.experienceHighlights) {
    page.drawText("*", {
      x: left + 2,
      y,
      size: 8,
      font: fontBold,
      color: cAccent,
    });
    const blines = wrap(b, 90);
    for (let i = 0; i < blines.length; i++) {
      page.drawText(blines[i], {
        x: left + 14,
        y: y - i * 10.5,
        size: 8.2,
        font: fontRegular,
        color: cDark,
      });
    }
    y -= blines.length * 10.5 + 3;
  }

  // 4. FEATURED ARCHITECTURES & FLAGSHIP PROJECTS
  y -= 2;
  drawSectionTitle("Featured Architectures & Shipped Systems");

  for (const proj of config.featuredProjects) {
    page.drawText(proj.title, {
      x: left,
      y,
      size: 9,
      font: fontBold,
      color: cBlack,
    });

    const metricW = fontMono.widthOfTextAtSize(proj.metric, 7.5);
    page.drawText(proj.metric, {
      x: right - metricW,
      y,
      size: 7.5,
      font: fontMono,
      color: cAccent,
    });
    y -= 10.5;

    page.drawText(proj.tech, {
      x: left,
      y,
      size: 8,
      font: fontMono,
      color: cMuted,
    });
    y -= 9.5;

    const pLines = wrap(proj.blurb, 94);
    for (const pl of pLines) {
      page.drawText(pl, {
        x: left,
        y,
        size: 8,
        font: fontRegular,
        color: cDark,
      });
      y -= 9.5;
    }
    y -= 4;
  }

  // 5. EDUCATION & HONORS
  y -= 2;
  drawSectionTitle("Education & Honors");

  // Masters
  page.drawText("Master of Artificial Intelligence in Business (MAIB)", {
    x: left,
    y,
    size: 9,
    font: fontBold,
    color: cBlack,
  });
  const spDate = "2025 – Present";
  page.drawText(spDate, {
    x: right - fontRegular.widthOfTextAtSize(spDate, 8),
    y,
    size: 8,
    font: fontRegular,
    color: cMuted,
  });
  y -= 10;
  page.drawText("SP Jain School of Global Management, Dubai  |  USD 9,000 Merit Scholarship  |  Class Representative", {
    x: left,
    y,
    size: 8,
    font: fontRegular,
    color: cDark,
  });
  y -= 13;

  // Bachelors
  page.drawText("B.Tech, Computer Science Engineering (AI & ML)", {
    x: left,
    y,
    size: 9,
    font: fontBold,
    color: cBlack,
  });
  const btechDate = "2021 – 2025";
  page.drawText(btechDate, {
    x: right - fontRegular.widthOfTextAtSize(btechDate, 8),
    y,
    size: 8,
    font: fontRegular,
    color: cMuted,
  });
  y -= 10;
  page.drawText("Manipal University Jaipur  |  Student Excellence Award (Highest academic rank in AI & ML cohort)", {
    x: left,
    y,
    size: 8,
    font: fontRegular,
    color: cDark,
  });

  return await doc.save();
}
