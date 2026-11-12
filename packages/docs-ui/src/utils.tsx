import { GitHubIcon, NpmIcon } from '@tuwaio/nova-icons/brands';
import type { ReactNode } from 'react';

/**
 * A link to an external page, rendered with its icon by `Navbar` and `Footer`. Links open in a new tab.
 */
export type SocialLink = {
  /** Text of the link; `Navbar` shows it from 1024px wide and keeps it as the accessible name and tooltip below */
  title: string;
  /** Absolute URL of the page */
  href: string;
  /** Icon rendered before the title */
  image: ReactNode;
  /** Classes added to the link */
  className?: string;
};

/**
 * The default links of `Navbar`: the npm organization of TUWA, with its pixel mark from `@tuwaio/nova-icons/brands`.
 * Sites spread it into their own `links` to keep it next to site-specific links (for example the GitHub repository).
 */
export const baseNavLinks: SocialLink[] = [
  {
    title: 'NPM',
    href: 'https://npmjs.com/org/tuwaio',
    image: <NpmIcon className="tuwadocs:w-4 tuwadocs:h-4" aria-hidden="true" />,
  },
];

/**
 * The default links of `Footer`: the npm organization and the GitHub organization of TUWA, with their pixel marks.
 */
export const baseFooterLinks: SocialLink[] = [
  {
    title: 'NPM',
    href: 'https://npmjs.com/org/tuwaio',
    className: 'tuwa-footer-link--npm',
    image: <NpmIcon className="tuwadocs:w-4 tuwadocs:h-4" aria-hidden="true" />,
  },
  {
    title: 'GitHub',
    href: 'https://github.com/TuwaIO',
    className: 'tuwa-footer-link--github',
    image: <GitHubIcon className="tuwadocs:w-4 tuwadocs:h-4" aria-hidden="true" />,
  },
];
