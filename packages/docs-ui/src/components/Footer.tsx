import { cn } from '@tuwaio/nova-core';
import { Footer as NextraFooter } from 'nextra-theme-docs';

import { baseFooterLinks } from '../utils';
import { RemoteLogo } from './Logo';
import { NavProps } from './NavBar';
import NoSSR from './NoSSR';

export function Footer({ links }: NavProps) {
  return (
    <NextraFooter>
      <div className="tuwadocs:flex tuwadocs:w-full tuwadocs:flex-col tuwadocs:items-center tuwadocs:sm:items-start tuwa-footer-border tuwadocs:pt-8">
        <div className="tuwadocs:mb-6 tuwadocs:flex tuwadocs:items-center tuwadocs:gap-4 tuwadocs:w-full tuwadocs:justify-between">
          <div className="tuwadocs:flex tuwadocs:items-center">
            <NoSSR>
              <RemoteLogo width={100} height={42} className="tuwadocs:transition-opacity tuwadocs:duration-300" />
            </NoSSR>
          </div>

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
          <div className="tuwadocs:flex tuwadocs:flex-col tuwadocs:sm:flex-row tuwadocs:justify-between tuwadocs:items-start tuwadocs:sm:items-center tuwadocs:gap-4">
            <div className="tuwadocs:flex-1">
              <p className="tuwa-footer-description">
                The modular, headless-first Web3 infrastructure. Build self-custodial applications with zero vendor
                lock-in.
              </p>
              <p className="tuwa-footer-license">Licensed under Apache 2.0. Open source and free to use.</p>
            </div>

            <div className="tuwa-footer-copyright">© 2025 - {new Date().getFullYear()} TUWA. All rights reserved.</div>
          </div>

          <div className="tuwadocs:flex tuwadocs:flex-wrap tuwadocs:items-center tuwadocs:gap-3 tuwadocs:mt-4 tuwadocs:pt-4 tuwa-footer-border">
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
