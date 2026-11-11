import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

// The documentation sites read in Geist and Geist Mono only, in every language, with the generic fonts of the system
// behind them: Chinese falls to the CJK font of the system, as Geist has none. Nova lists more monospace fonts after
// Geist Mono and puts JetBrains Mono first for Ukrainian, so docs-ui sets the stacks again over the copy it inlines.
// Nextra's chrome and code blocks and the `font-mono` class of the hub were in the fonts of the system until docs-ui and
// the hub pointed them at these stacks.

const docsUi = path.resolve(__dirname, '../../../../packages/docs-ui');
const globalsFile = path.resolve(__dirname, '../app/globals.css');
const read = (file: string) => readFileSync(file, 'utf8');

const stylesheets = [
  ['docs-ui dist/index.css', path.join(docsUi, 'dist/index.css')],
  ['docs-ui dist/site.css', path.join(docsUi, 'dist/site.css')],
  ['hub globals.css', globalsFile],
] as const;

/** Nova Core's own stylesheet, the one docs-ui inlines into `dist/index.css`. */
const novaCss = read(createRequire(path.join(docsUi, 'package.json')).resolve('@tuwaio/nova-core/dist/index.css'));

const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const squeeze = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Every rule without nested rules, with its selector (or `@font-face`), its body and where it starts. A statement before it
 * (`@import …;`) ends with a semicolon, which no selector has. */
function rulesOf(css: string) {
  return [...withoutComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selector: squeeze((match[1] as string).split(';').at(-1) as string),
    body: match[2] as string,
    index: match.index ?? 0,
  }));
}

/** The declarations of a rule body, by property, with their values squeezed to one line. */
function declarationsOf(body: string) {
  return [...body.matchAll(/(--[\w-]+|[a-z-]+)\s*:\s*([^;]+);?/g)].map((match) => ({
    property: match[1] as string,
    value: squeeze(match[2] as string),
  }));
}

/** The value of a property in the rules of a selector, the last one of the stylesheet. */
function lastValue(css: string, selector: string, property: string) {
  const values = rulesOf(css)
    .filter((rule) => rule.selector === selector)
    .flatMap((rule) =>
      declarationsOf(rule.body)
        .filter((declaration) => declaration.property === property)
        .map((declaration) => ({ value: declaration.value, index: rule.index })),
    );
  return values.at(-1);
}

const otherFonts =
  /JetBrains Mono|Cascadia|Fira (?:Code|Mono|Sans)|(?:^|[\s,'"])Inter['"]?\s*(?:,|$)|fonts\.googleapis/;
const geistOnly = (stack: string) => /^'Geist( Mono)?',/.test(stack) && !otherFonts.test(stack);

describe('the fonts of the documentation sites', () => {
  it.each(stylesheets)('%s declares only Geist and Geist Mono, from files published next to it', (_, file) => {
    const faces = rulesOf(read(file)).filter((rule) => rule.selector === '@font-face');
    for (const face of faces) {
      const declarations = declarationsOf(face.body);
      const family = declarations.find((declaration) => declaration.property === 'font-family')?.value;
      expect(family?.replace(/['"]/g, '')).toMatch(/^Geist( Mono)?$/);
      const sources = declarations.find((declaration) => declaration.property === 'src')?.value ?? '';
      const urls = [...sources.matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map((match) => match[2]);
      expect(urls.length).toBeGreaterThan(0);
      for (const url of urls) expect(url).toMatch(/^\.\/fonts\/[\w.-]+\.woff2$/);
    }
  });

  it('carries the faces of Nova Core in the stylesheet that inlines it', () => {
    expect(rulesOf(read(path.join(docsUi, 'dist/index.css'))).some((rule) => rule.selector === '@font-face')).toBe(
      true,
    );
  });

  // Nova's stacks name other fonts after Geist; they may stay in the copy of Nova, where docs-ui overrides them
  it.each(stylesheets)('%s names no other font outside the inlined Nova Core', (_, file) => {
    const novaDeclarations = new Set(
      rulesOf(novaCss).flatMap((rule) =>
        declarationsOf(rule.body).map((declaration) => `${declaration.property}:${declaration.value}`),
      ),
    );
    const outsideNova = rulesOf(read(file))
      .flatMap((rule) => declarationsOf(rule.body).map((declaration) => ({ ...declaration, selector: rule.selector })))
      .filter((declaration) => otherFonts.test(declaration.value))
      .filter((declaration) => !novaDeclarations.has(`${declaration.property}:${declaration.value}`));
    expect(outsideNova).toEqual([]);
    expect(withoutComments(read(file))).not.toMatch(/fonts\.googleapis|fonts\.gstatic/);
  });

  it('sets the stacks of docs-ui after those of the inlined Nova Core, so they win at the root', () => {
    const css = read(path.join(docsUi, 'dist/index.css'));
    for (const property of ['--tuwa-font-sans', '--tuwa-font-mono']) {
      const nova = lastValue(novaCss, ':root', property);
      const docs = lastValue(css, ':root', property);
      expect(nova).toBeDefined();
      expect(docs && geistOnly(docs.value)).toBe(true);
      expect(docs!.value).not.toBe(nova!.value);
      // The copy of Nova's root rule in the inlined stylesheet comes first
      const novaInIndex = rulesOf(css).find(
        (rule) =>
          rule.selector === ':root' &&
          declarationsOf(rule.body).some(
            (declaration) => declaration.property === property && declaration.value === nova!.value,
          ),
      );
      expect(novaInIndex).toBeDefined();
      expect(docs!.index).toBeGreaterThan(novaInIndex!.index);
    }
  });

  it.each([
    ['source', path.join(docsUi, 'src/styles/site.css')],
    ['build', path.join(docsUi, 'dist/site.css')],
  ])('maps the fonts of Nextra and the Ukrainian monospace of Nova to Geist (%s)', (_, file) => {
    const css = read(file);
    expect(lastValue(css, ':root', '--x-font-sans')?.value).toBe('var(--tuwa-font-sans)');
    expect(lastValue(css, ':root', '--x-font-mono')?.value).toBe('var(--tuwa-font-mono)');
    for (const property of ['--tuwa-font-sans', '--tuwa-font-mono', '--tuwa-font-mono-uk']) {
      const stack = lastValue(css, ':root', property)?.value ?? '';
      expect(geistOnly(stack), `${property}: ${stack}`).toBe(true);
    }
    // Nova reads the Ukrainian stack to build its monospace for Ukrainian: pointing back at that would be a cycle
    expect(lastValue(css, ':root', '--tuwa-font-mono-uk')?.value).not.toContain('var(--tuwa-font-mono)');
  });

  it('keeps Nova reading the Ukrainian stack that docs-ui overrides', () => {
    expect(squeeze(novaCss)).toMatch(/--tuwa-font-mono: var\( --tuwa-font-mono-uk,/);
  });

  it('gives the font classes of the hub the stacks of docs-ui', () => {
    const css = read(globalsFile);
    const theme = rulesOf(css).find((rule) => rule.selector === '@theme inline');
    expect(theme).toBeDefined();
    const declarations = declarationsOf(theme!.body);
    expect(declarations).toEqual(
      expect.arrayContaining([
        { property: '--font-sans', value: 'var(--tuwa-font-sans)' },
        { property: '--font-mono', value: 'var(--tuwa-font-mono)' },
      ]),
    );
    expect(lastValue(css, '.font-geist-mono', 'font-family')?.value).toBe('var(--tuwa-font-mono) !important');
  });

  // The sizes of paper and ink are drawn on the browser's 16px root: a smaller root shrank every rem of the pages
  it.each([
    ['docs-ui site.css', path.join(docsUi, 'src/styles/site.css')],
    ['hub globals.css', globalsFile],
  ])('%s keeps the root font size of the browser', (_, file) => {
    const sized = rulesOf(read(file)).filter(
      (rule) =>
        /(^|,\s*)(html|:root)(\s*,|$)/.test(rule.selector) &&
        declarationsOf(rule.body).some((declaration) => declaration.property === 'font-size'),
    );
    expect(sized).toEqual([]);
  });
});
