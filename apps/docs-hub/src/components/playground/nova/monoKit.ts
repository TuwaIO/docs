// TUWA Mono: class names for every part of Nova UI Kit (the `customization` props). Monospace type, outlined surfaces
// and accent rings. Every color, corner and ring comes from the `--tuwa-*` variables, so the kit works with any theme.
// Some Nova parts add these classes to their own defaults instead of replacing them, so the colors of buttons and list
// rows are marked important (`!`): the default hover colors of Nova would win otherwise.
// Tailwind CSS generates these classes from this file: keep each class a complete string literal.
import type { NovaConnectProviderCustomization } from '@tuwaio/sdk/nova-connect';
import type {
  ChainListRendererCustomization,
  ConnectButtonCustomization,
  ConnectCardCustomization,
  ConnectedModalCustomization,
  StatusIconCustomization,
} from '@tuwaio/sdk/nova-connect/components';
import { cn } from '@tuwaio/sdk/nova-core/utils';
import type { TransactionsHistoryCustomization } from '@tuwaio/sdk/nova-transactions';
import type { NovaTransactionsProviderProps } from '@tuwaio/sdk/nova-transactions/providers';
import type { Transaction } from '@tuwaio/sdk/pulsar';

/** The `customization` prop of `NovaTransactionsProvider`. */
export type NovaTransactionsCustomization = NonNullable<NovaTransactionsProviderProps<Transaction>['customization']>;

const corners = 'rounded-[var(--tuwa-rounded-corners)]';
const focus =
  'focus:outline-none focus-visible:ring-[length:var(--tuwa-ring-width)] focus-visible:ring-[var(--tuwa-text-accent)]';

const text = {
  body: 'font-mono font-light',
  strong: 'font-mono font-medium',
  primary: 'text-[var(--tuwa-text-primary)]',
  secondary: 'text-[var(--tuwa-text-secondary)]',
  accent: 'text-[var(--tuwa-text-accent)]',
  error: 'text-[var(--tuwa-error-icon)]',
};

// A status badge: its icon takes the color of its text, which every theme keeps readable on the badge
const statusBadge = cn(text.body, 'text-xs [&_svg]:text-current!');

const surface = {
  base: 'bg-[var(--tuwa-bg-secondary)]',
  muted: 'bg-[var(--tuwa-bg-muted)]',
  border: 'border border-[var(--tuwa-border-primary)]',
};

// The outlined button: the surface stays, the line and the text take the accent under the pointer
const buttonBase = cn(
  'cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 text-sm scale-100!',
  'disabled:cursor-not-allowed disabled:opacity-50',
  corners,
  focus,
);
const outlined = cn(
  buttonBase,
  'transition-colors',
  text.body,
  'bg-[var(--tuwa-bg-secondary)]! hover:bg-[var(--tuwa-bg-secondary)]! text-[var(--tuwa-text-primary)]!',
  'border! border-[var(--tuwa-border-primary)]!',
);

const button = {
  primary: cn(
    buttonBase,
    'transition-opacity',
    text.strong,
    // The text takes the page color: it stands out on the accent in every theme, also on a light accent
    'bg-[var(--tuwa-text-accent)]! hover:bg-[var(--tuwa-text-accent)]! text-[var(--tuwa-bg-primary)]! hover:opacity-90',
  ),
  ghost: cn(
    outlined,
    'not-disabled:hover:border-[var(--tuwa-text-accent)]! not-disabled:hover:text-[var(--tuwa-text-accent)]!',
  ),
  danger: cn(
    outlined,
    'not-disabled:hover:border-[var(--tuwa-error-icon)]! not-disabled:hover:text-[var(--tuwa-error-icon)]!',
  ),
  link: cn('cursor-pointer text-sm transition-opacity hover:opacity-80', text.body, text.accent),
  quiet: cn('cursor-pointer text-sm transition-opacity hover:opacity-80', text.body, text.secondary),
  icon: cn(
    'cursor-pointer p-1 transition-colors scale-100!',
    corners,
    'bg-transparent! text-[var(--tuwa-text-secondary)]!',
    'hover:bg-[var(--tuwa-bg-muted)]! hover:text-[var(--tuwa-text-primary)]! [&_svg]:text-current',
    focus,
  ),
  copy: cn('cursor-pointer transition-colors text-[var(--tuwa-text-secondary)]! hover:text-[var(--tuwa-text-accent)]!'),
};

const modal = {
  header: cn(surface.base, 'border-b border-[var(--tuwa-border-primary)]'),
  footer: cn(surface.base, 'border-t border-[var(--tuwa-border-primary)]'),
};

// A row of a chain list, in the selector and in the connected modal: the current chain is filled with the accent
const chainList: ChainListRendererCustomization = {
  classNames: {
    item: ({ isActive, isMobile }) =>
      cn(
        'flex w-full cursor-pointer items-center gap-3 px-2 py-2 text-left text-sm outline-none transition-colors',
        'ring-0! ring-offset-0!',
        isMobile && 'justify-between',
        corners,
        text.body,
        isActive
          ? 'bg-[var(--tuwa-text-accent)]! text-[var(--tuwa-bg-primary)]! hover:bg-[var(--tuwa-text-accent)]! focus:bg-[var(--tuwa-text-accent)]!'
          : 'bg-transparent! text-[var(--tuwa-text-primary)]! hover:bg-[var(--tuwa-bg-muted)]! focus:bg-[var(--tuwa-bg-muted)]!',
      ),
    chainName: () => 'text-current!',
    activeIndicatorWrapper: () => 'text-current! opacity-80',
  },
};

const connectCard: ConnectCardCustomization = {
  classNames: {
    container: ({ cardData }) =>
      cn(
        'group relative flex w-full cursor-pointer items-center justify-between p-3 transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        cardData.isTouch && 'h-[120px] w-[120px] flex-col justify-center p-2 text-center',
        corners,
        surface.base,
        surface.border,
        'hover:border-[var(--tuwa-text-accent)] hover:bg-[var(--tuwa-bg-muted)]',
        focus,
      ),
    content: ({ cardData }) => cn('flex items-center gap-3', cardData.isTouch && 'flex-col gap-1', text.primary),
    iconWrapper: () => cn('h-8 w-8 overflow-hidden leading-[0] [&_img]:h-8! [&_img]:w-8!', corners),
    title: () => cn(text.body, text.primary, 'transition-colors group-hover:text-[var(--tuwa-text-accent)]'),
    subtitle: () => cn(text.body, text.secondary, 'text-xs'),
    // The badge gives way to the chevron under the pointer
    recentBadgeWrapper: () => 'absolute top-0.5 right-0.5 transition group-hover:scale-90 group-hover:opacity-0',
    chevron: () =>
      cn(
        'h-5 w-5 -translate-x-2 opacity-0 transition duration-300',
        'group-hover:translate-x-0 group-hover:opacity-100',
        text.accent,
      ),
  },
};

const connectedModal: ConnectedModalCustomization = {
  classNames: {
    header: () => cn(modal.header, 'p-4'),
    closeButton: () => button.icon,
    mainContent: () => surface.base,
    footer: () => cn(modal.footer, 'p-4'),
  },
  childCustomizations: {
    mainContent: {
      classNames: {
        container: () => cn('flex flex-col items-center justify-center gap-3 p-4', surface.base),
        transactionsButton: () => cn(button.primary, 'min-h-10 px-6'),
      },
      childCustomizations: {
        walletAvatar: {
          classNames: {
            container: () =>
              'relative h-32 w-32 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--tuwa-border-primary)]',
          },
        },
        nameAndBalance: {
          classNames: {
            walletNameDisplay: () => cn(text.strong, text.primary, 'text-lg'),
            copyButton: () => button.icon,
          },
        },
      },
    },
    chainList: { chainListRenderer: chainList },
    connections: {
      classNames: {
        container: () => cn('flex flex-col gap-6 p-4', surface.base),
        activeSectionTitle: () => cn(text.strong, text.accent, 'mb-2 text-xs uppercase tracking-wider'),
        activeSectionWrapper: () => cn('overflow-hidden', corners, surface.border, surface.base),
        recentSectionTitle: () => cn(text.body, text.secondary, 'mb-2 text-xs uppercase tracking-wider'),
        activeRowWalletName: () => cn(text.strong, text.primary),
        activeRowConnectorName: () => cn(text.body, text.secondary, 'text-xs'),
        activeRowDisconnectButton: () => cn(button.danger, 'mt-4 px-3 py-1.5 text-xs'),
        connectedRowWalletName: () => cn(text.body, text.primary, 'text-sm'),
        recentRowContainer: () => cn('flex items-center justify-between p-3', corners, surface.border, surface.base),
        recentRowWalletName: () => cn(text.body, text.primary, 'text-sm'),
        recentRowConnectButton: () => cn(button.ghost, 'px-3 py-1.5 text-xs'),
        addWalletButton: () =>
          cn(
            'mt-2 w-full cursor-pointer border border-dashed border-[var(--tuwa-border-primary)] p-3 text-sm transition-colors',
            corners,
            text.body,
            text.secondary,
            'hover:border-[var(--tuwa-text-accent)] hover:text-[var(--tuwa-text-accent)]',
          ),
      },
    },
    footer: {
      classNames: {
        container: () =>
          cn(
            'flex w-full flex-col-reverse flex-wrap items-center justify-between gap-4 p-4 sm:flex-row *:grow',
            modal.footer,
          ),
        disconnectButton: () => cn(button.danger, 'min-h-10'),
        explorerLink: () => cn(button.ghost, 'min-h-10 no-underline'),
      },
    },
  },
};

/** The `customization` prop of `NovaConnectProvider`: the connect and connected modals and the error toasts. */
export const monoConnect: NovaConnectProviderCustomization = {
  modals: {
    connectModal: {
      classNames: {
        modalContainer: () => surface.base,
        header: () => cn(modal.header, 'border-[var(--tuwa-border-primary)]'),
        infoButton: () => button.icon,
        closeButton: () => button.icon,
        mainContent: () => surface.base,
        footer: () => modal.footer,
        backButton: () => button.ghost,
        actionButton: () => cn(button.primary, 'min-h-10'),
      },
      childComponents: {
        connectorsSelections: {
          connectorsBlock: {
            installed: {
              classNames: { title: () => cn(text.strong, text.accent, 'text-xs uppercase tracking-wider') },
              connectCard,
            },
            popular: {
              classNames: { title: () => cn(text.strong, text.secondary, 'text-xs uppercase tracking-wider') },
              connectCard,
            },
          },
        },
        networkSelections: {
          classNames: { title: () => cn(text.body, text.primary, 'mb-2') },
          connectCard,
        },
        connecting: {
          classNames: {
            statusMessage: ({ statusData }) =>
              cn(
                text.strong,
                'text-lg transition-colors',
                statusData.state === 'error' ? text.error : statusData.state === 'success' ? text.accent : text.primary,
              ),
            errorMessage: () => cn(text.body, text.error, 'text-center text-sm leading-relaxed'),
          },
        },
        // The text and the strip behind the indicators take the surface of the modal
        aboutWallets: {
          classNames: {
            contentSection: () => 'bg-[var(--tuwa-bg-secondary)]!',
            navigation: () => '[&>div:last-child]:bg-[var(--tuwa-bg-secondary)]!',
          },
        },
        rememberWallet: {
          classNames: {
            text: () => cn(text.body, text.primary, 'text-sm leading-tight'),
            box: ({ checked }) =>
              cn(
                'relative flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors',
                corners,
                'peer-focus-visible:ring-[length:var(--tuwa-ring-width)] peer-focus-visible:ring-[var(--tuwa-text-accent)]',
                checked
                  ? 'border-[var(--tuwa-text-accent)] bg-[var(--tuwa-text-accent)]'
                  : 'border-[var(--tuwa-border-primary)] bg-transparent group-hover:border-[var(--tuwa-text-accent)]',
              ),
            tooltip: () =>
              cn(
                'pointer-events-none absolute right-0 bottom-full z-20 mb-2 w-max max-w-[240px] px-3 py-2 text-left text-xs leading-snug shadow-lg',
                corners,
                text.body,
                'bg-[var(--tuwa-text-primary)] text-[var(--tuwa-bg-primary)]',
              ),
          },
        },
        legalDisclaimer: {
          classNames: {
            container: () => 'mt-2 border-t border-[var(--tuwa-border-primary)] pt-3',
            text: () => cn(text.body, text.secondary, 'text-center text-xs'),
            termsLink: () => 'underline transition-colors hover:text-[var(--tuwa-text-accent)]',
            privacyLink: () => 'underline transition-colors hover:text-[var(--tuwa-text-accent)]',
          },
        },
      },
    },
    connectedModal,
  },
  errors: {
    toastCloseButton: { className: button.icon },
    toastErrorCustomization: {
      classNames: {
        container: () => cn('w-full p-4', corners, text.body, surface.base, 'border border-[var(--tuwa-error-icon)]'),
        title: () => cn(text.strong, text.error, 'truncate text-sm'),
        description: () => cn(text.body, text.error, 'mt-1 break-words text-xs opacity-80'),
      },
    },
  },
};

// A transaction status on the connect button, in a ring of its color
const statusIcon = (colors: string): StatusIconCustomization => ({
  classNames: { container: () => cn('flex h-6 w-6 items-center justify-center rounded-full ring-1', colors) },
});

/** The `customization` prop of `ConnectButton`, with its network selector and connected state. */
export const monoConnectButton: ConnectButtonCustomization = {
  classNames: {
    container: () => 'flex items-center gap-3',
    button: ({ buttonData }) =>
      cn(
        'cursor-pointer inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-sm transition-colors',
        corners,
        text.body,
        focus,
        'disabled:cursor-not-allowed disabled:opacity-50',
        buttonData.isConnected
          ? cn(surface.base, surface.border, text.primary, 'hover:border-[var(--tuwa-text-accent)]')
          : 'bg-[var(--tuwa-text-accent)] text-[var(--tuwa-bg-primary)] hover:opacity-90',
      ),
  },
  childComponents: {
    connectedContent: {
      classNames: {
        balanceContainer: () => text.secondary,
        mainContent: () => '[&_span]:text-[var(--tuwa-text-primary)] [&_svg]:text-[var(--tuwa-text-accent)]',
      },
      childCustomizations: {
        walletAvatar: {
          classNames: {
            container: () =>
              'relative z-2 h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--tuwa-border-primary)]',
          },
        },
        statusIcon: {
          succeed: statusIcon(
            'bg-[var(--tuwa-success-bg)] text-[var(--tuwa-success-icon)] ring-[var(--tuwa-success-icon)]',
          ),
          failed: statusIcon('bg-[var(--tuwa-error-bg)] text-[var(--tuwa-error-icon)] ring-[var(--tuwa-error-icon)]'),
          replaced: statusIcon(
            'bg-[var(--tuwa-info-bg)] text-[var(--tuwa-info-icon)] ring-[var(--tuwa-border-primary)]',
          ),
        },
      },
    },
    chainSelector: {
      triggerButton: {
        classNames: {
          button: ({ isOpen }) => cn(button.ghost, 'min-h-11', isOpen && 'border-[var(--tuwa-text-accent)]'),
          arrowWrapper: () => '[&_svg]:text-[var(--tuwa-text-accent)]',
        },
      },
      selectContent: { contentClassName: cn(surface.base, surface.border, corners) },
      chainListRenderer: chainList,
    },
  },
};

/** The `customization` prop of `TransactionsHistory`, also used by the history modal. */
export const monoHistory: TransactionsHistoryCustomization<Transaction> = {
  classNames: {
    container: 'flex flex-col gap-y-3',
    listWrapper: cn('max-h-[400px] overflow-y-auto', corners, surface.border, surface.base),
    placeholderContainer: cn('p-8 text-center', corners, surface.border, surface.base),
    placeholderTitle: cn(text.strong, text.primary),
    placeholderMessage: cn(text.body, text.secondary, 'mt-1 text-sm'),
    itemContainer: cn(
      'flex flex-col gap-2 p-3 transition-colors',
      'border-b border-[var(--tuwa-border-primary)] last:border-b-0 hover:bg-[var(--tuwa-bg-muted)]',
    ),
    itemIconWrapper: cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', surface.border),
    itemTitle: cn(text.strong, text.primary, 'text-sm'),
    itemTimestamp: cn(text.body, text.secondary, 'mb-1 block text-xs'),
    itemDescription: cn(text.body, text.secondary, 'mt-1 text-xs'),
    itemStatusBadge: statusBadge,
    itemHashLabel: cn(text.strong, text.primary, 'pr-1 text-sm'),
    itemHashLink: cn(text.body, text.accent, 'flex items-center gap-x-1 hover:underline'),
    itemHashCopyButton: button.copy,
  },
};

/** The `customization` prop of `NovaTransactionsProvider`: toasts, the tracking modal and the history modal. */
export const monoTransactions: NovaTransactionsCustomization = {
  toastCloseButton: { className: button.icon },
  toast: {
    classNames: {
      container: cn(corners, surface.border, surface.base),
      title: cn(text.strong, text.primary, 'text-sm'),
      description: cn(text.body, text.secondary, 'mt-1 text-xs'),
      transactionKey: 'border-[var(--tuwa-border-primary)]',
      hashLabel: cn(text.strong, text.primary, 'pr-1 text-sm'),
      hashLink: cn(text.body, text.accent, 'hover:underline'),
      hashCopyButton: button.copy,
      statusBadge,
      speedUpButton: button.link,
      cancelButton: button.quiet,
      txInfoButton: cn(button.primary, 'min-h-8 px-3 py-1'),
    },
  },
  transactionsInfoModal: {
    classNames: {
      header: cn(modal.header, text.primary),
      closeButton: button.icon,
    },
    historyCustomization: monoHistory,
  },
  trackingTxModal: {
    classNames: {
      container: surface.base,
      header: cn(modal.header, text.primary),
      closeButton: button.icon,
      main: surface.base,
      footer: cn(modal.footer, 'p-4'),
      speedUpButton: button.link,
      cancelButton: button.quiet,
      retryButton: button.primary,
      allTransactionsButton: button.ghost,
      closeModalButton: button.ghost,
    },
    infoBlockCustomization: {
      classNames: {
        container: cn(corners, surface.border, surface.muted),
        rowLabel: cn(text.body, text.secondary),
        rowValue: cn(text.strong, text.primary),
        separator: 'border-[var(--tuwa-border-primary)]',
      },
    },
    errorBlockCustomization: {
      classNames: {
        container: cn(corners, 'border border-[var(--tuwa-error-icon)]/40', surface.muted),
        title: cn(text.strong, text.error),
        icon: text.error,
        messageText: cn(text.body, text.primary, 'text-xs'),
      },
    },
  },
};
