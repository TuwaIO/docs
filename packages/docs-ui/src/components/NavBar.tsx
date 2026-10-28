import { cn } from '@tuwaio/nova-core/utils';
import { Navbar as NextraNavbar } from 'nextra-theme-docs';
import { ReactNode } from 'react';

import { baseNavLinks } from '../utils';

/**
 * A link to an external page, rendered with its icon by {@link Navbar} and {@link Footer}. Links open in a new tab.
 */
export type SocialLink = {
  /** Text of the link; {@link Navbar} shows it from 1024px wide and keeps it as the accessible name and tooltip below */
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
  /** Extra elements rendered in the navbar next to the links, for example {@link LocaleSwitcher} */
  children?: ReactNode;
}

/**
 * The navbar of a TUWA documentation site: the `Navbar` of `nextra-theme-docs` with the logo and a row of external
 * links. Render it in the `navbar` prop of the Nextra `Layout`.
 *
 * The row stays on one line of the 64px Nextra header from 320px wide: the links are hidden below 640px and show only
 * their icons below 1024px, so the Nextra search, the top-level pages and `children` such as {@link LocaleSwitcher}
 * keep their room. The logo never shrinks; the top-level pages of Nextra scroll instead. Below 768px the stylesheet
 * (`dist/index.css`) makes the header opaque in the theme background, so the page never shows through it.
 *
 * @param props - See {@link NavProps}.
 * @returns The navbar.
 */
export function Navbar({ links, logo, children }: NavProps) {
  return (
    <NextraNavbar logo={logo} className="tuwadocs:[&>:first-child]:shrink-0">
      <div className="tuwadocs:flex tuwadocs:shrink-0 tuwadocs:items-center tuwadocs:gap-3">
        {(links ?? baseNavLinks).map(({ title, href, image, className }) => (
          <a
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={title}
            className={cn(
              'tuwadocs:hidden tuwadocs:sm:flex tuwadocs:items-center tuwadocs:gap-1 tuwadocs:px-3 tuwadocs:py-1.5 tuwadocs:text-sm tuwadocs:font-medium tuwadocs:whitespace-nowrap tuwadocs:transition-colors tuwadocs:text-[var(--tuwa-text-primary)]',
              className,
            )}
          >
            {image}
            <span className="tuwadocs:sr-only tuwadocs:lg:not-sr-only">{title}</span>
          </a>
        ))}
        {children}
      </div>
    </NextraNavbar>
  );
}
