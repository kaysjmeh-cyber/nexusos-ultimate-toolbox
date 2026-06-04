import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'audio-tools',
  name: 'Audio Tools',
  description: 'Module audio-tools — à implémenter',
  category: 'multimedia',
  version: '0.0.0',
  routePath: '/modules/multimedia/audio-tools',
  permissions: ['storage:read'],
  keywords: ['audio-tools'],
  enabled: false,
};
