import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'image-tools',
  name: 'Image Tools',
  description: 'Outils de traitement d\'images - crÃ©ation, conversion, Ã©dition',
  category: 'multimedia',
  version: '1.0.0',
  routePath: '/modules/multimedia/image-tools',
  permissions: ['storage:read', 'storage:write'],
  keywords: ['image', 'photo', 'create', 'convert', 'edit'],
  enabled: true,
};

