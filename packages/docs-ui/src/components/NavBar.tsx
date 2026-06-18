import { cn } from '@tuwaio/nova-core';
import { Navbar as NextraNavbar } from 'nextra-theme-docs';
import { ReactNode } from 'react';

import { baseNavLinks } from '../utils';

export type SocialLink = {
  title: string;
  href: string;
  image: ReactNode;
  className?: string;
};

export interface NavProps {
  links?: SocialLink[];
  logo?: ReactNode;
}

export function Navbar({ links, logo }: NavProps) {
  return (
    <NextraNavbar logo={logo}>
      <div className="tuwadocs:flex tuwadocs:items-center tuwadocs:gap-3">
        {(links ?? baseNavLinks).map(({ title, href, image, className }) => (
          <a
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'tuwadocs:hidden tuwadocs:sm:flex tuwadocs:items-center tuwadocs:gap-1 tuwadocs:px-3 tuwadocs:py-1.5 tuwadocs:text-sm tuwadocs:font-medium tuwadocs:transition-colors tuwadocs:text-[var(--tuwa-text-primary)]',
              className,
            )}
          >
            {image}
            {title}
          </a>
        ))}
      </div>
    </NextraNavbar>
  );
}
