/**
 * A text with a count, in each plural form that `Intl.PluralRules` names for the languages of the hub: `one` (1 in
 * English; 1, 21, 31 in Ukrainian), `few` (2–4, 22–24 in Ukrainian), `many` (0, 5–20, 25–30 in Ukrainian) and `other`
 * (every other count, every count in Chinese). Each language gives all four, so the dictionaries keep one shape; `{n}`
 * stands for the count.
 */
export type PluralLabel = Record<'one' | 'few' | 'many' | 'other', string>;

/**
 * The text of a count in the plural form its language takes for it ("23 пакети", "8 продуктів", "5 етапів").
 *
 * @param label - The text in each plural form.
 * @param count - The count.
 * @param locale - The language of the text (`en`, `uk`, `zh-CN`).
 * @returns The text of the form, with the count in place of `{n}`.
 */
export function formatPlural(label: PluralLabel, count: number, locale: string): string {
  const form = new Intl.PluralRules(locale).select(count);
  const template = form in label ? label[form as keyof PluralLabel] : label.other;
  return template.replace(/\{n\}/g, String(count));
}
