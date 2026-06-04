import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'video-tools',
  name: 'Video Tools',
  description: 'Module video-tools — à implémenter',
  category: 'multimedia',
  version: '0.0.0',
  routePath: '/modules/multimedia/video-tools',
  permissions: ['storage:read'],
  keywords: ['video-tools'],
  enabled: false,
};
