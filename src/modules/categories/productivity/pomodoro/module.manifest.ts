import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'pomodoro',
  name: 'Pomodoro',
  description: 'Module pomodoro â€” Ã  implÃ©menter',
  category: 'productivity',
  version: '0.0.0',
  routePath: '/modules/productivity/pomodoro',
  permissions: ['storage:read'],
  keywords: ['pomodoro'],
  enabled: true,
};

