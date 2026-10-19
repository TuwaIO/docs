import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core/utils';
import parse, { type DOMNode, Element } from 'html-react-parser';

import { getPolicyFileUrl, POLICY_SOURCE, type PolicyContent, type PolicySlug } from '../policies';

// Elements a policy never needs; they are dropped from the body instead of rendered
const BLOCKED_ELEMENTS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'link',
  'meta',
  'base',
]);

/**
 * Props of {@link PolicyDocument}.
 */
export interface PolicyDocumentProps {
  /** Slug of the policy; sets the link of the Download PDF button. */
  slug: PolicySlug;
  /** Content of the policy, from `loadPolicy`. */
  content: PolicyContent;
  /** Base URL of the policy files for the PDF link (default: `POLICY_SOURCE`). */
  source?: string;
  /** Texts of the page. */
  labels?: {
    /** Text before the date of the version (default: `Last updated`). */
    updated?: string;
    /** Text of the button that opens the PDF (default: `Download PDF`). */
    download?: string;
    /** Heading and accessible name of the list of sections (default: `On this page`). */
    toc?: string;
  };
  /** Classes of the root element. */
  className?: string;
  /** Classes of the parts of the page. */
  classNames?: {
    /** The header with the title, the date and the button. */
    header?: string;
    /** The title. */
    title?: string;
    /** The date of the version. */
    updated?: string;
    /** The Download PDF button. */
    download?: string;
    /** The `article` with the body. */
    body?: string;
    /** The list of sections (shown from the `lg` breakpoint). */
    toc?: string;
  };
}

// Drops elements and attributes a policy never needs and opens external links in a new tab
function sanitize(node: DOMNode) {
  if (!(node instanceof Element)) return undefined;
  if (BLOCKED_ELEMENTS.has(node.name)) return <></>;

  for (const name of Object.keys(node.attribs)) {
    if (name.toLowerCase().startsWith('on')) delete node.attribs[name];
  }

  if (node.name === 'a') {
    const href = node.attribs.href ?? '';
    if (/^\s*javascript:/i.test(href)) {
      delete node.attribs.href;
    } else if (/^https?:\/\//i.test(href)) {
      node.attribs.target = '_blank';
      node.attribs.rel = 'noopener noreferrer';
    }
  }

  return undefined;
}

/**
 * A TUWA policy page (Terms, Privacy, Cookie, Refund, Security): the title, the date of the version, a Download PDF
 * button with the official document, the text with anchored sections and, from the `lg` breakpoint, a sticky list of
 * the sections. The text is selectable and readable on phones, by search engines and by screen readers; the PDF is
 * generated from the same source.
 *
 * Load the content on the server with `loadPolicy` and render the page inside the layout of the site. The body is
 * HTML from `TuwaIO/workflows`: scripts, styles, frames, forms and event attributes are dropped, and external links
 * open in a new tab. Headings scroll below a sticky header (`scroll-margin-top`), so `/refund#how-to-request-a-refund`
 * opens at its section.
 *
 * @param props - See {@link PolicyDocumentProps}.
 * @returns The policy page.
 */
export function PolicyDocument({
  slug,
  content,
  source = POLICY_SOURCE,
  labels,
  className,
  classNames,
}: PolicyDocumentProps) {
  const tocLabel = labels?.toc ?? 'On this page';

  return (
    <div
      className={cn(
        'tuwadocs:grid tuwadocs:grid-cols-1 tuwadocs:gap-10 tuwadocs:lg:grid-cols-[minmax(0,1fr)_14rem]',
        className,
      )}
    >
      <div className="tuwadocs:min-w-0">
        <header
          className={cn(
            'tuwadocs:mb-8 tuwadocs:flex tuwadocs:flex-col tuwadocs:gap-4 tuwadocs:border-b tuwadocs:border-[var(--tuwa-border-primary)] tuwadocs:pb-6',
            classNames?.header,
          )}
        >
          <h1
            className={cn(
              'tuwadocs-policy-title tuwadocs:text-3xl tuwadocs:font-extrabold tuwadocs:tracking-tight tuwadocs:text-[var(--tuwa-text-primary)] tuwadocs:sm:text-4xl',
              classNames?.title,
            )}
          >
            {content.title}
          </h1>
          <div className="tuwadocs:flex tuwadocs:flex-wrap tuwadocs:items-center tuwadocs:justify-between tuwadocs:gap-3">
            <p className={cn('tuwadocs:text-sm tuwadocs:text-[var(--tuwa-text-secondary)]', classNames?.updated)}>
              {labels?.updated ?? 'Last updated'} {content.updated}
            </p>
            <a
              href={getPolicyFileUrl(slug, 'pdf', source)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'tuwadocs-policy-title tuwadocs:inline-flex tuwadocs:h-10 tuwadocs:no-underline tuwadocs:items-center tuwadocs:gap-2 tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:border tuwadocs:border-[var(--tuwa-border-primary)] tuwadocs:bg-[var(--tuwa-bg-primary)] tuwadocs:px-4 tuwadocs:text-sm tuwadocs:font-bold tuwadocs:text-[var(--tuwa-text-primary)] tuwadocs:transition-colors tuwadocs:hover:bg-[var(--tuwa-bg-muted)]',
                classNames?.download,
              )}
            >
              <ArrowDownTrayIcon className="tuwadocs:h-4 tuwadocs:w-4" aria-hidden="true" />
              {labels?.download ?? 'Download PDF'}
            </a>
          </div>
        </header>
        <article className={cn('tuwadocs-policy', classNames?.body)}>
          {parse(content.html, { replace: sanitize })}
        </article>
      </div>
      {content.sections.length > 0 && (
        <nav
          aria-label={tocLabel}
          className={cn(
            'tuwadocs:hidden tuwadocs:lg:sticky tuwadocs:lg:top-24 tuwadocs:lg:block tuwadocs:lg:self-start',
            classNames?.toc,
          )}
        >
          <p className="tuwadocs:mb-3 tuwadocs:text-xs tuwadocs:font-bold tuwadocs:uppercase tuwadocs:tracking-widest tuwadocs:text-[var(--tuwa-text-tertiary)]">
            {tocLabel}
          </p>
          <ol className="tuwadocs:flex tuwadocs:list-none tuwadocs:flex-col tuwadocs:gap-2 tuwadocs:border-l tuwadocs:border-[var(--tuwa-border-primary)] tuwadocs:pl-4">
            {content.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="tuwadocs:text-sm tuwadocs:text-[var(--tuwa-text-secondary)] tuwadocs:no-underline tuwadocs:transition-colors tuwadocs:hover:text-[var(--tuwa-text-primary)]"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}
