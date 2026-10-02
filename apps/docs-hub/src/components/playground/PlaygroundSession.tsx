'use client';

import type { NovaConnectProviderProps } from '@tuwaio/sdk/nova-connect';
import { useInitializeTransactionsPool } from '@tuwaio/sdk/pulsar';
import { SatelliteConnectProvider, useSatelliteConnectStore } from '@tuwaio/sdk/satellite';
import { isSessionMatchingTarget, useSiwxSessionStore } from '@tuwaio/sdk/siwx';
import { useEffect, useState } from 'react';

import { resetChain } from '@/lib/playground/chain';
import type { NovaCustomization } from '@/lib/playground/customization';
import { clearStoredTransactions, createDevice } from '@/lib/playground/device';
import { clearEvents, logEvent } from '@/lib/playground/eventLog';
import { resetQuasar } from '@/lib/playground/quasar';
import { createSimulatedSatelliteAdapter } from '@/lib/playground/satelliteAdapters';
import { DEFAULT_SCENARIO, scenarioStore } from '@/lib/playground/scenario';
import { familiesOf, type PlaygroundSettings } from '@/lib/playground/settings';
import { createSimulatedSiwx } from '@/lib/playground/siwx';
import type { ThemeValues, ThemeVariable } from '@/lib/playground/themes';
import { resetWalletSessions } from '@/lib/playground/wallets';

import { ControlsPanel } from './ControlsPanel';
import { Inspector } from './Inspector';
import { PlaygroundContext, type PlaygroundContextValue, usePlayground } from './PlaygroundContext';
import { Stage } from './Stage';

// Restarts the trackers of the pending transactions restored from localStorage, as an app does after a reload
function TransactionsPoolInitializer() {
  const { device } = usePlayground();
  const initializeTransactionsPool = device.usePulsarStore((state) => state.initializeTransactionsPool);
  useInitializeTransactionsPool({ initializeTransactionsPool });
  return null;
}

// Loads the first page of the Quasar history once the connected wallet is signed in, as in the Quasar guide
function HistoryLoader() {
  const { device } = usePlayground();
  const address = useSatelliteConnectStore((state) => state.activeConnection?.address);
  const session = useSiwxSessionStore((state) => state.session);
  const fetchInitial = device.useHistoryStore((state) => state.fetchInitial);
  const isSignedIn = Boolean(session && address && isSessionMatchingTarget(session, address));

  useEffect(() => {
    if (isSignedIn && address) void fetchInitial(address);
  }, [isSignedIn, address, fetchInitial]);

  return null;
}

/**
 * One session of the Playground: the stores of a simulated device, the Satellite store with the simulated adapters
 * and the SIWX backend, shared by the controls, the stage and the inspector. `PlaygroundStudio` keys it by the
 * settings that need a new app, so every session starts disconnected.
 */
export function PlaygroundSession({
  settings,
  theme,
  themeEdited,
  changeSettings,
  editTheme,
  resetThemeEdits,
  resetTheme,
  customization,
  changeCustomization,
  resetCustomization,
  restart,
}: {
  settings: PlaygroundSettings;
  theme: ThemeValues;
  themeEdited: boolean;
  changeSettings: (patch: Partial<PlaygroundSettings>) => void;
  editTheme: (variable: ThemeVariable, value: string) => void;
  resetThemeEdits: () => void;
  resetTheme: () => void;
  customization: NovaCustomization;
  changeCustomization: (patch: Partial<NovaCustomization>) => void;
  resetCustomization: () => void;
  restart: () => void;
}) {
  const families = familiesOf(settings);
  // Created once per session: new adapter objects would make SatelliteConnectProvider update its store
  const [device] = useState(() => createDevice({ families, quasar: settings.quasar }));
  const [adapters] = useState(() => families.map(createSimulatedSatelliteAdapter));
  const [siwx] = useState(() => createSimulatedSiwx(window.location.host));
  const [novaSiwx] = useState<NovaConnectProviderProps['siwx']>(() =>
    settings.siwx
      ? { ...siwx, statement: 'Sign in to the TUWA Playground. The signature is simulated.', expirationSeconds: 1800 }
      : undefined,
  );

  useEffect(() => device.start(), [device]);

  const startOver = (everything: boolean) => {
    device.halt();
    clearStoredTransactions();
    resetWalletSessions();
    useSiwxSessionStore.getState().reset();
    if (everything) {
      resetChain();
      resetQuasar();
      clearEvents();
      scenarioStore.setState({ ...DEFAULT_SCENARIO });
      resetTheme();
      resetCustomization();
    } else {
      logEvent('Quasar', 'New device: no local transactions. Connect the same wallet and sign in to load the history.');
    }
    restart();
  };

  const value: PlaygroundContextValue = {
    settings,
    families,
    device,
    siwx,
    novaSiwx,
    theme,
    themeEdited,
    customization,
    changeSettings,
    editTheme,
    resetThemeEdits,
    changeCustomization,
    resetCustomization,
    openOnAnotherDevice: () => startOver(false),
    resetPlayground: () => startOver(true),
  };

  return (
    <SatelliteConnectProvider adapter={adapters} autoConnect={false}>
      <PlaygroundContext value={value}>
        <TransactionsPoolInitializer />
        {settings.quasar && <HistoryLoader />}
        {/* lg: the controls take the left column of both rows, the inspector sits under the stage; xl: three columns */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_380px] items-start">
          <ControlsPanel />
          <Stage />
          <Inspector />
        </div>
      </PlaygroundContext>
    </SatelliteConnectProvider>
  );
}
