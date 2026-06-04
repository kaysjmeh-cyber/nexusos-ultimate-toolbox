import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'json-editor',
  name: 'JSON Editor',
  description: 'Module json-editor — à implémenter',
  category: 'development',
  version: '0.0.0',
  routePath: '/modules/development/json-editor',
  permissions: ['storage:read'],
  keywords: ['json-editor'],
  enabled: false,
};
