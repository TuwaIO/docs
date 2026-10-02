'use client';

import { cn } from '@tuwaio/nova-core';
import { useState } from 'react';
import { useStore } from 'zustand';

import { clearEvents, eventLog, type EventSource } from '@/lib/playground/eventLog';

import { JsonTree } from './JsonTree';

const SOURCE_CLASS: Record<EventSource, string> = {
  Wallet: 'bg-slate-500/15 text-slate-700 dark:text-slate-300',
  Chain: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300',
  Satellite: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  Pulsar: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  SIWX: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  Quasar: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  Webhook: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  Nova: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
};

const SOURCES = Object.keys(SOURCE_CLASS) as EventSource[];

function time(value: number): string {
  const date = new Date(value);
  return `${date.toLocaleTimeString('en-GB', { hour12: false })}.${String(date.getMilliseconds()).padStart(3, '0')}`;
}

/**
 * The event log of the simulation, newest first: the wallet prompts, the chain, the Satellite and Pulsar adapter
 * calls, the SIWX and Quasar requests and the webhooks. Sources can be hidden; an entry opens to its data.
 */
export function EventsTab() {
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
      <div className="flex flex-wrap items-center gap-1.5">
        {SOURCES.map((source) => (
          <button
            key={source}
            type="button"
            aria-pressed={!hidden.has(source)}
            onClick={() => toggle(source)}
            className={cn(
              'rounded-[var(--tuwa-rounded-corners)] px-2 py-0.5 text-[11px] font-semibold transition-opacity cursor-pointer',
              SOURCE_CLASS[source],
              hidden.has(source) && 'opacity-40',
            )}
          >
            {source}
          </button>
        ))}
        <button
          type="button"
          onClick={clearEvents}
          className="ml-auto text-xs text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)] cursor-pointer"
        >
          Clear
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-[var(--tuwa-text-tertiary)]">
          Nothing yet: connect a wallet on the stage and send a transaction.
        </p>
      ) : (
        // No live region: a transaction logs several events a second, too many to read aloud
        <ol className="@container flex flex-col gap-1 font-mono text-xs">
          {visible.map((event) => (
            <li key={event.id}>
              <details className="rounded-[var(--tuwa-rounded-corners)] px-2 py-1 hover:bg-[var(--tuwa-bg-secondary)]/60">
                {/* The source column fits the longest source, so the labels start in one column; a narrow panel puts
                    the label under the time and the source */}
                <summary className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 gap-y-0.5 @md:grid-cols-[auto_5.25rem_minmax(0,1fr)] [&::-webkit-details-marker]:hidden">
                  <span className="text-[var(--tuwa-text-tertiary)]">{time(event.time)}</span>
                  <span
                    className={cn(
                      'justify-self-start rounded-[var(--tuwa-rounded-corners)] px-1.5 font-semibold',
                      SOURCE_CLASS[event.source],
                    )}
                  >
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
