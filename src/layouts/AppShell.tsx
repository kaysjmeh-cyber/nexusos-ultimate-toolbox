import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@components/shell/AppSidebar';
import { AppTopBar } from '@components/shell/AppTopBar';
import { GlobalSearchBar } from '@features/search/GlobalSearchBar';
import { OfflineIndicator } from '@components/shell/OfflineIndicator';

/**
 * Shell principal NexusOS — multi-fenêtres / widgets en overlay futur.
 */
export function AppShell() {
  return (
    <div className="nx-app">
      <AppSidebar />
      <div className="nx-main">
        <AppTopBar />
        <GlobalSearchBar />
        <main className="nx-content">
          <Outlet />
        </main>
      </div>
      <OfflineIndicator />
    </div>
  );
}
