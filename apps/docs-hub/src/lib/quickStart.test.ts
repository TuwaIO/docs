import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CommandLine } from '../components/CommandLine';
import { Choice, Group, StackOptionsForm } from '../components/configurator/StackOptionsForm';
import { en, I18nProvider, uk, zhCN } from '../i18n';
import { DEFAULT_STACK_OPTIONS } from './configurator/generate';

// The quick start of the main page and the compact Stack Configurator, in paper and ink: the third section of the
// framed column, with its bar, the command of Cosmos Playground, three links and three steps on lines, and the options
// of the configurator as square buttons of ink

const read = (file: string) => readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const section = read('components/QuickStartSection.tsx');
const compact = read('components/configurator/CompactConfigurator.tsx');
const page = read('app/(default)/(home)/page.tsx');
const render = (element: ReactElement, locale: 'en' | 'uk' | 'zh-CN' = 'en') =>
  renderToStaticMarkup(createElement(I18nProvider, { initialLocale: locale, children: element }));

describe('the quick start section', () => {
  // The third section of the column, inside its frame: before, it stood under the frame in a column of its own width
  it('is the third section of the framed column', () => {
    expect(page).toMatch(/<StageLedgers[^>]*\/>\s*<QuickStartSection \/>\s*<CrossMark x="left" y="bottom" \/>/);
    expect(section).toMatch(/<section id="quick-start" aria-labelledby="quick-start-title"/);
    expect(section).toMatch(/<SectionBar\s+number=\{3\}\s+name=\{texts\.section\}/);
  });

  // "Start Building in" + "Cosmos Playground" read wrong in Ukrainian and Chinese: each language has its whole title
  it('has a whole title in every language', () => {
    for (const dictionary of [en, uk, zhCN]) {
      expect(dictionary.home.quickStart.title).toContain('Cosmos Playground');
      expect(dictionary.home.quickStart).not.toHaveProperty('titlePrefix');
      expect(dictionary.home.quickStart.section.length).toBeGreaterThan(1);
    }
    expect(uk.home.quickStart.title).toBe('Почніть розробку з Cosmos Playground');
  });

  it('shows the command of Cosmos Playground, three links and three steps', () => {
    expect(section).toContain("const command = 'npx @tuwaio/create-cosmos-playground';");
    expect(section).toContain('<CommandLine command={command} />');
    for (const href of [
      'https://www.npmjs.com/package/@tuwaio/create-cosmos-playground',
      'https://github.com/TuwaIO/cosmos-playground',
      'https://github.com/TuwaIO/workflows/blob/main/TUWA_AGENTS.md',
    ])
      expect(section).toContain(href);
    expect(section).toMatch(/<ol\s+role="list"/);
    expect(section.match(/title: steps\.step\dTitle/g)).toHaveLength(3);
    expect(section).toContain("href: '/guides/starter-templates'");
  });

  // The steps of a row are as tall as the tallest: without this a shorter step spread its rows, and its title
  // stood lower than the titles beside it
  it('keeps the titles of the steps on one line across a row', () => {
    expect(section).toMatch(/<li[\s\S]{0,160}className="grid grid-cols-\[34px_minmax\(0,1fr\)\] content-start /);
  });

  it('has no round badge, gradient, blur or heroicons', () => {
    for (const source of [section, compact]) {
      expect(source).not.toContain('@heroicons');
      expect(source).not.toMatch(/\bOrb\b|gradient|backdrop-blur|rounded|shadow-/);
    }
  });
});

describe('the compact configurator', () => {
  it('has the square of a gear, whose icon moves under the pointer, and the link to all the setup files', () => {
    expect(compact).toContain('<ProjectSquare icon="gear" />');
    expect(compact).toContain('onMouseEnter={(event) => startPixelMotion(event.currentTarget)}');
    expect(compact).toContain('href={`/configurator?${stackQuery(stack.options)}`}');
    expect(compact).toContain('group-hover/link:translate-x-[3px]');
    expect(compact).toContain('<CommandLine\n            compact');
  });

  it('sets the four groups of options in cells on shared lines, two by two from 768px', () => {
    const markup = render(
      createElement(StackOptionsForm, { options: DEFAULT_STACK_OPTIONS, onChange: () => {}, compact: true }),
    );
    expect(markup.match(/<fieldset/g)).toHaveLength(4);
    const grid = markup.match(/^<div class="([^"]*)"/)?.[1] ?? '';
    expect(grid).toContain('md:grid-cols-2');
    expect(grid).toContain('[&amp;&gt;*]:border-b');
    expect(grid).toContain('md:[&amp;&gt;*:nth-child(odd)]:border-r');
  });
});

describe('a choice of the configurator and the playground', () => {
  const classOf = (markup: string) => markup.match(/class="([^"]*)"/)?.[1] ?? '';

  it('is a square button in mono caps, filled with ink when chosen', () => {
    const on = render(createElement(Choice, { pressed: true, onClick: () => {}, children: 'EVM' }));
    const off = render(createElement(Choice, { pressed: false, onClick: () => {}, children: 'Solana' }));
    expect(on).toContain('aria-pressed="true"');
    expect(classOf(on)).toContain('bg-[var(--tuwa-text-primary)]');
    expect(classOf(on)).toContain('text-[var(--tuwa-docs-paper)]');
    expect(classOf(off)).toContain('border-[var(--tuwa-border-strong)]');
    expect(classOf(off)).not.toContain('bg-[var(--tuwa-text-primary)]');
    for (const markup of [on, off]) {
      expect(classOf(markup)).toContain('font-mono');
      expect(classOf(markup)).toContain('uppercase');
      expect(classOf(markup)).not.toMatch(/rounded/);
    }
  });

  // Two chosen options side by side (EVM and Solana) read as one block of ink without a line between them
  it('keeps a line of paper between two chosen neighbours', () => {
    const on = render(createElement(Choice, { pressed: true, onClick: () => {}, children: 'EVM' }));
    expect(classOf(on)).toContain('[[aria-pressed=true]+&amp;]:border-l-[var(--tuwa-docs-paper)]');
  });

  it('names its group in mono and its info button in the language of the reader', () => {
    const group = (locale: 'en' | 'uk') =>
      render(createElement(Group, { label: 'Chains', info: 'Which chains', children: null }), locale);
    expect(group('en')).toContain('aria-label="About Chains"');
    expect(group('uk')).toContain('aria-label="Про «Chains»"');
    expect(group('en')).toMatch(/<legend class="[^"]*font-mono[^"]*uppercase/);
    const tooltip = group('en').match(/<span role="tooltip"[^>]*class="([^"]*)"/)?.[1] ?? '';
    expect(tooltip).toContain('border-[var(--tuwa-border-strong)]');
    expect(tooltip).not.toMatch(/shadow|rounded/);
  });
});

describe('the command line in a framed part', () => {
  // The size class is merged after the line height and would drop it: the lines of a wrapped command then touch
  it('keeps its line height at both sizes', () => {
    const quiet = render(createElement(CommandLine, { command: 'pnpm add @tuwaio/sdk', compact: true }));
    const ink = render(createElement(CommandLine, { command: 'pnpm add @tuwaio/sdk' }));
    expect(quiet).toMatch(/<code class="[^"]*text-\[13px\] leading-\[1\.5\]/);
    expect(ink).toMatch(/<code class="[^"]*text-\[15px\] leading-\[1\.5\]/);
    expect(quiet).toMatch(/^<div class="[^"]*border-\[var\(--tuwa-border-strong\)\]/);
    expect(ink).toMatch(/^<div class="[^"]*border-\[var\(--tuwa-text-primary\)\]/);
  });
});
