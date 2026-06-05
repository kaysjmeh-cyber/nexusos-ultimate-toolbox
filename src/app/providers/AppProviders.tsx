import type { ReactNode } from 'react';
import { WindowManagerProvider } from '@features/windows/WindowManagerProvider';

/**
 * Providers racine — composition des sous-systèmes UI (shell).
 * CommandPaletteProvider est volontairement absent ici car il appelle
 * useNavigate() qui nécessite d'être à l'intérieur d'un Router.
 * Il est placé dans AppShell à la place.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <WindowManagerProvider>
      {children}
    </WindowManagerProvider>
  );
}
