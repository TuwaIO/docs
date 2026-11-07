import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

import type { PageMapItem } from 'nextra';
import { describe, expect, it } from 'vitest';

import {
  languageAlternates,
  localeOfPath,
  localizedPath,
  pathWithoutLocale,
  URL_LOCALES,
} from '../../../../packages/docs-ui/src/locale';
import { prefixPageMapRoutes } from '../../../../packages/docs-ui/src/pageMap';
import { languageTexts, localizedJsonLd } from './languageMetadata';
import { hasLanguageUrl, hrefInLanguage } from './languageUrls';

const APP = join(__dirname, '../app');

/**
 * The routes of a root layout that have a page file, relative to it.
 *
 * @param root - The folder of the root layout.
 * @returns The folders of its pages, with `page.ts` or `page.tsx`.
 */
const pagesOf = (root: string): string[] =>
  (readdirSync(join(APP, root), { recursive: true }) as string[])
    .filter((file) => /(^|\/)page\.tsx?$/.test(file))
    .sort();

describe('the routes of the languages', () => {
  it('has every English page under `[lang]`: a page without one is a 404 in that language', () => {
    const folder = (file: string) => dirname(file);
    expect(pagesOf('[lang]').map(folder)).toEqual(pagesOf('(default)').map(folder));
  });

  it('keeps the pages without MDX out of the page map of Nextra, which only reads `page.tsx`', () => {
    expect(pagesOf('[lang]/(home)').every((file) => file.endsWith('page.ts'))).toBe(true);
  });
});

describe('language in the URL', () => {
  it('gives English no prefix: every old link points to it', () => {
    expect(URL_LOCALES).toEqual(['uk', 'zh-CN']);
    expect(localizedPath('/quasar/webhooks', 'en')).toBe('/quasar/webhooks');
    expect(localizedPath('/uk/quasar/webhooks', 'en')).toBe('/quasar/webhooks');
  });

  it.each([
    ['/quasar/webhooks', 'uk', '/uk/quasar/webhooks'],
    ['/uk/quasar/webhooks', 'zh-CN', '/zh-CN/quasar/webhooks'],
    ['/', 'uk', '/uk'],
    ['/uk', 'en', '/'],
  ] as const)('puts %s in %s at %s', (path, locale, expected) => {
    expect(localizedPath(path, locale)).toBe(expected);
  });

  it.each([
    ['/uk/quasar', 'uk'],
    ['/zh-CN/quasar/api', 'zh-CN'],
    ['/uk', 'uk'],
    ['/quasar/webhooks', null],
    ['/', null],
    // Only the exact prefix: a page may be called anything
    ['/UK/quasar', null],
    ['/ukraine', null],
    ['/en/quasar', null],
  ])('reads the language of %s as %s', (path, locale) => {
    expect(localeOfPath(path)).toBe(locale);
  });

  it('takes the prefix off', () => {
    expect(pathWithoutLocale('/uk/quasar/webhooks')).toBe('/quasar/webhooks');
    expect(pathWithoutLocale('/zh-CN')).toBe('/');
    expect(pathWithoutLocale('/quasar')).toBe('/quasar');
  });

  it('names every language of a page, and English for everyone else', () => {
    expect(languageAlternates('/uk/quasar/webhooks')).toEqual({
      en: '/quasar/webhooks',
      uk: '/uk/quasar/webhooks',
      'zh-CN': '/zh-CN/quasar/webhooks',
      'x-default': '/quasar/webhooks',
    });
  });

  it('has language URLs on every page, not on the files next to them', () => {
    for (const route of [
      '/',
      '/quasar',
      '/quasar/webhooks',
      '/guides/full-stack-react',
      '/comparisons',
      '/playground',
    ]) {
      expect(hasLanguageUrl(route)).toBe(true);
    }
    for (const route of ['/llms.txt', '/quasar-openapi.yaml', '/manifest.json', '/brand/logo.svg']) {
      expect(hasLanguageUrl(route)).toBe(false);
    }
  });

  it('keeps a link in the language of the reader, with its anchor and query', () => {
    expect(hrefInLanguage('/quasar/api#keys', 'uk')).toBe('/uk/quasar/api#keys');
    expect(hrefInLanguage('/configurator?chain=evm', 'uk')).toBe('/uk/configurator?chain=evm');
    expect(hrefInLanguage('/', 'zh-CN')).toBe('/zh-CN');
    expect(hrefInLanguage('/quasar/api', 'en')).toBe('/quasar/api');
    expect(hrefInLanguage('/llms.txt', 'uk')).toBe('/llms.txt');
    expect(hrefInLanguage('https://tuwa.io', 'uk')).toBe('https://tuwa.io');
  });

  it('prefixes the links of the top pages of the navbar, which come from `_meta`', () => {
    const data = { main: { title: 'Main', href: '/' }, guides: { type: 'page' }, x: { href: 'https://x.com' } };
    const flat = { name: 'main', title: 'Main', href: '/' };
    const [prefixed, flatPrefixed] = prefixPageMapRoutes([{ data }, flat] as PageMapItem[], 'uk', hasLanguageUrl);
    expect(prefixed).toEqual({ data: { ...data, main: { title: 'Main', href: '/uk' } } });
    expect(flatPrefixed).toEqual({ ...flat, href: '/uk' });
    expect(data.main.href).toBe('/');
    expect(flat.href).toBe('/');
  });

  it('gives a page its title and description in the language of the URL', () => {
    const english = { title: 'Webhooks', description: 'English' };
    expect(languageTexts('/comparisons', 'uk', english).title).toContain('порівняно');
    expect(languageTexts('/guides/full-stack-react', 'uk', english)).toEqual({
      title: 'Full-Stack React застосунок',
      description: expect.stringContaining('Повна інтеграція'),
    });
    expect(languageTexts('/guides/nothing-like-this', 'uk', english)).toEqual(english);
    expect(languageTexts('/comparisons', 'en', english)).toEqual(english);
  });

  it('names the language and the URL of a page in its structured data', () => {
    const data = {
      inLanguage: 'en',
      url: 'https://docs.tuwa.io/comparisons',
      isPartOf: 'https://docs.tuwa.io',
      name: 'A',
    };
    expect(localizedJsonLd(data, '/comparisons', 'uk')).toEqual({
      inLanguage: 'uk',
      url: 'https://docs.tuwa.io/uk/comparisons',
      isPartOf: 'https://docs.tuwa.io',
      name: expect.stringContaining('порівняно'),
      description: expect.stringContaining('RainbowKit'),
    });
    expect(localizedJsonLd(data, '/comparisons')).toBe(data);
  });

  // Nextra finds the active page and its sidebar by comparing these routes with the URL
  it('prefixes the sidebar routes that have language URLs', () => {
    const pageMap = [
      { name: 'guides', route: '/guides', children: [{ name: 'a', route: '/guides/a' }] },
      { name: 'quasar', route: '/quasar', children: [{ name: 'webhooks', route: '/quasar/webhooks' }] },
      { data: { quasar: 'Quasar' } },
    ] as unknown as PageMapItem[];
    const prefixed = prefixPageMapRoutes(pageMap, 'uk', hasLanguageUrl) as unknown as {
      route?: string;
      children?: { route: string }[];
    }[];
    expect(prefixed[0]?.route).toBe('/uk/guides');
    expect(prefixed[0]?.children?.[0]?.route).toBe('/uk/guides/a');
    expect(prefixed[1]?.route).toBe('/uk/quasar');
    expect(prefixed[1]?.children?.[0]?.route).toBe('/uk/quasar/webhooks');
    expect((pageMap[1] as { route: string }).route).toBe('/quasar');
  });
});
