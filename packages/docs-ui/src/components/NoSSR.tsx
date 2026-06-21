'use client';

import { ReactNode, useEffect, useState } from 'react';

/**
 * A wrapper component that prevents its children from rendering on the server (SSR).
 * It waits until the component is mounted on the client before rendering them.
 *
 * @param props - The component props.
 * @param props.children - The children components to render on the client.
 * @returns The children components on the client, or null on the server.
 */
export default function NoSSR({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
