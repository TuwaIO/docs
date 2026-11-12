import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PolicyDocument } from '../../../../packages/docs-ui/src/components/PolicyDocument';
import type { PolicyContent } from '../../../../packages/docs-ui/src/policies';

// The page of a policy (docs-ui, shown by tuwa.io) in paper and ink: the date in mono caps after a lit square, the
// title in large mono, a square language switch and a square PDF button with a pixel icon, the text on lines of 1px

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui/src');
const source = readFileSync(path.join(docsUi, 'components/PolicyDocument.tsx'), 'utf8');
const css = readFileSync(path.join(docsUi, 'styles/site.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rule = (selector: string) => {
  const start = css.indexOf(`\n${selector} {`);
  expect(start, selector).toBeGreaterThan(-1);
  return css.slice(start, css.indexOf('}', start));
};
const content: PolicyContent = {
  title: 'Refund Policy',
  updated: '2026-10-23',
  sections: [{ id: 'how-to-request-a-refund', title: 'How to request a refund' }],
  html: '<h2 id="how-to-request-a-refund">7. How to request a refund</h2><blockquote><p>Note</p></blockquote>',
  language: 'en',
  languages: ['en', 'uk'],
};
const markup = renderToStaticMarkup(createElement(PolicyDocument, { slug: 'refund', content }));

describe('the page of a policy', () => {
  it('dates the version in mono caps after a lit square, above the title', () => {
    const header = markup.slice(markup.indexOf('<header'), markup.indexOf('</header>'));
    expect(header).toMatch(
      /<p class="[^"]*tuwadocs:font-mono[^"]*tuwadocs:uppercase[^"]*"><span aria-hidden="true" class="[^"]*tuwadocs:bg-\[var\(--tuwa-docs-lit\)\]"><\/span>Last updated October 23, 2026<\/p><h1/,
    );
    expect(header).toMatch(/<h1 class="tuwadocs-policy-title [^"]*tuwadocs:font-medium[^"]*">Refund Policy<\/h1>/);
  });

  it('has a square language switch whose current language is a block of ink', () => {
    const current = markup.match(/<a[^>]*aria-current="page"[^>]*>English<\/a>/)?.[0] ?? '';
    expect(current).toContain('tuwadocs:bg-[var(--tuwa-text-primary)] tuwadocs:text-[var(--tuwa-docs-paper)]');
    const other = markup.match(/<a[^>]*hrefLang="uk"[^>]*>Українська<\/a>/)?.[0] ?? '';
    expect(other).toContain('tuwadocs:text-[var(--tuwa-text-secondary)]');
    expect(other).not.toContain('aria-current');
  });

  it('downloads the PDF with a square button and a pixel icon of Nova', () => {
    expect(source).toContain("import { ArrowDownTrayIcon } from '@tuwaio/nova-icons/24/outline';");
    const button = markup.match(/<a[^>]*refund\.pdf"[^>]*>/)?.[0] ?? '';
    expect(button).toContain('tuwadocs:border-[var(--tuwa-border-strong)]');
    expect(button).toContain('tuwadocs:h-[34px]');
    expect(markup).toMatch(/<svg[^>]*class="tuwadocs:h-4 tuwadocs:w-4 tuwadocs:shrink-0"/);
  });

  it('has no round corner, no fill of a card and no extra bold title', () => {
    expect(source).not.toMatch(/rounded|font-extrabold|--tuwa-bg-muted|--tuwa-bg-primary|shadow|@heroicons/);
  });

  it('draws a note in a frame of 1px with a strip of the accent, and the heads of a table in mono caps', () => {
    const note = rule('.tuwadocs-policy blockquote');
    expect(note).toContain('border: 1px solid var(--tuwa-border-primary);');
    expect(note).toContain('border-left: 3px solid var(--tuwa-docs-lit);');
    expect(note).not.toMatch(/background|radius/);
    const head = rule('.tuwadocs-policy th');
    expect(head).toContain('font-family: var(--tuwa-font-mono);');
    expect(head).toContain('text-transform: uppercase;');
    expect(head).not.toMatch(/background/);
    expect(rule('.tuwadocs-policy code')).not.toMatch(/radius/);
    expect(rule('.tuwadocs-policy ul')).toContain('list-style: square;');
  });
});
