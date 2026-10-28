import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import type { PageMapItem } from 'nextra';
import { createElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { DocsLayout } from '../../../../packages/docs-ui/src/components/DocsLayout';
import { LocalizedPage, type LocalizedPageVariant } from '../../../../packages/docs-ui/src/components/LocalizedPage';
import { DocsI18nProvider } from '../../../../packages/docs-ui/src/docsI18n';
import { docsLabels } from '../../../../packages/docs-ui/src/docsLabels';
import { localizePageMap } from '../../../../packages/docs-ui/src/pageMap';
import {
  checkSiteTranslations,
  checkTranslation,
  extractCodeBlocks,
  extractHeadings,
  extractLinks,
  type HeadingSlugger,
  loadNextraSlugger,
} from '../../../../packages/docs-ui/src/translationCheck';
import { en, uk, zhCN } from '../i18n';

// The project documentation sites (Orbit, SIWX, Satellite Connect, Pulsar, SDK) are in English, Ukrainian and
// Simplified Chinese (owner decision 2026-10-28): the hub model (one URL, the language kept in `tuwa-locale`), with the
// shared parts in @tuwaio/docs-ui. The hand-written pages are translated, package READMEs and the API reference stay in
// English with a note. These tests keep the shared parts: the interface texts, the sidebar titles, the page that
// switches to its translation and the check that keeps translations in line with their English pages.

vi.mock('nextra-theme-docs', () => ({
  // Stand-ins that render what the tests read: the layout props, the navbar children and the page wrapper
  Layout: (props: Record<string, unknown> & { children: ReactNode; navbar: ReactNode; footer: ReactNode }) =>
    createElement(
      'div',
      { 'data-layout': '' },
      props.navbar,
      createElement('pre', { 'data-props': '' }, JSON.stringify(layoutPropsOf(props))),
      props.search as ReactNode,
      props.children,
      props.footer,
    ),
  LastUpdated: ({ children }: { children: ReactNode }) => createElement('span', null, children),
  Navbar: ({ logo, children }: { logo: ReactNode; children?: ReactNode }) => createElement('nav', null, logo, children),
  Footer: ({ children }: { children: ReactNode }) => createElement('footer', null, children),
  useMDXComponents: () => ({
    wrapper: ({
      toc,
      metadata,
      children,
    }: {
      toc: { id: string }[];
      metadata: { title: string };
      children: ReactNode;
    }) =>
      createElement(
        'article',
        { 'data-title': metadata.title, 'data-toc': toc.map((item) => item.id).join(',') },
        children,
      ),
  }),
}));

vi.mock('nextra/components', () => ({
  Callout: ({ children }: { children: ReactNode }) => createElement('aside', { 'data-callout': '' }, children),
  Search: ({ placeholder }: { placeholder: string }) => createElement('input', { placeholder }),
}));

vi.mock('../../../../packages/docs-ui/src/components/LocaleSwitcher', () => ({
  LocaleSwitcher: ({ locale, ariaLabel }: { locale: string; ariaLabel: string }) =>
    createElement('button', { 'data-locale': locale, 'aria-label': ariaLabel }),
}));

/** The props of the Nextra `Layout` that the language changes, as JSON-friendly values. */
function layoutPropsOf(props: Record<string, unknown>) {
  const { editLink, feedback, toc, themeSwitch, pageMap } = props as {
    editLink: string;
    feedback: { content: string };
    toc: { title: string; backToTop: string };
    themeSwitch: Record<string, string>;
    pageMap: PageMapItem[];
  };
  return { editLink, feedback: feedback.content, toc, themeSwitch, pageMap };
}

/** Collects every key path of an object, so dictionaries of different languages can be compared. */
function keysOf(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    keysOf(child, prefix ? `${prefix}.${key}` : key),
  );
}

const pageMap: PageMapItem[] = [
  {
    data: {
      index: { title: 'Introduction' },
      '--': { type: 'separator' },
      packages: { title: 'Packages' },
      guides: { title: 'Guides', href: 'https://docs.tuwa.io/guides' },
    },
  },
  { name: 'index', route: '/', frontMatter: { title: 'Introduction' }, title: 'Introduction' } as PageMapItem,
  {
    name: 'packages',
    route: '/packages',
    title: 'Packages',
    children: [
      { data: { index: 'Overview', 'satellite-core': '@tuwaio/satellite-core' } },
      { name: 'index', route: '/packages', frontMatter: { title: 'Packages' }, title: 'Overview' } as PageMapItem,
    ],
  } as PageMapItem,
];

describe('the interface texts of the documentation sites', () => {
  it('have the same keys and no empty text in every language', () => {
    const englishKeys = keysOf({ ...docsLabels.en, sidebar: undefined });
    for (const labels of Object.values(docsLabels)) {
      expect(keysOf({ ...labels, sidebar: undefined })).toEqual(englishKeys);
      expect(JSON.stringify(labels)).not.toMatch(/:""/);
    }
    expect(Object.keys(docsLabels.uk.sidebar)).toEqual(Object.keys(docsLabels['zh-CN'].sidebar));
    expect(docsLabels.en.sidebar).toEqual({});
  });

  it('never use the word «рушій» and keep the TUWA product names', () => {
    expect(JSON.stringify(docsLabels.uk)).not.toMatch(/руші/i);
    expect(docsLabels.uk.englishOnly).toContain('README');
    expect(docsLabels['zh-CN'].englishOnly).toContain('README');
  });

  it('are the texts of the docs hub, kept in one place', () => {
    for (const [locale, hub] of [
      ['en', en],
      ['uk', uk],
      ['zh-CN', zhCN],
    ] as const) {
      expect(hub.footer).toEqual(docsLabels[locale].footer);
      expect(hub.nav.selectLanguage).toBe(docsLabels[locale].selectLanguage);
      expect(hub.nextra).toMatchObject(docsLabels[locale].nextra);
    }
  });
});

describe('localizePageMap', () => {
  it('translates the sidebar titles by their English text and leaves package names as they are', () => {
    const localized = localizePageMap(pageMap, docsLabels.uk.sidebar);
    const [meta, intro, packages] = localized as [
      { data: Record<string, { title?: string }> },
      { title: string; frontMatter: { title: string } },
      {
        title: string;
        children: [{ data: Record<string, string> }, { title: string; frontMatter: { title: string } }];
      },
    ];
    expect(meta.data.index.title).toBe('Вступ');
    expect(meta.data.packages.title).toBe('Пакети');
    expect(meta.data.guides).toEqual({ title: 'Посібники', href: 'https://docs.tuwa.io/guides' });
    expect(meta.data['--']).toEqual({ type: 'separator' });
    expect(intro.title).toBe('Вступ');
    expect(intro.frontMatter.title).toBe('Вступ');
    expect(packages.title).toBe('Пакети');
    expect(packages.children[0].data).toEqual({ index: 'Огляд', 'satellite-core': '@tuwaio/satellite-core' });
    expect(packages.children[1]).toMatchObject({ title: 'Огляд', frontMatter: { title: 'Пакети' } });
  });

  it('copies changed items and returns the page map itself when nothing is translated', () => {
    const before = JSON.stringify(pageMap);
    localizePageMap(pageMap, docsLabels['zh-CN'].sidebar);
    expect(JSON.stringify(pageMap)).toBe(before);
    expect(localizePageMap(pageMap, {})).toBe(pageMap);
  });
});

const variant = (title: string, ids: string[]): LocalizedPageVariant => ({
  content: createElement('h1', null, title),
  toc: ids.map((id) => ({ id, value: id, depth: 2 })),
  metadata: { title, filePath: `${title}.mdx` },
});

describe('LocalizedPage', () => {
  const render = (locale: 'en' | 'uk' | 'zh-CN', variants: Parameters<typeof LocalizedPage>[0]['variants']) =>
    renderToStaticMarkup(
      createElement(DocsI18nProvider, { initialLocale: locale, children: createElement(LocalizedPage, { variants }) }),
    );

  it('shows the translation of the active language with its own table of contents', () => {
    const html = render('uk', {
      en: variant('Introduction', ['-installation']),
      uk: variant('Вступ', ['-installation']),
    });
    expect(html).toContain('data-title="Вступ"');
    expect(html).toContain('<h1>Вступ</h1>');
    expect(html).toContain('data-toc="-installation"');
    expect(html).not.toContain('data-callout');
  });

  it('shows English with a note in the active language when the page has no translation', () => {
    const html = render('zh-CN', { en: variant('@tuwaio/satellite-core', ['-usage']) });
    expect(html).toContain('<h1>@tuwaio/satellite-core</h1>');
    expect(html).toContain(docsLabels['zh-CN'].englishOnly);
  });

  it('renders English without a note on the server and for English readers', () => {
    const html = renderToStaticMarkup(
      createElement(LocalizedPage, { variants: { en: variant('Introduction', []), uk: variant('Вступ', []) } }),
    );
    expect(html).toContain('<h1>Introduction</h1>');
    expect(html).not.toContain('data-callout');
  });
});

describe('DocsLayout', () => {
  const render = (initialLocale: 'en' | 'uk' | 'zh-CN', sidebarTitles?: Record<string, Record<string, string>>) =>
    renderToStaticMarkup(
      createElement(DocsLayout, {
        logo: createElement('img', { alt: 'TUWA' }),
        pageMap,
        docsRepositoryBase: 'https://github.com/TuwaIO/satellite-connect/tree/main/apps/docs',
        initialLocale,
        sidebarTitles,
        children: createElement('main', null, 'page'),
      }),
    );
  const propsOf = (html: string) =>
    JSON.parse(
      html
        .match(/<pre data-props="">(.*?)<\/pre>/)![1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&'),
    ) as ReturnType<typeof layoutPropsOf>;

  it('puts the language switch in the navbar and the interface texts of the language in the layout', () => {
    const html = render('uk');
    expect(html).toMatch(/<nav><img alt="TUWA"\/>.*<button data-locale="uk" aria-label="Оберіть мову"><\/button>/);
    expect(html).toContain(`placeholder="${docsLabels.uk.nextra.searchPlaceholder}"`);
    expect(html).toContain(docsLabels.uk.footer.description);
    const props = propsOf(html);
    expect(props.editLink).toBe('Редагувати цю сторінку');
    expect(props.toc).toEqual({ title: 'На цій сторінці', backToTop: 'Прокрутити вгору' });
    expect(props.themeSwitch).toEqual({ light: 'Світла', dark: 'Темна', system: 'Системна' });
    expect(JSON.stringify(props.pageMap)).toContain('"title":"Вступ"');
  });

  it('adds the sidebar titles of the site and keeps English untouched', () => {
    const zh = propsOf(render('zh-CN', { 'zh-CN': { Overview: '总览' } }));
    expect(JSON.stringify(zh.pageMap)).toContain('"index":"总览"');
    expect(JSON.stringify(zh.pageMap)).toContain('"title":"简介"');
    const english = propsOf(render('en', { uk: { Introduction: 'Вступ' } }));
    expect(english.pageMap).toEqual(JSON.parse(JSON.stringify(pageMap)));
    expect(english.editLink).toBe('Edit this page');
  });
});

describe('the translation check', () => {
  const english = [
    '# Introduction',
    '',
    'See [Packages](/packages) and <img src="https://tuwa.io/a.png" />.',
    '',
    '## 🏛️ Where It Fits',
    '',
    '```bash',
    'pnpm add @tuwaio/satellite-core',
    '```',
    '',
    '## 💾 Installation',
    '',
    'Read the [guide](https://docs.tuwa.io/guides).',
  ].join('\n');
  let slugger: HeadingSlugger;

  beforeAll(async () => {
    // The ids the sites give their headings come from the slugger of Nextra (github-slugger), loaded from the hub
    slugger = (await loadNextraSlugger(resolve(__dirname, '../..')))!;
    expect(slugger).toBeTypeOf('function');
  });

  it('reads code blocks, headings and links outside code blocks', () => {
    expect(extractCodeBlocks(english)).toEqual(['```bash\npnpm add @tuwaio/satellite-core\n```']);
    expect(extractHeadings('## Встановлення [#-installation]\n```\n## not a heading\n```')).toEqual([
      { depth: 2, text: 'Встановлення', customId: '-installation' },
    ]);
    expect(extractLinks(english)).toEqual(['/packages', 'https://tuwa.io/a.png', 'https://docs.tuwa.io/guides']);
  });

  it('accepts a translation with the English code, heading ids and links', () => {
    const ids = [slugger()('🏛️ Where It Fits'), slugger()('💾 Installation')];
    const translated = english
      .replace('# Introduction', '# Вступ')
      .replace('See [Packages]', 'Дивіться [Пакети]')
      .replace('## 🏛️ Where It Fits', `## 🏛️ Місце в TUWA [#${ids[0]}]`)
      .replace('## 💾 Installation', `## 💾 Встановлення [#${ids[1]}]`)
      .replace('Read the [guide]', 'Прочитайте [посібник]');
    expect(checkTranslation(english, translated, slugger)).toEqual([]);
  });

  it('reports changed code, missing heading ids, other heading levels and other links', () => {
    const translated = english
      .replace('pnpm add @tuwaio/satellite-core', 'pnpm add @tuwaio/satellite-evm')
      .replace('## 💾 Installation', '## 💾 Встановлення')
      .replace('https://docs.tuwa.io/guides', 'https://docs.tuwa.io/quasar');
    const issues = checkTranslation(english, translated, slugger);
    expect(issues).toHaveLength(3);
    expect(issues[0]).toContain('code block 1 differs');
    expect(issues[1]).toContain('add [#-installation]');
    expect(issues[2]).toContain('missing: https://docs.tuwa.io/guides');
    expect(checkTranslation(english, english.replace('## 💾 Installation', '### 💾 Installation'))[0]).toContain(
      'heading levels',
    );
  });

  describe('of a site', () => {
    let site: string;
    const write = (path: string, content: string) => {
      mkdirSync(dirname(join(site, path)), { recursive: true });
      writeFileSync(join(site, path), content);
    };

    beforeEach(() => {
      site = mkdtempSync(join(tmpdir(), 'docs-i18n-'));
      write('src/content/index.mdx', english);
      write('src/content/packages/index.md', '# Packages\n\n- [core](/packages/core)\n');
    });
    afterEach(() => rmSync(site, { recursive: true, force: true }));

    it('checks every translated page in every language against its English page', async () => {
      const translated = english.replace(/## (.*)/g, (_, text: string) => `## ${text} [#${slugger()(text)}]`);
      write('src/i18n/uk/index.mdx', translated);
      write('src/i18n/zh-CN/index.mdx', translated);
      write('src/i18n/uk/packages/index.mdx', '# Пакети\n\n- [core](/packages/core)\n');
      write('src/i18n/uk/guide.mdx', '# Посібник\n');

      const { files, issues } = await checkSiteTranslations({ cwd: site, createSlugger: slugger });
      expect(files).toBe(4);
      expect(issues).toEqual([
        { file: 'src/i18n/uk/guide.mdx', message: 'has no English page src/content/guide.mdx' },
        { file: 'src/i18n/zh-CN/guide.mdx', message: 'is missing: every translated page exists in every language' },
        {
          file: 'src/i18n/zh-CN/packages/index.mdx',
          message: 'is missing: every translated page exists in every language',
        },
      ]);
    });

    it('fails outside a docs app', async () => {
      await expect(checkSiteTranslations({ cwd: join(site, 'src') })).rejects.toThrow(
        'run the check from the docs app',
      );
    });
  });
});
