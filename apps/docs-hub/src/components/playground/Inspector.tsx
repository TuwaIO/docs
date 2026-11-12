'use client';

import { ScrollArrow, useScrollArrows } from '@tuwaio/docs-ui';
import { cn } from '@tuwaio/nova-core/utils';
import { ArrowsUpDownIcon } from '@tuwaio/sdk/nova-icons/24/outline';
import { useRef, useState } from 'react';
import { useStore } from 'zustand';

import { useI18n } from '@/i18n';
import { eventLog } from '@/lib/playground/eventLog';

import { homeEdgeToEdgeClassName, homeMarginLeftClassName, homeMarginRightClassName } from '../home/homeLayout';
import { CrossMark } from '../home/SectionHead';
import { CodeTab } from './CodeTab';
import { CustomizeTab } from './CustomizeTab';
import { EventsTab } from './EventsTab';
import { capsClassName, iconClassName, lineClassName } from './playgroundStyles';
import { StateTab } from './StateTab';

const TABS = ['Events', 'State', 'Code', 'Customize'] as const;
type Tab = (typeof TABS)[number];

// A cell of the row of tabs: 44px high, mono caps; the pressed or selected one is a block of ink
const cellClassName = `h-11 cursor-pointer px-3 transition-colors ${capsClassName}`;
const inkClassName = 'bg-[var(--tuwa-text-primary)] text-[var(--tuwa-docs-paper)]';
const paperClassName =
  'text-[var(--tuwa-text-secondary)] hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)] hover:text-[var(--tuwa-text-primary)]';

/**
 * Under the stage, from line to line of the frame of the page: the event log, the live state of the stores, the code
 * of the stack and the Nova customization, as tabs in cells on shared lines of 1px, the open one a block of ink (on a
 * phone their row scrolls sideways under the arrows of such rows). It
 * grows with its content; "Scroll" (a cell at the end of the row, a block of ink while it is on) keeps it at a fixed
 * height with a scroll bar, and its corner then resizes it.
 */
export function Inspector() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('Events');
  const [scroll, setScroll] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const eventCount = useStore(eventLog, (state) => state.events.length);
  // The names change with the language of the page
  const {
    ref: rowRef,
    before,
    after,
    scroll: scrollRow,
  } = useScrollArrows<HTMLDivElement>(t.playground.inspector.tabs);

  const tabLabel = (name: Tab) => {
    if (name === 'Events') return t.playground.inspector.tabs.events;
    if (name === 'State') return t.playground.inspector.tabs.state;
    if (name === 'Code') return t.playground.inspector.tabs.code;
    return t.playground.inspector.tabs.customize;
  };

  return (
    <section
      aria-label={t.playground.inspector.tabsAria}
      className={`relative flex min-w-0 flex-col border-y ${lineClassName} ${homeEdgeToEdgeClassName}`}
    >
      <CrossMark x="left" y="top" />
      <CrossMark x="right" y="top" />
      <CrossMark x="left" y="bottom" />
      <CrossMark x="right" y="bottom" />
      <div className={`flex border-b ${lineClassName}`}>
        {/* On a phone the four names do not fit: their row scrolls sideways, with an arrow over the end that has more */}
        <div className="relative min-w-0 flex-1">
          <div
            ref={rowRef}
            role="tablist"
            aria-label={t.playground.inspector.tabsAria}
            className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                id={`inspector-tab-${name}`}
                aria-selected={tab === name}
                aria-controls="inspector-panel"
                onClick={() => setTab(name)}
                className={cn(
                  'shrink-0 grow border-r px-4 whitespace-nowrap',
                  lineClassName,
                  cellClassName,
                  tab === name ? inkClassName : paperClassName,
                )}
              >
                {tabLabel(name)}
                {name === 'Events' && eventCount > 0 && <span className="ml-1.5 font-medium">{eventCount}</span>}
              </button>
            ))}
          </div>
          <ScrollArrow side="left" shown={before} onClick={() => scrollRow('left')} />
          <ScrollArrow side="right" shown={after} onClick={() => scrollRow('right')} />
        </div>
        <button
          type="button"
          aria-pressed={scroll}
          onClick={() => {
            // A resize by the corner leaves an inline height, which would let the content spill over the page
            if (scroll) panel.current?.style.removeProperty('height');
            setScroll(!scroll);
          }}
          title={t.ui.playgroundExtra.scrollTitle}
          className={cn(
            'inline-flex shrink-0 items-center gap-2 sm:px-4',
            cellClassName,
            scroll ? inkClassName : paperClassName,
          )}
        >
          <ArrowsUpDownIcon className={iconClassName} aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">{t.ui.playgroundExtra.scrollButton}</span>
        </button>
      </div>
      <div
        ref={panel}
        id="inspector-panel"
        role="tabpanel"
        aria-labelledby={`inspector-tab-${tab}`}
        className={cn(
          'min-h-40 py-5 md:py-6',
          homeMarginLeftClassName,
          homeMarginRightClassName,
          scroll && 'h-[480px] resize-y overflow-y-auto [scrollbar-width:thin]',
        )}
      >
        {tab === 'State' && <StateTab />}
        {tab === 'Events' && <EventsTab />}
        {tab === 'Code' && <CodeTab />}
        {tab === 'Customize' && <CustomizeTab />}
      </div>
    </section>
  );
}
