import { cn } from '@tuwaio/nova-core/utils';
import { ArrowDownTrayIcon } from '@tuwaio/nova-icons/24/outline';
import parse, { type DOMNode, Element } from 'html-react-parser';

import {
  formatPolicyDate,
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

// The small texts of the page (the date, the languages, the button, the title of the list): mono caps of 11px
const capsClassName =
  'tuwadocs:font-mono tuwadocs:text-[11px] tuwadocs:font-bold tuwadocs:uppercase tuwadocs:leading-[1.35] tuwadocs:tracking-[0.12em]';

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
 * A TUWA policy page (Terms, Privacy, Cookie, Refund, Security), in paper and ink: the date of the version in mono caps
 * after a lit square, the title in large mono, a language switch when the policy exists in more than one language (a
 * frame of 1px, the language of the text a block of ink) and a Download PDF button with the official document in the
 * language of the text (a square button with a pixel icon); under a line of 1px the text with anchored sections and,
 * from the `lg` breakpoint, a sticky list of the sections.
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
            'tuwadocs:mb-10 tuwadocs:flex tuwadocs:flex-col tuwadocs:border-b tuwadocs:border-[var(--tuwa-border-primary)] tuwadocs:pb-8',
            classNames?.header,
          )}
        >
          <p
            className={cn(
              'tuwadocs:m-0 tuwadocs:flex tuwadocs:items-center tuwadocs:gap-3 tuwadocs:text-[var(--tuwa-text-secondary)]',
              capsClassName,
              classNames?.updated,
            )}
          >
            <span
              aria-hidden="true"
              className="tuwadocs:h-1.5 tuwadocs:w-1.5 tuwadocs:shrink-0 tuwadocs:bg-[var(--tuwa-docs-lit)]"
            />
            {texts.updated} {formatPolicyDate(content.updated, language)}
          </p>
          <h1
            className={cn(
              'tuwadocs-policy-title tuwadocs:m-0 tuwadocs:mt-5 tuwadocs:text-[clamp(2rem,5vw,3.5rem)] tuwadocs:leading-[1.02] tuwadocs:font-medium tuwadocs:text-[var(--tuwa-text-primary)]',
              // Cyrillic letters in mono need their own width
              language === 'uk' ? 'tuwadocs:tracking-normal' : 'tuwadocs:tracking-[-0.03em]',
              classNames?.title,
            )}
          >
            {content.title}
          </h1>
          <div className="tuwadocs:mt-7 tuwadocs:flex tuwadocs:flex-wrap tuwadocs:items-center tuwadocs:gap-2.5">
            {languages.length > 1 && (
              <nav
                aria-label={texts.language}
                className={cn(
                  'tuwadocs:inline-flex tuwadocs:border tuwadocs:border-[var(--tuwa-border-strong)]',
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
                      'tuwadocs:inline-flex tuwadocs:h-8 tuwadocs:items-center tuwadocs:px-3 tuwadocs:no-underline tuwadocs:transition-colors',
                      capsClassName,
                      item === language
                        ? 'tuwadocs:bg-[var(--tuwa-text-primary)] tuwadocs:text-[var(--tuwa-docs-paper)]'
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
                'tuwadocs:inline-flex tuwadocs:h-[34px] tuwadocs:items-center tuwadocs:gap-2 tuwadocs:border tuwadocs:border-[var(--tuwa-border-strong)] tuwadocs:px-3 tuwadocs:whitespace-nowrap tuwadocs:text-[var(--tuwa-text-primary)] tuwadocs:no-underline tuwadocs:transition-colors tuwadocs:hover:bg-[color-mix(in_srgb,var(--tuwa-text-primary)_3.5%,transparent)]',
                capsClassName,
                classNames?.download,
              )}
            >
              <ArrowDownTrayIcon className="tuwadocs:h-4 tuwadocs:w-4 tuwadocs:shrink-0" aria-hidden="true" />
              {texts.download}
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
          <p className={cn('tuwadocs:m-0 tuwadocs:mb-4 tuwadocs:text-[var(--tuwa-text-secondary)]', capsClassName)}>
            {tocLabel}
          </p>
          <ol className="tuwadocs:m-0 tuwadocs:flex tuwadocs:list-none tuwadocs:flex-col tuwadocs:gap-2.5 tuwadocs:border-l tuwadocs:border-[var(--tuwa-border-primary)] tuwadocs:py-0 tuwadocs:pr-0 tuwadocs:pl-4">
            {content.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="tuwadocs:text-[13px] tuwadocs:leading-[1.4] tuwadocs:text-[var(--tuwa-text-secondary)] tuwadocs:no-underline tuwadocs:transition-colors tuwadocs:hover:text-[var(--tuwa-text-primary)]"
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
