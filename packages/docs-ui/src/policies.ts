/** Slug of a TUWA policy: the path of its page on the TUWA sites and the name of its files in `TuwaIO/workflows/docs`. */
export type PolicySlug = 'terms' | 'privacy' | 'cookie' | 'refund' | 'security' | 'dpa';

/** A TUWA policy, as listed in {@link policies}. */
export interface Policy {
  /** Slug of the policy. */
  slug: PolicySlug;
  /** Title shown in footers and on the page. */
  title: string;
  /** One sentence on what the policy covers, for policy lists. */
  description: string;
  /** Path of the policy page on the website and the Quasar dashboard. */
  href: `/${PolicySlug}`;
  /** Whether the policy is in force. Drafts stay `false` until they are approved. */
  published: boolean;
  /** Whether footers link the policy (default: `true`); documents linked from other policies set `false`. */
  footer?: boolean;
}

/**
 * A language of the TUWA policies: English, the original, and the translations generated next to it in
 * `TuwaIO/workflows/docs/<language>/`.
 */
export type PolicyLanguage = 'en' | 'uk';

/** The languages of the policies, the original first. */
export const POLICY_LANGUAGES: readonly PolicyLanguage[] = ['en', 'uk'];

/** The name of each language in that language, for language switches. */
export const POLICY_LANGUAGE_NAMES: Readonly<Record<PolicyLanguage, string>> = {
  en: 'English',
  uk: 'Українська',
};

/**
 * Reads the language of a policy page from a value such as the `lang` search parameter.
 *
 * @param value - The value: a string, an array of strings (the first counts) or nothing.
 * @returns The language it names, or `en` when it names none of {@link POLICY_LANGUAGES}.
 */
export function policyLanguageFrom(value: unknown): PolicyLanguage {
  const first = Array.isArray(value) ? value[0] : value;
  return POLICY_LANGUAGES.find((language) => language === first) ?? 'en';
}

/** Texts of a policy page. */
export interface PolicyDocumentLabels {
  /** Text before the date of the version (default in English: `Last updated`). */
  updated?: string;
  /** Text of the button that opens the PDF (default in English: `Download PDF`). */
  download?: string;
  /** Heading and accessible name of the list of sections (default in English: `On this page`). */
  toc?: string;
  /** Accessible name of the language switch (default in English: `Language`). */
  language?: string;
}

/** The texts of `PolicyDocument` in each language of the policies; its `labels` override them. */
export const POLICY_DOCUMENT_LABELS: Readonly<Record<PolicyLanguage, Required<PolicyDocumentLabels>>> = {
  en: { updated: 'Last updated', download: 'Download PDF', toc: 'On this page', language: 'Language' },
  uk: { updated: 'Останнє оновлення', download: 'Завантажити PDF', toc: 'На цій сторінці', language: 'Мова' },
};

/** A section of a policy: a level-2 heading with its anchor. */
export interface PolicySection {
  /** Anchor of the heading, without `#` (stable when sections are renumbered). */
  id: string;
  /** Text of the heading without its number. */
  title: string;
}

/** Content of a policy page, generated next to its PDF by `generate_pdf.js` in `TuwaIO/workflows/docs`. */
export interface PolicyContent {
  /** Title of the document. */
  title: string;
  /** Date of the current version as written in the document (`October 8, 2026`). */
  updated: string;
  /** Level-2 sections in document order; a translation keeps the anchors of the English sections. */
  sections: PolicySection[];
  /** Body of the document as HTML, without the title and the date line; headings carry their anchors as `id`. */
  html: string;
  /** Language of this text. */
  language: PolicyLanguage;
  /** Languages the policy exists in, the original first: the choices of the language switch. */
  languages: PolicyLanguage[];
}

/** Where the policy files live: the `docs` folder of `TuwaIO/workflows` on GitHub, branch `main`. */
export const POLICY_SOURCE = 'https://raw.githubusercontent.com/TuwaIO/workflows/main/docs';

/** The site that hosts the policy pages; sites without their own policy pages (documentation sites) link there. */
export const POLICY_SITE_URL = 'https://tuwa.io';

/** The page that lists every TUWA policy in force: `/policies` of the docs hub. */
export const POLICIES_INDEX_URL = 'https://docs.tuwa.io/policies';

/**
 * Every TUWA policy in the order footers list them. Footers of the website and the Quasar dashboard read
 * {@link publishedPolicies}, so a policy appears everywhere once it is published.
 */
export const policies: readonly Policy[] = [
  {
    slug: 'terms',
    title: 'Terms of Service',
    description:
      'The rules for using the TUWA websites and documentation, Quasar Cloud, Quasar Community Edition and the open-source packages.',
    href: '/terms',
    published: true,
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'What data TUWA collects and why, how it is protected, and how to access or delete it.',
    href: '/privacy',
    published: true,
  },
  {
    slug: 'cookie',
    title: 'Cookie Policy',
    description: 'The cookies and Local Storage that the TUWA sites and the Quasar dashboard use.',
    href: '/cookie',
    published: true,
  },
  {
    slug: 'refund',
    title: 'Refund Policy',
    description: 'When and how payments for Quasar Cloud quota are refunded.',
    href: '/refund',
    // Quota purchases are paused; the policy is published again when they reopen
    published: false,
  },
  {
    slug: 'security',
    title: 'Security Policy',
    description: 'How to report a vulnerability, what TUWA promises in return, and who is responsible for what.',
    href: '/security',
    published: true,
  },
  {
    slug: 'dpa',
    title: 'Data Processing Addendum',
    description: 'How we process the personal data of your app users on your behalf when you use Quasar Cloud.',
    href: '/dpa',
    published: true,
  },
];

/** The policies in force, for policy lists: {@link policies} with `published: true`. */
export const publishedPolicies: readonly Policy[] = policies.filter((policy) => policy.published);

/** The policies that footers link: {@link publishedPolicies} without those marked `footer: false`. */
export const footerPolicies: readonly Policy[] = publishedPolicies.filter((policy) => policy.footer !== false);

/**
 * Returns the absolute URL of a policy page, for sites that do not host the policies themselves.
 *
 * @param slug - Slug of the policy.
 * @param site - Origin of the site with the policy pages (default: {@link POLICY_SITE_URL}).
 * @param language - Language of the page (default: `en`); a translation adds `?lang=<language>`.
 * @returns The URL of the page, for example `https://tuwa.io/terms` or `https://tuwa.io/terms?lang=uk`.
 */
export function getPolicyPageUrl(
  slug: PolicySlug,
  site: string = POLICY_SITE_URL,
  language: PolicyLanguage = 'en',
): string {
  return `${site.replace(/\/+$/, '')}/${slug}${language === 'en' ? '' : `?lang=${language}`}`;
}

/**
 * Returns the URL of a policy file.
 *
 * @param slug - Slug of the policy.
 * @param format - `json` for the page content, `pdf` for the official document, `md` for the source text.
 * @param source - Base URL of the policy files (default: {@link POLICY_SOURCE}).
 * @param language - Language of the file (default: `en`); a translation lives in the folder of its language.
 * @returns The URL of the file, for example `…/docs/terms.pdf` or `…/docs/uk/terms.pdf`.
 */
export function getPolicyFileUrl(
  slug: PolicySlug,
  format: 'json' | 'pdf' | 'md',
  source: string = POLICY_SOURCE,
  language: PolicyLanguage = 'en',
): string {
  return `${source.replace(/\/+$/, '')}${language === 'en' ? '' : `/${language}`}/${slug}.${format}`;
}

function isPolicyContent(value: unknown): value is PolicyContent {
  if (!value || typeof value !== 'object') return false;
  const content = value as Record<string, unknown>;
  return (
    typeof content.title === 'string' &&
    typeof content.updated === 'string' &&
    typeof content.html === 'string' &&
    Array.isArray(content.sections) &&
    content.sections.every(
      (section: unknown) =>
        !!section &&
        typeof (section as PolicySection).id === 'string' &&
        typeof (section as PolicySection).title === 'string',
    )
  );
}

/**
 * Loads the content of a policy page (its `json` file) in a language. Call it on the server, for example in a Server
 * Component of the Next.js App Router, and pass the result to `PolicyDocument`. A policy not translated into the
 * language loads in English, so a page asked for in that language still shows the policy.
 *
 * Network: one request to `getPolicyFileUrl(slug, 'json', source, language)` per revalidation, and one more for the
 * English file when the translation does not exist; cached by the Next.js `fetch` cache for `revalidate` seconds
 * (outside Next.js, plain requests).
 *
 * @param slug - Slug of the policy.
 * @param options - Optional settings.
 * @param options.source - Base URL of the policy files (default: {@link POLICY_SOURCE}).
 * @param options.revalidate - Seconds the Next.js `fetch` cache keeps the content, or `false` to cache it until the
 *   next deployment (default: 3600).
 * @param options.language - Language of the text (default: `en`).
 * @returns The content of the policy, with its language and the languages it exists in.
 * @throws Error when the request fails, the response is not `2xx` (other than a missing translation), or the file is
 *   not a policy page.
 */
export async function loadPolicy(
  slug: PolicySlug,
  options: { source?: string; revalidate?: number | false; language?: PolicyLanguage } = {},
): Promise<PolicyContent> {
  const language = options.language ?? 'en';
  const url = getPolicyFileUrl(slug, 'json', options.source, language);
  const response = await fetch(url, { next: { revalidate: options.revalidate ?? 3600 } });

  if (response.status === 404 && language !== 'en') {
    return loadPolicy(slug, { ...options, language: 'en' });
  }
  if (!response.ok) {
    throw new Error(`loadPolicy: ${url} answered ${response.status}`);
  }

  const content: unknown = await response.json();
  if (!isPolicyContent(content)) {
    throw new Error(`loadPolicy: ${url} is not a policy page`);
  }

  // Files generated before translations name no languages: they are English only
  const raw = content as PolicyContent & { language?: unknown; languages?: unknown };
  const languages = Array.isArray(raw.languages)
    ? POLICY_LANGUAGES.filter((item) => (raw.languages as unknown[]).includes(item))
    : [];
  return {
    title: content.title,
    updated: content.updated,
    sections: content.sections.map(({ id, title }) => ({ id, title })),
    html: content.html,
    language: policyLanguageFrom(raw.language ?? language),
    languages: languages.length > 0 ? languages : ['en'],
  };
}
