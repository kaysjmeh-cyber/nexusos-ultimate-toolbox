import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'storage-inspector',
  name: 'Storage Inspector',
  description: 'Module storage-inspector â€” Ã  implÃ©menter',
  category: 'system',
  version: '0.0.0',
  routePath: '/modules/system/storage-inspector',
  permissions: ['storage:read'],
  keywords: ['storage-inspector'],
  enabled: true,
};

