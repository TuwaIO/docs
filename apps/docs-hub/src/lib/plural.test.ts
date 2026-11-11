import { describe, expect, it } from 'vitest';

import { en, uk, zhCN } from '../i18n';
import { formatPlural } from './plural';

// Counts in Ukrainian take one of three forms ("1 продукт", "3 продукти", "8 продуктів"): one string with a count in
// it read wrong for most counts
describe('formatPlural', () => {
  const products = uk.home.plate.products;

  it.each([
    [1, '1 продукт'],
    [3, '3 продукти'],
    [8, '8 продуктів'],
    [11, '11 продуктів'],
    [21, '21 продукт'],
    [23, '23 продукти'],
  ])('writes %i in the Ukrainian form of its count', (count, text) => {
    expect(formatPlural(products, count, 'uk')).toBe(text);
  });

  it('writes English and Chinese counts', () => {
    expect(formatPlural(en.home.plate.products, 1, 'en')).toBe('1 product');
    expect(formatPlural(en.home.plate.products, 8, 'en')).toBe('8 products');
    expect(formatPlural(zhCN.home.plate.stages, 5, 'zh-CN')).toBe('5 个阶段');
  });

  it('labels the count of packages in the form of the count', () => {
    expect(formatPlural(uk.home.plate.packagesOnNpm, 23, 'uk')).toBe('пакети в npm');
    expect(formatPlural(uk.home.plate.packagesOnNpm, 25, 'uk')).toBe('пакетів у npm');
    expect(formatPlural(en.home.plate.packagesOnNpm, 23, 'en')).toBe('Packages on npm');
  });
});
