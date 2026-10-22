'use client';

import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core/utils';
import { useRef, useState } from 'react';
import { useStore } from 'zustand';

import { eventLog } from '@/lib/playground/eventLog';

import { CodeTab } from './CodeTab';
import { CustomizeTab } from './CustomizeTab';
import { EventsTab } from './EventsTab';
import { StateTab } from './StateTab';

const TABS = ['Events', 'State', 'Code', 'Customize'] as const;
type Tab = (typeof TABS)[number];

/**
 * Under the stage: the event log, the live state of the stores, the code of the stack and the Nova customization. It
 * grows with its content; "Scroll" keeps it at a fixed height with a scroll bar, and its corner then resizes it.
 */
export function Inspector() {
  const [tab, setTab] = useState<Tab>('Events');
  const [scroll, setScroll] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const eventCount = useStore(eventLog, (state) => state.events.length);

  return (
    <section
      aria-label="Inspector"
      className="flex min-w-0 flex-col rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.02] sm:backdrop-blur-sm"
    >
      <div className="flex items-center gap-1 border-b border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06] p-2">
        <div role="tablist" aria-label="Inspector tabs" className="flex flex-1 gap-1">
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
                'flex-1 rounded-[calc(var(--tuwa-rounded-corners)-2px)] px-2 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                tab === name
                  ? 'bg-[var(--tuwa-text-accent)]/10 text-[var(--tuwa-text-primary)]'
                  : 'text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]',
              )}
            >
              {name}
              {name === 'Events' && eventCount > 0 && (
                <span className="ml-1 font-mono text-[10px] text-[var(--tuwa-text-tertiary)]">{eventCount}</span>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={scroll}
          onClick={() => {
            // A resize by the corner leaves an inline height, which would let the content spill over the page
            if (scroll) panel.current?.style.removeProperty('height');
            setScroll(!scroll);
          }}
          title="A fixed height with a scroll bar; drag the bottom corner to resize"
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-[var(--tuwa-rounded-corners)] border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer',
            scroll
              ? 'border-[var(--tuwa-text-accent)]/60 bg-[var(--tuwa-text-accent)]/10 text-[var(--tuwa-text-primary)]'
              : 'border-[var(--tuwa-border-primary)]/50 dark:border-white/10 text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]',
          )}
        >
          <ArrowsUpDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Scroll</span>
        </button>
      </div>
      <div
        ref={panel}
        id="inspector-panel"
        role="tabpanel"
        aria-labelledby={`inspector-tab-${tab}`}
        className={cn('min-h-40 p-4', scroll && 'h-[480px] resize-y overflow-y-auto [scrollbar-width:thin]')}
      >
        {tab === 'State' && <StateTab />}
        {tab === 'Events' && <EventsTab />}
        {tab === 'Code' && <CodeTab />}
        {tab === 'Customize' && <CustomizeTab />}
      </div>
    </section>
  );
}
