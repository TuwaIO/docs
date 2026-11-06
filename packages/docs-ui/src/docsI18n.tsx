'use client';

import { docsLabels } from './docsLabels';
import { createI18n } from './i18n';

/**
 * The i18n kit of the TUWA documentation sites, on {@link docsLabels}: `DocsI18nProvider` provides the language of the
 * reader and the interface texts, `useDocsI18n` reads them (outside the provider: English and a no-op setter).
 * `DocsLayout` renders the provider, so a site's client components inside the layout call `useDocsI18n` directly.
 * The language is detected after mount and kept under `tuwa-locale` in Local Storage (list it in `PreferenceExpiry`).
 */
export const { I18nProvider: DocsI18nProvider, useI18n: useDocsI18n } = createI18n(docsLabels);
