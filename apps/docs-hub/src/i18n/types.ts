import type { PolicySlug } from '@tuwaio/docs-ui';
import type { TuwaLocale } from '@tuwaio/docs-ui/locale';

import type { AxisId, SegmentId } from '../lib/comparisons';
import type { StyleKit } from '../lib/playground/customization';
import type { ThemeId } from '../lib/playground/themes';

export type SimulatedOutcomeKey = 'succeed' | 'fail' | 'replace' | 'cancel' | 'reject';

/**
 * Supported locale codes for the TUWA Documentation Hub.
 */
export type Locale = TuwaLocale;

/**
 * Localized strings for a single product in `/comparisons`.
 */
export interface ComparisonProductTranslation {
  summary: string;
  license: string;
  pricingText: string;
  chooseWhen: string;
  tuwaDifference: string;
  facts: Record<string, string>;
}

export interface NextraGuidesIndexCard {
  href: string;
  emoji: string;
  title: string;
  description: string;
  meta1Label?: string;
  meta1Text?: string;
  meta2Label?: string;
  meta2Text?: string;
}

/**
 * Localized strings for the Nextra sections (`/guides` and `/quasar`).
 */
export interface NextraSectionLabels {
  onThisPage: string;
  scrollToTop: string;
  editThisPage: string;
  feedback: string;
  lastUpdated: string;
  searchPlaceholder: string;
  searchEmpty: string;
  searchError: string;
  searchLoading: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  sidebar: Record<string, string>;
  pageDescriptions: Record<string, string>;
  headings: Record<string, string>;
  guidesOverview: {
    title: string;
    p1: string;
    p2: string;
    calloutTitle: string;
    calloutBeforeLink: string;
    calloutAfterLink: string;
    deepDiveHeading: string;
    deepDiveIntro: string;
    deepDives: NextraGuidesIndexCard[];
    stepByStepHeading: string;
    stepByStepIntro: string;
    stepBySteps: NextraGuidesIndexCard[];
    apiReferencesHeading: string;
    apiReferencesP1: string;
    apiReferencesP2Before: string;
    apiReferencesMainScreenLink: string;
    apiReferencesP2After: string;
    apiReferencesP3Before: string;
    apiReferencesQuasarLink: string;
    apiReferencesP3After: string;
    principlesHeading: string;
    principlesIntro: string;
    principles: { lead: string; body: string }[];
  };
  guidesIndex: {
    title: string;
    intro: string;
    tableHeaders: {
      guide: string;
      whatYouBuild: string;
      layersUsed: string;
    };
    rows: {
      href: string;
      title: string;
      whatYouBuild: string;
      layersUsed: string;
    }[];
    whereToStartHeading: string;
    whereToStart: {
      newAppLead: string;
      newAppBeforeLink: string;
      newAppLink: string;
      newAppAfterLink: string;
      existingAppLead: string;
      existingAppBeforeFirst: string;
      existingAppFirstLink: string;
      existingAppMiddle: string;
      existingAppSecondLink: string;
      existingAppAfterSecond: string;
      existingAppThirdLink: string;
      existingAppEnd: string;
      notSureLead: string;
      notSureLink: string;
      notSureAfterLink: string;
    };
    sharedRulesHeading: string;
    sharedRulesIntro: string;
    sharedRules: {
      sdkImportsLead: string;
      sdkImportsBody: string;
      viemWagmiLead: string;
      viemWagmiBody: string;
      solanaKitLead: string;
      solanaKitBody: string;
      noSecretsLead: string;
      noSecretsBody: string;
    };
  };
  quasarIndex: {
    title: string;
    introPart1: string;
    introPart2: string;
    howFitsHeading: string;
    howFitsIntro: string;
    bullets: {
      serverKeyLead: string;
      serverKeyPart1: string;
      serverKeyLinkText: string;
      serverKeyPart2: string;
      trackingTwiceLead: string;
      trackingTwiceBody: string;
      webhooksLead: string;
      webhooksPart1: string;
      webhooksSee: string;
      webhooksLinkText: string;
    };
    finalityHeading: string;
    finalityIntro: string;
    finalityHeaders: {
      chainTracker: string;
      intermediate: string;
      terminalSuccess: string;
      terminalFailed: string;
    };
    finalityRows: {
      solana: { intermediate: string; success: string; failed: string };
      evm: { intermediate: string; success: string; failed: string };
      eip5792: { intermediate: string; success: string; failed: string };
      erc4337: { intermediate: string; success: string; failed: string };
    };
    finalityNotes: {
      solanaLead: string;
      solanaBody: string;
      nonCustodialLead: string;
      nonCustodialBody: string;
      recoveryLead: string;
      recoveryBody: string;
    };
    editionsHeading: string;
    editionsIntro: string;
    editionsHeaders: {
      cloud: string;
      community: string;
    };
    editionsRows: {
      label: string;
      cloud: string;
      community: string;
    }[];
    editionsNotePart1: string;
    editionsMigrateLink: string;
    editionsNotePart2: string;
    editionsSelfHostLink: string;
    whichPathHeading: string;
    whichPaths: {
      serverlessLead: string;
      serverlessBody: string;
      customWorkerLead: string;
      customWorkerBody: string;
      selfHostedLead: string;
      selfHostedBody: string;
    };
    nextStepsHeading: string;
    nextSteps: {
      appsKeysPrefix: string;
      appsKeysLink: string;
      syncPrefix: string;
      syncLink1: string;
      syncMiddle: string;
      syncLink2: string;
      webhooksPrefix: string;
      webhooksLink: string;
      apiPrefix: string;
      apiLink1: string;
      apiMiddle: string;
      apiLink2: string;
    };
  };
}

/**
 * Full translation schema for the TUWA Documentation Hub (`apps/docs-hub`).
 */
export interface DocsHubLabels {
  nav: {
    mainScreen: string;
    guides: string;
    quasar: string;
    comparisons: string;
    configurator: string;
    playground: string;
    theme: string;
    language: string;
    selectLanguage: string;
    toggleTheme: string;
    openMenu: string;
    closeMenu: string;
    mobileNavAria: string;
  };
  footer: {
    description: string;
    license: string;
    policiesAriaLabel: string;
    allPolicies: string;
    copyright: string;
    policyTitles: Record<PolicySlug, string>;
  };
  common: {
    packageManager: string;
    copy: string;
    copied: string;
    copyCommand: string;
    copyCode: string;
    close: string;
    yes: string;
    partial: string;
    no: string;
  };
  home: {
    hero: {
      badge: string;
      titlePrefix: string;
      titleHighlight: string;
      description: string;
      /** the licence promise under the description */
      license: string;
      searchAria: string;
      searchButton: string;
      explorePackages: string;
      tryPlayground: string;
    };
    timeline: {
      titlePrefix: string;
      titleHighlight: string;
      subtitle: string;
      stages: Record<number, { label: string; subtitle: string }>;
    };
    entries: Record<string, { tagline: string; packagesBadgeLabel?: string }>;
    docCard: {
      cloudAndSelfHosted: string;
      onePackage: string;
      packagesCount: string;
      readDocs: string;
      tryLiveAdmin: string;
      showPackages: string;
      hidePackages: string;
    };
    packagePreview: {
      installLabel: string;
      copyInstallTitle: string;
      peerDepsTitle: string;
      deprecated: string;
      standalone: string;
      peersCount: string;
      peersCountPlural: string;
      lighterInstallPrefix: string;
      lighterInstallConjunction: string;
    };
    packageDialog: {
      deprecatedPrefix: string;
      install: string;
      copyInstallTitle: string;
      peersHint: string;
      lighterEntryHeading: string;
      guidesHeading: string;
      dependenciesHeading: string;
      includedWith: string;
      peerDependenciesHeading: string;
      noRuntimeDeps: string;
      optional: string;
      viewOnNpm: string;
      packageDescriptions: Record<string, string>;
      packageDeprecations: Record<string, string>;
      lighterDescriptions: Record<string, string>;
    };
    quickStart: {
      titlePrefix: string;
      titleHighlight: string;
      subtitle: string;
      cards: {
        choosePackages: { title: string; description: string; cta: string };
        fullStackReact: { title: string; description: string; cta: string };
        selfHostQuasar: { title: string; description: string; cta: string };
      };
      allGuidesPrefix: string;
      browseAllGuides: string;
      aiBanner: {
        badge: string;
        title: string;
        description: string;
        copyUrl: string;
        copied: string;
        copyTitle: string;
        viewOnGithub: string;
      };
    };
    compactConfigurator: {
      badge: string;
      title: string;
      description: string;
      openWithFiles: string;
      install: string;
      filesGenerated: string;
      viewCode: string;
    };
  };
  comparisons: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    verifiedPrefix: string;
    methodologyLink: string;
    radar: {
      sectionTitle: string;
      sectionDescription: string;
      compareLabel: string;
      chartLabel: string;
      axisColumn: string;
      favorsHostedNote: string;
    };
    matrix: {
      sectionTitle: string;
      sectionDescription: string;
      allAxes: string;
      criterionColumn: string;
      licenseRow: string;
      pricingRow: string;
      sourceLabel: string;
    };
    chooseInstead: {
      sectionTitle: string;
      sectionDescription: string;
      vsTuwa: string;
      pickWhen: string;
      howTuwaDiffers: string;
    };
    methodology: {
      sectionTitle: string;
      howScoresWorkTitle: string;
      howScoresWorkP1: string;
      howScoresWorkP2: string;
      whyOnboardingTitle: string;
      whyOnboardingP1: string;
      whyOnboardingP2: string;
      reportErrorTitle: string;
      reportErrorP1: string;
      openIssue: string;
      transparencyTitle: string;
      transparencyText: string;
    };
    cta: {
      configureStack: string;
      readOverview: string;
    };
    segments: Record<SegmentId, { label: string }>;
    axes: Record<AxisId, { label: string; question: string }>;
    criteria: Record<string, { label: string; description: string }>;
    products: Record<string, ComparisonProductTranslation>;
  };
  configurator: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    form: {
      framework: string;
      chains: string;
      chainsHint: string;
      ui: string;
      uiVanillaHint: string;
      uiNova: string;
      uiHeadless: string;
      authBackend: string;
      siwxLabel: string;
      siwxTooltipLabel: string;
      siwxTooltip: string;
      quasarLabel: string;
      quasarTooltipLabel: string;
      quasarTooltip: string;
      quasarHint: string;
    };
    steps: {
      step1Title: string;
      copyShareLink: string;
      linkCopied: string;
      tryInPlayground: string;
      copyPromptForAi: string;
      promptCopied: string;
      promptTitle: string;
      step2Title: string;
      devPackagesLabel: string;
      copyDevPackages: string;
      step3Title: string;
      setupFilesAria: string;
      step4Title: string;
      closestTemplate: string;
      cloneWithTiged: string;
      copyCloneCommand: string;
      guidesForStack: string;
    };
    templateNotes: Record<string, string>;
    commandLabels: Record<string, string>;
    guideTitles: Record<string, string>;
  };
  playground: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    description: string;
    controls: {
      stackHeading: string;
      chains: string;
      chainsHint: string;
      ui: string;
      uiNova: string;
      uiHeadless: string;
      authBackend: string;
      siwxLabel: string;
      siwxInfoLabel: string;
      siwxInfo: string;
      quasarLabel: string;
      quasarInfoLabel: string;
      quasarInfo: string;
      scenarioHeading: string;
      txOutcome: string;
      outcomeInfoLabel: string;
      outcomeInfo: string;
      outcomes: Record<SimulatedOutcomeKey, { label: string; hint: string }>;
      latency: string;
      fast: string;
      realistic: string;
      multiDevice: string;
      multiDeviceInfoLabel: string;
      multiDeviceInfo: string;
      openAnotherDevice: string;
      openAnotherDeviceHint: string;
      resetPlayground: string;
    };
    stage: {
      stageBadge: string;
      simulatedLabel: string;
      reloadStage: string;
      reloadStageTitle: string;
      walletModalLabel: string;
      walletExtension: string;
      signInRequest: string;
      txRequest: string;
      messageToSign: string;
      signingWith: string;
      reject: string;
      confirm: string;
      sign: string;
      novaHeaderSubtitle: string;
      novaConnectedHint: string;
      novaConnectHint: string;
      novaConnectAndSignInHint: string;
      historyHeading: string;
      historyAria: string;
      headlessSubtitle: string;
      networkAria: string;
      disconnect: string;
      signedInWithSiwx: string;
      signOut: string;
      signInWithSiwx: string;
      noTransactionsYet: string;
      syncedToQuasar: string;
      syncPending: string;
      actions: Record<
        'MINT' | 'SWAP' | 'STAKE',
        {
          label: string;
          title: [string, string, string, string];
          description: [string, string, string, string];
        }
      >;
    };
    inspector: {
      tabsAria: string;
      tabs: {
        events: string;
        state: string;
        customize: string;
        code: string;
      };
      events: {
        clear: string;
        empty: string;
      };
      state: {
        quasarSource: string;
        walletTitle: string;
        walletSource: string;
      };
      customize: {
        intro: string;
        headlessNotice: string;
        themeLayer: string;
        styleLayer: string;
        componentsLayer: string;
        textsLayer: string;
        behaviorLayer: string;
        languageLabel: string;
        connectTextLabel: string;
        toastPositionLabel: string;
        resetNova: string;
        copyCss: string;
        cssCopied: string;
        resetEdits: string;
        editedSuffix: string;
        themeGroups: Record<string, string>;
        themePresets: Record<ThemeId, { label: string; description: string }>;
        styleKits: Record<StyleKit, { label: string; description: string }>;
        flags: Record<string, string>;
      };
      code: {
        introPart1: string;
        introPart2: string;
        introPart3: string;
        stackSetup: string;
        setupFilesAria: string;
        novaCustomization: string;
        themeHeading: string;
        importThemeNote: string;
        passObjectsNote: string;
        customizationFilesAria: string;
        openInConfigurator: string;
        openInStackblitz: string;
      };
    };
  };
  policies: {
    badge: string;
    title: string;
    description: string;
    listAria: string;
    read: string;
    pdf: string;
    securityContactTitle: string;
    securityContactText: string;
    securityContactSuffix: string;
    legalPrivacyTitle: string;
    items: Record<PolicySlug, { title: string; description: string }>;
  };
  notFound: {
    heading: string;
    description: string;
    backToMain: string;
    browseGuides: string;
    destinationsAria: string;
    packageRefHeading: string;
    packageRefDescription: string;
    destinations: Record<string, { title: string; description: string }>;
  };
  ui: {
    latestReleasePrefix: string;
    documentationTitle: string;
    deprecatedBadge: string;
    /** Badges of a package row on the main page; `{date}` is the measurement date, `{size}` a size in kB */
    packageBadges: {
      version: string;
      license: string;
      size: string;
      sizeLazy: string;
    };
    moreCount: string;
    requiredPeers: string;
    optionalPeersHeading: string;
    includesHeading: string;
    usedBy: string;
    clickForDetails: string;
    clickForInstall: string;
    referenceLink: string;
    sourceLink: string;
    includedInPrefix: string;
    includedInAnd: string;
    includedInSuffix: string;
    installsWithPeers: string;
    peerSingular: string;
    peerPlural: string;
    alsoNeedsFrameworkPeers: string;
    lighterDoesNotImport: string;
    lighterEntryDescriptions: Record<string, string>;
    quickStartSteps: {
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      compareTemplates: string;
      step3Title: string;
      step3Desc: string;
      aiAgentsBadge: string;
      aiAgentsTitle: string;
    };
    comparisonsExtra: {
      verifiedBadge: string;
      productsCount: string;
      criteriaCount: string;
      radarIntro: string;
      criteriaIntro: string;
      chooseInsteadIntro: string;
      methodologyIntro: string;
      bundleTitle: string;
      bundleIntro: string;
      bundleSetColumn: string;
      bundlePackagesColumn: string;
      bundleSizeColumn: string;
      bundleIncomplete: string;
      bundleMeasured: string;
      /** Labels of `BUNDLE_SETS` in lib/bundleSize.ts, by set id */
      bundleSets: Record<string, string>;
      readyHeading: string;
      startFromTemplate: string;
      fullStackGuide: string;
      compareTuwaWith: string;
      radarAxesAria: string;
      favorsHostedOnboarding: string;
      favorsHostedChains: string;
      tuwaCounterpartLabel: string;
      scoringHeading: string;
      scoringBodyPart1: string;
      scoringBodyPart2: string;
      markMetLead: string;
      markMetBody: string;
      markPartialLead: string;
      markPartialBody: string;
      markNoLead: string;
      markNoBody: string;
      whatWeCompareHeading: string;
      whatWeCompareBody: string;
      transparencyPart1: string;
      transparencyFileLink: string;
      transparencyPart2: string;
      transparencyIssueLink: string;
      transparencyPart3: string;
      sourcesHeading: string;
    };
    configuratorExtra: {
      subtitle: string;
      frameworkHints: Record<'next' | 'vite' | 'vanilla', string>;
      chainsHintFull: string;
      uiHintVanilla: string;
      uiHintNova: string;
      uiHintHeadless: string;
      featuresLabel: string;
      featuresHintQuasar: string;
      featuresHintDefault: string;
      siwxChoice: string;
      quasarChoice: string;
      fastestStart: string;
      starterTemplate: string;
      runCommandAndPick: string;
      orAddToExisting: string;
      peersIncluded: string;
      sdkBringsProjects: string;
      addFilesTitle: string;
      runStepTitle: string;
      readNext: string;
    };
    playgroundExtra: {
      subnote: string;
      loadingAria: string;
      connectButtonGroup: string;
      minimal: string;
      full: string;
      nextTxGroup: string;
      nextTxShort: string;
      speedGroup: string;
      signaturesGroup: string;
      approve: string;
      reject: string;
      quasarGroup: string;
      online: string;
      offline: string;
      pendingEvmGroup: string;
      speedUp: string;
      cancel: string;
      otherDeviceShort: string;
      resetShort: string;
      resetTitle: string;
      setupButton: string;
      closeSetup: string;
      scrollButton: string;
      scrollTitle: string;
      outcomeLabels: Record<'success' | 'revert' | 'replaced' | 'rejected', string>;
      outcomeHints: Record<'success' | 'revert' | 'replaced' | 'rejected', string>;
      info: {
        chains: string;
        ui: string;
        features: string;
        theme: string;
        style: string;
        connectButton: string;
        language: string;
        outcome: string;
        speed: string;
        signatures: string;
        quasar: string;
        pendingEvm: string;
      };
    };
    policiesExtra: {
      lastUpdated: string;
      vulnTitle: string;
      vulnBeforeLink: string;
      vulnAfterLink: string;
      legalTitle: string;
      legalBeforeLink: string;
      legalAfterLink: string;
    };
    notFoundExtra: {
      reportBrokenLink: string;
      hubSectionsHeading: string;
      policiesTitle: string;
      policiesDescription: string;
    };
  };
  nextra: NextraSectionLabels;
}
