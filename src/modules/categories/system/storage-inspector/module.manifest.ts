import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'storage-inspector',
  name: 'Storage Inspector',
  description: 'Module storage-inspector — à implémenter',
  category: 'system',
  version: '0.0.0',
  routePath: '/modules/system/storage-inspector',
  permissions: ['storage:read'],
  keywords: ['storage-inspector'],
  enabled: false,
};
