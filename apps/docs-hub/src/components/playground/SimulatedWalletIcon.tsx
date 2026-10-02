'use client';

import type { WalletIconFallbackIconProps } from '@tuwaio/sdk/nova-connect/components';
import { cn } from '@tuwaio/sdk/nova-core';

import { walletIconOf } from '@/lib/playground/wallets';

/**
 * The fallback wallet icon of Nova Connect on the stage (`walletIcon.components.FallbackIcon`). Nova draws the `icon`
 * of the connector or connection; without one, or when it fails to load, its default fallback looks the name up in
 * `@web3icons` and then on GitHub, which know no simulated wallet. This one draws the simulated wallet's icon, or a
 * plain circle for another name, without a request.
 */
export function SimulatedWalletIcon({ walletName, size, className }: WalletIconFallbackIconProps) {
  const icon = walletIconOf(walletName);

  return (
    <span
      aria-hidden="true"
      className={cn('inline-block shrink-0 rounded-full bg-[var(--tuwa-bg-muted)] bg-cover', className)}
      style={{ width: size, height: size, backgroundImage: icon ? `url("${icon}")` : undefined }}
    />
  );
}
