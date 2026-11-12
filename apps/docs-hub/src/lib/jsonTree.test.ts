import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { JsonTree } from '../components/playground/JsonTree';

// The tree of the State and Events tabs of the Playground. A row that folds is a pointer target: its rows were 19.5px
// tall and stood one under another, under the 24px of a target (WCAG 2.5.8, axe `target-size`), and the count beside a
// key (`{2}`, `Array(3)`) was set in the tertiary ink, which is for marks and does not reach 4.5:1 as a text (axe
// `color-contrast`)

const markup = renderToStaticMarkup(
  createElement(JsonTree, { value: { name: 'TUWA', count: 2, list: [1, { deep: true }], empty: {}, call: () => 1 } }),
);

describe('the tree of a value in the Playground', () => {
  it('gives every row the height of a pointer target', () => {
    const folds = [...markup.matchAll(/<summary class="([^"]*)"/g)].map((match) => match[1] ?? '');
    const leaves = [...markup.matchAll(/<div class="(pl-4[^"]*)"/g)].map((match) => match[1] ?? '');
    expect(folds).toHaveLength(4);
    expect(leaves).toHaveLength(5);
    // 24px lines: the rows that fold reach the size of a target, and the rows between them keep the same rhythm
    for (const classes of [...folds, ...leaves]) expect(classes.split(' ')).toContain('leading-6');
  });

  it('sets no text in the tertiary ink', () => {
    expect(markup).not.toContain('--tuwa-text-tertiary');
    expect(markup).toMatch(/<span class="text-\[var\(--tuwa-text-secondary\)\]">\{5\}<\/span>/);
    expect(markup).toMatch(/<span class="text-\[var\(--tuwa-text-secondary\)\]">Array\(2\)<\/span>/);
  });

  it('keeps what a value is readable', () => {
    expect(markup).toContain('&quot;TUWA&quot;');
    expect(markup).toContain('ƒ()');
    expect(markup).toContain('<details open="" class="pl-4">');
  });
});
