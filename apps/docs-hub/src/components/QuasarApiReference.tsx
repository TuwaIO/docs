'use client';

import '@scalar/api-reference-react/style.css';

import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const ApiReferenceReact = dynamic(() => import('@scalar/api-reference-react').then((mod) => mod.ApiReferenceReact), {
  ssr: false,
});

/**
 * The interactive reference of the Quasar API (Scalar), rendered in the browser only. It loads
 * `public/quasar-openapi.yaml`, which `pnpm openapi:gen` of the `TuwaIO/sdk` repository writes, and follows the
 * light or dark theme of the site, with the fonts of the system (no requests to fonts.scalar.com). Side effect:
 * requests that the reader sends with the built-in client go to the Quasar API.
 *
 * @returns The API reference.
 */
export function QuasarApiReference() {
  const { resolvedTheme } = useTheme();

  return (
    <ApiReferenceReact
      key={resolvedTheme}
      configuration={{
        url: '/quasar-openapi.yaml',
        agent: { disabled: true },
        // Scalar loads Inter and JetBrains Mono from fonts.scalar.com by default, which would get the IP address of
        // every reader (Cookie and Privacy policies): the reference uses the fonts of the system instead
        withDefaultFonts: false,
        forceDarkModeState: resolvedTheme === 'dark' ? 'dark' : 'light',
        hideDarkModeToggle: true,
        showDeveloperTools: 'never',
      }}
    />
  );
}
