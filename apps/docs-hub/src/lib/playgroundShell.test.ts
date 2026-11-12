import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PlaygroundHeader } from '../components/playground/PlaygroundLoader';
import { en, I18nProvider, uk } from '../i18n';

// The shell of the Playground in paper and ink, on the frame of the main page: the header, the controls on lines, the
// stage as a window in a frame of 1px, the inspector as tabs on shared lines

const read = (file: string) => readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const folder = path.resolve(__dirname, '../components/playground');
const shell = readdirSync(folder).filter((file) => /\.tsx?$/.test(file));
const controls = read('components/playground/ControlsPanel.tsx');
const stage = read('components/playground/Stage.tsx');
const inspector = read('components/playground/Inspector.tsx');
const header = (locale: 'en' | 'uk' = 'en') =>
  renderToStaticMarkup(
    createElement(I18nProvider, { initialLocale: locale, children: createElement(PlaygroundHeader) }),
  );

describe('the shell of the Playground', () => {
  it('stands on the frame of the main page, and the footer takes the sides of that frame', () => {
    expect(read('app/(default)/(home)/playground/page.tsx')).toContain(
      '<div className={`${homeContentClassName} ${homeFrameClassName}`}>',
    );
    expect(read('components/HubShell.tsx')).toMatch(/const FRAMED_PAGES = \[[^\]]*'\/playground'[^\]]*\];/);
  });

  it('has one title in ink under a kicker, with no gradient text', () => {
    const markup = header();
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup).toContain(`${en.playground.titlePrefix} ${en.playground.titleHighlight}</h1>`);
    expect(markup.slice(0, markup.indexOf('<h1'))).toContain(en.playground.stage.simulatedLabel.replace('&', '&amp;'));
    expect(header('uk')).toContain(`${uk.playground.titlePrefix} ${uk.playground.titleHighlight}</h1>`);
    expect(read('components/playground/PlaygroundLoader.tsx')).not.toMatch(
      /bg-clip-text|text-transparent|--tuwa-hero-gradient|animate-pulse/,
    );
  });

  // The titles of the hub pages were transparent text over a gradient kept in globals.css: the last of them (this page)
  // is ink now, and the gradient is gone with it
  it('leaves no title gradient in the stylesheet of the hub', () => {
    expect(read('app/globals.css')).not.toMatch(/--tuwa-hero-gradient/);
  });

  it('takes every icon from Nova, none from heroicons', () => {
    // An import of heroicons; the hook of the icon set only names the package it loads through the SDK
    for (const file of shell)
      expect(read(`components/playground/${file}`), file).not.toMatch(/from '@heroicons\/react/);
    expect(controls).toContain("} from '@tuwaio/sdk/nova-icons/24/outline';");
  });

  // The switch of the controls: Nova's pixel icons, or Heroicons through the `icons` prop of the two providers. The
  // Heroicons set is loaded when it is first picked, not with the page
  it('lets the reader switch the icons of Nova to Heroicons, loaded only when picked', () => {
    expect(controls).toMatch(/<Group label=\{t\.ui\.playgroundExtra\.iconsGroup\}/);
    expect(controls).toContain("onClick={() => changeCustomization({ icons: 'classic' })}");
    const hook = read('components/playground/useNovaIconSet.ts');
    expect(hook).toContain("void import('@tuwaio/sdk/nova-core/heroicons').then(");
    expect(hook).not.toMatch(/^import .*heroicons/m);
    const novaStage = read('components/playground/NovaStage.tsx');
    expect(novaStage.match(/icons=\{icons\}/g)).toHaveLength(2);
  });

  it('draws the stage as a window in a frame of 1px, with square marks and no shadow', () => {
    expect(stage).toContain(
      '<div className="overflow-hidden border border-[var(--tuwa-border-strong)] [--playground-frame-radius:var(--tuwa-rounded-corners)]">',
    );
    expect(stage).toContain('<span key={mark} className="h-2.5 w-2.5 border border-[var(--tuwa-text-secondary)]" />');
    // The red, yellow and green dots of a macOS window
    expect(stage).not.toMatch(/#ff5f57|#febc2e|#28c840|rounded-full|shadow-/);
  });

  // On a phone the chip that says the stage is simulated left the address of the window no room
  it('keeps the address of the window in sight on a phone', () => {
    expect(stage).toMatch(/text-\[var\(--tuwa-pending-text\)\][^"]*max-sm:hidden/);
  });

  it('runs the controls and the inspector from line to line of the frame, on lines of 1px', () => {
    for (const source of [controls, inspector]) {
      expect(source).toContain('${lineClassName} ${homeEdgeToEdgeClassName}');
      expect(source).toMatch(/<CrossMark x="left" y="top" \/>\s*<CrossMark x="right" y="top" \/>/);
      expect(source).not.toMatch(/backdrop-blur|shadow-xl|rounded-\[/);
    }
  });

  it('shows a theme as a square of two halves, with no gradient', () => {
    expect(controls).toContain(
      '<span className="grid h-3 w-3 shrink-0 grid-cols-2 border border-current" aria-hidden="true">',
    );
    expect(controls).not.toMatch(/gradient\(/);
  });

  // In mono caps the next transaction and the two session actions were wider than a phone, and the page scrolled
  // sideways: the actions go under the next transaction when the line has no room for both
  it('wraps the bar of a phone instead of widening the page', () => {
    expect(controls).toMatch(
      /<div className="flex flex-wrap gap-2\.5">\s*<label\s+className="[^"]*min-w-0 flex-1 basis-48/,
    );
    expect(controls).toContain('[&:has(>button:nth-child(2))]:grow');
  });

  it('opens the setup of a phone in a square sheet over a plain scrim', () => {
    expect(controls).toContain('backdrop:bg-black/60');
    expect(controls).not.toMatch(/backdrop:backdrop-blur|rounded-t-/);
  });

  it('sets the tabs of the inspector in cells on shared lines, the open one a block of ink', () => {
    expect(inspector).toContain("const inkClassName = 'bg-[var(--tuwa-text-primary)] text-[var(--tuwa-docs-paper)]';");
    expect(inspector).toContain('tab === name ? inkClassName : paperClassName,');
    expect(inspector).toContain('scroll ? inkClassName : paperClassName,');
  });

  // On a phone the name of the last tab was cut with an ellipsis: the row scrolls sideways under the arrows of such rows
  it('scrolls the tabs sideways on a phone, with an arrow over the end that has more', () => {
    expect(inspector).toContain("import { ScrollArrow, useScrollArrows } from '@tuwaio/docs-ui';");
    expect(inspector).toContain("'shrink-0 grow border-r px-4 whitespace-nowrap',");
    expect(inspector).not.toMatch(/\btruncate\b/);
    expect(inspector).toContain(`<ScrollArrow side="left" shown={before} onClick={() => scrollRow('left')} />`);
    expect(inspector).toContain(`<ScrollArrow side="right" shown={after} onClick={() => scrollRow('right')} />`);
  });

  // Each source of the event log had a pastel colour of its own; paper and ink has ink and one accent
  it('names the sources of the event log in ink, with no colour each', () => {
    const events = read('components/playground/EventsTab.tsx');
    expect(events).not.toMatch(/SOURCE_CLASS|bg-(slate|zinc|sky|amber|teal|emerald|rose|blue)-/);
    expect(read('components/playground/JsonTree.tsx')).not.toMatch(/text-(emerald|amber|sky)-/);
  });
});
