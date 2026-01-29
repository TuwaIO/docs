import Image from 'next/image';
import { Footer as NextraFooter } from 'nextra-theme-docs';

import { baseFooterLinks } from '../utils';
import { NavProps } from './NavBar';
import NoSSR from './NoSSR';

export function Footer({ links }: NavProps) {
  return (
    <NextraFooter>
      <div className="flex w-full flex-col items-center sm:items-start tuwa-footer-border pt-8">
        <div className="mb-6 flex items-center gap-4 w-full justify-between">
          <div className="flex items-center">
            <NoSSR>
              <Image
                width={120}
                height={40}
                src="https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/tuwa_logo.svg"
                alt="TUWA Logo"
                className="transition-opacity duration-300"
              />
            </NoSSR>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {(links ?? baseFooterLinks).map(({ title, href, image }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="tuwa-footer-link tuwa-footer-link--npm flex items-center gap-1"
              >
                {image}
                <span className="hidden sm:inline">{title}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="w-full tuwa-footer-border pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="tuwa-footer-description">
                A useful and powerful utils for building decentralized applications.
              </p>
              <p className="tuwa-footer-license">Licensed under Apache 2.0. Open source and free to use.</p>
            </div>

            <div className="tuwa-footer-copyright">
              © 2025 - {new Date().getFullYear()} TUWA. Built with{' '}
              <span className="tuwa-heart" aria-label="love">
                ❤️
              </span>{' '}
              for Web3.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 tuwa-footer-border">
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
