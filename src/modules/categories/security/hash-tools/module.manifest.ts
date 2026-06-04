import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'hash-tools',
  name: 'Hash Tools',
  description: 'Module hash-tools — à implémenter',
  category: 'security',
  version: '0.0.0',
  routePath: '/modules/security/hash-tools',
  permissions: ['storage:read'],
  keywords: ['hash-tools'],
  enabled: false,
};
