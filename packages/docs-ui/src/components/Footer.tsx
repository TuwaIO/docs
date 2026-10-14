import { cn } from '@tuwaio/nova-core';
import { Footer as NextraFooter } from 'nextra-theme-docs';

import { footerPolicies, getPolicyPageUrl, POLICIES_INDEX_URL } from '../policies';
import { baseFooterLinks } from '../utils';
import { NavProps } from './NavBar';

/**
 * The footer of a TUWA documentation site: the `Footer` of `nextra-theme-docs` with the logo, external links, the
 * TUWA description and the license on the left, links to the policies in force on tuwa.io (`footerPolicies`) and to
 * the list of all policies on the docs hub on the right, and the copyright line (the current year is read on render)
 * centered below; on narrow screens everything is centered. Render it in the `footer` prop of the Nextra `Layout`.
 *
 * @param props - See {@link NavProps}.
 * @returns The footer.
 */
export function Footer({ links, logo }: NavProps) {
  return (
    <NextraFooter>
      <div className="tuwadocs:flex tuwadocs:w-full tuwadocs:flex-col tuwadocs:items-center tuwadocs:sm:items-start tuwa-footer-border tuwadocs:pt-8">
        <div className="tuwadocs:mb-6 tuwadocs:flex tuwadocs:items-center tuwadocs:gap-4 tuwadocs:w-full tuwadocs:justify-between">
          <div className="tuwadocs:flex tuwadocs:items-center">{logo}</div>

          <div className="tuwadocs:flex tuwadocs:items-center tuwadocs:gap-4 tuwadocs:text-sm">
            {(links ?? baseFooterLinks).map(({ title, href, image, className }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn('tuwa-footer-link tuwadocs:flex tuwadocs:items-center tuwadocs:gap-1', className)}
              >
                {image}
                <span className="tuwadocs:hidden tuwadocs:sm:inline">{title}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="tuwadocs:w-full tuwa-footer-border tuwadocs:pt-4">
          <div className="tuwadocs:flex tuwadocs:flex-col tuwadocs:sm:flex-row tuwadocs:justify-between tuwadocs:items-center tuwadocs:sm:items-start tuwadocs:gap-4">
            <div className="tuwadocs:flex-1 tuwadocs:text-center tuwadocs:sm:text-left">
              <p className="tuwa-footer-description">
                The modular, headless-first Web3 infrastructure. Build self-custodial applications on open-source,
                portable building blocks.
              </p>
              <p className="tuwa-footer-license">Licensed under Apache 2.0. Open source and free to use.</p>
            </div>

            <nav
              aria-label="Policies"
              className="tuwadocs:flex tuwadocs:flex-wrap tuwadocs:items-center tuwadocs:justify-center tuwadocs:sm:justify-end tuwadocs:gap-x-4 tuwadocs:gap-y-2 tuwadocs:text-xs"
            >
              {footerPolicies.map((policy) => (
                <a
                  key={policy.slug}
                  href={getPolicyPageUrl(policy.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tuwa-footer-link"
                >
                  {policy.title}
                </a>
              ))}
              <a
                href={POLICIES_INDEX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="tuwa-footer-link tuwadocs:font-semibold"
              >
                All policies
              </a>
            </nav>
          </div>

          <div className="tuwadocs:flex tuwadocs:flex-wrap tuwadocs:items-center tuwadocs:justify-center tuwadocs:gap-3 tuwadocs:mt-4 tuwadocs:pt-4 tuwa-footer-border">
            <div className="tuwa-footer-copyright">© 2025 - {new Date().getFullYear()} TUWA. All rights reserved.</div>
            {/*<span className="tuwa-badge">*/}
            {/* 🚀 v1.0 Released*/}
            {/*</span>*/}
            {/*<span className="tuwa-badge tuwa-badge--secondary">⚡ Lightning Fast</span>*/}
            {/*<span className="tuwa-badge tuwa-badge--success">✨ Production Ready</span>*/}
          </div>
        </div>
      </div>
    </NextraFooter>
  );
}
