import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { extname, join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

// With its extension: the `tuwa-docs-i18n-check` command loads the built file in Node, which needs it
import { DEFAULT_LOCALE, TUWA_LOCALES } from './locale.js';

/** A heading of a Markdown or MDX page (levels 1 to 6), outside code blocks. */
export interface MarkdownHeading {
  /** The level: 1 for `#`, 2 for `##`. */
  depth: number;
  /** The text without Markdown syntax and without the custom id. */
  text: string;
  /** The id written as `[#id]` at the end of the heading, as Nextra reads it. */
  customId?: string;
}

/** Turns a heading text into an id the way Nextra does (`github-slugger`, one instance per page). */
export type HeadingSlugger = () => (text: string) => string;

/** A problem of a translated page. */
export interface TranslationIssue {
  /** The translated file, relative to the docs app. */
  file: string;
  /** What does not match the English page. */
  message: string;
}

const FENCE_RE = /^ {0,3}(`{3,}|~{3,})/;

/** The source split into the fenced code blocks (in order) and the text outside them. */
function splitFences(source: string): { blocks: string[]; prose: string } {
  const blocks: string[] = [];
  const prose: string[] = [];
  let block: string[] | null = null;
  let fence = '';
  for (const line of source.split('\n')) {
    if (block) {
      block.push(line);
      if (line.trim().startsWith(fence) && line.trim().replace(/[`~]/g, '') === '') {
        blocks.push(block.join('\n'));
        block = null;
      }
      continue;
    }
    const open = FENCE_RE.exec(line);
    if (open) {
      fence = open[1];
      block = [line];
    } else {
      prose.push(line);
    }
  }
  if (block) blocks.push(block.join('\n'));
  return { blocks, prose: prose.join('\n') };
}

/**
 * The fenced code blocks of a Markdown or MDX page, in order, each with its opening line (language and meta) and its
 * closing fence.
 *
 * @param source - The page source.
 * @returns The code blocks.
 */
export function extractCodeBlocks(source: string): string[] {
  return splitFences(source).blocks;
}

/** Heading text without inline Markdown: link targets, emphasis and code marks. */
function plainText(markdown: string): string {
  return markdown
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(\*|_)(.+?)\1/g, '$2')
    .replace(/`([^`]*)`/g, '$1')
    .trim();
}

/**
 * The headings of a Markdown or MDX page, outside code blocks.
 *
 * @param source - The page source.
 * @returns The headings, in order.
 */
export function extractHeadings(source: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  for (const line of splitFences(source).prose.split('\n')) {
    const match = /^ {0,3}(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const custom = /\s*\[#([^\]]+)\]\s*$/.exec(match[2]);
    const text = plainText(custom ? match[2].slice(0, custom.index) : match[2]);
    headings.push({ depth: match[1].length, text, ...(custom && { customId: custom[1] }) });
  }
  return headings;
}

/**
 * The link and image targets of a Markdown or MDX page outside code blocks: `[text](url)`, `href="url"` and
 * `src="url"`.
 *
 * @param source - The page source.
 * @returns The targets, in order.
 */
export function extractLinks(source: string): string[] {
  const prose = splitFences(source).prose.replace(/`[^`\n]*`/g, '');
  const targets: string[] = [];
  for (const match of prose.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|\b(?:href|src)=["']([^"']+)["']/g)) {
    targets.push(match[1] ?? match[2]);
  }
  return targets;
}

/** The ids Nextra gives the headings of levels 2 to 6 (level 1 is the page title and has none). */
function headingIds(headings: MarkdownHeading[], createSlugger: HeadingSlugger): string[] {
  const slug = createSlugger();
  return headings.filter((heading) => heading.depth > 1).map((heading) => slug(heading.customId ?? heading.text));
}

const sorted = (values: string[]) => [...values].sort();

/**
 * Compares a translated page with its English page. A translation keeps the structure of the English page so readers
 * of every language get the same page: the same code blocks in the same order (examples are never translated), the
 * same heading levels with the English heading ids (written as `[#id]`, so anchors work in every language) and the
 * same links.
 *
 * @param english - The source of the English page.
 * @param translated - The source of the translation.
 * @param createSlugger - Creates the heading id function of a page (`() => { const s = new GithubSlugger(); return (text) => s.slug(text); }`);
 *   without it the ids are not compared.
 * @returns What does not match, empty when the translation keeps the structure.
 */
export function checkTranslation(english: string, translated: string, createSlugger?: HeadingSlugger): string[] {
  const issues: string[] = [];

  const englishBlocks = extractCodeBlocks(english);
  const translatedBlocks = extractCodeBlocks(translated);
  if (englishBlocks.length !== translatedBlocks.length) {
    issues.push(`has ${translatedBlocks.length} code blocks, the English page ${englishBlocks.length}`);
  } else {
    englishBlocks.forEach((block, index) => {
      if (block !== translatedBlocks[index]) issues.push(`code block ${index + 1} differs from the English one`);
    });
  }

  const englishHeadings = extractHeadings(english);
  const translatedHeadings = extractHeadings(translated);
  const levels = (headings: MarkdownHeading[]) => headings.map((heading) => '#'.repeat(heading.depth)).join(' ');
  if (levels(englishHeadings) !== levels(translatedHeadings)) {
    issues.push(`heading levels "${levels(translatedHeadings)}" differ from the English "${levels(englishHeadings)}"`);
  } else if (createSlugger) {
    const englishIds = headingIds(englishHeadings, createSlugger);
    const translatedIds = headingIds(translatedHeadings, createSlugger);
    englishIds.forEach((id, index) => {
      if (id !== translatedIds[index]) {
        issues.push(
          `heading "${translatedHeadings.filter((h) => h.depth > 1)[index].text}" has the id "${translatedIds[index]}", the English one "${id}" (add [#${id}])`,
        );
      }
    });
  }

  const englishLinks = sorted(extractLinks(english));
  const translatedLinks = sorted(extractLinks(translated));
  const missing = englishLinks.filter((link) => !translatedLinks.includes(link));
  const extra = translatedLinks.filter((link) => !englishLinks.includes(link));
  if (missing.length || extra.length || englishLinks.length !== translatedLinks.length) {
    issues.push(
      `links differ from the English page (missing: ${missing.join(', ') || 'none'}; not in English: ${extra.join(', ') || 'none'}; ${translatedLinks.length} vs ${englishLinks.length})`,
    );
  }

  return issues;
}

/** Markdown and MDX files under a directory, relative to it, with `/` separators. */
function pageFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => ['.md', '.mdx'].includes(extname(file)))
    .map((file) => file.split(sep).join('/'))
    .sort();
}

/** The route path of a page file: `packages/index.mdx` → `packages/index`. */
const withoutExtension = (file: string) => file.slice(0, -extname(file).length);

/**
 * Loads the heading slugger of Nextra (`github-slugger`, a dependency of `nextra`) from the site, so the check gives
 * headings the ids the site gives them.
 *
 * @param cwd - The docs app, whose `node_modules` has `nextra`.
 * @returns The slugger factory, or `undefined` when `nextra` or `github-slugger` cannot be found.
 */
export async function loadNextraSlugger(cwd: string): Promise<HeadingSlugger | undefined> {
  try {
    const nextra = createRequire(join(cwd, 'package.json')).resolve('nextra/package.json');
    const sluggerPath = createRequire(nextra).resolve('github-slugger');
    const { default: GithubSlugger } = (await import(pathToFileURL(sluggerPath).href)) as {
      default: new () => { slug: (value: string) => string };
    };
    return () => {
      const slugger = new GithubSlugger();
      return (text) => slugger.slug(text);
    };
  } catch {
    return undefined;
  }
}

/** Options of {@link checkSiteTranslations}. */
export interface CheckSiteTranslationsOptions {
  /** The docs app (default: the working directory). */
  cwd?: string;
  /** The English pages, relative to `cwd` (default: `src/content`). */
  contentDir?: string;
  /** The translations, one folder per language, relative to `cwd` (default: `src/i18n`). */
  i18nDir?: string;
  /** The heading slugger (default: {@link loadNextraSlugger}). */
  createSlugger?: HeadingSlugger;
}

/**
 * Checks the translated pages of a documentation site: `<i18nDir>/<locale>/<path>.mdx` translates
 * `<contentDir>/<path>.mdx` (or the generated `.md`). Every translated page must exist in every language and keep the
 * structure of its English page ({@link checkTranslation}). Reads files only.
 *
 * @param options - See {@link CheckSiteTranslationsOptions}.
 * @returns The number of translated files and the issues found.
 * @throws When `contentDir` does not exist (the check runs from the wrong directory).
 */
export async function checkSiteTranslations(
  options: CheckSiteTranslationsOptions = {},
): Promise<{ files: number; issues: TranslationIssue[] }> {
  const { cwd = process.cwd(), contentDir = 'src/content', i18nDir = 'src/i18n' } = options;
  if (!existsSync(join(cwd, contentDir))) {
    throw new Error(`No ${contentDir} in ${cwd}: run the check from the docs app of the site`);
  }
  const createSlugger = options.createSlugger ?? (await loadNextraSlugger(cwd));
  const locales = TUWA_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);
  const filesByLocale = new Map(locales.map((locale) => [locale, pageFiles(join(cwd, i18nDir, locale))]));
  const pages = [...new Set([...filesByLocale.values()].flat().map(withoutExtension))].sort();
  const issues: TranslationIssue[] = [];
  let files = 0;

  for (const page of pages) {
    const englishFile = ['.mdx', '.md'].map((ext) => join(cwd, contentDir, page + ext)).find(existsSync);
    for (const locale of locales) {
      const translatedFile = filesByLocale.get(locale)?.find((file) => withoutExtension(file) === page);
      const shown = join(i18nDir, locale, translatedFile ?? `${page}.mdx`)
        .split(sep)
        .join('/');
      if (!translatedFile) {
        issues.push({ file: shown, message: 'is missing: every translated page exists in every language' });
        continue;
      }
      files += 1;
      if (!englishFile) {
        issues.push({ file: shown, message: `has no English page ${join(contentDir, page)}.mdx` });
        continue;
      }
      const english = readFileSync(englishFile, 'utf8');
      const translated = readFileSync(join(cwd, i18nDir, locale, translatedFile), 'utf8');
      for (const message of checkTranslation(english, translated, createSlugger)) issues.push({ file: shown, message });
    }
  }

  return { files, issues };
}
