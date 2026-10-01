import { readFile } from 'node:fs/promises';
import path from 'node:path';

import packageReadmes from '../generated/package-readmes.json';
import { AXES, axisScore, COMPETITORS, CRITERIA, PRODUCTS, SEGMENTS, verifiedAsOf } from './comparisons';
import { layers } from './ecosystem';
import { getHubPages, type HubPage, readPageSource } from './hubPages';
import { getPackageDetails, type PackageDetails } from './packages';
import { SITE_NAME, SITE_URL, TUWA_AGENTS_URL, TUWA_SUMMARY } from './site';

// llms.txt (https://llmstxt.org) and llms-full.txt of the hub, built once at build time by their route handlers

const OPENAPI_URL = `${SITE_URL}/quasar-openapi.yaml`;

const absolute = (url: string) => (url.startsWith('/') ? `${SITE_URL}${url}` : url);

function installCommand(details: PackageDetails): string {
  const command = `\`pnpm add ${details.install.packages.join(' ')}\``;
  const framework = details.install.frameworkPeers.map((peer) => `${peer.name} ${peer.range}`).join(' and ');
  return framework ? `${command} (and ${framework} in the app)` : command;
}

function pageLine(page: HubPage): string {
  return `- [${page.title}](${SITE_URL}${page.route})${page.description ? `: ${page.description}` : ''}`;
}

// A `## <section>` list of the pages of each section
function sectionLists(pages: HubPage[]): string {
  const sections = new Map<string, HubPage[]>();
  for (const page of pages) sections.set(page.section.title, [...(sections.get(page.section.title) ?? []), page]);
  return [...sections]
    .map(([title, sectionPages]) => `## ${title}\n\n${sectionPages.map(pageLine).join('\n')}`)
    .join('\n\n');
}

const MARK_TEXT = { yes: 'Yes', partial: 'Partial', no: 'No' } as const;

/**
 * `/comparisons` as Markdown, from the same data as the page: the scores of every product on every axis, then each
 * product with its pricing, when to choose it and every fact with its source.
 */
function comparisonsMarkdown(): string {
  const header = `| Axis | ${PRODUCTS.map((product) => product.name).join(' | ')} |`;
  const divider = `| --- | ${PRODUCTS.map(() => '---').join(' | ')} |`;
  const rows = AXES.map(
    (axis) => `| ${axis.label} | ${PRODUCTS.map((product) => axisScore(product, axis.id)).join(' | ')} |`,
  );

  const products = PRODUCTS.map((product) => {
    const segment = SEGMENTS.find((item) => item.id === product.segment);
    const facts = CRITERIA.map((criterion) => {
      const item = product.facts[criterion.id];
      return `- ${criterion.label}: ${MARK_TEXT[item.mark]}. ${item.note} (${item.sourceUrl})`;
    });
    return [
      `### ${product.name}`,
      '',
      `${product.summary} License: ${product.license}. Pricing: ${product.pricing.text} (${product.pricing.sourceUrl})`,
      ...(segment ? ['', `Segment: ${segment.label}. TUWA counterpart: ${segment.counterpart}.`] : []),
      ...(product.chooseWhen ? ['', `Choose ${product.name} when: ${product.chooseWhen}`] : []),
      ...(product.tuwaDifference ? ['', `How TUWA differs: ${product.tuwaDifference}`] : []),
      '',
      ...facts,
    ].join('\n');
  });

  return `# Why TUWA: Comparisons & Ecosystem Radar

TUWA compared with ${COMPETITORS.map((product) => product.name).join(', ')}, verified on ${verifiedAsOf()} against vendor documentation, licenses and pricing pages. TUWA is a set of packages, not a wallet provider: each product faces the TUWA projects that do the same job. Each axis has ${CRITERIA.length / AXES.length} criteria; a score is (met + 0.5 × partial) ÷ ${CRITERIA.length / AXES.length} × 100. Onboarding and Chain Coverage favor hosted platforms by design.

## Scores

${[header, divider, ...rows].join('\n')}

## Products

${products.join('\n\n')}`;
}

/**
 * The text of `/llms.txt`: what TUWA is, where to start, every page of the hub with its description, every package
 * (by stage) with its version, reference and install command, and the documentation sites.
 *
 * @returns Markdown in the llms.txt format.
 */
export async function getLlmsIndex(): Promise<string> {
  const pages = await getHubPages();
  const packages = getPackageDetails();

  const packageSections = layers.map((layer) => {
    const lines = layer.entries.flatMap((entry) =>
      (entry.packages ?? [])
        .map((badge) => packages[badge.name])
        .filter((details): details is PackageDetails => Boolean(details) && !details.deprecated)
        .map(
          (details) =>
            `- [${details.name}](${details.docsUrl ?? `https://www.npmjs.com/package/${details.name}`}): v${details.version}${details.layer ? `, layer ${details.layer}` : ''}. ${details.description} Install: ${installCommand(details)}`,
        ),
    );
    return lines.length > 0 ? `### ${layer.label}\n\n${lines.join('\n')}` : null;
  });

  const sites = layers.flatMap((layer) =>
    layer.entries.map((entry) => `- [${entry.name}](${absolute(entry.docsUrl)}): ${entry.tagline}`),
  );

  return `# TUWA

> ${TUWA_SUMMARY}

This is the index of the ${SITE_NAME} (${SITE_URL}): guides that combine several TUWA projects, the Quasar documentation and every TUWA package. Each project also has a reference site generated from its source.

- Start a new app from the TUWA SDK (\`@tuwaio/sdk\` with \`@tuwaio/evm-sdk\` or \`@tuwaio/solana-sdk\`) or from a template: \`npx @tuwaio/create-cosmos-playground\`.
- Coding agents: read TUWA_AGENTS.md first. Its stack, install commands and code are checked against the current packages.
- The full text of every page below and the README of every package are in ${SITE_URL}/llms-full.txt.

## Start here

- [TUWA_AGENTS.md](${TUWA_AGENTS_URL}): Stack, install commands, setup code and rules for AI coding agents that build apps with TUWA
- [Stack Configurator](${SITE_URL}/configurator): Install command and setup files for Next.js, Vite or Vanilla TS, EVM and/or Solana, Nova UI or headless, SIWX and Quasar; each stack is type-checked against the published packages
- [Full text of the hub](${SITE_URL}/llms-full.txt): Every page of the hub and the README of every package, in one file
${pages
  .filter((page) => page.route === '/guides/starter-templates' || page.route === '/guides/full-stack-react')
  .map(pageLine)
  .join('\n')}

${sectionLists(pages)}

## Comparisons

- [Why TUWA: Comparisons & Ecosystem Radar](${SITE_URL}/comparisons): TUWA against ${COMPETITORS.map((product) => product.name).join(', ')} on self-custody, openness, cost at scale, transaction lifecycle, onboarding and chain coverage, with a source for every fact

## Packages

Install commands include the required peer dependencies.

${packageSections.filter(Boolean).join('\n\n')}

## Documentation sites

${sites.join('\n')}

## Optional

- [Quasar API (OpenAPI)](${OPENAPI_URL}): The endpoints that \`@tuwaio/quasar-sdk\` calls, as an OpenAPI 3 document
- [Nova UI Kit Storybook](https://stories.tuwa.io/): Live examples of the Nova components
- [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground): Source of the starter templates
- [Quasar Community Edition](https://github.com/TuwaIO/quasar-community): The self-hosted Quasar
- [TUWA website](https://tuwa.io): Product overview and Quasar Cloud
- [GitHub](https://github.com/TuwaIO): Source code of every package
`;
}

/**
 * Turns the MDX source of a hub page into plain Markdown: no front matter and imports, the tabs of `<Tabs>` labeled
 * (`**EVM:**`) and their text unindented (indented text would be a code block in Markdown), the API reference
 * component replaced by the OpenAPI document, and links to the hub made absolute. Code blocks are kept as they are.
 */
function mdxToMarkdown(source: string, openapi: string): string {
  const output: string[] = [];
  let fence: string | null = null;
  let tabs: string[] | null = null;
  let tab = 0;

  for (const line of source.replace(/^---\n[\s\S]*?\n---\n/, '').split('\n')) {
    const trimmed = line.trim();
    const fenceMatch = /^(`{3,}|~{3,})/.exec(trimmed);
    if (fence) {
      output.push(line);
      if (fenceMatch && fenceMatch[1].startsWith(fence) && trimmed === fenceMatch[1]) fence = null;
      continue;
    }
    if (fenceMatch) {
      fence = fenceMatch[1];
      output.push(line);
      continue;
    }

    const tabsMatch = /^<Tabs items=\{\[(.*?)\]\}/.exec(trimmed);
    if (/^import .+ from '.+';?$/.test(trimmed)) continue;
    if (tabsMatch) {
      tabs = [...tabsMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
      tab = 0;
    } else if (trimmed === '<Tabs.Tab>') {
      output.push('', `**${tabs?.[tab++] ?? 'Option'}:**`, '');
    } else if (trimmed === '</Tabs>') {
      tabs = null;
    } else if (trimmed === '</Tabs.Tab>') {
      continue;
    } else if (trimmed === '<QuasarApiReference />') {
      output.push(`OpenAPI document (${OPENAPI_URL}):`, '', '```yaml', openapi.trim(), '```');
    } else {
      output.push((tabs ? trimmed : line).replace(/\]\(\//g, `](${SITE_URL}/`));
    }
  }

  return output
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function readmeToMarkdown(readme: string): string {
  // Badges are images of links: of no use as text
  return readme
    .split('\n')
    .filter((line) => !/^\s*\[!\[/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * The text of `/llms-full.txt`: every page of the hub as Markdown, then the README of every package at its latest npm
 * version (saved by `scripts/build-data.mjs`).
 *
 * @returns Markdown, one document after another, each with its source URL.
 */
export async function getLlmsFull(): Promise<string> {
  const pages = await getHubPages();
  const packages = getPackageDetails();
  const readmes = (packageReadmes as { readmes: Record<string, string> }).readmes;
  const openapi = await readFile(path.join(process.cwd(), 'public', 'quasar-openapi.yaml'), 'utf8');

  const pageDocuments = await Promise.all(
    pages.map(
      async (page) => `Source: ${SITE_URL}${page.route}\n\n${mdxToMarkdown(await readPageSource(page.route), openapi)}`,
    ),
  );

  const packageDocuments = layers.flatMap((layer) =>
    layer.entries.flatMap((entry) =>
      (entry.packages ?? [])
        .map((badge) => packages[badge.name])
        .filter((details): details is PackageDetails => Boolean(details) && !details.deprecated)
        .filter((details) => readmes[details.name])
        .map(
          (details) =>
            `Source: README of ${details.name} ${details.version} (https://www.npmjs.com/package/${details.name})${details.docsUrl ? `, reference: ${details.docsUrl}` : ''}\n\n${readmeToMarkdown(readmes[details.name])}`,
        ),
    ),
  );

  return `# ${SITE_NAME}: full text

> ${TUWA_SUMMARY}

This file holds every page of ${SITE_URL} (guides, the Quasar documentation and the comparisons), then the README of every TUWA package at its latest npm version. The index is ${SITE_URL}/llms.txt. Coding agents that build apps with TUWA should also read ${TUWA_AGENTS_URL}.

${[...pageDocuments, `Source: ${SITE_URL}/comparisons\n\n${comparisonsMarkdown()}`, ...packageDocuments].map((document) => `---\n\n${document}`).join('\n\n')}
`;
}
