import { createStore } from 'zustand/vanilla';

/** The part of the simulated stack an event comes from. */
export type EventSource = 'Wallet' | 'Chain' | 'Satellite' | 'Pulsar' | 'SIWX' | 'Quasar' | 'Webhook' | 'Nova';

/** One entry of the Events tab. */
export interface PlaygroundEvent {
  /** Increasing number, unique within the page. */
  id: number;
  /** `Date.now()` when the event was logged. */
  time: number;
  /** Where the event comes from. */
  source: EventSource;
  /** One line, for example `connect evm:orbitwallet`. */
  label: string;
  /** Data shown when the entry is expanded: a request, a webhook payload, a transaction. */
  detail?: unknown;
}

const MAX_EVENTS = 200;
let nextId = 1;

/** The event log of the Playground, newest first, at most 200 events. */
export const eventLog = createStore<{ events: PlaygroundEvent[] }>()(() => ({ events: [] }));

/** Adds an event to the log. */
export function logEvent(source: EventSource, label: string, detail?: unknown): void {
  const event: PlaygroundEvent = { id: nextId++, time: Date.now(), source, label, detail };
  eventLog.setState(({ events }) => ({ events: [event, ...events].slice(0, MAX_EVENTS) }));
}

/** Empties the log. */
export function clearEvents(): void {
  eventLog.setState({ events: [] });
}
