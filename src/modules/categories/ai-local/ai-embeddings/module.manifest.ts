import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'ai-embeddings',
  name: 'Embeddings',
  description: 'Module ai-embeddings — à implémenter',
  category: 'ai-local',
  version: '0.0.0',
  routePath: '/modules/ai-local/ai-embeddings',
  permissions: ['storage:read'],
  keywords: ['ai-embeddings'],
  enabled: false,
};
