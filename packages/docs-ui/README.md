# @tuwaio/docs-ui

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/docs-ui.svg)](https://www.npmjs.com/package/@tuwaio/docs-ui)
[![License](https://img.shields.io/npm/l/@tuwaio/docs-ui.svg)](https://github.com/TuwaIO/docs/blob/main/packages/docs-ui/LICENSE)

`@tuwaio/docs-ui` is the shared UI of the TUWA documentation sites: the navbar, footer, logo and stylesheet of every `*.docs.tuwa.io` site and of the [docs hub](https://docs.tuwa.io), plus the decorative parts of the hub and the TUWA landing page, and the policy pages of the TUWA website and the Quasar dashboard. The sites are built with Next.js (App Router) and Nextra 4; one package keeps them visually consistent.

---

## 🏛️ Core Capabilities

- **Nextra layout parts:** `Navbar` and `Footer` wrap the navbar and footer of `nextra-theme-docs` with the site logo and a row of external links (`baseNavLinks`, `baseFooterLinks` are the defaults: the npm and GitHub organizations of TUWA). The footer also links the policies in force on tuwa.io and the list of all policies on the docs hub.
- **Logo:** `RemoteLogo` is an async React Server Component that fetches an SVG (by default the TUWA logo) and renders it as React elements, so it takes `className` and `currentColor`.
- **Theme switch:** `ThemeSwitcher` is a light/dark switch for any theme state (for example `next-themes`).
- **Language select:** `LocaleSwitcher` is an accessible glassmorphic select dropdown for switching languages (English, Українська, 简体中文, etc.), styled to match `ThemeSwitcher`. Features zero layout shift, Nova UI Kit animated directional chevron, collision detection with auto-flip (`placement="auto"`), multi-layout Latin typeahead navigation (independent of user OS keyboard language), and an invisible native `<select>` overlay on touch devices (`pointer: coarse`) for native mobile system pickers (iOS wheel, Android sheet). Full WCAG 2.1/2.2 AA/AAA compliance. It renders an invisible placeholder during SSR to avoid hydration shifts.
- **Interface settings for 30 days:** `PreferenceExpiry` is an inline script for the `<head>` of a site's root layout. It forgets the Local Storage values of the given keys (by default `theme`) 30 days after they were written, as the [Cookie Policy](https://tuwa.io/cookie) states, and dates each later write, whatever library writes it (`next-themes`, the `Tabs` of Nextra).
- **Decoration:** `Orb` (an animated sphere in the brand color of a TUWA project), `StarryBackground` (an animated star field on a canvas) and `NoSSR` (renders its children only on the client).
- **Policy pages:** `policies` lists the TUWA policies (Terms, Privacy, Cookie, Refund, Security, Data Processing Addendum) with their paths and whether they are in force (`publishedPolicies`; footers use `footerPolicies`). `loadPolicy` loads the text of a policy in a language, and `PolicyDocument` renders it with the date of the version, a Download PDF button, a language switch (English, Українська) when the policy is translated, anchored sections (the same anchors in every language) and a list of sections. The texts and PDFs come from [`TuwaIO/workflows/docs`](https://github.com/TuwaIO/workflows/tree/main/docs). Code that needs only the list or `loadPolicy` (footers, sitemaps, route handlers) imports them from `@tuwaio/docs-ui/policies`, which has no React, Next.js or Nextra imports.
- **Search index:** the `tuwa-docs-search-index` command builds the [Pagefind](https://pagefind.app) index that the Nextra search loads from `/_pagefind`, from the pages `next build` prerendered. It reads both places Next.js keeps them: `.next/server/app` and, in builds with a deployment adapter (Next.js 16.3.8 and later on Vercel), `.next/server/route-cache`, where `pagefind --site .next/server/app` finds no pages.
- **Stylesheet:** `dist/index.css` contains the `--tuwa-*` theme variables of [`@tuwaio/nova-core`](https://stories.tuwa.io/?path=/docs/packages-nova-core-overview--docs) (light and `.dark`), the styles of the Nextra parts and the Tailwind CSS v4 utilities used by the components, prefixed with `tuwadocs:`.

---

## 💾 Installation

```bash
pnpm add @tuwaio/docs-ui next nextra nextra-theme-docs react react-dom @heroicons/react
```

`nextra-theme-docs` (and its peer `nextra`) is needed by `Navbar` and `Footer`, `next` by `RemoteLogo` (a Server Component that uses the `fetch` cache of Next.js) and `@heroicons/react` by `ThemeSwitcher`.

Import the stylesheet after the Nextra theme:

```css
@import 'nextra-theme-docs/style.css';
@import '@tuwaio/docs-ui/dist/index.css';
@import 'tailwindcss';
```

---

## 🚀 Usage

The root layout of a TUWA documentation site:

```tsx
import { baseNavLinks, Footer, Navbar, PreferenceExpiry, RemoteLogo } from '@tuwaio/docs-ui';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';
import type { ReactNode } from 'react';

const logo = <RemoteLogo width={126} height={40} />;

const navLinks = [
  ...baseNavLinks,
  {
    title: 'GitHub',
    href: 'https://github.com/TuwaIO/pulsar-core',
    image: <span aria-hidden="true">★</span>,
  },
];

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <PreferenceExpiry keys={['theme']} />
      </Head>
      <body>
        <Layout
          navbar={<Navbar logo={logo} links={navLinks} />}
          footer={<Footer logo={logo} />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/TuwaIO/pulsar-core/tree/main/apps/docs"
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
```

---

### Policy pages

A policy page in the Next.js App Router (a Server Component; the content is cached for an hour). The language comes from `?lang=` (`en` by default, `uk` for Ukrainian); a policy without a translation loads in English, and the switch links each language with `?lang=<language>`:

```tsx
import { loadPolicy, PolicyDocument, policyLanguageFrom } from '@tuwaio/docs-ui';

export default async function RefundPage({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }) {
  const content = await loadPolicy('refund', { language: policyLanguageFrom((await searchParams).lang) });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <PolicyDocument slug="refund" content={content} />
    </main>
  );
}
```

Footers list the policies in force (`@tuwaio/docs-ui/policies` has only the policy data, so a footer does not pull in the Nextra parts):

```tsx
import { footerPolicies } from '@tuwaio/docs-ui/policies';

export function PolicyLinks() {
  return (
    <nav aria-label="Policies" className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
      {footerPolicies.map((policy) => (
        <a key={policy.slug} href={policy.href}>
          {policy.title}
        </a>
      ))}
    </nav>
  );
}
```

Sections have stable anchors (`/refund#how-to-request-a-refund`), so hints and FAQ answers can link to a section.

### Search index

Run the command after `next build`. It uses the `pagefind` package of the site, so add it to the site's dependencies:

```json
{
  "scripts": {
    "build": "next build && pnpm postbuild",
    "postbuild": "tuwa-docs-search-index"
  },
  "dependencies": {
    "pagefind": "^1.5.2"
  }
}
```

It writes the index to `public/_pagefind` (keep that directory in `.gitignore`) with the same URLs as `pagefind --site .next/server/app`, and fails when the build has no prerendered pages.

---

## 🗄️ Browser Storage

`LocaleSwitcher` and `ThemeSwitcher` store nothing; they only call `onSelect` / `onToggle`, and the site keeps the choice. `PreferenceExpiry` stores `<key>:expires` (the time in epoch milliseconds) next to each key it is given, removes both once that time has passed, and wraps `Storage.prototype.setItem` on the page to date later writes of those keys.

## 🌐 External Services

`RemoteLogo` requests its `url` on the server (by default `cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/logo_v2.svg`), cached by Next.js for 24 hours. `loadPolicy` requests `raw.githubusercontent.com/TuwaIO/workflows/main/docs/<slug>.json` (a translation: `docs/<language>/<slug>.json`, and the English file when it does not exist) on the server, cached by Next.js for an hour by default. The Download PDF button of `PolicyDocument` links to the PDF on the same host; the browser requests it only when it is clicked. The other components send no requests.

---

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/docs/blob/main/packages/docs-ui/LICENSE) file for details.
