'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * An inline script that runs once, when the page loads. It is rendered on the server and kept while the page
 * hydrates (`useSyncExternalStore` takes the server snapshot there), and React never renders it in a render that
 * starts on the client: such a script would not run, and React 19 reports it ("Encountered a script tag while
 * rendering React component"), as when a link leads to another root layout (`/` → `/uk`).
 *
 * @param props - The script.
 * @param props.code - The JavaScript to run.
 * @returns The script, or nothing on the client.
 * @internal
 */
export function InlineScript({ code }: { code: string }) {
  const onServer = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );
  return onServer ? <script dangerouslySetInnerHTML={{ __html: code }} /> : null;
}
