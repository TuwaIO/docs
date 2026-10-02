'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

// next-themes renders an inline script that applies the theme before the first paint; it runs from the server HTML.
// A provider created on the client (remounted during development) renders the script again, where it never runs, so
// there it is a data block and React does not warn about a script tag
const themeScriptProps = typeof window === 'undefined' ? undefined : { type: 'text/plain' };

/**
 * Application-level providers wrapping all client-side context.
 * @param props.children - The child components to wrap.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem scriptProps={themeScriptProps}>
      {children}
    </ThemeProvider>
  );
}
