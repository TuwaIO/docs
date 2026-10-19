import { describe, expect, it } from 'vitest';

import { expireStoredPreferences } from '../../../../packages/docs-ui/src/preferences';

// The documentation sites keep the theme and the guide tab 30 days after they are chosen, not until the browser
// storage is cleared (Cookie Policy, owner decision 2026-10-15; lawyer round 8). The function runs inline in the page
// head, before next-themes and Nextra read the stored values, and dates every later write of those keys.
class FakeStorage {
  data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
}

const DAY = 86_400_000;
const keys = ['theme', 'tuwa-guide-network'];
const now = Date.UTC(2026, 9, 15);

describe('stored preferences of the documentation sites', () => {
  it('forget a value chosen more than 30 days ago, and one saved before values had an expiry', () => {
    const storage = new FakeStorage();
    const proto = { setItem: FakeStorage.prototype.setItem };
    storage.setItem('theme', 'light');
    storage.setItem('theme:expires', String(now - DAY));
    storage.setItem('tuwa-guide-network', 'Solana');
    storage.setItem('other', 'kept');

    expireStoredPreferences(storage as unknown as Storage, proto, keys, 30 * DAY, now);

    expect(storage.getItem('theme')).toBeNull();
    expect(storage.getItem('theme:expires')).toBeNull();
    expect(storage.getItem('tuwa-guide-network')).toBeNull();
    expect(storage.getItem('other')).toBe('kept');
  });

  it('keep a value within its 30 days', () => {
    const storage = new FakeStorage();
    storage.setItem('theme', 'dark');
    storage.setItem('theme:expires', String(now + DAY));

    expireStoredPreferences(
      storage as unknown as Storage,
      { setItem: FakeStorage.prototype.setItem },
      keys,
      30 * DAY,
      now,
    );

    expect(storage.getItem('theme')).toBe('dark');
  });

  it('date each later write of those keys 30 days ahead, whoever writes it', () => {
    const storage = new FakeStorage();
    const proto = FakeStorage.prototype as unknown as Pick<Storage, 'setItem'>;
    const original = proto.setItem;
    try {
      expireStoredPreferences(storage as unknown as Storage, proto, keys, 30 * DAY, now);
      storage.setItem('tuwa-guide-network', 'EVM');
      storage.setItem('other', 'x');

      const expiresAt = Number(storage.getItem('tuwa-guide-network:expires'));
      expect(expiresAt - Date.now()).toBeGreaterThan(29 * DAY);
      expect(storage.getItem('other:expires')).toBeNull();
    } finally {
      proto.setItem = original;
    }
  });
});
