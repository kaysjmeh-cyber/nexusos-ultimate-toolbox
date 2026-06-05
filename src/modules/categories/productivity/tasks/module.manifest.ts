import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'tasks',
  name: 'TÃ¢ches',
  description: 'Gestionnaire de tÃ¢ches avec prioritÃ©, Ã©chÃ©ance et export/import JSON',
  category: 'productivity',
  version: '0.1.0',
  routePath: '/modules/productivity/tasks',
  permissions: ['storage:read'],
  keywords: ['tasks', 'todo', 'tÃ¢ches', 'agenda'],
  enabled: true,
};

