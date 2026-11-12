'use client';

import type { TuwaLocale } from '@tuwaio/docs-ui/locale';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { I18nProvider } from '@/i18n';

// next-themes renders an inline script that applies the theme before the first paint; it runs from the server HTML.
// A provider created on the client (remounted during development) renders the script again, where it never runs, so
// there it is a data block and React does not warn about a script tag
const themeScriptProps = typeof window === 'undefined' ? undefined : { type: 'text/plain' };

/**
 * Application-level providers wrapping all client-side context.
 * @param props.children - The child components to wrap.
 * @param props.urlLocale - The language of the URL, from the root layout: the server renders it, with no English first and no
 * detection. It does not come from the path here: a 404 is prerendered once, for every URL.
 */
export function Providers({ children, urlLocale }: { children: ReactNode; urlLocale?: TuwaLocale }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem scriptProps={themeScriptProps}>
      <I18nProvider initialLocale={urlLocale}>{children}</I18nProvider>
    </ThemeProvider>
  );
}
