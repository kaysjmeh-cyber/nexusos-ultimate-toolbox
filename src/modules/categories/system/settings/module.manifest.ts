import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'settings',
  name: 'ParamÃ¨tres',
  description: 'Module settings â€” Ã  implÃ©menter',
  category: 'system',
  version: '0.0.0',
  routePath: '/modules/system/settings',
  permissions: ['storage:read'],
  keywords: ['settings'],
  enabled: true,
};

