'use client';

import { cn } from '@tuwaio/nova-core/utils';
import { useState } from 'react';
import { useStore } from 'zustand';

import { useI18n } from '@/i18n';
import { clearEvents, eventLog, type EventSource } from '@/lib/playground/eventLog';

import { JsonTree } from './JsonTree';
import { capsClassName } from './playgroundStyles';

// What writes to the log, in the order of a transaction's way. Paper and ink has ink and one accent: the sources are
// told apart by their names in mono caps, not by a colour each
const SOURCES: EventSource[] = ['Wallet', 'Chain', 'Satellite', 'Pulsar', 'SIWX', 'Quasar', 'Webhook', 'Nova'];

function time(value: number): string {
  const date = new Date(value);
  return `${date.toLocaleTimeString('en-GB', { hour12: false })}.${String(date.getMilliseconds()).padStart(3, '0')}`;
}

/**
 * The event log of the simulation, newest first: the wallet prompts, the chain, the Satellite and Pulsar adapter
 * calls, the SIWX and Quasar requests and the webhooks. Sources can be hidden; an entry opens to its data.
 */
export function EventsTab() {
  const { t } = useI18n();
  const events = useStore(eventLog, (state) => state.events);
  const [hidden, setHidden] = useState<ReadonlySet<EventSource>>(new Set());
  const visible = events.filter((event) => !hidden.has(event.source));

  const toggle = (source: EventSource) =>
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-y-2">
        {SOURCES.map((source) => (
          <button
            key={source}
            type="button"
            aria-pressed={!hidden.has(source)}
            onClick={() => toggle(source)}
            className={cn(
              '-mr-px h-7 cursor-pointer border px-2.5 transition-colors',
              capsClassName,
              hidden.has(source)
                ? 'border-[var(--tuwa-border-primary)] text-[var(--tuwa-text-secondary)] line-through opacity-60'
                : 'relative z-[1] border-[var(--tuwa-text-primary)] text-[var(--tuwa-text-primary)]',
            )}
          >
            {source}
          </button>
        ))}
        <button
          type="button"
          onClick={clearEvents}
          className={cn(
            'ml-auto cursor-pointer text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]',
            capsClassName,
          )}
        >
          {t.playground.inspector.events.clear}
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="m-0 text-sm text-[var(--tuwa-text-secondary)]">{t.playground.inspector.events.empty}</p>
      ) : (
        // No live region: a transaction logs several events a second, too many to read aloud
        <ol className="@container flex flex-col gap-1 font-mono text-xs">
          {visible.map((event) => (
            <li key={event.id}>
              <details className="px-2 py-1 hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]">
                {/* The source column fits the longest source, so the labels start in one column; a narrow panel puts
                    the label under the time and the source */}
                <summary className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 gap-y-0.5 @md:grid-cols-[auto_5.75rem_minmax(0,1fr)] [&::-webkit-details-marker]:hidden">
                  <span className="text-[var(--tuwa-text-secondary)]">{time(event.time)}</span>
                  <span className="justify-self-start font-bold tracking-[0.08em] text-[var(--tuwa-text-primary)] uppercase">
                    {event.source}
                  </span>
                  <span className="col-span-2 min-w-0 break-words text-[var(--tuwa-text-primary)] @md:col-span-1">
                    {event.label}
                  </span>
                </summary>
                {event.detail !== undefined && (
                  <div className="mt-1 leading-relaxed">
                    <JsonTree value={event.detail} />
                  </div>
                )}
              </details>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
