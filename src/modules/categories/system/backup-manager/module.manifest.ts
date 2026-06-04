import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'backup-manager',
  name: 'Backup Manager',
  description: 'Module backup-manager — à implémenter',
  category: 'system',
  version: '0.0.0',
  routePath: '/modules/system/backup-manager',
  permissions: ['storage:read'],
  keywords: ['backup-manager'],
  enabled: false,
};
