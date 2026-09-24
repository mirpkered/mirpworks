# Mirpworks

Version 1 of the official website for Mirpworks, an independent game and application development studio.

## Technology

The site is generated with a small, dependency-free Node.js build. Shared layouts, project metadata, and page content live in `src/`; the production-ready static site is written to `dist/`. This keeps the site fast, easy to maintain, and straightforward to deploy on Cloudflare Pages.

## Requirements

- Node.js 20 or newer

No package installation is required.

## Local development

```sh
npm run dev
```

Open `http://localhost:4173`. The local server rebuilds before starting.

## Production build

```sh
npm run build
```

The output directory is `dist`.

Run project checks with:

```sh
npm run check
```

## Cloudflare Pages

Recommended settings:

- Production branch: `main`
- Framework preset: None
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node.js version: 20 or newer

No environment variables, Functions, database, authentication, analytics, or custom-domain configuration are required.

## Content structure

- `src/data/projects.js` — central project metadata
- `src/site.js` — reusable layout, cards, and page templates
- `src/styles.css` — site-wide responsive design system
- `src/brand-integration.css` — logo placement in the shared wordmark and home hero
- `src/assets/brand/` — original supplied logo and tightly framed logo crops
- `src/script.js` — mobile navigation and small progressive enhancements
- `scripts/build.mjs` — static route generator
- `scripts/check.mjs` — route, link, and markup checks

Future studio and editorial sections can be added through the existing route generator without changing the public architecture.

## Generated artwork

The home-page hero artwork was created for Mirpworks with OpenAI image generation and contains no project-specific gameplay claims.

© 2026 Mirpworks
