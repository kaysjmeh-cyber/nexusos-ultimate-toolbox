import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'pgp-tools',
  name: 'PGP Tools',
  description: 'Module pgp-tools — à implémenter',
  category: 'security',
  version: '0.0.0',
  routePath: '/modules/security/pgp-tools',
  permissions: ['storage:read'],
  keywords: ['pgp-tools'],
  enabled: false,
};
