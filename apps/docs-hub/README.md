# TUWA Docs Hub — Documentation Gateway

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

> 🟢 **Public Repository:** This app is the source for the official **TUWA Documentation Hub**, available at **[docs.tuwa.io](https://docs.tuwa.io)**.

## About This Project

**Docs Hub** is the central landing page for the entire **TUWA Web3 ecosystem**. From this single entry point, developers can jump into the documentation of every TUWA project — `SIWX`, `Orbit`, `Satellite`, `Pulsar`, `Nova`, `Quasar` (managed cloud and the self-hosted Community Edition), and the shared **TUWA SDK** — without hunting across separate sites.

The app has two surfaces:

- **Main screen (`/`)** — a hand-crafted React page: a gradient hero, a layered ecosystem timeline, doc cards linking out to each project, and a Cosmos Playground quick start.
- **Guides (`/guides`)** — MDX pages rendered by **Nextra 4** with the docs theme, sidebar, and full-text search: architecture deep dives, and step-by-step setups that combine several TUWA projects (for example the [React transaction tracking guide](https://docs.tuwa.io/guides/react-transaction-tracking) and the [Starter Templates](https://docs.tuwa.io/guides/starter-templates)).

Both consume shared UI primitives and design tokens from [`@tuwaio/docs-ui`](../../packages/docs-ui) and [`@tuwaio/nova-core`](https://www.npmjs.com/package/@tuwaio/nova-core), so the visual identity stays consistent with the rest of the ecosystem. Individual TUWA project docs (Orbit, Satellite, etc.) live in their own repositories on the same Nextra stack: an Introduction, the package READMEs and a generated reference. Content that combines several projects lives here, content about one package lives on its site.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16+ (App Router, Server Components)
- **UI Runtime:** React 19+
- **Guides:** Nextra 4 (`nextra`, `nextra-theme-docs`) — MDX pages, `_meta.tsx` navigation, Mermaid diagrams, GitHub-style callouts
- **Search:** Pagefind, indexed after every production build
- **Styling:** Tailwind CSS 4+ with PostCSS, plus TUWA design tokens from `@tuwaio/nova-core` and `@tuwaio/docs-ui`
- **Icons:** `@heroicons/react`
- **Theme:** `next-themes` for dark/light mode
- **Utilities:** `clsx`, `tailwind-merge`, `nextjs-toploader`
- **Deployment:** Vercel

---

## 🚀 Getting Started

### 1. Prerequisites

Install all workspace dependencies from the **root of the monorepo** using `pnpm`:

```bash
# Run from the monorepo root, not from apps/docs-hub/
pnpm install
```

This installs dependencies for every workspace package, builds `packages/docs-ui`, and links it into the app.

### 2. Environment Variables

Copy `.env.example` to `.env.local`. Both variables are optional:

| Variable                           | Purpose                                                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_QUASAR_DASHBOARD_URL` | Link to the Quasar Cloud dashboard. Defaults to `https://quasar.tuwa.io/`.                                                                                  |
| `GITHUB_TOKEN`                     | Server-only. Raises the GitHub API rate limit for the Quasar Community release badge. Without it, the badge still works within 60 requests per hour per IP. |

### 3. Running the Dev Server

Start the Next.js dev server for the hub from the monorepo root:

```bash
pnpm dev:hub
```

_(A shortcut for `pnpm --filter @tuwaio/docs-hub dev`, which targets this app via its `name` in `apps/docs-hub/package.json`.)_

The site will be available at **[http://localhost:3000](http://localhost:3000)**.

### 4. Production Build

```bash
pnpm build:hub
pnpm start:hub
```

`build` runs `next build`, then `postbuild` indexes the rendered pages with Pagefind into `public/_pagefind`. That folder is generated and git-ignored, so run a production build at least once to get search in `/guides` locally.

---

## ✍️ How to Edit Content

### Project Structure

```
apps/docs-hub/
├── public/
│   └── manifest.json                # PWA manifest
├── src/
│   ├── app/
│   │   ├── (home)/
│   │   │   ├── layout.tsx           # Header + Footer shell of the main screen
│   │   │   └── page.tsx             # Main screen: hero, timeline, quick start
│   │   ├── guides/
│   │   │   ├── [[...mdxPath]]/
│   │   │   │   └── page.tsx         # Renders MDX pages from src/content/guides
│   │   │   └── layout.tsx           # Nextra docs layout (navbar, sidebar, footer)
│   │   ├── globals.css              # Tailwind, Nextra and design-token imports
│   │   ├── layout.tsx               # Root layout, <Metadata>, fonts, Providers
│   │   └── providers.tsx            # next-themes ThemeProvider
│   ├── components/
│   │   ├── DocCard.tsx              # Card linking to a project's Docs + GitHub
│   │   ├── Footer.tsx               # Footer of the main screen
│   │   ├── Header.tsx               # Fixed glassmorphic header + theme switcher
│   │   ├── HeroSection.tsx          # Gradient title + subtitle
│   │   ├── LayerTimeline.tsx        # Vertical timeline of ecosystem layers
│   │   ├── QuickStartSection.tsx    # Cosmos Playground CLI quick start
│   │   └── index.ts                 # Barrel export
│   ├── content/
│   │   ├── _meta.tsx                # Top-level Nextra navigation
│   │   └── guides/
│   │       ├── _meta.tsx            # Guides sidebar order and titles
│   │       ├── index.mdx            # Guides overview page (a card per guide)
│   │       ├── multi-chain-auth-siwx-caip122.mdx          # Deep dive: SIWX and CAIP-122
│   │       ├── why-web3-transaction-state-is-broken.mdx   # Deep dive: transaction state (Pulsar)
│   │       ├── erc-4337-sovereign-account-abstraction.mdx # Deep dive: ERC-4337 (Orbit EVM, Pulsar, Quasar)
│   │       ├── react-transaction-tracking.mdx             # Setup: Pulsar in a React app, EVM and Solana tabs
│   │       └── starter-templates.mdx                      # Setup: Cosmos Playground templates and CLI
│   ├── lib/
│   │   └── github.ts                # Latest release tag from the GitHub API
│   └── mdx-components.ts            # MDX component map for Nextra
├── next.config.ts                   # Nextra plugin setup
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

### Adding or Updating an Ecosystem Entry

The timeline of TUWA projects is defined inline in `src/components/LayerTimeline.tsx` as a `layers` array. Each entry describes one layer of the ecosystem (label, subtitle, accent color, dot gradient, and the `DocCard` items nested under it). To add a new project:

1. Open `src/components/LayerTimeline.tsx`.
2. Add a new object to the appropriate layer (or introduce a new layer) with the correct `name`, `tagline`, `icon`, gradient classes, and links (`docsUrl`, `githubUrl`).
3. If the icon is not yet imported, add it from `@heroicons/react/24/outline`.
4. The desktop orb is picked by `id`. If the project has no orb of its own in `@tuwaio/docs-ui`, set `orb` to an existing one (the Quasar Community card uses `orb: 'quasar'`).

To show a project's latest `vX.Y.Z` tag, fetch it in `src/app/(home)/page.tsx` with `fetchLatestTag('<owner>/<repo>')` and pass it to `<LayerTimeline releases={{ '<entry id>': release }} />`. The page is revalidated once per hour, and the badge is hidden if the GitHub API is unavailable.

### Writing a Guide

1. Create `src/content/guides/<slug>.mdx` with `title` and `description` in the frontmatter — they become the page's `<title>` and meta description.
2. Register the page in `src/content/guides/_meta.tsx`. The key is the slug, the value is the sidebar title. Order in the object is order in the sidebar.
3. Add a short card for it to `src/content/guides/index.mdx`.

Guides support Mermaid code blocks (` ```mermaid `) and GitHub-style callouts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`).

Rules for guides:

- **One place per topic.** A guide here combines several TUWA projects. A scenario of one package belongs on the site of that package, and the reference of an API belongs to its package page: link to it (`https://<project>.docs.tuwa.io/packages/<package>`) instead of repeating it.
- **Plain MDX.** Code examples are fenced code blocks with a `filename` (` ```ts filename="src/hooks/txTrackingHooks.ts" `), not strings inside React components. Variants of one step go into `<Tabs>` from `nextra/components`; give every `Tabs` group of a page the same `storageKey` (for example `tuwa-guide-network`), so one choice switches all steps.
- **Examples compile.** Every TypeScript example must compile against the published packages it imports. Check a guide after writing it and after a release of a package it uses, for example by copying its code blocks into a project with those packages and running `tsc`.
- **No redirects.** When a page moves or is removed, update every link to it in all TUWA repositories instead of adding a redirect.

### Design Tokens

Rounded corners, colors, gradients, and other visual tokens are provided as CSS custom properties by `@tuwaio/nova-core` and `@tuwaio/docs-ui` (see `src/app/globals.css` for the imports). Always prefer the token — e.g. `rounded-[var(--tuwa-rounded-corners)]`, `text-[var(--tuwa-text-primary)]` — over hard-coded Tailwind values, so the hub stays visually aligned with every other TUWA doc site.

### Metadata, Favicon, and Manifest

- SEO metadata (OpenGraph, Twitter, icons, manifest) for the main screen is declared via the Next.js **Metadata API** in `src/app/layout.tsx`. Guides take their title and description from MDX frontmatter, with the `%s – TUWA Guides` template from `src/app/guides/layout.tsx`.
- Favicon assets are served from the shared CDN (`cdn.jsdelivr.net/gh/TuwaIO/workflows@main/favicon/…`), so there are no binary favicons committed to this app.
- The web app manifest lives at `public/manifest.json`.

---

## 🚀 Deployment

The hub is deployed to **Vercel**.

- **Production URL:** [**https://docs.tuwa.io**](https://docs.tuwa.io)
- Automatic deploys on push to `main`; preview deploys per PR.

## 🔗 Quick Links

| Resource                     | Link                                                   |
| ---------------------------- | ------------------------------------------------------ |
| **Live Docs Hub**            | [**docs.tuwa.io**](https://docs.tuwa.io)               |
| **Shared UI (`docs-ui`)**    | [`../../packages/docs-ui`](../../packages/docs-ui)     |
| **TUWA GitHub Organization** | [`github.com/TuwaIO`](https://github.com/TuwaIO)       |
| **Next.js App Router Docs**  | [`nextjs.org/docs/app`](https://nextjs.org/docs/app)   |
| **Nextra Docs**              | [`nextra.site`](https://nextra.site)                   |
| **Tailwind CSS Docs**        | [`tailwindcss.com/docs`](https://tailwindcss.com/docs) |

## 📄 License

This project is licensed under the **Apache-2.0 License** — see the [LICENSE](./LICENSE) file for details.
