import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'budget',
  name: 'Budget',
  description: 'Module budget — à implémenter',
  category: 'finance',
  version: '0.0.0',
  routePath: '/modules/finance/budget',
  permissions: ['storage:read'],
  keywords: ['budget'],
  enabled: false,
};
