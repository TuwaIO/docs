'use client';

import { createI18n } from '@tuwaio/docs-ui/i18n';

import { en } from './locales/en';
import { uk } from './locales/uk';
import { zhCN } from './locales/zhCN';
import type { DocsHubLabels } from './types';

/**
 * The i18n kit of the docs hub: detection, persistence (`tuwa-locale`, 30 days through `PreferenceExpiry`) and
 * switching come from `@tuwaio/docs-ui`; the texts are the dictionaries of this app.
 */
export const { I18nProvider, useI18n, dictionaries } = createI18n<DocsHubLabels>({
  en,
  uk,
  'zh-CN': zhCN,
});
