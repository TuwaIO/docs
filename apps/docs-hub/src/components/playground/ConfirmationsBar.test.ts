import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ConfirmationsBar } from './nova/ConfirmationsBar';

describe('ConfirmationsBar', () => {
  it('fills up to the confirmations Nova requires', () => {
    const html = renderToStaticMarkup(createElement(ConfirmationsBar, { count: 3, required: 6 }));
    expect(html).toContain('aria-valuemax="6"');
    expect(html).toContain('width:50%');
  });

  it('fills up to the 32 confirmations of a finalized Solana transaction when Nova passes no requirement', () => {
    const html = renderToStaticMarkup(createElement(ConfirmationsBar, { count: 8 }));
    expect(html).toContain('aria-valuemax="32"');
    expect(html).toContain('width:25%');
  });
});
