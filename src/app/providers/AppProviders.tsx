import type { ReactNode } from 'react';
import { CommandPaletteProvider } from '@features/command-palette/command-palette-context';
import { WindowManagerProvider } from '@features/windows/WindowManagerProvider';

/**
 * Providers racine — composition des sous-systèmes UI (shell).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <WindowManagerProvider>
      <CommandPaletteProvider>{children}</CommandPaletteProvider>
    </WindowManagerProvider>
  );
}
