import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'notes',
  name: 'Notes',
  description: 'Module notes â€” Ã  implÃ©menter',
  category: 'productivity',
  version: '0.0.0',
  routePath: '/modules/productivity/notes',
  permissions: ['storage:read'],
  keywords: ['notes'],
  enabled: true,
};

