import { useSyncExternalStore } from 'react';

// The install commands of each package manager, for dependencies and dev dependencies
export const PACKAGE_MANAGERS = [
  { id: 'pnpm', add: 'pnpm add', addDev: 'pnpm add -D' },
  { id: 'npm', add: 'npm install', addDev: 'npm install -D' },
  { id: 'yarn', add: 'yarn add', addDev: 'yarn add -D' },
  { id: 'bun', add: 'bun add', addDev: 'bun add -d' },
] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]['id'];

// Remembers the chosen package manager in this browser, shared by every install command of the hub
const PACKAGE_MANAGER_KEY = 'tuwa-docs-hub:package-manager';
const listeners = new Set<() => void>();
// The choice when the storage is blocked: it lasts until the page is closed
let chosenInMemory: PackageManager | null = null;

function readPackageManager(): PackageManager {
  try {
    const saved = window.localStorage.getItem(PACKAGE_MANAGER_KEY);
    const found = PACKAGE_MANAGERS.find(({ id }) => id === saved)?.id;
    if (found) return found;
  } catch {
    // Storage is blocked
  }
  return chosenInMemory ?? 'pnpm';
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

/**
 * The package manager the reader chose (pnpm by default, also while server rendering) and a function to change it.
 * The choice is saved to `localStorage` under `tuwa-docs-hub:package-manager` and reaches every install command of the
 * page at once.
 *
 * @returns The package manager and its setter.
 */
export function usePackageManager(): [PackageManager, (id: PackageManager) => void] {
  const packageManager = useSyncExternalStore(subscribe, readPackageManager, () => 'pnpm' as const);
  const choose = (id: PackageManager) => {
    chosenInMemory = id;
    try {
      window.localStorage.setItem(PACKAGE_MANAGER_KEY, id);
    } catch {
      // Storage is blocked: chosenInMemory keeps the choice
    }
    listeners.forEach((listener) => listener());
  };
  return [packageManager, choose];
}

/**
 * The install command of `packages` for a package manager.
 *
 * @param packageManager - The package manager.
 * @param packages - Package names, with or without versions.
 * @param dev - Whether they are dev dependencies.
 * @returns The command, or an empty string without packages.
 */
export function installCommand(packageManager: PackageManager, packages: string[], dev = false): string {
  if (packages.length === 0) return '';
  const manager = PACKAGE_MANAGERS.find(({ id }) => id === packageManager)!;
  return `${dev ? manager.addDev : manager.add} ${packages.join(' ')}`;
}
