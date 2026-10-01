# TUWA Docs Hub — Documentation Gateway

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

> 🟢 **Public Repository:** This app is the source for the official **TUWA Documentation Hub**, available at **[docs.tuwa.io](https://docs.tuwa.io)**.

## About This Project

**Docs Hub** is the central landing page for the entire **TUWA Web3 ecosystem**. From this single entry point, developers can jump into the documentation of every TUWA project — `SIWX`, `Orbit`, `Satellite`, `Pulsar`, `Nova`, `Quasar` (managed cloud and the self-hosted Community Edition), and the shared **TUWA SDK** — without hunting across separate sites.

The app has three surfaces:

- **Main screen (`/`)** — a hand-crafted React page: a gradient hero, a layered ecosystem timeline, doc cards linking out to each project, and a Cosmos Playground quick start.
- **Guides (`/guides`)** — MDX pages rendered by **Nextra 4** with the docs theme, sidebar, and full-text search: architecture deep dives, and step-by-step setups that combine several TUWA projects (for example the [React transaction tracking guide](https://docs.tuwa.io/guides/react-transaction-tracking), the [Full-Stack React guide](https://docs.tuwa.io/guides/full-stack-react) and the [Starter Templates](https://docs.tuwa.io/guides/starter-templates)).
- **Quasar (`/quasar`)** — the documentation of Quasar, the TUWA backend (Quasar Cloud and the self-hosted Community Edition): overview, apps and keys, quotas, webhooks, self-hosting and the API reference (Scalar). The client, `@tuwaio/quasar-sdk`, is documented on [sdk.docs.tuwa.io](https://sdk.docs.tuwa.io/packages/quasar-sdk).

Both consume shared UI primitives and design tokens from [`@tuwaio/docs-ui`](../../packages/docs-ui) and [`@tuwaio/nova-core`](https://www.npmjs.com/package/@tuwaio/nova-core), so the visual identity stays consistent with the rest of the ecosystem. Individual TUWA project docs (Orbit, Satellite, etc.) live in their own repositories on the same Nextra stack: an Introduction, the package READMEs and a generated reference. Content that combines several projects lives here, content about one package lives on its site.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16+ (App Router, Server Components)
- **UI Runtime:** React 19+
- **Guides and Quasar docs:** Nextra 4 (`nextra`, `nextra-theme-docs`) — MDX pages, `_meta.tsx` navigation, Mermaid diagrams, GitHub-style callouts
- **API reference:** `@scalar/api-reference-react`, rendered in the browser from `public/quasar-openapi.yaml`
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

This installs dependencies for every workspace package, builds `packages/docs-ui`, and installs it into the app as an injected dependency (a copy that uses the app's `next` and `nextra-theme-docs`). After changing `docs-ui`, run `pnpm build` from the root: it rebuilds the package and refreshes the copy.

### 2. Environment Variables

Copy `.env.example` to `.env.local`. The variable is optional:

| Variable                           | Purpose                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_QUASAR_DASHBOARD_URL` | Link to the Quasar Cloud dashboard. Defaults to `https://quasar.tuwa.io/`. |

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

`build` first runs `scripts/build-data.mjs` (see [Build-Time Data](#build-time-data)), then `next build`, then `postbuild` indexes the rendered pages with Pagefind into `public/_pagefind`. That folder is generated and git-ignored, so run a production build at least once to get search in `/guides` locally.

Keep `next` at 16.3.7: with the Vercel build adapter, 16.3.8 writes the prerendered pages outside `.next/server/app`, and Pagefind then finds no HTML and fails the deployment.

### Package Details

Hovering an npm package of the timeline (or focusing it with the keyboard) shows `PackagePreview` over the rows around it after a short delay: version, description, required peers and the packages that use it. A click opens `PackageDialog`:

- version and description, and the SDK packages that include it (`@tuwaio/sdk`, `evm-sdk`, `solana-sdk`): apps on the SDK import it from there;
- the install command for pnpm, npm, yarn or bun (the choice is saved to `localStorage`), with the required peers the app needs: the package's own and those of its TUWA peers, without what an installed SDK package already brings, and without `react`/`react-dom`, which the dialog names below the command. Ranges become arguments that need no shell quoting (`5.x.x` → `zustand@5`, `>=0.3` → the bare name);
- required and optional peers, the TUWA packages it includes and the ones that use it (TUWA packages open in the same dialog);
- up to three hub pages that mention the package, and links to its reference, npm and source.

### Build-Time Data

`scripts/build-data.mjs` runs before `pnpm dev` and `pnpm build` and saves to `src/generated/` (git-ignored), so the pages make no requests and the data is as fresh as the last deployment:

| File                   | Content                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `npm-packages.json`    | The latest npm manifests of the `@tuwaio/` packages listed in `src/lib/ecosystem.ts`                                           |
| `package-readmes.json` | The README of each of these versions, from jsDelivr (for `llms-full.txt`)                                                      |
| `releases.json`        | The latest `vX.Y.Z` tag of each repository in `RELEASES` of the script, listed with `git ls-remote` (no GitHub API rate limit) |
| `package-guides.json`  | The pages of `src/content/guides` and `src/content/quasar` that mention each package, most mentions first                      |

A step that fails (registry, jsDelivr or GitHub unreachable) keeps its last saved file, or saves an empty one: the rows then link to npm and the release badge is hidden. The main page is still revalidated once a day, because `RemoteLogo` of `@tuwaio/docs-ui` caches the logo for 24 hours; the data does not change between builds.

### Search Engines and LLMs

- Every MDX page gets its canonical URL, Open Graph and Twitter card (`withPageMetadata` in `src/lib/site.ts`) and `TechArticle` and `BreadcrumbList` structured data; the main page has `WebSite` and `Organization` data. Keep the front matter `description` under about 160 characters: it is the search snippet.
- `/sitemap.xml` lists the main page and every MDX page, `/robots.txt` allows everything and points to the sitemap.
- `/llms.txt` ([llmstxt.org](https://llmstxt.org)) lists every page with its description, every package by stage with its version, reference and install command, and the documentation sites. `/llms-full.txt` holds every page as Markdown (tabs labeled, the API reference as the OpenAPI document) and the README of every package. Both are built at build time from the page map of Nextra, the MDX sources and the build-time data (`src/lib/llms.ts`).

---

## ✍️ How to Edit Content

### Project Structure

```
apps/docs-hub/
├── public/
│   ├── manifest.json                # PWA manifest
│   └── quasar-openapi.yaml          # GENERATED by `pnpm openapi:gen` in TuwaIO/sdk — do not edit
├── src/
│   ├── app/
│   │   ├── (home)/
│   │   │   ├── layout.tsx           # Header + Footer shell of the main screen
│   │   │   └── page.tsx             # Main screen: hero, timeline, quick start
│   │   ├── guides/
│   │   │   ├── [[...mdxPath]]/
│   │   │   │   └── page.tsx         # Renders MDX pages from src/content/guides
│   │   │   └── layout.tsx           # Nextra docs layout (navbar, sidebar, footer)
│   │   ├── quasar/                  # Same for src/content/quasar
│   │   │   ├── [[...mdxPath]]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── llms.txt/route.ts        # llms.txt, built at build time
│   │   ├── llms-full.txt/route.ts   # llms-full.txt, built at build time
│   │   ├── sitemap.ts               # /sitemap.xml
│   │   ├── robots.ts                # /robots.txt
│   │   ├── globals.css              # Tailwind, Nextra and design-token imports
│   │   ├── layout.tsx               # Root layout, <Metadata> (metadataBase), fonts, Providers
│   │   └── providers.tsx            # next-themes ThemeProvider
│   ├── components/
│   │   ├── DocCard.tsx              # Card linking to a project's Docs + GitHub
│   │   ├── Footer.tsx               # Footer of the main screen
│   │   ├── Header.tsx               # Fixed glassmorphic header + theme switcher
│   │   ├── HeroSection.tsx          # Gradient title + subtitle
│   │   ├── JsonLd.tsx               # Structured data script
│   │   ├── LayerTimeline.tsx        # Vertical timeline of ecosystem layers
│   │   ├── PackageDialog.tsx        # Details of an npm package (Dialog of @tuwaio/nova-core)
│   │   ├── PackagePreview.tsx       # Hover preview of an npm package
│   │   ├── QuickStartSection.tsx    # Cosmos Playground CLI quick start
│   │   ├── QuasarApiReference.tsx   # Scalar reference of the Quasar API (client only, not in the barrel)
│   │   └── index.ts                 # Barrel export
│   ├── content/
│   │   ├── _meta.tsx                # Top-level Nextra navigation
│   │   ├── guides/
│   │   │   ├── _meta.tsx            # Guides sidebar order and titles
│   │   │   ├── index.mdx            # Guides overview page (a card per guide)
│   │   │   ├── multi-chain-auth-siwx-caip122.mdx          # Deep dive: SIWX and CAIP-122
│   │   │   ├── why-web3-transaction-state-is-broken.mdx   # Deep dive: transaction state (Pulsar)
│   │   │   ├── erc-4337-sovereign-account-abstraction.mdx # Deep dive: ERC-4337 (Orbit EVM, Pulsar, Quasar)
│   │   │   ├── react-transaction-tracking.mdx             # Setup: Pulsar in a React app, EVM and Solana tabs
│   │   │   ├── full-stack-react.mdx                       # Setup: a Next.js app on the TUWA SDK (Nova, SIWX, Pulsar)
│   │   │   ├── quasar-transaction-sync.mdx                # Setup: sync transactions to Quasar, history in Nova
│   │   │   └── starter-templates.mdx                      # Setup: Cosmos Playground templates and CLI
│   │   └── quasar/
│   │       ├── _meta.tsx            # Quasar sidebar (the API page uses the full-width layout)
│   │       ├── index.mdx            # Overview: Quasar Cloud and Community Edition
│   │       ├── apps-and-keys.mdx
│   │       ├── quotas-and-limits.mdx
│   │       ├── webhooks.mdx
│   │       ├── self-hosting.mdx     # Links to the guides of TuwaIO/quasar-community
│   │       └── api.mdx              # API reference (QuasarApiReference)
│   ├── generated/                   # GENERATED by scripts/build-data.mjs (git-ignored)
│   ├── lib/
│   │   ├── ecosystem.ts             # Stages, projects and packages of the main page
│   │   ├── github.ts                # Saved release tags
│   │   ├── hubPages.ts              # MDX pages in sidebar order (sitemap, llms.txt)
│   │   ├── llms.ts                  # Text of llms.txt and llms-full.txt
│   │   ├── packages.ts              # Package details and install commands from the saved npm data
│   │   ├── site.ts                  # Site URL, page metadata, structured data ids
│   │   └── nextraSection.tsx        # Route, metadata and layout of an MDX section (guides, quasar)
│   └── mdx-components.ts            # MDX component map for Nextra
├── scripts/build-data.mjs           # Saves npm data, READMEs, release tags and guide mentions before dev and build
├── next.config.ts                   # Nextra plugin setup
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

### Adding or Updating an Ecosystem Entry

The timeline of TUWA projects is defined in `src/lib/ecosystem.ts` as a `layers` array, outside the client components, so `llms.txt` reads the same data. Each entry describes one layer of the ecosystem (label, subtitle, accent color, dot gradient, and the `DocCard` items nested under it). To add a new project:

1. Open `src/lib/ecosystem.ts`.
2. Add a new object to the appropriate layer (or introduce a new layer) with the correct `name`, `tagline`, `icon`, gradient classes, and links (`docsUrl`, `githubUrl`).
3. If the icon is not yet imported, add it from `@heroicons/react/24/outline`.
4. The desktop orb is picked by `id`. If the project has no orb of its own in `@tuwaio/docs-ui`, set `orb` to an existing one (the Quasar Community card uses `orb: 'quasar'`).

An `@tuwaio/` package added to `packages` gets its details, preview and `llms.txt` entry on the next build. To show a project's latest `vX.Y.Z` tag, add its entry id and repository to `RELEASES` in `scripts/build-data.mjs`.

### Writing a Guide

1. Create `src/content/guides/<slug>.mdx` with `title` and `description` in the frontmatter — they become the page's `<title>`, meta description (keep it under about 160 characters) and its line in `llms.txt`.
2. Register the page in `src/content/guides/_meta.tsx`. The key is the slug, the value is the sidebar title. Order in the object is order in the sidebar.
3. Add a short card for it to `src/content/guides/index.mdx`.

Guides support Mermaid code blocks (` ```mermaid `) and GitHub-style callouts (`> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`).

Rules for guides:

- **One place per topic.** A guide here combines several TUWA projects. A scenario of one package belongs on the site of that package, and the reference of an API belongs to its package page: link to it (`https://<project>.docs.tuwa.io/packages/<package>`) instead of repeating it.
- **Plain MDX.** Code examples are fenced code blocks with a `filename` (` ```ts filename="src/hooks/txTrackingHooks.ts" `), not strings inside React components. Variants of one step go into `<Tabs>` from `nextra/components`; give every `Tabs` group of a page the same `storageKey` (for example `tuwa-guide-network`), so one choice switches all steps.
- **Examples compile.** Every TypeScript example must compile against the published packages it imports. Check a guide after writing it and after a release of a package it uses, for example by copying its code blocks into a project with those packages and running `tsc`.
- **No redirects.** When a page moves or is removed, update every link to it in all TUWA repositories instead of adding a redirect.

### Quasar Pages

- Every fact about Quasar (limits, quotas, headers, webhook payloads) comes from the code of `TuwaIO/quasar` (the Community Edition is generated from it). Check it there when Quasar changes.
- The Community Edition is single-tenant, with email, password and TOTP in the Payload admin: it has no SIWX sign-in, passkeys, transactional email or billing. Setup guides stay in `TuwaIO/quasar-community`; `self-hosting.mdx` links to them.
- `public/quasar-openapi.yaml` is written by `pnpm openapi:gen` in the `TuwaIO/sdk` checkout next to this repository, from Zod schemas checked against the Pulsar types. Regenerate it when the Quasar endpoints or the Pulsar transaction types change.

### Design Tokens

Rounded corners, colors, gradients, and other visual tokens are provided as CSS custom properties by `@tuwaio/nova-core` and `@tuwaio/docs-ui` (see `src/app/globals.css` for the imports). Always prefer the token — e.g. `rounded-[var(--tuwa-rounded-corners)]`, `text-[var(--tuwa-text-primary)]` — over hard-coded Tailwind values, so the hub stays visually aligned with every other TUWA doc site.

### Metadata, Favicon, and Manifest

- SEO metadata (OpenGraph, Twitter, icons, manifest) for the main screen is declared via the Next.js **Metadata API** in `src/app/layout.tsx`. Guides and Quasar pages take their title and description from MDX frontmatter, with the `%s – TUWA Guides` and `%s – Quasar` templates of their layouts.
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
