import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getPolicyFileUrl, getPolicyPageUrl, publishedPolicies } from '../../../../packages/docs-ui/src/policies';
import { PoliciesContent } from '../components/PoliciesContent';
import { en, I18nProvider } from '../i18n';

// The policies page in paper and ink, on the frame of the main page: the published policies as a ledger, a row each,
// with small buttons to the page and the PDF of each, and the contacts on a shared line

const source = readFileSync(path.resolve(__dirname, '../components/PoliciesContent.tsx'), 'utf8');
const dates = publishedPolicies.map((_, index) => `2026-10-${String(10 + index).padStart(2, '0')}`);
const render = (locale: 'en' | 'uk' | 'zh-CN' = 'en') =>
  renderToStaticMarkup(
    createElement(I18nProvider, { initialLocale: locale, children: createElement(PoliciesContent, { dates }) }),
  );
const markup = render();

describe('the policies page', () => {
  it('stands on the frame of the main page, and the footer takes the sides of that frame', () => {
    expect(source).toContain('<div className={`${homeContentClassName} ${homeFrameClassName}`}>');
    const shell = readFileSync(path.resolve(__dirname, '../components/HubShell.tsx'), 'utf8');
    expect(shell).toMatch(/const FRAMED_PAGES = \[[^\]]*'\/policies'[^\]]*\];/);
  });

  it('has one title in ink, with no gradient text and no card in a blur', () => {
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`>${en.policies.title}</h1>`);
    expect(source).not.toMatch(/bg-clip-text|text-transparent|--tuwa-hero-gradient|bg-gradient|backdrop-blur|rounded-/);
  });

  // The kicker dates the page by the latest version among the policies
  it('says when the latest policy was updated', () => {
    const kicker = markup.slice(0, markup.indexOf('<h1'));
    expect(kicker).toContain(en.policies.badge.replace(/&/g, '&amp;'));
    expect(kicker).toContain(`October ${10 + publishedPolicies.length - 1}, 2026`);
  });

  it('lists every published policy as a row of a ledger, with its number, date, page and PDF', () => {
    const rows = markup.match(/<li class="grid grid-cols-\[34px_minmax\(0,1fr\)\][^"]*"/g) ?? [];
    expect(rows).toHaveLength(publishedPolicies.length);
    const numbers = [
      ...markup.matchAll(/<span aria-hidden="true" class="grid h-\[34px\] w-\[34px\][^"]*">(\d\d)<\/span>/g),
    ];
    expect(numbers.map((match) => match[1])).toEqual(
      publishedPolicies.map((_, index) => String(index + 1).padStart(2, '0')),
    );
    for (const policy of publishedPolicies) {
      expect(markup).toContain(`href="${getPolicyPageUrl(policy.slug)}"`);
      expect(markup).toContain(`href="${getPolicyFileUrl(policy.slug, 'pdf')}"`);
    }
    expect(markup.match(/target="_blank" rel="noopener noreferrer"/g)).toHaveLength(publishedPolicies.length * 2);
  });

  it('takes its icons from Nova, none from heroicons', () => {
    expect(source).not.toContain('@heroicons');
    expect(source).toMatch(/import \{ ArrowDownTrayIcon \} from '@tuwaio\/sdk\/nova-icons\/24\/outline'/);
    expect(source).toMatch(/<ArrowDownTrayIcon className="h-4 w-4 /);
  });

  it('says where to report a vulnerability and where to ask legal questions', () => {
    expect(markup).toContain('href="mailto:security@tuwa.io"');
    expect(markup).toContain('href="mailto:admin@tuwa.io"');
    expect(markup).toContain(en.ui.policiesExtra.vulnTitle);
    expect(markup).toContain(en.ui.policiesExtra.legalTitle);
  });

  it('reads in every language of the hub', () => {
    expect(render('uk').match(/<h1/g)).toHaveLength(1);
    expect(render('zh-CN').match(/<li class="grid /g)).toHaveLength(publishedPolicies.length);
  });
});
