import type { WidgetManifest } from '@nexus-types/widget';

export const tasksWidgetManifest: WidgetManifest = {
  id: 'widget-tasks',
  name: 'Tâches (widget)',
  moduleId: 'tasks',
  defaultSize: { w: 4, h: 2 },
  minSize: { w: 2, h: 1 },
  resizable: true,
  floating: false,
  meta: { createdAt: Date.now(), updatedAt: Date.now() },
};

export default tasksWidgetManifest;
