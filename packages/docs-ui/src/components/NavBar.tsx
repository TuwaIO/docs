import { cn } from '@tuwaio/nova-core';
import { Navbar as NextraNavbar } from 'nextra-theme-docs';
import { ReactNode } from 'react';

import { baseNavLinks } from '../utils';

/**
 * A link to an external page, rendered with its icon by {@link Navbar} and {@link Footer}. Links open in a new tab.
 */
export type SocialLink = {
  /** Text of the link (hidden on small screens) */
  title: string;
  /** Absolute URL of the page */
  href: string;
  /** Icon rendered before the title */
  image: ReactNode;
  /** Classes added to the link */
  className?: string;
};

/**
 * Props of {@link Navbar} and {@link Footer}.
 */
export interface NavProps {
  /** Links rendered next to the logo (default: {@link baseNavLinks} in the navbar, {@link baseFooterLinks} in the footer) */
  links?: SocialLink[];
  /** Logo of the site, for example {@link RemoteLogo} */
  logo?: ReactNode;
}

/**
 * The navbar of a TUWA documentation site: the `Navbar` of `nextra-theme-docs` with the logo and a row of external
 * links, hidden on small screens. Render it in the `navbar` prop of the Nextra `Layout`.
 *
 * @param props - See {@link NavProps}.
 * @returns The navbar.
 */
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
