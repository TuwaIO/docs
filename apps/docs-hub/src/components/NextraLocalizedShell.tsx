'use client';

import { docsLabels, localizePageMap } from '@tuwaio/docs-ui';
import { NextraDocsLayout } from '@tuwaio/docs-ui/nextra';
import type { $NextraMetadata, Heading, PageMapItem } from 'nextra';
import { Callout } from 'nextra/components';
import { type ReactNode, useMemo } from 'react';

import { type DocsHubLabels, useI18n } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet, MdxCodeBlocksProvider } from './localized/CodeSnippet';
import { Erc4337Localized } from './localized/guides/Erc4337Localized';
import { FullStackReactLocalized } from './localized/guides/FullStackReactLocalized';
import { MultiChainAuthLocalized } from './localized/guides/MultiChainAuthLocalized';
import { QuasarTxSyncLocalized } from './localized/guides/QuasarTxSyncLocalized';
import { ReactTxTrackingLocalized } from './localized/guides/ReactTxTrackingLocalized';
import { SiwxJwtLocalized } from './localized/guides/SiwxJwtLocalized';
import { SiwxSupabaseLocalized } from './localized/guides/SiwxSupabaseLocalized';
import { StarterTemplatesLocalized } from './localized/guides/StarterTemplatesLocalized';
import { WhyWeb3StateBrokenLocalized } from './localized/guides/WhyWeb3StateBrokenLocalized';
import { AppsKeysLocalized } from './localized/quasar/AppsKeysLocalized';
import { MigrateCommunityLocalized } from './localized/quasar/MigrateCommunityLocalized';
import { QuotasLimitsLocalized } from './localized/quasar/QuotasLimitsLocalized';
import { SelfHostingLocalized } from './localized/quasar/SelfHostingLocalized';
import { WebhooksLocalized } from './localized/quasar/WebhooksLocalized';

const GUIDE_HEADING_IDS: Record<string, string> = {
  '/guides/multi-chain-auth-siwx-caip122': 'multi-chain-authentication-with-siwx-caip-122-beyond-evm-silos',
  '/guides/why-web3-transaction-state-is-broken':
    'why-web3-transaction-state-management-is-broken-and-why-usestate-is-an-anti-pattern',
  '/guides/erc-4337-sovereign-account-abstraction':
    'demystifying-erc-4337-sovereign-account-abstraction-without-proprietary-waas',
  '/guides/react-transaction-tracking': 'track-transactions-in-react-with-pulsar',
  '/guides/full-stack-react': 'build-a-full-stack-react-app-with-the-tuwa-sdk',
  '/guides/quasar-transaction-sync': 'sync-transactions-to-quasar',
  '/guides/siwx-jwt-external-auth': 'hand-a-siwx-sign-in-to-external-auth-with-jwt-and-jwks',
  '/guides/siwx-supabase': 'use-a-siwx-sign-in-with-supabase-row-level-security',
  '/guides/starter-templates': 'starter-templates',
};

function GuidesOverviewLocalized({ labels }: { labels: DocsHubLabels['nextra']['guidesOverview'] }) {
  const mdx = useMDXComponents();
  const H1 = mdx.h1 ?? 'h1';
  const H2 = mdx.h2 ?? 'h2';
  const H3 = mdx.h3 ?? 'h3';
  const P = mdx.p ?? 'p';
  const Ul = mdx.ul ?? 'ul';
  const Ol = mdx.ol ?? 'ol';
  const Li = mdx.li ?? 'li';
  const Hr = mdx.hr ?? 'hr';
  const A = mdx.a ?? 'a';
  const Code = mdx.code ?? 'code';

  return (
    <>
      <H1>{labels.title}</H1>
      <P>{labels.p1}</P>
      <P>{labels.p2}</P>
      <Hr />
      <Callout type="info">
        <strong>{labels.calloutTitle}</strong>
        <br />
        {labels.calloutBeforeLink}
        <A href="https://github.com/TuwaIO/workflows/blob/main/TUWA_AGENTS.md">
          <Code>workflows/TUWA_AGENTS.md</Code>
        </A>
        {labels.calloutAfterLink}
      </Callout>
      <Hr />
      <H2 id="deep-dive-guides">{labels.deepDiveHeading}</H2>
      <P>{labels.deepDiveIntro}</P>
      {labels.deepDives.map((guide) => (
        <div key={guide.href}>
          <H3 id={GUIDE_HEADING_IDS[guide.href]}>
            {guide.emoji} <A href={guide.href}>{guide.title}</A>
          </H3>
          <P>{guide.description}</P>
          <Ul>
            {guide.meta1Label && guide.meta1Text && (
              <Li>
                <strong>{guide.meta1Label}</strong> {guide.meta1Text}
              </Li>
            )}
            {guide.meta2Label && guide.meta2Text && (
              <Li>
                <strong>{guide.meta2Label}</strong> {guide.meta2Text}
              </Li>
            )}
          </Ul>
        </div>
      ))}
      <Hr />
      <H2 id="step-by-step-guides">{labels.stepByStepHeading}</H2>
      <P>{labels.stepByStepIntro}</P>
      {labels.stepBySteps.map((guide) => (
        <div key={guide.href}>
          <H3 id={GUIDE_HEADING_IDS[guide.href]}>
            {guide.emoji} <A href={guide.href}>{guide.title}</A>
          </H3>
          <P>{guide.description}</P>
          {guide.meta1Label && guide.meta1Text && (
            <Ul>
              <Li>
                <strong>{guide.meta1Label}</strong> {guide.meta1Text}
              </Li>
            </Ul>
          )}
        </div>
      ))}
      <Hr />
      <H2 id="package-api-references">{labels.apiReferencesHeading}</H2>
      <P>{labels.apiReferencesP1}</P>
      <P>
        {labels.apiReferencesP2Before}
        <strong>
          <A href="/">{labels.apiReferencesMainScreenLink}</A>
        </strong>
        {labels.apiReferencesP2After}
      </P>
      <P>
        {labels.apiReferencesP3Before}
        <strong>
          <A href="/quasar">{labels.apiReferencesQuasarLink}</A>
        </strong>
        {labels.apiReferencesP3After}
      </P>
      <Hr />
      <H2 id="architectural-principles">{labels.principlesHeading}</H2>
      <P>{labels.principlesIntro}</P>
      <Ol>
        {labels.principles.map((item) => (
          <Li key={item.lead}>
            <strong>{item.lead}</strong> {item.body}
          </Li>
        ))}
      </Ol>
    </>
  );
}

function QuasarIndexLocalized({ labels }: { labels: DocsHubLabels['nextra']['quasarIndex'] }) {
  const mdx = useMDXComponents();
  const H1 = mdx.h1 ?? 'h1';
  const H2 = mdx.h2 ?? 'h2';
  const H3 = mdx.h3 ?? 'h3';
  const P = mdx.p ?? 'p';
  const Ul = mdx.ul ?? 'ul';
  const Li = mdx.li ?? 'li';
  const Hr = mdx.hr ?? 'hr';
  const A = mdx.a ?? 'a';
  const Code = mdx.code ?? 'code';
  const Table = mdx.table ?? 'table';
  const Th = mdx.th ?? 'th';
  const Tr = mdx.tr ?? 'tr';
  const Td = mdx.td ?? 'td';

  return (
    <>
      <H1>{labels.title}</H1>
      <P>
        <strong>Quasar</strong> {labels.introPart1}
        <A href="https://sdk.docs.tuwa.io/packages/quasar-sdk">
          <Code>@tuwaio/quasar-sdk</Code>
        </A>
        {labels.introPart2}
      </P>
      <Hr />
      <H2>{labels.howFitsHeading}</H2>
      <P>{labels.howFitsIntro}</P>
      <CodeSnippet index={0} />
      <Ul>
        <Li>
          <strong>{labels.bullets.serverKeyLead}</strong> {labels.bullets.serverKeyPart1}
          <A href="/guides/quasar-transaction-sync">{labels.bullets.serverKeyLinkText}</A>
          {labels.bullets.serverKeyPart2}
        </Li>
        <Li>
          <strong>{labels.bullets.trackingTwiceLead}</strong> {labels.bullets.trackingTwiceBody}
        </Li>
        <Li>
          <strong>{labels.bullets.webhooksLead}</strong> {labels.bullets.webhooksPart1} {labels.bullets.webhooksSee}
          <A href="/quasar/webhooks">{labels.bullets.webhooksLinkText}</A>.
        </Li>
      </Ul>
      <Hr />
      <H2 id="finality-expiry-and-reconciliation">{labels.finalityHeading}</H2>
      <P>{labels.finalityIntro}</P>
      <Table>
        <thead>
          <Tr>
            <Th>{labels.finalityHeaders.chainTracker}</Th>
            <Th>{labels.finalityHeaders.intermediate}</Th>
            <Th>{labels.finalityHeaders.terminalSuccess}</Th>
            <Th>{labels.finalityHeaders.terminalFailed}</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              <strong>Solana</strong> (<Code>TransactionTracker.Solana</Code>)
            </Td>
            <Td>{labels.finalityRows.solana.intermediate}</Td>
            <Td>{labels.finalityRows.solana.success}</Td>
            <Td>{labels.finalityRows.solana.failed}</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>EVM</strong> (<Code>TransactionTracker.Ethereum</Code>)
            </Td>
            <Td>{labels.finalityRows.evm.intermediate}</Td>
            <Td>{labels.finalityRows.evm.success}</Td>
            <Td>{labels.finalityRows.evm.failed}</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>EIP-5792</strong> (<Code>TransactionTracker.EIP5792</Code>)
            </Td>
            <Td>{labels.finalityRows.eip5792.intermediate}</Td>
            <Td>{labels.finalityRows.eip5792.success}</Td>
            <Td>{labels.finalityRows.eip5792.failed}</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>ERC-4337</strong> (<Code>TransactionTracker.ERC4337</Code>)
            </Td>
            <Td>{labels.finalityRows.erc4337.intermediate}</Td>
            <Td>{labels.finalityRows.erc4337.success}</Td>
            <Td>{labels.finalityRows.erc4337.failed}</Td>
          </Tr>
        </tbody>
      </Table>
      <Ul>
        <Li>
          <strong>{labels.finalityNotes.solanaLead}</strong> {labels.finalityNotes.solanaBody}
        </Li>
        <Li>
          <strong>{labels.finalityNotes.nonCustodialLead}</strong> {labels.finalityNotes.nonCustodialBody}
        </Li>
        <Li>
          <strong>{labels.finalityNotes.recoveryLead}</strong> {labels.finalityNotes.recoveryBody}
        </Li>
      </Ul>
      <Hr />
      <H2 id="quasar-cloud-and-quasar-community">{labels.editionsHeading}</H2>
      <P>{labels.editionsIntro}</P>
      <Table>
        <thead>
          <Tr>
            <Th />
            <Th>{labels.editionsHeaders.cloud}</Th>
            <Th>{labels.editionsHeaders.community}</Th>
          </Tr>
        </thead>
        <tbody>
          {labels.editionsRows.map((row) => (
            <Tr key={row.label}>
              <Td>
                <strong>{row.label}</strong>
              </Td>
              <Td>{row.cloud}</Td>
              <Td>{row.community}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <P>
        {labels.editionsNotePart1}
        <A href="/quasar/migrate-to-community">{labels.editionsMigrateLink}</A>
        {labels.editionsNotePart2}
        <A href="/quasar/self-hosting">{labels.editionsSelfHostLink}</A>.
      </P>
      <H3>{labels.whichPathHeading}</H3>
      <Ul>
        <Li>
          <strong>{labels.whichPaths.serverlessLead}</strong> {labels.whichPaths.serverlessBody}
        </Li>
        <Li>
          <strong>{labels.whichPaths.customWorkerLead}</strong> {labels.whichPaths.customWorkerBody}
        </Li>
        <Li>
          <strong>{labels.whichPaths.selfHostedLead}</strong> {labels.whichPaths.selfHostedBody}
        </Li>
      </Ul>
      <Hr />
      <H2>{labels.nextStepsHeading}</H2>
      <Ul>
        <Li>
          {labels.nextSteps.appsKeysPrefix}
          <A href="/quasar/apps-and-keys">{labels.nextSteps.appsKeysLink}</A>.
        </Li>
        <Li>
          {labels.nextSteps.syncPrefix}
          <A href="/guides/quasar-transaction-sync">{labels.nextSteps.syncLink1}</A>
          {labels.nextSteps.syncMiddle}
          <A href="/guides/full-stack-react">{labels.nextSteps.syncLink2}</A>.
        </Li>
        <Li>
          {labels.nextSteps.webhooksPrefix}
          <A href="/quasar/webhooks">{labels.nextSteps.webhooksLink}</A>.
        </Li>
        <Li>
          {labels.nextSteps.apiPrefix}
          <A href="/quasar/api">{labels.nextSteps.apiLink1}</A>
          {labels.nextSteps.apiMiddle}
          <A href="https://sdk.docs.tuwa.io/packages/quasar-sdk">{labels.nextSteps.apiLink2}</A>.
        </Li>
      </Ul>
    </>
  );
}

/**
 * Renders localized Nextra page content for `/guides` and `/quasar` when a non-English locale is active.
 * @param props.routeKey - Key such as `guides/index`, `quasar/index`, or `guides/full-stack-react`.
 * @param props.children - The default English MDX content.
 */
export function NextraLocalizedPage({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const { locale, t } = useI18n();

  // English or explicitly preserved English routes (API Reference)
  if (locale === 'en' || routeKey === 'quasar/api') {
    return <>{children}</>;
  }

  // Quasar section
  if (routeKey === 'quasar/index') {
    return <QuasarIndexLocalized labels={t.nextra.quasarIndex} />;
  }
  if (routeKey === 'quasar/self-hosting') {
    return <SelfHostingLocalized locale={locale} />;
  }
  if (routeKey === 'quasar/quotas-and-limits') {
    return <QuotasLimitsLocalized locale={locale} />;
  }
  if (routeKey === 'quasar/apps-and-keys') {
    return <AppsKeysLocalized locale={locale} />;
  }
  if (routeKey === 'quasar/migrate-to-community') {
    return <MigrateCommunityLocalized locale={locale} />;
  }
  if (routeKey === 'quasar/webhooks') {
    return <WebhooksLocalized locale={locale} />;
  }

  // Guides section
  if (routeKey === 'guides/index') {
    return <GuidesOverviewLocalized labels={t.nextra.guidesOverview} />;
  }
  if (routeKey === 'guides/starter-templates') {
    return <StarterTemplatesLocalized locale={locale} />;
  }
  if (routeKey === 'guides/siwx-jwt-external-auth') {
    return <SiwxJwtLocalized locale={locale} />;
  }
  if (routeKey === 'guides/siwx-supabase') {
    return <SiwxSupabaseLocalized locale={locale} />;
  }
  if (routeKey === 'guides/multi-chain-auth-siwx-caip122') {
    return <MultiChainAuthLocalized locale={locale} />;
  }
  if (routeKey === 'guides/why-web3-transaction-state-is-broken') {
    return <WhyWeb3StateBrokenLocalized locale={locale} />;
  }
  if (routeKey === 'guides/quasar-transaction-sync') {
    return <QuasarTxSyncLocalized locale={locale} />;
  }
  if (routeKey === 'guides/react-transaction-tracking') {
    return <ReactTxTrackingLocalized locale={locale} />;
  }
  if (routeKey === 'guides/full-stack-react') {
    return <FullStackReactLocalized locale={locale} />;
  }
  if (routeKey === 'guides/erc-4337-sovereign-account-abstraction') {
    return <Erc4337Localized locale={locale} />;
  }

  const slug = routeKey.split('/')[1] ?? routeKey;
  const localizedDescription = t.nextra.pageDescriptions[routeKey] ?? t.nextra.pageDescriptions[slug];
  const localizedTitle = t.nextra.sidebar[routeKey] ?? t.nextra.sidebar[slug];

  if (!localizedDescription && !localizedTitle) {
    return <>{children}</>;
  }

  return (
    <>
      <Callout type="info">
        {localizedTitle && <strong className="block">{localizedTitle}</strong>}
        {localizedDescription && <span>{localizedDescription}</span>}
      </Callout>
      {children}
    </>
  );
}

export interface NextraPageWrapperProps {
  toc: Heading[];
  metadata: $NextraMetadata;
  sourceCode?: string;
  routeKey: string;
  children: ReactNode;
}

function DefaultNextraWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Client wrapper that intercepts the Nextra `Wrapper` component to localize the Table of Contents (`toc`)
 * according to the active language while keeping smooth-scrolling anchor navigation functional.
 */
export function NextraPageWrapper({ toc, metadata, sourceCode = '', routeKey, children }: NextraPageWrapperProps) {
  const { locale, t } = useI18n();
  const mdx = useMDXComponents();
  const Wrapper =
    (mdx.wrapper as React.ComponentType<{
      toc: Heading[];
      metadata: $NextraMetadata;
      sourceCode: string;
      children: ReactNode;
    }>) ?? DefaultNextraWrapper;

  const localizedToc = useMemo(() => {
    if (locale === 'en' || !Array.isArray(toc)) return toc;
    return toc.map((item: Heading) => {
      if (!item || typeof item !== 'object') return item;
      const rawId = typeof item.id === 'string' ? item.id : '';
      const normalizedId = rawId.replace(/^[^\w]+/, '');
      const singleDashId = rawId.replace(/--+/g, '-');
      const normalizedSingleDash = normalizedId.replace(/--+/g, '-');
      const rawValue = typeof item.value === 'string' ? item.value : '';
      const strippedValue = rawValue.replace(/^[\p{Emoji}\s]+/u, '').trim();
      const slugifiedRaw = rawValue
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      const slugifiedStripped = strippedValue
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      const translated =
        t.nextra.headings[`${routeKey}#${rawId}`] ??
        t.nextra.headings[`${routeKey}#${singleDashId}`] ??
        t.nextra.headings[`${routeKey}#${normalizedId}`] ??
        t.nextra.headings[`${routeKey}#${normalizedSingleDash}`] ??
        t.nextra.headings[`${routeKey}#${rawValue}`] ??
        t.nextra.headings[`${routeKey}#${slugifiedRaw}`] ??
        t.nextra.headings[`${routeKey}#${slugifiedStripped}`] ??
        t.nextra.headings[rawId] ??
        t.nextra.headings[singleDashId] ??
        t.nextra.headings[normalizedId] ??
        t.nextra.headings[normalizedSingleDash] ??
        t.nextra.headings[rawValue] ??
        t.nextra.headings[strippedValue] ??
        t.nextra.headings[slugifiedRaw] ??
        t.nextra.headings[slugifiedStripped];
      return translated ? { ...item, value: translated } : item;
    });
  }, [toc, routeKey, locale, t]);

  return (
    <Wrapper toc={localizedToc} metadata={metadata} sourceCode={sourceCode}>
      <MdxCodeBlocksProvider sourceCode={sourceCode}>
        <NextraLocalizedPage routeKey={routeKey}>{children}</NextraLocalizedPage>
      </MdxCodeBlocksProvider>
    </Wrapper>
  );
}

/**
 * Client wrapper around the Nextra `Layout`: `NextraDocsLayout` of `@tuwaio/docs-ui` (the layout of every TUWA
 * documentation site) in the language of the reader, with the sidebar `pageMap` translated by route
 * (`localizePageMap` with `nextra.sidebar` of the hub dictionaries).
 * @param props.logo - Server-rendered `<RemoteLogo />` element.
 * @param props.pageMap - Raw Nextra `PageMapItem[]` from `getPageMap()`.
 * @param props.children - Section children.
 */
export function NextraLocalizedShell({
  logo,
  pageMap,
  children,
}: {
  logo: ReactNode;
  pageMap: PageMapItem[];
  children: ReactNode;
}) {
  const { locale, setLocale, t } = useI18n();

  const localizedPageMap = useMemo(
    () => (locale === 'en' ? pageMap : localizePageMap(pageMap, {}, { routes: t.nextra.sidebar })),
    [locale, pageMap, t.nextra.sidebar],
  );

  return (
    <NextraDocsLayout
      logo={logo}
      pageMap={localizedPageMap}
      docsRepositoryBase="https://github.com/TuwaIO/docs/tree/main/apps/docs-hub"
      locale={locale}
      onLocaleChange={setLocale}
      labels={docsLabels[locale]}
      sidebar={{ defaultMenuCollapseLevel: 1 }}
    >
      {children}
    </NextraDocsLayout>
  );
}
