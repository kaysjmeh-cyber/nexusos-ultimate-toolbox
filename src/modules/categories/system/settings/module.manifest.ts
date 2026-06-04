import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'settings',
  name: 'Paramètres',
  description: 'Module settings — à implémenter',
  category: 'system',
  version: '0.0.0',
  routePath: '/modules/system/settings',
  permissions: ['storage:read'],
  keywords: ['settings'],
  enabled: false,
};
