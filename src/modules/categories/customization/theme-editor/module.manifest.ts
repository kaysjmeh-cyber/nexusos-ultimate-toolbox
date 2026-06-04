import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'theme-editor',
  name: 'Theme Editor',
  description: 'Module theme-editor — à implémenter',
  category: 'customization',
  version: '0.0.0',
  routePath: '/modules/customization/theme-editor',
  permissions: ['storage:read'],
  keywords: ['theme-editor'],
  enabled: true,
};
