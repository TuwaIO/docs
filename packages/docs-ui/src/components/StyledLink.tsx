import { cn } from '@tuwaio/nova-core';
import { ReactNode } from 'react';

export function StyledLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      className={cn(
        'tuwadocs:font-medium tuwadocs:text-[var(--tuwa-text-accent)]',
        'tuwadocs:transition-all tuwadocs:hover:underline tuwadocs:underline-offset-4',
      )}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
