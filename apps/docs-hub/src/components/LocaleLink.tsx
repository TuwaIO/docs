'use client';

import { Link } from 'nextra-theme-docs';
import type { ComponentProps } from 'react';

import { useI18n } from '@/i18n';
import { hrefInLanguage } from '@/lib/languageUrls';

/**
 * A link of an MDX page that stays in the language of the URL: the pages are written with their English paths, and a reader on
 * `/uk/quasar/webhooks` who follows `/quasar/api` belongs on `/uk/quasar/api`.
 *
 * @param props - The props of the link of the Nextra theme.
 * @returns The link.
 */
export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { locale } = useI18n();
  return <Link href={typeof href === 'string' ? hrefInLanguage(href, locale) : href} {...props} />;
}
