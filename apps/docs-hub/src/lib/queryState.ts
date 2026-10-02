import { useSyncExternalStore } from 'react';

// The hub tools keep their options in the query string of the page, so a setup can be shared as a link
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

/** The query string of the page (`?…`), or `''` while the static page is rendered on the server. */
export function useQueryString(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => '',
  );
}

/** Replaces the query string without a navigation and re-renders the components that read it. */
export function replaceQuery(query: string): void {
  window.history.replaceState(window.history.state, '', `?${query}`);
  listeners.forEach((listener) => listener());
}
