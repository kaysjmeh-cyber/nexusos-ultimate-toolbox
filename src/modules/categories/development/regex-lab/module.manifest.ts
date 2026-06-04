import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'regex-lab',
  name: 'Regex Lab',
  description: 'Module regex-lab — à implémenter',
  category: 'development',
  version: '0.0.0',
  routePath: '/modules/development/regex-lab',
  permissions: ['storage:read'],
  keywords: ['regex-lab'],
  enabled: false,
};
