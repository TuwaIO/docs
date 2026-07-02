# TUWA Docs Hub — Documentation Gateway

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

> 🟢 **Public Repository:** This app is the source for the official **TUWA Documentation Hub**, available at **[docs.tuwa.io](https://docs.tuwa.io)**.

## About This Project

**Docs Hub** is the central landing page for the entire **TUWA Web3 ecosystem**. From this single entry point, developers can jump into the documentation of every TUWA project — `Orbit`, `Satellite`, `Pulsar`, `Nova`, `Quasar`, and the shared **TUWA SDK** — without hunting across separate sites.

Unlike the individual project docs (which are Nextra-based), this hub is a lean **Next.js App Router** app that renders a gradient hero, a layered ecosystem timeline, and doc cards linking out to each project. It consumes shared UI primitives and design tokens from [`@tuwaio/docs-ui`](../../packages/docs-ui) and [`@tuwaio/nova-core`](https://www.npmjs.com/package/@tuwaio/nova-core) so the visual identity stays consistent with the rest of the ecosystem.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16+ (App Router, Server Components)
- **UI Runtime:** React 19+
- **Styling:** Tailwind CSS 4+ with PostCSS, plus TUWA design tokens from `@tuwaio/nova-core` and `@tuwaio/docs-ui`
- **Icons:** `@heroicons/react`
- **Theme:** `next-themes` for dark/light mode
- **Utilities:** `clsx`, `tailwind-merge`
- **Deployment:** Vercel

No Nextra, no MDX, no TypeDoc — the hub is a hand-crafted React surface. Individual TUWA project docs (Orbit, Satellite, etc.) live in their own repositories and use the Nextra-based stack from `@tuwaio/docs-ui`.

---

## 🚀 Getting Started

### 1. Prerequisites

Install all workspace dependencies from the **root of the monorepo** using `pnpm`:

```bash
# Run from the monorepo root, not from apps/docs-hub/
pnpm install
```

This installs dependencies for every workspace package, builds `packages/docs-ui`, and links it into the app.

### 2. Running the Dev Server

Start the Next.js dev server for the hub from the monorepo root:

```bash
pnpm --filter @tuwaio/docs-hub dev
```

_(The filter `@tuwaio/docs-hub` targets this specific app via its `name` in `apps/docs-hub/package.json`.)_

The site will be available at **[http://localhost:3000](http://localhost:3000)**.

### 3. Production Build

```bash
pnpm --filter @tuwaio/docs-hub build
pnpm --filter @tuwaio/docs-hub start
```

---

## ✍️ How to Edit Content

The hub is a **component-driven** page, not an MDX site. All content lives in React components under `src/`.

### Project Structure

```
apps/docs-hub/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind + design-token imports
│   │   ├── layout.tsx         # Root layout, <Metadata>, fonts, Providers
│   │   ├── page.tsx           # Home — StarryBackground, mobile orbs, sections
│   │   └── providers.tsx      # next-themes ThemeProvider
│   └── components/
│       ├── Header.tsx         # Fixed glassmorphic header + theme switcher
│       ├── HeroSection.tsx    # Gradient title + subtitle
│       ├── LayerTimeline.tsx  # Vertical timeline of ecosystem layers
│       ├── DocCard.tsx        # Card linking to a project's Docs + GitHub
│       ├── Footer.tsx         # Footer with links and copyright
│       └── index.ts           # Barrel export
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

### Adding or Updating an Ecosystem Entry

The timeline of TUWA projects is defined inline in `src/components/LayerTimeline.tsx` as a `layers` array. Each entry describes one layer of the ecosystem (label, subtitle, accent color, dot gradient, and the `DocCard` items nested under it). To add a new project:

1. Open `src/components/LayerTimeline.tsx`.
2. Add a new object to the appropriate layer (or introduce a new layer) with the correct `name`, `tagline`, `icon`, gradient classes, and links (`docsUrl`, `githubUrl`).
3. If the icon is not yet imported, add it from `@heroicons/react/24/outline`.

### Design Tokens

Rounded corners, colors, gradients, and other visual tokens are provided as CSS custom properties by `@tuwaio/nova-core` and `@tuwaio/docs-ui` (see `src/app/globals.css` for the imports). Always prefer the token — e.g. `rounded-[var(--tuwa-rounded-corners)]`, `text-[var(--tuwa-text-primary)]` — over hard-coded Tailwind values, so the hub stays visually aligned with every other TUWA doc site.

### Metadata, Favicon, and Manifest

- SEO metadata (OpenGraph, Twitter, icons, manifest) is declared via the Next.js **Metadata API** in `src/app/layout.tsx`.
- Favicon assets are served from the shared CDN (`cdn.jsdelivr.net/gh/TuwaIO/workflows@main/favicon/…`), so there are no binary favicons committed to this app.
- The web app manifest lives at `public/manifest.json`.

---

## 🚀 Deployment

The hub is deployed to **Vercel**.

- **Production URL:** [**https://docs.tuwa.io**](https://docs.tuwa.io)
- Automatic deploys on push to `main`; preview deploys per PR.

## 🔗 Quick Links

| Resource                      | Link                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| **Live Docs Hub**             | [**docs.tuwa.io**](https://docs.tuwa.io)                                                      |
| **Shared UI (`docs-ui`)**     | [`../../packages/docs-ui`](../../packages/docs-ui)                                            |
| **TUWA GitHub Organization**  | [`github.com/TuwaIO`](https://github.com/TuwaIO)                                              |
| **Next.js App Router Docs**   | [`nextjs.org/docs/app`](https://nextjs.org/docs/app)                                          |
| **Tailwind CSS Docs**         | [`tailwindcss.com/docs`](https://tailwindcss.com/docs)                                        |

## 📄 License

This project is licensed under the **Apache-2.0 License** — see the [LICENSE](./LICENSE) file for details.
