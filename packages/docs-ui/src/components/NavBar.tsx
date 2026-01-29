'use client';

import { cn } from '@tuwaio/nova-core';
import Image from 'next/image';
import { Navbar as NextraNavbar } from 'nextra-theme-docs';
import { ReactNode } from 'react';

import { baseNavLinks } from '../utils';
import NoSSR from './NoSSR';

export type SocialLink = {
  title: string;
  href: string;
  image: ReactNode;
  className?: string;
};

export interface NavProps {
  links?: SocialLink[];
}

export function Navbar({ links }: NavProps) {
  return (
    <NextraNavbar
      logo={
        <NoSSR>
          <Image
            width={120}
            height={40}
            src="https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/tuwa_logo.svg"
            alt="TUWA Logo"
          />
        </NoSSR>
      }
    >
      <div className="tuwadocs:flex tuwadocs:items-center tuwadocs:gap-3">
        {(links ?? baseNavLinks).map(({ title, href, image, className }) => (
          <a
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'tuwadocs:hidden tuwadocs:sm:flex tuwadocs:items-center tuwadocs:gap-1 tuwadocs:px-3 tuwadocs:py-1.5 tuwadocs:text-sm tuwadocs:font-medium tuwadocs:transition-colors tuwadocs:text-gray-700 tuwadocs:dark:text-gray-300',
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
