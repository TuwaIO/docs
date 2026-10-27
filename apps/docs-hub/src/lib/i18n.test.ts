import { publishedPolicies } from '@tuwaio/docs-ui';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { en, formatLabel, LOCALE_STORAGE_KEY, normalizeLocale, resolveClientLocale, uk, zhCN } from '../i18n';
import { AXES, COMPETITORS, CRITERIA, SEGMENTS, TUWA } from './comparisons';
import { layers } from './ecosystem';

function collectKeys(obj: unknown, prefix = ''): string[] {
  if (!obj || typeof obj !== 'object') return [prefix];
  if (Array.isArray(obj)) {
    return obj.flatMap((item, index) => collectKeys(item, `${prefix}[${index}]`));
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
    collectKeys(value, prefix ? `${prefix}.${key}` : key),
  );
}

describe('docs-hub i18n', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes supported locale tags', () => {
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('uk')).toBe('uk');
    expect(normalizeLocale('uk-UA')).toBe('uk');
    expect(normalizeLocale('ua')).toBe('uk');
    expect(normalizeLocale('zh-CN')).toBe('zh-CN');
    expect(normalizeLocale('zh-Hans')).toBe('zh-CN');
    expect(normalizeLocale('zh')).toBe('zh-CN');
    expect(normalizeLocale('fr-FR')).toBeNull();
    expect(normalizeLocale(null)).toBeNull();
  });

  it('formats template labels with placeholders', () => {
    expect(formatLabel('Verified {date} · {count} items', { date: 'Oct 2026', count: 8 })).toBe(
      'Verified Oct 2026 · 8 items',
    );
  });

  it('resolves client locale from localStorage, navigator.languages, or timezone', () => {
    const storage = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
      },
    });
    vi.stubGlobal('navigator', {
      language: 'en-US',
      languages: ['en-US'],
    });

    storage.set(LOCALE_STORAGE_KEY, 'zh-CN');
    expect(resolveClientLocale()).toBe('zh-CN');

    storage.delete(LOCALE_STORAGE_KEY);
    vi.stubGlobal('navigator', {
      language: 'uk-UA',
      languages: ['uk-UA', 'en-US'],
    });
    expect(resolveClientLocale()).toBe('uk');
  });

  it('maintains identical recursive key structure across en, uk, and zh-CN', () => {
    const enKeys = collectKeys(en).sort();
    const ukKeys = collectKeys(uk).sort();
    const zhKeys = collectKeys(zhCN).sort();

    expect(ukKeys).toEqual(enKeys);
    expect(zhKeys).toEqual(enKeys);
  });

  it('covers all ecosystem entries, comparison products/criteria, and published policies', () => {
    for (const [index, layer] of layers.entries()) {
      const stage = index + 1;
      expect(en.home.timeline.stages[stage]).toBeDefined();
      expect(uk.home.timeline.stages[stage]).toBeDefined();
      expect(zhCN.home.timeline.stages[stage]).toBeDefined();
      for (const entry of layer.entries) {
        expect(en.home.entries[entry.id]?.tagline).toBeTruthy();
        expect(uk.home.entries[entry.id]?.tagline).toBeTruthy();
        expect(zhCN.home.entries[entry.id]?.tagline).toBeTruthy();
      }
    }

    for (const axis of AXES) {
      expect(uk.comparisons.axes[axis.id]?.label).toBeTruthy();
      expect(zhCN.comparisons.axes[axis.id]?.label).toBeTruthy();
    }

    for (const segment of SEGMENTS) {
      expect(uk.comparisons.segments[segment.id]?.label).toBeTruthy();
      expect(zhCN.comparisons.segments[segment.id]?.label).toBeTruthy();
    }

    for (const criterion of CRITERIA) {
      expect(uk.comparisons.criteria[criterion.id]?.label).toBeTruthy();
      expect(zhCN.comparisons.criteria[criterion.id]?.label).toBeTruthy();
    }

    for (const product of [TUWA, ...COMPETITORS]) {
      expect(uk.comparisons.products[product.id]?.summary).toBeTruthy();
      expect(zhCN.comparisons.products[product.id]?.summary).toBeTruthy();
      for (const criterion of CRITERIA) {
        expect(uk.comparisons.products[product.id]?.facts[criterion.id]).toBeTruthy();
        expect(zhCN.comparisons.products[product.id]?.facts[criterion.id]).toBeTruthy();
      }
    }

    for (const policy of publishedPolicies) {
      expect(uk.footer.policyTitles[policy.slug]).toBeTruthy();
      expect(zhCN.footer.policyTitles[policy.slug]).toBeTruthy();
      expect(uk.policies.items[policy.slug]?.title).toBeTruthy();
      expect(zhCN.policies.items[policy.slug]?.title).toBeTruthy();
    }
  });
});
