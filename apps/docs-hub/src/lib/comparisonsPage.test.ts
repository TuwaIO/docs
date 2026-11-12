import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ComparisonsContent } from '../components/comparisons/ComparisonsContent';
import { MarkIcon } from '../components/comparisons/MarkIcon';
import { en, I18nProvider, uk, zhCN } from '../i18n';
import { AXES, COMPETITORS, CRITERIA, PRODUCTS, SEGMENTS } from './comparisons';

// The comparisons page in paper and ink, on the frame of the main page: five sections under their bars, the radar in
// lines of 1px with square points, the criteria on shared lines, marks as squares, and no colour but ink and the accent

const folder = path.resolve(__dirname, '../components/comparisons');
const read = (file: string) => readFileSync(path.join(folder, file), 'utf8');
const sources = readdirSync(folder).filter((file) => /\.tsx?$/.test(file));
const render = (locale: 'en' | 'uk' | 'zh-CN' = 'en') =>
  renderToStaticMarkup(
    createElement(I18nProvider, { initialLocale: locale, children: createElement(ComparisonsContent) }),
  );
const markup = render();

describe('the comparisons page', () => {
  it('stands on the frame of the main page, and the footer takes the sides of that frame', () => {
    const content = read('ComparisonsContent.tsx');
    expect(content).toContain('<div className={`${homeContentClassName} ${homeFrameClassName}`}>');
    expect(content).toMatch(/<CrossMark x="left" y="top" \/>\s*<CrossMark x="right" y="top" \/>/);
    const shell = readFileSync(path.resolve(__dirname, '../components/HubShell.tsx'), 'utf8');
    expect(shell).toMatch(/const FRAMED_PAGES = \[[^\]]*'\/comparisons'[^\]]*\];/);
  });

  it('has five sections under their bars, at the anchors the page had', () => {
    const sections = [...markup.matchAll(/<section id="([\w-]+)" aria-labelledby="([\w-]+)"/g)].map((match) => [
      match[1],
      match[2],
    ]);
    expect(sections).toEqual([
      ['radar', 'radar-title'],
      ['criteria', 'criteria-title'],
      ['choose-instead', 'choose-instead-title'],
      ['bundle-size', 'bundle-size-title'],
      ['methodology', 'methodology-title'],
      // The end of the page, where the flight plan ends
      ['next', 'comparisons-next'],
    ]);
    // Each bar sticks under the header with the number and the short name of its section
    const bars = [
      ...markup.matchAll(
        /class="sticky top-\[56px\][^"]*"[\s\S]*?<span[^>]*>(\d\d) \/<\/span>(?:<!-- -->)? ?(?:<!-- -->)?([^<]+)</g,
      ),
    ];
    expect(bars.map((bar) => [bar[1], bar[2]])).toEqual([
      ['01', 'Radar'],
      ['02', 'Criteria'],
      ['03', 'Alternatives'],
      ['04', 'Bundle size'],
      ['05', 'Method'],
    ]);
  });

  it('names its sections in every language', () => {
    for (const dictionary of [en, uk, zhCN])
      for (const name of Object.values(dictionary.comparisons.sections)) expect(name.length).toBeGreaterThan(1);
    expect(Object.keys(uk.comparisons.sections)).toEqual(Object.keys(en.comparisons.sections));
    expect(Object.keys(zhCN.comparisons.sections)).toEqual(Object.keys(en.comparisons.sections));
    expect(render('uk')).toContain('Радар');
    expect(render('zh-CN')).toContain('雷达图');
  });

  it('has one title in ink, with no gradient text', () => {
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`${en.comparisons.titlePrefix} ${en.comparisons.titleHighlight}`);
    for (const file of sources)
      expect(read(file), file).not.toMatch(/bg-clip-text|text-transparent|--tuwa-hero-gradient/);
  });

  // The segments had a colour each (sky, amber, emerald, rose) on the radar, the chips and the cards. Paper and ink has
  // ink and the accent: TUWA is lit, the other product is ink, and a segment is named, not coloured
  it('has no colour of its own: ink, the accent and the greys of the theme', () => {
    expect(existsSync(path.join(folder, 'segmentColors.ts'))).toBe(false);
    for (const file of sources) {
      const source = read(file);
      expect(source, file).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(source, file).not.toMatch(/\b(emerald|amber|sky|rose|purple|violet|indigo|fuchsia)-\d/);
      expect(source, file).not.toMatch(/dark:(bg|border|text)-white/);
    }
  });

  // The tabs of the axes stand two in a row on phones, on shared lines, in a frame of 1px inside the margins of the
  // page (16px): at 320px a tab is 142.5px wide, and the Ukrainian «Некастодіальність» in mono caps of 11px with a
  // tracking of 0.12em ran out of it. Below 375px a tab has margins of 10px and its label a tracking of 0.04em; from
  // 375px the usual margins of 16px and tracking of 0.12em have room
  it('fits the longest word of an axis in its tab on the narrowest phones, in every language', () => {
    const radar = read('ComparisonRadar.tsx');
    expect(radar).toContain('px-4 py-3.5 text-left transition-colors max-[374px]:px-2.5');
    expect(radar).toContain('className={`block max-[374px]:tracking-[0.04em] ${capsClassName}');
    const tab = (screen: number) => (screen - 2 * 16 - 2 - 1) / 2;
    // A letter of Geist Mono is 0.6em wide, a Chinese character 1em, and each is followed by its tracking
    const width = (word: string, tracking: number) =>
      [...word].reduce((sum, letter) => sum + ((letter.codePointAt(0) ?? 0) > 0x2e80 ? 1 : 0.6) + tracking, 0) * 11;
    for (const texts of [en, uk, zhCN])
      for (const axis of AXES) {
        const label = texts.comparisons.axes[axis.id]?.label ?? axis.label;
        for (const word of label.split(/\s+/)) {
          expect(width(word, 0.04), word).toBeLessThanOrEqual(tab(320) - 2 * 10);
          expect(width(word, 0.12), word).toBeLessThanOrEqual(tab(375) - 2 * 16);
        }
      }
    expect(width('Некастодіальність', 0.12)).toBeGreaterThan(tab(320) - 2 * 16);
  });

  it('draws the radar in lines and square points, with no gradient and no glow', () => {
    const radar = read('ComparisonRadar.tsx');
    expect(radar).not.toMatch(/<circle|linearGradient|feGaussianBlur|<filter|<defs/);
    expect(radar.match(/<rect\b/g)?.length).toBeGreaterThanOrEqual(2);
    // TUWA lit and solid, the other product in ink and dashed
    expect(radar).toMatch(/className="stroke-\[var\(--tuwa-docs-lit\)\]"\s+strokeWidth=\{2\}/);
    expect(radar).toMatch(
      /className="stroke-\[var\(--tuwa-text-primary\)\]"\s+strokeWidth=\{1\.5\}\s+strokeDasharray="5 4"/,
    );
    // Six axes as tabs, the chosen one a block of ink
    expect(markup.match(/role="tab"/g)).toHaveLength(AXES.length);
    expect(markup).toMatch(
      /role="tab"[^>]*aria-selected="true"[^>]*class="[^"]*bg-\[var\(--tuwa-text-primary\)\] text-\[var\(--tuwa-docs-paper\)\]/,
    );
    // Every product can be laid over TUWA: square buttons, the chosen one a block of ink
    expect(markup.match(/aria-pressed="(true|false)"/g)).toHaveLength(COMPETITORS.length);
    expect(markup.match(/aria-pressed="true"/g)).toHaveLength(1);
  });

  it('draws a mark as a square that is as full as the criterion is met', () => {
    const marks = (['yes', 'partial', 'no'] as const).map((mark) =>
      renderToStaticMarkup(
        createElement(I18nProvider, { initialLocale: 'en', children: createElement(MarkIcon, { mark }) }),
      ),
    );
    for (const mark of marks) {
      expect(mark).toContain('<rect');
      expect(mark).not.toContain('<circle');
    }
    expect(marks[0]).toMatch(/<rect x="1" y="1" width="14" height="14" class="fill-\[var\(--tuwa-text-primary\)\]"/);
    expect(marks[1]).toMatch(/<rect x="1" y="1" width="7" height="14" class="fill-\[var\(--tuwa-text-primary\)\]"/);
    expect(marks[2]).not.toMatch(/width="14" height="14" class="fill-\[var\(--tuwa-text-primary\)\]"/);
    // The mark is read out as text
    expect(marks.map((mark) => mark.match(/<span class="sr-only">([^<]+)<\/span>/)?.[1])).toEqual([
      en.common.yes,
      en.common.partial,
      en.common.no,
    ]);
  });

  it('shows every criterion against every product, with its source', () => {
    const table = markup.slice(markup.indexOf('<table'), markup.indexOf('</table>'));
    expect(table.match(/<th scope="col"/g)).toHaveLength(PRODUCTS.length + 1);
    expect(table.match(/<th scope="rowgroup"/g)).toHaveLength(AXES.length);
    expect(table.match(/<th scope="row"/g)).toHaveLength(CRITERIA.length);
    expect(table.match(/href="#source-\d+"/g)).toHaveLength(CRITERIA.length * PRODUCTS.length);
  });

  // The marks carry their meaning as text set out of sight, placed absolutely. Without a positioned box around the
  // table that text is placed from the page, outside the scroller of the table, and a phone scrolls the whole page
  // sideways as far as the last column
  it('keeps the hidden text of the marks inside the scroller of the table', () => {
    expect(read('CriteriaMatrix.tsx')).toContain('<div className="relative overflow-x-auto">');
    expect(read('BundleSizes.tsx')).toContain('<div className="relative overflow-x-auto">');
    expect(markup.match(/class="relative overflow-x-auto"/g)?.length).toBeGreaterThanOrEqual(1);
  });

  // The flight plan of the main page flies here too: from the top of the page past its sections, and the segments of
  // the alternatives, to its end, where the reader starts: the Earth
  it('has the flight plan of the main page, to the buttons at its end', () => {
    const links = [
      ...markup.matchAll(
        /<a href="#([\w-]+)" aria-label="([^"]+)"(?: aria-current="location")? class="tuwadocs:group\/waypoint/g,
      ),
    ].map((match) => [match[1], match[2]?.replace(/&amp;/g, '&')]);
    expect(links).toEqual([
      ['overview', '00 Overview'],
      ['radar', '01 Radar'],
      ['criteria', '02 Criteria'],
      ['choose-instead', '03 Alternatives'],
      ...SEGMENTS.map((segment) => [`segment-${segment.id}`, segment.label]),
      ['bundle-size', '04 Bundle size'],
      ['methodology', '05 Method'],
      ['next', 'Start'],
    ]);
    // Every waypoint is a part of the page
    for (const [id] of links) expect(markup, id).toContain(`id="${id}"`);
    const content = read('ComparisonsContent.tsx');
    expect(content).toMatch(/<PageFlightPlan waypoints=\{waypoints\} \/>\s*<div className="relative z-10">/);
    expect(content).toContain("{ id: 'next', kind: 'section', name: sections.next },");
  });

  it('names the TUWA projects that do the job of each segment, and when to choose each product', () => {
    for (const segment of SEGMENTS) expect(markup).toContain(segment.counterpart.replace(/&/g, '&amp;'));
    for (const product of COMPETITORS) expect(markup).toContain(`Pick ${product.name} when`);
  });
});
