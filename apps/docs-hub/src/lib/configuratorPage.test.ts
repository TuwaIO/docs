import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { FileTabs } from '../components/configurator/FileTabs';
import { ConfiguratorHeader, StackConfigurator } from '../components/configurator/StackConfigurator';
import { ARROW_RIGHT } from '../components/home/pixelArrows';
import { ScrollArrow } from '../components/ScrollArrow';
import { en, I18nProvider, uk, zhCN } from '../i18n';
import { allStackOptions, DEFAULT_STACK_OPTIONS, generateStack } from './configurator/generate';
import { scrollEdges, scrollStep } from './scrollEdges';

// The Stack Configurator in paper and ink, on the frame of the main page: the options and the result side by side on a
// shared line, steps with square numbers, file tabs whose open one is a block of ink, code on the paper of its frame

const read = (file: string) => readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const configurator = read('components/configurator/StackConfigurator.tsx');
const tabsSource = read('components/configurator/FileTabs.tsx');
const codeSource = read('components/configurator/CodeBlock.tsx');
const arrowsSource = read('components/ScrollArrow.tsx') + read('components/useScrollArrows.ts');
const globals = read('app/globals.css');
const inEnglish = (element: ReturnType<typeof createElement>, locale: 'en' | 'uk' | 'zh-CN' = 'en') =>
  renderToStaticMarkup(createElement(I18nProvider, { initialLocale: locale, children: element }));
const stack = generateStack(DEFAULT_STACK_OPTIONS);

describe('the configurator page', () => {
  it('stands on the frame of the main page, and the footer takes the sides of that frame', () => {
    const page = read('app/(default)/(home)/configurator/page.tsx');
    expect(page).toContain('<div className={`${homeContentClassName} ${homeFrameClassName}`}>');
    expect(page).toMatch(
      /<CrossMark x="left" y="top" \/>\s*<CrossMark x="right" y="top" \/>\s*<ConfiguratorHeader \/>/,
    );
    expect(read('components/HubShell.tsx')).toMatch(/const FRAMED_PAGES = \[[^\]]*'\/configurator'[^\]]*\];/);
  });

  it('has one title in ink and says how many stacks it generates, in every language', () => {
    const count = allStackOptions().length;
    const header = inEnglish(createElement(ConfiguratorHeader));
    expect(header.match(/<h1/g)).toHaveLength(1);
    expect(header).toContain(`>${en.configurator.titleHighlight}</h1>`);
    expect(header).toContain(`${count} stacks`);
    expect(inEnglish(createElement(ConfiguratorHeader), 'uk')).toContain(`${count} стеків`);
    for (const dictionary of [en, uk, zhCN])
      for (const form of ['one', 'few', 'many', 'other'] as const)
        expect(dictionary.configurator.stacks[form]).toContain('{n}');
    expect(configurator).not.toMatch(/bg-clip-text|text-transparent|--tuwa-hero-gradient|bg-gradient/);
  });

  // The options stay in sight beside the result, on a line both share, from line to line of the frame
  it('sets the options and the result side by side on a shared line', () => {
    const markup = inEnglish(createElement(StackConfigurator));
    expect(markup).toMatch(/class="relative grid grid-cols-1 border-t lg:grid-cols-\[372px_minmax\(0,1fr\)\]/);
    expect(markup).toMatch(/<aside[^>]*class="[^"]*lg:border-r/);
    expect(configurator).toContain('<div className="lg:sticky lg:top-[88px]">');
    expect(configurator).toContain('${homeEdgeToEdgeClassName}');
  });

  it('numbers its steps in squares on lines', () => {
    const markup = inEnglish(createElement(StackConfigurator));
    const numbers = [
      ...markup.matchAll(/<span aria-hidden="true" class="grid h-\[34px\] w-\[34px\][^"]*">(\d\d)<\/span>/g),
    ];
    expect(numbers.map((match) => match[1])).toEqual(
      ['01', '02', '03', '04'].slice(0, 3 + (stack.commands.length > 1 ? 1 : 0)),
    );
    expect(markup).toMatch(/<ol role="list"/);
    expect(configurator).not.toMatch(/rounded-full|shadow-md/);
  });

  // The two copy buttons under the options are as wide as the column of the options, 284px at its narrowest (372px
  // less the margins of the column from 1600px; the same on a phone of 320px), and their text is one line of mono caps
  // of 11px: a Ukrainian label of 36 letters ran out of its frame. What is left for the text is the button less its
  // paddings (12px each), its icon (16px) and the gap after it (8px)
  it('has copy buttons whose labels fit them in every language', () => {
    expect(configurator).toContain(
      'className={`w-full justify-center disabled:cursor-default ${smallButtonClassName} ${secondaryButtonClassName}`}',
    );
    const room = 284 - 2 * 12 - 16 - 8;
    // A letter of Geist Mono is 0.6em wide, a Chinese character 1em, and each is followed by 0.12em of tracking
    const width = (label: string) =>
      [...label].reduce((sum, letter) => sum + ((letter.codePointAt(0) ?? 0) > 0x2e80 ? 1 : 0.6) + 0.12, 0) * 11;
    for (const { configurator: texts } of [en, uk, zhCN])
      for (const label of [
        texts.steps.copyPromptForAi,
        texts.steps.promptCopied,
        texts.steps.copyShareLink,
        texts.steps.linkCopied,
      ])
        expect(width(label), label).toBeLessThanOrEqual(room);
    expect(width('Скопіювати посилання на конфігурацію')).toBeGreaterThan(room);
  });

  it('takes its icons from Nova, none from heroicons', () => {
    for (const source of [configurator, tabsSource, codeSource]) expect(source).not.toContain('@heroicons');
    expect(configurator).toMatch(/import \{ CpuChipIcon, LinkIcon \} from '@tuwaio\/sdk\/nova-icons\/24\/outline'/);
    expect(configurator).toContain('<ProjectSquare icon="rocket"');
    expect(tabsSource).toMatch(/import \{ DocumentTextIcon \} from '@tuwaio\/sdk\/nova-icons\/24\/outline'/);
    // Pixel icons sit on a grid of 16: never a size between
    for (const source of [configurator, tabsSource])
      expect(source).not.toMatch(/Icon className="[^"]*\b(?:h|w)-3(?:\.5)?\b/);
  });
});

describe('the file tabs', () => {
  const markup = inEnglish(createElement(FileTabs, { files: stack.files, label: 'Setup files' }));

  it('are cells on lines, the open one a block of ink', () => {
    expect(markup.match(/role="tab"/g)).toHaveLength(stack.files.length);
    expect(markup.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(markup).toMatch(
      /role="tab" aria-selected="true" class="[^"]*bg-\[var\(--tuwa-text-primary\)\] text-\[var\(--tuwa-docs-paper\)\]/,
    );
    expect(markup).not.toMatch(/rounded/);
  });

  // The row of tabs scrolls sideways, and nothing said so: an arrow stands over the end that has more, on a cell of
  // glass that shades what is under it, and moves the row
  it('have an arrow over each end of their row, shown while the row has more on that side', () => {
    expect(tabsSource).toContain('<ScrollArrow side="left" shown={before} onClick={() => scroll(\'left\')} />');
    expect(tabsSource).toContain('<ScrollArrow side="right" shown={after} onClick={() => scroll(\'right\')} />');
    // Before the row is measured neither arrow shows
    expect(markup.match(/pointer-events-none opacity-0/g)).toHaveLength(2);
    const shown = inEnglish(createElement(ScrollArrow, { side: 'right', shown: true, onClick: () => {} }));
    expect(shown).toMatch(/class="[^"]*right-0 border-l opacity-100"/);
    expect(shown).toContain('tuwa-docs-glass');
    // No gradient shades the row: the glass does
    expect(arrowsSource).not.toMatch(/-gradient|gradient\(|mask-image/);
    // The arrow is for the pointer: the tabs are reached by the keyboard, which brings them into sight
    expect(shown).toMatch(/<button type="button" aria-hidden="true" tabindex="-1"/);
  });

  // The arrows came and went with a plain fade. They are pixel pictures: an arrow unfolds, its pixels flying in to their
  // places, when its side has more, and folds away, its pixels flying apart, when the row reaches that end
  it('unfold and fold their arrows pixel by pixel', () => {
    const arrow = (shown: boolean) =>
      inEnglish(createElement(ScrollArrow, { side: 'right', shown, onClick: () => {} }));
    const pixels = ARROW_RIGHT.join('').replace(/\./g, '').length;
    for (const shown of [true, false]) {
      const markup = arrow(shown);
      expect(markup).toContain('tuwa-pixel-fold');
      expect(markup.match(/<rect /g)).toHaveLength(pixels);
      expect(markup.match(/style="--i:\d+;--dx:[-\d.]+px;--dy:[-\d.]+px"/g)).toHaveLength(pixels);
    }
    expect(arrow(true)).not.toContain('data-folded');
    expect(arrow(false)).toContain('data-folded=""');
    // Folded, every pixel is off its place: none stays where the arrow was
    expect(arrow(false)).not.toMatch(/--dx:0px;--dy:0px/);
    // The cell fades after the pixels have flown apart
    expect(arrow(false)).toContain('delay-[240ms]');
    expect(globals).toMatch(
      /\.tuwa-pixel-fold\[data-folded\] rect \{\s*transform: translate\(var\(--dx\), var\(--dy\)\);\s*opacity: 0;/,
    );
    expect(globals).toMatch(
      /\.tuwa-pixel-fold rect \{\s*transition:[^}]*transition-delay: calc\(var\(--i\) \* 12ms\);/,
    );
    // Once each way, and at once for reduced motion
    expect(globals).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*\.tuwa-pixel-fold rect \{\s*transition: none;/,
    );
    expect(read('components/PixelFold.tsx') + arrowsSource).not.toMatch(/animate-|infinite/);
  });

  it('move the row smoothly, and at once for reduced motion', () => {
    expect(arrowsSource).toContain(
      "behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',",
    );
    expect(arrowsSource).toContain("row.addEventListener('scroll', read, { passive: true });");
    expect(tabsSource).toContain("inline: 'nearest',");
    expect(tabsSource).toContain("block: 'nearest',");
  });

  it('know which ends of a row have more', () => {
    expect(scrollEdges({ scrollLeft: 0, clientWidth: 600, scrollWidth: 1500 })).toEqual({ before: false, after: true });
    expect(scrollEdges({ scrollLeft: 400, clientWidth: 600, scrollWidth: 1500 })).toEqual({
      before: true,
      after: true,
    });
    expect(scrollEdges({ scrollLeft: 900, clientWidth: 600, scrollWidth: 1500 })).toEqual({
      before: true,
      after: false,
    });
    // A row that fits has no arrows, and a fraction of a pixel short of an end is that end
    expect(scrollEdges({ scrollLeft: 0, clientWidth: 600, scrollWidth: 600 })).toEqual({ before: false, after: false });
    expect(scrollEdges({ scrollLeft: 899.4, clientWidth: 600, scrollWidth: 1500 })).toEqual({
      before: true,
      after: false,
    });
    expect(scrollEdges({ scrollLeft: 0.6, clientWidth: 600, scrollWidth: 1500 })).toEqual({
      before: false,
      after: true,
    });
  });

  it('move the row by most of what is in sight, never less than a tab', () => {
    expect(scrollStep(600)).toBe(420);
    expect(scrollStep(100)).toBe(120);
  });
});

describe('the code of the configurator', () => {
  it('stands on the paper of its frame in Geist Mono, with the token colours of the themes', () => {
    const rule = globals.match(/\.tuwa-code pre \{([^}]*)\}/)?.[1] ?? '';
    expect(rule).toMatch(/background: transparent;/);
    expect(rule).toMatch(/font-family: var\(--tuwa-font-mono\);/);
    expect(rule).toMatch(/color: var\(--tuwa-text-primary\);/);
    expect(globals).not.toMatch(/#f6f8fa|#0d1117/i);
    expect(globals).toMatch(/\.tuwa-code pre span \{\s*color: var\(--shiki-light\);/);
    expect(globals).toMatch(/\.dark \.tuwa-code pre span \{\s*color: var\(--shiki-dark\);/);
  });

  // On a phone the copy button lay over the first lines of the code
  it('starts under its copy button on phones', () => {
    expect(globals).toMatch(/@media \(max-width: 767px\) \{\s*\.tuwa-code pre \{\s*padding-top: 3\.75rem;/);
    expect(codeSource).toContain('${smallButtonClassName} ${secondaryButtonClassName}');
  });
});
