import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { expireStoredPreferences, PREFERENCE_DAYS } from '../../../../packages/docs-ui/src/preferences';
import { STORED_PREFERENCES } from './storedPreferences';

const DAY = 86_400_000;
const MS = PREFERENCE_DAYS * DAY;
const NOW = Date.UTC(2026, 10, 28);

/** A Local Storage as the browser has it, with a prototype of its own: the script wraps the `setItem` of it. */
function browserStorage() {
  class MemoryStorage {
    items = new Map<string, string>();
    getItem(key: string) {
      return this.items.get(key) ?? null;
    }
    setItem(key: string, value: string) {
      this.items.set(key, String(value));
    }
    removeItem(key: string) {
      this.items.delete(key);
    }
  }
  return { storage: new MemoryStorage(), proto: MemoryStorage.prototype };
}
/** The script of `PreferenceExpiry` as a page runs it when it loads, at `now`. */
const load = (page: ReturnType<typeof browserStorage>, now: number) =>
  expireStoredPreferences(page.storage as unknown as Storage, page.proto, STORED_PREFERENCES, MS, now);

beforeEach(() => vi.useFakeTimers({ now: NOW }));
afterEach(() => vi.useRealTimers());

// Every interface setting a page of the hub keeps in the browser lasts 30 days after it is chosen (Cookie Policy)
describe('the interface settings of the hub', () => {
  it('are the theme, the network tab of the guides, the language, the package manager and the client of the API reference', () => {
    expect(STORED_PREFERENCES).toEqual([
      'theme',
      'tuwa-guide-network',
      'tuwa-locale',
      'tuwa-docs-hub:package-manager',
      'scalar-reference-selected-client-v2',
    ]);
  });

  it.each(STORED_PREFERENCES)('%s is dated as it is written and forgotten 30 days after', (key) => {
    const page = browserStorage();
    load(page, NOW);

    page.storage.setItem(key, 'chosen');
    expect(page.storage.getItem(`${key}:expires`)).toBe(String(NOW + MS));

    load(page, NOW + MS - DAY);
    expect(page.storage.getItem(key)).toBe('chosen');

    load(page, NOW + MS + 1);
    expect(page.storage.getItem(key)).toBeNull();
    expect(page.storage.getItem(`${key}:expires`)).toBeNull();
  });
});
