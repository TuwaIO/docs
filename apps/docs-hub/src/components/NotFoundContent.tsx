'use client';

import { PixelArt } from '@tuwaio/docs-ui';
import { ExternalLinkIcon } from '@tuwaio/nova-core';
import { useSyncExternalStore } from 'react';

import Link from '@/components/LocaleNextLink';
import { useI18n } from '@/i18n';
import { layers } from '@/lib/ecosystem';

import {
  buttonArrowClassName,
  largeButtonClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  smallButtonClassName,
} from './buttonStyles';
import {
  homeContentClassName,
  homeEdgeToEdgeClassName,
  homeFrameClassName,
  homeMarginLeftClassName,
  homeMarginRightClassName,
} from './home/homeLayout';
import { ARROW_RIGHT } from './home/pixelArrows';
import { CrossMark, Kicker } from './home/SectionHead';

const destinationHrefs = ['/guides', '/quasar', '/configurator', '/playground', '/comparisons', '/policies'] as const;

// The reference sites of the projects (absolute URLs only; Quasar lives in this hub)
const projectSites = layers
  .flatMap((layer) => layer.entries)
  .filter((entry) => entry.docsUrl.startsWith('https://'))
  .map((entry) => ({ name: entry.name, url: entry.docsUrl }));

/**
 * The number of the page in pixels, on a grid of 19 by 7 for `PixelArt`: the fours in ink, the zero between them lit.
 */
// prettier-ignore
const NOT_FOUND_ART = [
  '#...#..ooooo..#...#',
  '#...#..o...o..#...#',
  '#...#..o...o..#...#',
  '#####..o...o..#####',
  '....#..o...o......#',
  '....#..o...o......#',
  '....#..ooooo......#',
];

/** The longest address the kicker shows whole; a longer one ends with an ellipsis. */
const PATH_LENGTH = 64;

const lineClassName = 'border-[var(--tuwa-border-primary)]';
const capsClassName = 'font-mono text-[11px] font-bold uppercase leading-[1.35] tracking-[0.12em]';

const noSubscription = () => () => {};
const readPath = () => window.location.pathname;
const noPath = () => '';

/**
 * The content of the 404 page of the hub, in paper and ink, on the frame of the main page: the kicker with the address
 * that was not found, the title in large mono, the lead and two buttons (back to the main page, report a broken link),
 * beside the number 404 in pixels, which fly in to their places once; then the sections of the hub as cells on shared
 * lines of 1px, from line to line of the frame, and the reference sites of the projects as small buttons.
 *
 * The address is read in the browser after the page has loaded: a 404 is prerendered once for every address of its
 * language, so the server does not know it.
 *
 * @returns The page.
 */
export function NotFoundContent() {
  const { locale, t } = useI18n();
  const path = useSyncExternalStore(noSubscription, readPath, noPath);
  const shownPath = path.length > PATH_LENGTH ? `${path.slice(0, PATH_LENGTH)}…` : path;

  return (
    <div className="relative z-10">
      <div className={`${homeContentClassName} ${homeFrameClassName}`}>
        <CrossMark x="left" y="top" />
        <CrossMark x="right" y="top" />

        <header className="grid grid-cols-1 pt-12 pb-14 md:pt-16 md:pb-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-12 xl:pt-20">
          <Kicker>
            <span className="min-w-0">
              404
              {shownPath && (
                <>
                  {' · '}
                  <span className="tracking-normal break-all normal-case">{shownPath}</span>
                </>
              )}
            </span>
          </Kicker>
          <PixelArt
            art={NOT_FOUND_ART}
            assemble
            className="mt-8 h-auto w-[228px] sm:w-[304px] lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mt-0 lg:self-end xl:w-[380px]"
          />
          <h1
            className={`mt-8 font-mono text-[clamp(32px,5.2vw,64px)] leading-[0.98] font-medium text-[var(--tuwa-text-primary)] lg:col-start-1 lg:mt-5 ${locale === 'uk' ? 'tracking-normal' : 'tracking-[-0.04em]'}`}
          >
            {t.notFound.heading}
          </h1>
          <p className="mt-7 max-w-[600px] text-lg leading-[1.55] text-[var(--tuwa-text-primary)] lg:col-start-1">
            {t.notFound.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 lg:col-start-1">
            <Link href="/" className={`${largeButtonClassName} ${primaryButtonClassName}`}>
              <PixelArt
                art={ARROW_RIGHT}
                className={`${buttonArrowClassName} -scale-x-100 group-hover:-translate-x-[3px] group-focus-visible:-translate-x-[3px]`}
              />
              {t.notFound.backToMain}
            </Link>
            <a
              href="https://github.com/TuwaIO/docs/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              // On the narrowest phones the longest of its texts (Ukrainian) is wider than the screen: it takes two lines
              className={`${largeButtonClassName} ${secondaryButtonClassName} max-w-full max-[400px]:h-auto max-[400px]:min-h-11 max-[400px]:py-2.5 max-[400px]:leading-[1.35] max-[400px]:whitespace-normal`}
            >
              {t.ui.notFoundExtra.reportBrokenLink}
              <ExternalLinkIcon className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </header>

        <nav aria-labelledby="hub-sections" className={`relative border-t ${lineClassName} ${homeEdgeToEdgeClassName}`}>
          <CrossMark x="left" y="top" />
          <CrossMark x="right" y="top" />
          <h2
            id="hub-sections"
            className={`m-0 border-b py-4 text-[var(--tuwa-text-secondary)] ${lineClassName} ${capsClassName} ${homeMarginLeftClassName} ${homeMarginRightClassName}`}
          >
            {t.ui.notFoundExtra.hubSectionsHeading}
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {destinationHrefs.map((href) => {
              const destination =
                href === '/policies'
                  ? { title: t.ui.notFoundExtra.policiesTitle, description: t.ui.notFoundExtra.policiesDescription }
                  : t.notFound.destinations[href];
              return (
                <li
                  key={href}
                  className={`border-b sm:max-lg:odd:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0 ${lineClassName}`}
                >
                  <Link
                    href={href}
                    className="group flex h-full flex-col gap-2 px-4 py-6 transition-colors hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)] md:px-8 xl:px-12 min-[1600px]:px-14"
                  >
                    <span className="flex items-center justify-between gap-3 font-mono text-base leading-[1.25] font-bold text-[var(--tuwa-text-primary)]">
                      {destination?.title ?? href}
                      <PixelArt
                        art={ARROW_RIGHT}
                        className={`${buttonArrowClassName} shrink-0 group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]`}
                      />
                    </span>
                    <span className="text-sm leading-normal text-[var(--tuwa-text-secondary)]">
                      {destination?.description ?? ''}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav aria-labelledby="project-sites" className="py-8 md:py-10">
          <h2 id="project-sites" className={`m-0 text-[var(--tuwa-text-primary)] ${capsClassName}`}>
            {t.notFound.packageRefHeading}
          </h2>
          <p className="m-0 mt-2.5 max-w-[480px] text-sm leading-normal text-[var(--tuwa-text-secondary)]">
            {t.notFound.packageRefDescription}
          </p>
          <ul className="m-0 mt-5 flex list-none flex-wrap gap-2.5 p-0">
            {projectSites.map((site) => (
              <li key={site.url}>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${smallButtonClassName} ${secondaryButtonClassName}`}
                >
                  {site.name}
                  <ExternalLinkIcon className="h-2.5 w-2.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
