import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { NotFoundContent } from '../components/NotFoundContent';
import { en, I18nProvider, uk } from '../i18n';
import { layers } from './ecosystem';

// The 404 page in paper and ink, on the frame of the main page: the number in pixels beside the title, the sections of
// the hub as cells on shared lines and the reference sites of the projects as small buttons

const read = (file: string) => readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const source = read('components/NotFoundContent.tsx');
const render = (locale: 'en' | 'uk' | 'zh-CN' = 'en') =>
  renderToStaticMarkup(
    createElement(I18nProvider, { initialLocale: locale, children: createElement(NotFoundContent) }),
  );
const markup = render();

describe('the 404 page', () => {
  // A 404 answers every unknown address, so its address cannot tell the shell that the page has the frame
  it('stands on the frame of the main page, and asks the shell for the footer of that frame', () => {
    expect(source).toContain('<div className={`${homeContentClassName} ${homeFrameClassName}`}>');
    for (const route of ['app/(default)/not-found.tsx', 'app/global-not-found.tsx'])
      expect(read(route)).toContain('<HubShell framed>');
    expect(read('app/[lang]/not-found.tsx')).toContain("from '../(default)/not-found'");
    expect(read('components/HubShell.tsx')).toContain('const isFramed = framed || FRAMED_PAGES.includes(');
  });

  it('has one title in ink, with no gradient, no card in a blur, no round corner and no heroicons', () => {
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`${en.notFound.heading}</h1>`);
    expect(source).not.toMatch(
      /bg-clip-text|text-transparent|--tuwa-hero-gradient|--tuwa-button-gradient|bg-gradient|backdrop-blur|rounded-|@heroicons/,
    );
  });

  it('draws its number in pixels that fly in once: the fours in ink, the zero lit', () => {
    const art = markup.slice(markup.indexOf('<svg viewBox="0 0 19 7"'), markup.indexOf('</svg>') + 6);
    expect(art).toContain('tuwa-pixel-art--assemble');
    expect(art.match(/<rect/g)).toHaveLength(48);
    expect(art.match(/data-lit="true"/g)).toHaveLength(20);
  });

  // The page is prerendered once for every address of its language: the address comes in the browser, after the load
  it('names no address on the server', () => {
    const kicker = markup.slice(0, markup.indexOf('<svg'));
    expect(kicker).toContain('404');
    expect(kicker).not.toContain(' · ');
    expect(source).toContain('useSyncExternalStore(noSubscription, readPath, noPath)');
  });

  it('leads to the sections of the hub in the language of the reader', () => {
    const sections = ['/guides', '/quasar', '/configurator', '/playground', '/comparisons', '/policies'];
    const cells = (page: string) =>
      [...page.matchAll(/<li class="border-b[^"]*"><a[^>]* href="([^"]+)"/g)].map((match) => match[1]);
    expect(cells(markup)).toEqual(sections);
    expect(cells(render('uk'))).toEqual(sections.map((href) => `/uk${href}`));
    expect(render('uk')).toContain(`${uk.notFound.heading}</h1>`);
    expect(markup).toContain(`href="/"`);
  });

  it('links the reference site of every project that has one, in a new tab', () => {
    const sites = layers
      .flatMap((layer) => layer.entries)
      .map((entry) => entry.docsUrl)
      .filter((url) => url.startsWith('https://'));
    expect(sites.length).toBeGreaterThan(0);
    for (const url of sites) expect(markup).toContain(`<a href="${url}" target="_blank" rel="noopener noreferrer"`);
  });
});
