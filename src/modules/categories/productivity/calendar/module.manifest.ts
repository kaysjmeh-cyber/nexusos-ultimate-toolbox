import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'calendar',
  name: 'Calendrier',
  description: 'Module calendar â€” Ã  implÃ©menter',
  category: 'productivity',
  version: '0.0.0',
  routePath: '/modules/productivity/calendar',
  permissions: ['storage:read'],
  keywords: ['calendar'],
  enabled: true,
};

