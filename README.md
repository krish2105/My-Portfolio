# Krishna Mathur — Portfolio

A modern, Awwwards-style personal portfolio for **Krishna Mathur** — AI Developer, Data Analyst & GenAI Builder. Built with React 19, TypeScript and Vite, featuring smooth scrolling, a WebGL/Three.js hero, motion-driven reveals, and a fully responsive, accessible layout.

---

## 1. Overview

This is a single-page portfolio that presents Krishna's work across AI, machine learning, NLP and data analytics. It is data-driven (content lives in `src/data/portfolio.ts`), type-safe, and production-ready for any static host. Heavy visuals degrade gracefully on low-power devices and respect `prefers-reduced-motion`.

## 2. Live Demo

> **TODO:** Deploy the site (see [Deployment](#10-deployment)) and paste the live URL here.
>
> `https://<your-deployment>.vercel.app`

## 3. Preview

> **TODO:** Add a screenshot once deployed. Place it at `public/preview.png` and reference it here:
>
> `![Portfolio preview](public/preview.png)`

## 4. Features

- ⚡ **Single-page experience** with smooth, momentum-based scrolling (Lenis) and anchor navigation.
- 🎨 **Awwwards-style design** — custom cursor, grain texture, animated reveals (Motion), and a WebGL hero (Three.js / `@react-three/fiber`).
- 🧩 **Data-driven content** — projects, journey, capabilities, recognition and social links all live in `src/data/portfolio.ts`.
- 📱 **Fully responsive** with a dedicated mobile menu.
- ♿ **Accessible** — semantic HTML, skip link, keyboard-focusable controls, `aria-label`s, reduced-motion support, and an error boundary.
- 🔒 **Safe external links** (`rel="noreferrer noopener"`) and validated link helpers.
- 🚀 **SEO-ready** — meta description, Open Graph and Twitter Card tags, favicon and theme color in `index.html`.
- 📄 **One-click resume download** via a Google Drive direct-download link.

## 5. Tech Stack

| Area | Tools |
|------|-------|
| Framework | React 19, TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Animation | Motion, Lenis (smooth scroll) |
| 3D / WebGL | Three.js, `@react-three/fiber`, `@react-three/drei`, OGL |
| Icons | lucide-react, react-icons |
| Linting | ESLint (typescript-eslint, react-hooks, react-refresh) |

## 6. Folder Structure

```
Krishna_Portfolio/
├── public/                 # Static assets served as-is
│   ├── avatar.png          # Profile image
│   ├── favicon.svg
│   ├── icons.svg
│   └── logos/              # Tech-stack marquee logos
├── src/
│   ├── assets/             # (reserved for bundled assets)
│   ├── components/
│   │   ├── common/         # Button, Reveal, Cursor, SafeExternalLink, LogoLoop, ...
│   │   ├── hero/           # WebGL hero (Prism, NeuralScene, fallbacks)
│   │   ├── layout/         # Navbar, Footer, MobileMenu
│   │   ├── profile/        # ProfileCard
│   │   ├── projects/       # ProjectCard
│   │   └── sections/       # About, WhatIDo, Journey, Capabilities, Projects, Recognition, Resume, Contact
│   ├── data/
│   │   └── portfolio.ts    # ← All editable content lives here
│   ├── hooks/              # useMediaQuery, useActiveSection, useWebGLSupport
│   ├── lib/                # SmoothScroll (Lenis wrapper)
│   ├── types/
│   │   └── portfolio.ts    # Project, Skill/Capability, Journey, Recognition, SocialLinks types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html              # SEO meta, fonts, favicon
├── vite.config.ts
├── package.json
└── README.md
```

> Note: content is organized around an AI portfolio (Journey, Capabilities, Recognition) rather than the generic Education/Skills/Experience split — all of it is editable in `src/data/portfolio.ts`.

## 7. Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/krish2105/Krishna_Portfolio.git
cd Krishna_Portfolio
npm install
npm run dev
```

The dev server starts at **http://localhost:5173**.

## 8. Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server with HMR (http://localhost:5173) |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally (http://localhost:4173) |
| `npm run lint` | Run ESLint |

## 9. Build for Production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

## 10. Deployment

This is a static SPA — the build output in `dist/` can be hosted anywhere.

**Universal settings:**

| Setting | Value |
|---------|-------|
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |

### Vercel
1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Vercel auto-detects Vite. Confirm: Build = `npm run build`, Output = `dist`.
3. Deploy. (`vercel.json` is included for explicit settings.)

### Netlify
1. "Add new site" → import from Git.
2. Build command `npm run build`, publish directory `dist`.
3. Deploy. (`netlify.toml` and `public/_redirects` are included.)

### GitHub Pages
GitHub Pages serves from a sub-path (`/<repo>/`), so set a base before building:
```bash
# vite.config.ts → defineConfig({ base: '/Krishna_Portfolio/', ... })
npm run build
npx gh-pages -d dist     # or use a GitHub Actions workflow
```
> Leave `base` unset (default `/`) for Vercel/Netlify/Cloudflare, which serve from the root.

### Cloudflare Pages
1. Connect the repo in the Cloudflare Pages dashboard.
2. Framework preset: **Vite**. Build command `npm run build`, output `dist`.

## 11. Environment Variables

This project does not require environment variables by default.

The contact form uses a `mailto:` submission, so no service keys are needed. If you later wire up [EmailJS](https://www.emailjs.com/), add these to a `.env` file (and to your host's env settings):

```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

## 12. Customization Guide

Almost everything is editable from **`src/data/portfolio.ts`**:

- `profile` — name, titles, location, about statements.
- `socialLinks` — GitHub, LinkedIn, email, etc. Set a value to `""` to hide that link.
- `RESUME_DRIVE_FILE_ID` — your Google Drive file ID (the part between `/d/` and `/view`). Powers the "Download Resume" button as a forced download.
- `services`, `journey`, `capabilities`, `projects`, `recognition` — section content.

Other touch points:
- **Profile image:** replace `public/avatar.png`.
- **SEO / social preview:** edit meta tags in `index.html`.
- **Tech marquee logos:** add SVGs to `public/logos/`.

### Personalization TODO
- [ ] Replace placeholder social usernames (`instagram`, `twitter`/`x`, `website`) in `src/data/portfolio.ts`.
- [ ] Confirm GitHub URL (`github.com/krish2105`) is correct.
- [ ] Add a real Open Graph image and uncomment the `og:url` / `og:image` tags in `index.html` after deployment.
- [ ] Add a `public/preview.png` screenshot and reference it in the README Preview section.
- [ ] Paste the live URL into the [Live Demo](#2-live-demo) section.
- [ ] Verify the projects in `projects` reflect your real, public work and links.

## 13. Contact

- **Email:** krishnamathur008@gmail.com
- **GitHub:** https://github.com/krish2105
- **LinkedIn:** https://www.linkedin.com/in/krishnamathurmay/
- **Location:** Dubai, UAE · Jaipur, India

## 14. License

This project is released under the MIT License. Content, branding and personal assets (name, resume, profile image, project descriptions) belong to Krishna Mathur and are not covered by the code license.
