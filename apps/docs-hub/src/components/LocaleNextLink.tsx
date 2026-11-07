'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

import { useI18n } from '@/i18n';
import { hrefInLanguage } from '@/lib/languageUrls';

/**
 * The link of a page of the hub, which stays in the language of the reader: the pages are written with their English paths. The
 * language comes from the provider and not from the path, because a 404 is prerendered once, for every URL of its language.
 *
 * @param props - The props of `next/link`.
 * @returns The link.
 */
export default function LocaleNextLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { locale } = useI18n();
  return <Link href={typeof href === 'string' ? hrefInLanguage(href, locale) : href} {...props} />;
}
