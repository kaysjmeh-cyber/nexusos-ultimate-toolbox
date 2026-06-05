import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@components/shell/AppSidebar';
import { AppTopBar } from '@components/shell/AppTopBar';
import { StatusBar } from '@components/shell/StatusBar';
import { OfflineIndicator } from '@components/shell/OfflineIndicator';
import { Toaster } from '@components/ui/Toaster';
import { PWAInstallBanner } from '@components/ui/PWAInstallBanner';
import { CommandPaletteProvider } from '@features/command-palette/command-palette-context';

/**
 * Shell principal NexusOS — sidebar rétractable, topbar, statusbar,
 * toaster notifications, indicateur PWA.
 * CommandPaletteProvider est ici car useNavigate() requiert un Router ancêtre.
 */
export function AppShell() {
  return (
    <CommandPaletteProvider>
      <div className="nx-app">
        <AppSidebar />
        <div className="nx-main">
          <AppTopBar />
          <main className="nx-content">
            <PWAInstallBanner />
            <Outlet />
          </main>
          <StatusBar />
        </div>
        <OfflineIndicator />
        <Toaster />
      </div>
    </CommandPaletteProvider>
  );
}
