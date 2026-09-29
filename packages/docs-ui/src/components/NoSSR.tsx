'use client';

import { ReactNode, useEffect, useState } from 'react';

/**
 * Renders its children only on the client, after the component is mounted; on the server and in the first client
 * render it renders nothing. Use it for parts whose output depends on browser-only state.
 *
 * @param props - The component props.
 * @param props.children - The content to render on the client.
 * @returns The children after mount, otherwise `null`.
 */
export default function NoSSR({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
