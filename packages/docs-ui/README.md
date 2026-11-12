# @tuwaio/docs-ui

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/docs-ui.svg)](https://www.npmjs.com/package/@tuwaio/docs-ui)
[![License](https://img.shields.io/npm/l/@tuwaio/docs-ui.svg)](https://github.com/TuwaIO/docs/blob/main/packages/docs-ui/LICENSE)

`@tuwaio/docs-ui` is the shared UI of the TUWA documentation sites: the navbar, footer, logo and stylesheet of every `*.docs.tuwa.io` site and of the [docs hub](https://docs.tuwa.io), plus the decorative parts of the hub and the TUWA landing page, and the policy pages of the TUWA website and the Quasar dashboard. The sites are built with Next.js (App Router) and Nextra 4; one package keeps them visually consistent.

---

## 🏛️ Core Capabilities

- **Nextra layout parts:** `Navbar` and `Footer` wrap the navbar and footer of `nextra-theme-docs` with the site logo and a row of external links in mono caps with pixel marks (`baseNavLinks`, `baseFooterLinks` are the defaults: the npm and GitHub organizations of TUWA). The header is the glass of the docs at every width (`.tuwa-docs-glass`: the paper, a little clear, over a light blur of the page) with faint scanlines and a line of 1px; the headings of the articles are in Geist Mono; the footer stands on the paper below a line of 1px. The footer also links the policies in force on tuwa.io and the list of all policies on the docs hub.
- **Logo:** `SiteLogo` shows the logo of TUWA for the light and the dark theme (images on `tuwa.io`), at the size of the logo of tuwa.io (110px wide on phones, 126px from 640px) unless it is given a width.
- **Theme switch:** `ThemeSwitcher` is a light/dark switch for any theme state (for example `next-themes`): a knob that slides with a spring, a pixel sun or a pixel moon with stars, a line in colour along its edge and, for about two seconds after a change, a twinkle and a satellite on its orbit. Only CSS, still for reduced motion. A click removes the anchor (`#…`) from the address and keeps the page where it is; a language picked through `useLocaleRouting` opens the page from its top, without the anchor (`dropAnchor`, `addressWithoutAnchor`).
- **Language select:** `LocaleSwitcher` is an accessible select dropdown for switching languages (English, Українська, 简体中文, etc.), a pair with `ThemeSwitcher`: the flag of the language on the same knob with a quiet glow in its colour, and in the menu each flag on a small knob of its own. Features zero layout shift, Nova UI Kit animated directional chevron, collision detection with auto-flip (`placement="auto"`), multi-layout Latin typeahead navigation (independent of user OS keyboard language), and an invisible native `<select>` overlay on touch devices (`pointer: coarse`) for native mobile system pickers (iOS wheel, Android sheet). Full WCAG 2.1/2.2 AA/AAA compliance. It renders an invisible placeholder while the page hydrates, to avoid hydration shifts, and shows at once when it is rendered on the client.
- **Three languages (project sites):** `@tuwaio/docs-ui/nextra` and `@tuwaio/docs-ui/nextra/page` turn a Nextra site into an English, Ukrainian and Simplified Chinese site with one URL per page, as on the [docs hub](https://docs.tuwa.io). `DocsLayout` is the Nextra layout with the navbar (the language switch and then the theme switch after the links; Nextra's own theme select is off), the footer, the search, the table of contents, the edit, feedback and last-updated texts and the sidebar titles in the language of the reader (`docsLabels`, `localizePageMap`). `createDocsPage` creates the `[[...mdxPath]]` route: each page is prerendered in English and in the languages it is translated into, and `LocalizedPage` shows the reader's language without a request; pages without a translation (package READMEs, the generated API reference) show English with a note in the reader's language. The language is detected after mount (`tuwa-locale`, then the browser languages and the time zone; no cookie, no request). The `tuwa-docs-i18n-check` command keeps the translations in line with their English pages.
- **Interface settings for 30 days:** `PreferenceExpiry` is an inline script for the `<head>` of a site's root layout. It forgets the Local Storage values of the given keys (by default `theme`) 30 days after they were written, as the [Cookie Policy](https://tuwa.io/cookie) states, and dates each later write, whatever library writes it (`next-themes`, the `Tabs` of Nextra).
- **Decoration:** `ProjectSquare` (the square of a TUWA project in paper and ink: a frame of 1px with the pixel icon of the project and corner marks that turn to the accent when it is `active` or pointed at; its pixels assemble once, still for reduced motion; `Orb` is its old, deprecated name and renders it), `PixelArt` (a pixel picture of ink and lit pixels, with `projectIconArt` and `projectIcons`, the icons of the projects; with `assemble` and `motion` the picture assembles again and plays the motion of its project while `startPixelMotion` runs, until `stopPixelMotion`: the arrow glides into the door, a planet goes round the orbit, the beams of the pulsar pulse; still for reduced motion), `CornerMarks` and `StarryBackground` (the pixel star field of the TUWA documentation on a transparent canvas behind the page: crisp pixel stars in ink, one in ten lit in the colour of the brand, and sparkles whose arms reach out at their brightest; they drift, twinkle, move away from the pointer and shine brighter near it, neighbours joined by dotted lines of 1px pixels; now and then a small pixel event of the sky: a shooting star, a supernova, a satellite passing or a rocket taking off. Nothing below 768px, still with no events for reduced motion, paused in a hidden tab; `NextraDocsLayout` renders it on every documentation site).
- **Anchors:** `SmoothAnchors` (mounted by `DocsLayout`) makes the links to anchors of a page scroll smoothly to their part, in 420–960ms by the distance, where a frame of the accent closes in on it once; at once for reduced motion.
- **Policy pages:** `policies` lists the TUWA policies (Terms, Privacy, Cookie, Refund, Security, Data Processing Addendum) with their paths and whether they are in force (`publishedPolicies`; footers use `footerPolicies`). `loadPolicy` loads the text of a policy in a language, and `PolicyDocument` renders it with the date of the version, a Download PDF button, a language switch (English, Українська) when the policy is translated, anchored sections (the same anchors in every language) and a list of sections. The texts and PDFs come from [`TuwaIO/workflows/docs`](https://github.com/TuwaIO/workflows/tree/main/docs). Code that needs only the list or `loadPolicy` (footers, sitemaps, route handlers) imports them from `@tuwaio/docs-ui/policies`, which has no React, Next.js or Nextra imports.
- **Search index:** the `tuwa-docs-search-index` command builds the [Pagefind](https://pagefind.app) index that the Nextra search loads from `/_pagefind`, from the pages `next build` prerendered. It reads both places Next.js keeps them: `.next/server/app` and, in builds with a deployment adapter (Next.js 16.3.8 and later on Vercel), `.next/server/route-cache`, where `pagefind --site .next/server/app` finds no pages.
- **Stylesheet:** `dist/index.css` contains the `--tuwa-*` theme variables of [`@tuwaio/nova-core`](https://stories.tuwa.io/?path=/docs/packages-nova-core-overview--docs) (light and `.dark`), the styles of the Nextra parts and the Tailwind CSS v4 utilities used by the components, prefixed with `tuwadocs:`.

---

## 💾 Installation

```bash
pnpm add @tuwaio/docs-ui next nextra nextra-theme-docs react react-dom @heroicons/react
```

`next`, `nextra` and `nextra-theme-docs` are optional: only the `/nextra` and `/nextra/page` entries need them (`Navbar`, `Footer`, `DocsLayout`, `LocalizedPage`, `createDocsPage`), so the root entry works in any React app. `@heroicons/react` is needed by `PolicyDocument`.

Import the stylesheet after the Nextra theme. `dist/index.css` includes the stylesheet of Nova Core, whose fonts it carries in `dist/fonts`. An app that loads Nova Core or the SDK stylesheet itself imports `dist/site.css` instead, which has none of it:

```css
@import 'nextra-theme-docs/style.css';
@import '@tuwaio/docs-ui/dist/index.css';
@import 'tailwindcss';
```

---

## 🚀 Usage

The root layout of a TUWA documentation site:

```tsx
import { baseNavLinks, PreferenceExpiry, SiteLogo } from '@tuwaio/docs-ui';
import { Footer, Navbar } from '@tuwaio/docs-ui/nextra';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';
import type { ReactNode } from 'react';

const logo = <SiteLogo />;

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

### Languages of a project site

A TUWA project site (Orbit, SIWX, Satellite Connect, Pulsar, SDK) in English, Ukrainian and Simplified Chinese. The root layout renders `DocsLayout` around the page and keeps the language for 30 days:

```tsx
import { PreferenceExpiry, SiteLogo } from '@tuwaio/docs-ui';
import { DocsLayout } from '@tuwaio/docs-ui/nextra';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import type { ReactNode } from 'react';

const logo = <SiteLogo />;

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <PreferenceExpiry keys={['theme', 'tuwa-locale']} />
      </Head>
      <body>
        <DocsLayout
          logo={logo}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/TuwaIO/pulsar-core/tree/main/apps/docs"
          sidebarTitles={{ uk: { 'EVM Trackers Standalone': 'EVM-трекери окремо' } }}
        >
          {children}
        </DocsLayout>
      </body>
    </html>
  );
}
```

`src/app/[[...mdxPath]]/page.tsx` renders every page of `src/content` with its translations:

```tsx
import { createDocsPage } from '@tuwaio/docs-ui/nextra/page';

import { localizedPages } from '@/i18n/pages';

const { generateStaticParams, generateMetadata, Page } = createDocsPage({ localizedPages });

export { generateMetadata, generateStaticParams };
export default Page;
```

The translations are MDX files with the path of their English page under `src/i18n/<language>` (`src/i18n/uk/index.mdx` translates `src/content/index.mdx`), listed by route in `src/i18n/pages.ts`:

```ts
import type { LocalizedPageLoaders } from '@tuwaio/docs-ui/nextra/page';

export const localizedPages: Record<string, LocalizedPageLoaders> = {
  '/': {
    uk: () => import('./uk/index.mdx'),
    'zh-CN': () => import('./zh-CN/index.mdx'),
  },
};
```

TypeScript types the imported MDX files with a declaration next to it (`src/i18n/mdx.d.ts`):

```ts
declare module '*.mdx' {
  import type { EvaluateResult } from 'nextra';

  const MDXContent: EvaluateResult['default'];
  export default MDXContent;
  export const toc: EvaluateResult['toc'];
  export const metadata: EvaluateResult['metadata'];
  export const sourceCode: EvaluateResult['sourceCode'];
}
```

A translation keeps the structure of its English page: the same code blocks in the same order, the same heading levels with the English heading ids written as `## Встановлення [#-installation]` (so anchors work in every language) and the same links. `tuwa-docs-i18n-check`, run from the docs app, checks it and that every translated page exists in every language (it gives headings their ids with the `github-slugger` of the site's `nextra` and fails when that cannot be loaded); add it to the build and to the pre-commit hook:

```json
{
  "scripts": {
    "build": "tuwa-docs-i18n-check && next build && pnpm postbuild",
    "i18n:check": "tuwa-docs-i18n-check"
  }
}
```

Client components inside `DocsLayout` read the language and the interface texts with `useDocsI18n()`.

`NextraDocsLayout` is the same layout without state: the language, its texts (`docsLabels[locale]`) and the page map come from props. The docs hub renders it with its own dictionaries and translates its sidebar by route with `localizePageMap(pageMap, {}, { routes })`.

### Language in the URL

A site can give each translation a URL of its own: English has no prefix, `/uk/...` and `/zh-CN/...` are real pages, prerendered in their language, so search engines find every language and a reader sees no English first. `@tuwaio/docs-ui/locale` has the path helpers (`localeOfPath`, `pathWithoutLocale`, `localizedPath`, and `languageAlternates` for `hreflang`), `prefixPageMapRoutes` gives the sidebar and the navbar the links of the language, the `logoLink` prop of `NextraDocsLayout` leads the logo there, and `useLocaleRouting` of `@tuwaio/docs-ui/routing` keeps the language and the URL together:

```tsx
'use client';

import { type TuwaLocale } from '@tuwaio/docs-ui/locale';
import { useLocaleRouting } from '@tuwaio/docs-ui/routing';

export function useLanguageSwitch(locale: TuwaLocale, setLocale: (locale: TuwaLocale) => void, resolved: boolean) {
  return useLocaleRouting({ locale, setLocale, resolved, hasLanguageUrl: (route) => route.startsWith('/guides') });
}
```

Picking a language goes to its URL with the query and the anchor. A reader with a saved or detected language who opens the English URL of such a page is taken to the URL of that language; crawlers stay where they are. The site gives the provider the language of the URL (the `[lang]` root layout) so the server renders it, and adds a route under `[lang]` for each page. The docs hub is built this way, with every page translated.

A project site has only a few translated pages, so only they move, and the English reference keeps its one URL. The English route goes to `src/app/(default)`, with a root layout that renders the document with `lang="en"`, and each language gets its own folder, as `src/app/uk`, with a root layout for that language and a route that serves its translated pages:

```tsx
import { createDocsPage } from '@tuwaio/docs-ui/nextra/page';

import { localizedPages } from '@/i18n/pages';

const { generateStaticParams, generateMetadata, Page } = createDocsPage({ localizedPages, locale: 'uk' });

// Only the translated pages: an unknown one is a 404
export const dynamicParams = false;

export { generateMetadata, generateStaticParams };
export default Page;
```

Folders with the name of the language and not one `[lang]` folder: a dynamic segment would take every English URL from the root route. The root layouts render `DocsLayout` with `initialLocale` for their language and `languageRoutes={Object.keys(localizedPages)}`, and the root metadata needs `metadataBase`, for the canonical URL and `hreflang`. A search from a translated page has to find the reference, so such a site indexes all its pages together: `tuwa-docs-search-index --force-language en`.

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

It writes the index to `public/_pagefind` (keep that directory in `.gitignore`) with the same URLs as `pagefind --site .next/server/app`, and fails when the build has no prerendered pages. Pages with their language in the URL get an index of that language, by the `lang` of their HTML.

---

## 🗄️ Browser Storage

`LocaleSwitcher` and `ThemeSwitcher` store nothing; they only call `onSelect` / `onToggle`, and the site keeps the choice. `DocsLayout`, `useLocaleState` and the providers of `createI18n` save the language the reader picks to `tuwa-locale` (`en`, `uk` or `zh-CN`) and read it on the next visit; list the key in `PreferenceExpiry` to forget it after 30 days. `PreferenceExpiry` stores `<key>:expires` (the time in epoch milliseconds) next to each key it is given, removes both once that time has passed, and wraps `Storage.prototype.setItem` on the page to date later writes of those keys. A change of language crossfades the page where the browser has view transitions (`useLocaleRouting`, and the `@view-transition` rule of `site.css` for a change that loads a new page); the inline script of `PreferenceExpiry` also takes such a crossfade quietly when the browser skips it.

## 🌐 External Services

`SiteLogo` loads its images from `tuwa.io`. `loadPolicy` requests `raw.githubusercontent.com/TuwaIO/workflows/main/docs/<slug>.json` (a translation: `docs/<language>/<slug>.json`, and the English file when it does not exist) on the server, cached by Next.js for an hour by default. The Download PDF button of `PolicyDocument` links to the PDF on the same host; the browser requests it only when it is clicked. `createDocsPage` and `LocalizedPage` send no requests: the translations are part of the page. The other components send no requests.

---

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/docs/blob/main/packages/docs-ui/LICENSE) file for details.
