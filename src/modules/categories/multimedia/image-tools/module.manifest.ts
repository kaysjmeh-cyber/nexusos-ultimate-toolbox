import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'image-tools',
  name: 'Image Tools',
  description: 'Module image-tools — à implémenter',
  category: 'multimedia',
  version: '0.0.0',
  routePath: '/modules/multimedia/image-tools',
  permissions: ['storage:read'],
  keywords: ['image-tools'],
  enabled: false,
};
