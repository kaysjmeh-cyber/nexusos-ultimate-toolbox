import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'shortcut-editor',
  name: 'Shortcuts',
  description: 'Module shortcut-editor — à implémenter',
  category: 'customization',
  version: '0.0.0',
  routePath: '/modules/customization/shortcut-editor',
  permissions: ['storage:read'],
  keywords: ['shortcut-editor'],
  enabled: false,
};
