import type { ReactNode } from 'react';

import { HubShell } from '../../components/HubShell';

/**
 * Layout for the main Docs Hub landing portal.
 */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return <HubShell>{children}</HubShell>;
}
