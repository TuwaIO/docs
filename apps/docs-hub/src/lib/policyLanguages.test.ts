import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PolicyDocument } from '../../../../packages/docs-ui/src/components/PolicyDocument';
import {
  getPolicyFileUrl,
  getPolicyPageUrl,
  loadPolicy,
  type PolicyContent,
  policyLanguageFrom,
} from '../../../../packages/docs-ui/src/policies';

const SOURCE = 'https://raw.githubusercontent.com/TuwaIO/workflows/main/docs';
const page = (overrides: Record<string, unknown> = {}) => ({
  title: 'Політика повернення коштів',
  updated: '23 жовтня 2026 р.',
  sections: [{ id: 'how-to-request-a-refund', title: 'Як запросити повернення' }],
  html: '<h2 id="how-to-request-a-refund">7. Як запросити повернення</h2><p>Текст</p>',
  language: 'uk',
  languages: ['en', 'uk'],
  ...overrides,
});
const answer = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

afterEach(() => vi.unstubAllGlobals());

// The policies have a Ukrainian version next to the English one (Law of Ukraine on the state language; lawyer
// 2026-10-23): every policy page offers the languages its policy exists in
describe('policy languages', () => {
  it('reads the language of a page from its lang parameter, English otherwise', () => {
    expect(policyLanguageFrom('uk')).toBe('uk');
    expect(policyLanguageFrom(['uk', 'en'])).toBe('uk');
    expect(policyLanguageFrom('de')).toBe('en');
    expect(policyLanguageFrom(undefined)).toBe('en');
  });

  it('finds a translation in the folder of its language, and its page by ?lang', () => {
    expect(getPolicyFileUrl('refund', 'pdf', SOURCE, 'uk')).toBe(`${SOURCE}/uk/refund.pdf`);
    expect(getPolicyFileUrl('refund', 'json')).toBe(`${SOURCE}/refund.json`);
    expect(getPolicyPageUrl('terms', 'https://tuwa.io', 'uk')).toBe('https://tuwa.io/terms?lang=uk');
    expect(getPolicyPageUrl('terms')).toBe('https://tuwa.io/terms');
  });

  it('loads the translation with its languages', async () => {
    const fetchMock = vi.fn(async () => answer(page()));
    vi.stubGlobal('fetch', fetchMock);
    const content = await loadPolicy('refund', { language: 'uk' });
    expect(fetchMock.mock.calls[0][0]).toBe(`${SOURCE}/uk/refund.json`);
    expect(content).toMatchObject({ language: 'uk', languages: ['en', 'uk'], title: 'Політика повернення коштів' });
  });

  it('shows the English text when a policy has no translation, and reads files made before translations', async () => {
    const english = page({ title: 'Refund Policy', language: undefined, languages: undefined });
    const fetchMock = vi.fn(async (url: string) => (url.includes('/uk/') ? answer({}, 404) : answer(english)));
    vi.stubGlobal('fetch', fetchMock);
    const content = await loadPolicy('refund', { language: 'uk' });
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([`${SOURCE}/uk/refund.json`, `${SOURCE}/refund.json`]);
    expect(content).toMatchObject({ title: 'Refund Policy', language: 'en', languages: ['en'] });
  });

  it('renders the page in its language with a switch, its PDF and the anchors of the English sections', () => {
    const html = renderToStaticMarkup(
      createElement(PolicyDocument, { slug: 'refund', content: page() as PolicyContent }),
    );
    expect(html).toContain('lang="uk"');
    expect(html).toContain('Завантажити PDF');
    expect(html).toContain(`href="${SOURCE}/uk/refund.pdf"`);
    expect(html).toContain('aria-label="Мова"');
    expect(html).toMatch(/<a[^>]*href="\?lang=en"[^>]*hrefLang="en"[^>]*>English<\/a>/);
    expect(html).toMatch(/<a[^>]*href="\?lang=uk"[^>]*aria-current="page"[^>]*>Українська<\/a>/);
    expect(html).toContain('id="how-to-request-a-refund"');
  });

  it('shows no switch for a policy in one language, and lets a site link its own pages', () => {
    const single = renderToStaticMarkup(
      createElement(PolicyDocument, {
        slug: 'refund',
        content: page({ title: 'Refund Policy', language: 'en', languages: ['en'] }) as PolicyContent,
      }),
    );
    expect(single).not.toContain('aria-label="Language"');
    expect(single).toContain('Download PDF');
    const custom = renderToStaticMarkup(
      createElement(PolicyDocument, {
        slug: 'terms',
        content: page() as PolicyContent,
        languageHref: (language) => `/terms${language === 'en' ? '' : `?lang=${language}`}`,
      }),
    );
    expect(custom).toContain('href="/terms"');
  });
});
