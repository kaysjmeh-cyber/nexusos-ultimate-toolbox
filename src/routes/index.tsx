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
import { UnitConverterPage } from '@modules/categories/development/unit-converter/UnitConverterPage';
import { PasswordGeneratorPage } from '@modules/categories/security/password-generator/PasswordGeneratorPage';
import { JSONFormatterPage } from '@modules/categories/development/json-formatter/JSONFormatterPage';
import { ImageToolsPage } from '@modules/categories/multimedia/image-tools/ImageToolsPage';

/**
 * Arbre de routes NexusOS — extensible par catégorie / module.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      // Productivity
      { path: 'modules/productivity/notes',  element: <NotesPage /> },
      { path: 'modules/productivity/tasks',  element: <TasksPage /> },
      // Security
      { path: 'modules/security/password-vault',      element: <VaultPage /> },
      { path: 'modules/security/password-generator',  element: <PasswordGeneratorPage /> },
      // Development / Tools
      { path: 'modules/development/unit-converter',   element: <UnitConverterPage /> },
      { path: 'modules/development/json-formatter',   element: <JSONFormatterPage /> },
      // AI / Customization
      { path: 'modules/ai-local/ai-chat',             element: <AIChatPage /> },
      { path: 'modules/customization/theme-editor',   element: <ThemeEditorPage /> },
      // Multimedia
      { path: 'modules/multimedia/image-tools',      element: <ImageToolsPage /> },
      // Hub / Marketplace / Settings
      { path: 'modules',                element: <ModuleHubPage /> },
      { path: 'modules/:category',      element: <ModuleHubPage /> },
      { path: 'modules/:category/:moduleId', element: <ModulePlaceholderPage /> },
      { path: 'marketplace/plugins',    element: <MarketplacePluginsPage /> },
      { path: 'marketplace/themes',     element: <MarketplaceThemesPage /> },
      { path: 'settings',               element: <SettingsPage /> },
      { path: 'settings/:section',      element: <SettingsPage /> },
      { path: '*',                      element: <Navigate to="/" replace /> },
    ],
  },
]);
