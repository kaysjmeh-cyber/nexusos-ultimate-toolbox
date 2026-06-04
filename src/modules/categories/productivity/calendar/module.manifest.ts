import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'calendar',
  name: 'Calendrier',
  description: 'Module calendar — à implémenter',
  category: 'productivity',
  version: '0.0.0',
  routePath: '/modules/productivity/calendar',
  permissions: ['storage:read'],
  keywords: ['calendar'],
  enabled: false,
};
