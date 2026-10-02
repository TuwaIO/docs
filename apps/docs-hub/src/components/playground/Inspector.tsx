'use client';

import { cn } from '@tuwaio/nova-core';
import { useState } from 'react';
import { useStore } from 'zustand';

import { eventLog } from '@/lib/playground/eventLog';

import { CodeTab } from './CodeTab';
import { CustomizeTab } from './CustomizeTab';
import { EventsTab } from './EventsTab';
import { StateTab } from './StateTab';

const TABS = ['State', 'Events', 'Code', 'Customize'] as const;
type Tab = (typeof TABS)[number];

/** The right column: the live state of the stores, the event log, the code of the stack and the Nova customization. */
export function Inspector() {
  const [tab, setTab] = useState<Tab>('Events');
  const eventCount = useStore(eventLog, (state) => state.events.length);

  return (
    <section
      aria-label="Inspector"
      className="flex min-w-0 max-h-none flex-col lg:col-start-2 xl:col-start-auto rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)]/40 dark:border-white/[0.06] bg-[var(--tuwa-bg-primary)]/60 dark:bg-white/[0.02] sm:backdrop-blur-sm xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)]"
    >
      <div
        role="tablist"
        aria-label="Inspector tabs"
        className="flex gap-1 border-b border-[var(--tuwa-border-primary)]/30 dark:border-white/[0.06] p-2"
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
      <div
        id="inspector-panel"
        role="tabpanel"
        aria-labelledby={`inspector-tab-${tab}`}
        className="min-h-[320px] overflow-y-auto p-4 [scrollbar-width:thin]"
      >
        {tab === 'State' && <StateTab />}
        {tab === 'Events' && <EventsTab />}
        {tab === 'Code' && <CodeTab />}
        {tab === 'Customize' && <CustomizeTab />}
      </div>
    </section>
  );
}
