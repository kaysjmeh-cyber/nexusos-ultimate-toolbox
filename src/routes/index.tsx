import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@layouts/AppShell';
import { HomePage } from '@app/pages/HomePage';
import { DashboardPage } from '@features/dashboard/DashboardPage';
import { ModuleHubPage } from '@app/pages/ModuleHubPage';
import { MarketplacePluginsPage } from '@features/marketplace/MarketplacePluginsPage';
import { MarketplaceThemesPage } from '@features/marketplace/MarketplaceThemesPage';
import { SettingsPage } from '@app/pages/SettingsPage';
import { ModulePlaceholderPage } from '@app/pages/ModulePlaceholderPage';
import { NotesPage } from '@modules/categories/productivity/notes/NotesPage';
import { TasksPage } from '@modules/categories/productivity/tasks/TasksPage';
import { VaultPage } from '@modules/categories/security/password-vault/VaultPage';
import { AIChatPage } from '@modules/categories/ai-local/ai-chat/AIChatPage';
import { ThemeEditorPage } from '@modules/categories/customization/theme-editor/ThemeEditorPage';

/**
 * Arbre de routes NexusOS — extensible par catégorie / module.
 * 250+ modules : pattern /modules/:category/:moduleId
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'dashboard', element: <DashboardPage /> },
        { path: 'modules/productivity/notes', element: <NotesPage /> },
        { path: 'modules/productivity/tasks', element: <TasksPage /> },
        { path: 'modules/security/password-vault', element: <VaultPage /> },
        { path: 'modules/ai-local/ai-chat', element: <AIChatPage /> },
        { path: 'modules/customization/theme-editor', element: <ThemeEditorPage /> },
      { path: 'modules', element: <ModuleHubPage /> },
      { path: 'modules/:category', element: <ModuleHubPage /> },
      { path: 'modules/:category/:moduleId', element: <ModulePlaceholderPage /> },
      { path: 'marketplace/plugins', element: <MarketplacePluginsPage /> },
      { path: 'marketplace/themes', element: <MarketplaceThemesPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/:section', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
