import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core/utils';
import parse, { type DOMNode, Element } from 'html-react-parser';

import {
  getPolicyFileUrl,
  POLICY_DOCUMENT_LABELS,
  POLICY_LANGUAGE_NAMES,
  POLICY_SOURCE,
  type PolicyContent,
  type PolicyDocumentLabels,
  type PolicyLanguage,
  type PolicySlug,
} from '../policies';

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
  /** Texts of the page; the defaults are those of the language of `content` ({@link POLICY_DOCUMENT_LABELS}). */
  labels?: PolicyDocumentLabels;
  /**
   * Link of each choice of the language switch (default: `?lang=<language>`, the page itself in that language). The
   * switch shows when `content.languages` has more than one language.
   */
  languageHref?: (language: PolicyLanguage) => string;
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
    /** The language switch. */
    languages?: string;
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
 * button with the official document in the language of the text, a language switch when the policy exists in more
 * than one language, the text with anchored sections and, from the `lg` breakpoint, a sticky list of the sections.
 * The sections keep their anchors in every language, and the page marks its language (`lang`) for screen readers and
 * search engines. The text is selectable and readable on phones, by search engines and by screen readers; the PDF is
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
  languageHref = (language) => `?lang=${language}`,
  className,
  classNames,
}: PolicyDocumentProps) {
  const language = content.language ?? 'en';
  const languages = content.languages ?? ['en'];
  const texts = { ...POLICY_DOCUMENT_LABELS[language], ...labels };
  const tocLabel = texts.toc;

  return (
    <div
      lang={language}
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
              {texts.updated} {content.updated}
            </p>
            <div className="tuwadocs:flex tuwadocs:flex-wrap tuwadocs:items-center tuwadocs:gap-2">
              {languages.length > 1 && (
                <nav
                  aria-label={texts.language}
                  className={cn(
                    'tuwadocs:inline-flex tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:border tuwadocs:border-[var(--tuwa-border-primary)] tuwadocs:p-0.5',
                    classNames?.languages,
                  )}
                >
                  {languages.map((item) => (
                    <a
                      key={item}
                      href={languageHref(item)}
                      hrefLang={item}
                      lang={item}
                      aria-current={item === language ? 'page' : undefined}
                      className={cn(
                        'tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:px-3 tuwadocs:py-1.5 tuwadocs:text-xs tuwadocs:font-bold tuwadocs:no-underline tuwadocs:transition-colors',
                        item === language
                          ? 'tuwadocs:bg-[var(--tuwa-bg-muted)] tuwadocs:text-[var(--tuwa-text-primary)]'
                          : 'tuwadocs:text-[var(--tuwa-text-secondary)] tuwadocs:hover:text-[var(--tuwa-text-primary)]',
                      )}
                    >
                      {POLICY_LANGUAGE_NAMES[item]}
                    </a>
                  ))}
                </nav>
              )}
              <a
                href={getPolicyFileUrl(slug, 'pdf', source, language)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'tuwadocs-policy-title tuwadocs:inline-flex tuwadocs:h-10 tuwadocs:no-underline tuwadocs:items-center tuwadocs:gap-2 tuwadocs:rounded-[var(--tuwa-rounded-corners)] tuwadocs:border tuwadocs:border-[var(--tuwa-border-primary)] tuwadocs:bg-[var(--tuwa-bg-primary)] tuwadocs:px-4 tuwadocs:text-sm tuwadocs:font-bold tuwadocs:text-[var(--tuwa-text-primary)] tuwadocs:transition-colors tuwadocs:hover:bg-[var(--tuwa-bg-muted)]',
                  classNames?.download,
                )}
              >
                <ArrowDownTrayIcon className="tuwadocs:h-4 tuwadocs:w-4" aria-hidden="true" />
                {texts.download}
              </a>
            </div>
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
