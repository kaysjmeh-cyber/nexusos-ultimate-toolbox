import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'crypto-tracker',
  name: 'Crypto Tracker',
  description: 'Module crypto-tracker — à implémenter',
  category: 'finance',
  version: '0.0.0',
  routePath: '/modules/finance/crypto-tracker',
  permissions: ['storage:read'],
  keywords: ['crypto-tracker'],
  enabled: false,
};
