import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'git-tools',
  name: 'Git Tools',
  description: 'Module git-tools — à implémenter',
  category: 'development',
  version: '0.0.0',
  routePath: '/modules/development/git-tools',
  permissions: ['storage:read'],
  keywords: ['git-tools'],
  enabled: false,
};
