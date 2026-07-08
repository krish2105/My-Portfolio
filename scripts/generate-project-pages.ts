/**
 * Post-build step: generates a real, crawlable static HTML page for every
 * project at dist/work/<slug>/index.html.
 *
 * Why: this is a client-only SPA (no SSR framework). The in-app experience
 * already deep-links case studies via History API (/work/:slug -> modal, see
 * ProjectsSection.tsx), which is great for in-app sharing but means a crawler
 * or link-preview bot hitting /work/:slug directly only ever sees the
 * site-wide <head> — no per-project title/description/OG image.
 *
 * This script closes that gap WITHOUT introducing react-router or a full SSG
 * framework: it clones the already-built dist/index.html (same JS/CSS
 * references, same fonts, same theme-init script) and swaps in per-project
 * <title>/meta/OG/canonical + a CreativeWork + BreadcrumbList JSON-LD block.
 * Vercel serves these literal static files in preference to the SPA rewrite,
 * so a direct visit gets correct SEO/social-preview metadata immediately;
 * the bundled app then hydrates and the existing pathname-sync effect in
 * ProjectsSection opens the matching case-study modal automatically.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../src/data/portfolio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE = "https://krishnamathur-ai.vercel.app";

const templatePath = resolve(DIST, "index.html");
if (!existsSync(templatePath)) {
  console.error("[generate-project-pages] dist/index.html not found — run `vite build` first.");
  process.exit(1);
}
const template = readFileSync(templatePath, "utf8");

/** Replace a substring exactly once; warns (does not throw) if not found, so a future
 * edit to index.html's copy doesn't silently corrupt output — it just no-ops that tag. */
const replaceOnce = (html: string, search: string, replacement: string, label: string): string => {
  if (!html.includes(search)) {
    console.warn(`[generate-project-pages] template anchor not found for "${label}" — skipping.`);
    return html;
  }
  return html.replace(search, replacement);
};

/** Same as replaceOnce, but replaces every occurrence — for values shared
 * verbatim across multiple tags (e.g. og:title and twitter:title use the
 * exact same site-wide string, so a single-occurrence replace would only
 * ever update the first one and silently leave the other generic). */
const replaceAll = (html: string, search: string, replacement: string, label: string): string => {
  if (!html.includes(search)) {
    console.warn(`[generate-project-pages] template anchor not found for "${label}" — skipping.`);
    return html;
  }
  return html.split(search).join(replacement);
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let generated = 0;

for (const project of projects) {
  const url = `${SITE}/work/${project.id}`;
  const pageTitle = `${project.shortTitle} — Krishna Mathur`;
  const description = project.description;
  const ogImage = `${SITE}/og/${project.id}.png`;

  let html = template;

  html = replaceOnce(
    html,
    "<title>Krishna Mathur — AI Developer building decision tools from data, language & workflows</title>",
    `<title>${escapeHtml(pageTitle)}</title>`,
    "title"
  );

  html = replaceOnce(
    html,
    'content="Krishna Mathur builds practical AI, ML and GenAI systems — fraud detection, resource optimisation, NL-to-SQL and analytics dashboards — that turn messy data into decisions. Master of AI in Business, Dubai."',
    `content="${escapeHtml(description)}"`,
    "meta description"
  );

  html = replaceOnce(
    html,
    'href="https://krishnamathur-ai.vercel.app/"',
    `href="${url}"`,
    "canonical"
  );

  // og:title and twitter:title share the exact same site-wide string, so
  // this must replace BOTH occurrences (see replaceAll's doc comment).
  html = replaceAll(
    html,
    'content="Krishna Mathur — AI Developer building decision tools from data, language & workflows"',
    `content="${escapeHtml(pageTitle)}"`,
    "og:title / twitter:title"
  );

  // Likewise og:description and twitter:description share the same string.
  html = replaceAll(
    html,
    'content="AI developer building decision tools from messy data, language and business workflows. Master of AI in Business, Dubai."',
    `content="${escapeHtml(description)}"`,
    "og:description / twitter:description"
  );

  html = replaceOnce(
    html,
    'content="https://krishnamathur-ai.vercel.app/"',
    `content="${url}"`,
    "og:url"
  );

  html = html.replace(/content="https:\/\/krishnamathur-ai\.vercel\.app\/og-image\.png"/g, `content="${ogImage}"`);

  // Insert per-project structured data (CreativeWork + BreadcrumbList) just before </head>.
  const jsonLd = `
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CreativeWork",
            "name": ${JSON.stringify(project.title)},
            "description": ${JSON.stringify(description)},
            "url": ${JSON.stringify(url)},
            "image": ${JSON.stringify(ogImage)},
            "creator": { "@type": "Person", "name": "Krishna Mathur", "url": "${SITE}/" },
            "about": ${JSON.stringify(project.category)},
            "abstract": ${JSON.stringify(project.valueProp ?? project.description)},
            "keywords": ${JSON.stringify(
              [...(project.tags || []), ...(project.technologies || [])].join(", ")
            )}
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Krishna Mathur", "item": "${SITE}/" },
              { "@type": "ListItem", "position": 2, "name": "Work", "item": "${SITE}/#projects" },
              { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(project.shortTitle)}, "item": ${JSON.stringify(url)} }
            ]
          }
        ]
      }
    </script>
  </head>`;
  html = html.replace("</head>", jsonLd);

  // A small static content snapshot inside #root's initial markup — invisible once the SPA
  // hydrates (React replaces it), but gives non-JS crawlers/readers real text immediately.
  const staticSnapshot = `<div id="root"><noscript><main style="font-family:system-ui,sans-serif;background:#050505;color:#edf5fa;padding:2rem;max-width:640px;margin:0 auto;">
      <h1>${escapeHtml(project.title)}</h1>
      <p>${escapeHtml(description)}</p>
      <p><strong>Stack:</strong> ${escapeHtml((project.technologies || []).join(", "))}</p>
      <p><a href="${SITE}/" style="color:#00ff94;">View the full portfolio</a></p>
    </main></noscript></div>`;
  html = html.replace('<div id="root"></div>', staticSnapshot);

  const outDir = resolve(DIST, "work", project.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  generated++;
}

console.log(`[generate-project-pages] Generated ${generated}/${projects.length} static case-study pages.`);

// Fail the build loudly if data drifted (e.g. a project id renamed) and we generated fewer pages than expected.
if (generated !== projects.length) {
  console.error("[generate-project-pages] Mismatch between projects and generated pages.");
  process.exit(1);
}
