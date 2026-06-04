import type { ModuleManifest } from '@nexus-types/module';

export const moduleManifest: ModuleManifest = {
  id: 'tasks',
  name: 'Tâches',
  description: 'Gestionnaire de tâches avec priorité, échéance et export/import JSON',
  category: 'productivity',
  version: '0.1.0',
  routePath: '/modules/productivity/tasks',
  permissions: ['storage:read'],
  keywords: ['tasks', 'todo', 'tâches', 'agenda'],
  enabled: true,
};
